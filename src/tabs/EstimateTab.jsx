import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// ── 定数 ─────────────────────────────────────────────────────
const LIST_COLORS = ["#0047AA","#38A169","#D69E2E","#805AD5","#E53E3E","#DD6B20","#2C7A7B","#702459"];

const FIELDS = [
  { key: "honsha",  label: "本体" },
  { key: "hosho",   label: "保証" },
  { key: "kouji",   label: "標準工事" },
  { key: "tsuika",  label: "追加工事" },
  { key: "nebiki",  label: "値引き" },
  { key: "hyoji",   label: "表示価格" },
  { key: "zaichi",  label: "座値" },
];

const KEYPAD_FIELD_TABS = [
  { key: "honsha", label: "本体" },
  { key: "nebiki", label: "値引" },
  { key: "hosho",  label: "保証" },
  { key: "camera", label: "📷", isCamera: true },
];

const fmt = (n) => {
  const num = parseInt(n);
  return isNaN(num) ? "" : num.toLocaleString("ja-JP");
};

const initList = (name) => ({
  name, honsha:"", hosho:"", kouji:"", tsuika:"", nebiki:"", hyoji:"", zaichi:"",
});

const emptyData = () => ({
  honsha:"", hosho:"", kouji:"", tsuika:"", nebiki:"", hyoji:"", zaichi:"",
});

// ── メインコンポーネント ──────────────────────────────────────
export default function EstimateTab() {
  const [lists, setLists] = useState([
    initList("List1"), initList("List2"), initList("List3"),
  ]);

  const [activeList,  setActiveList]  = useState(0);
  const [activeField, setActiveField] = useState("honsha");
  const [inputBuf,    setInputBuf]    = useState("");

  // ── フローティングテンキーの位置・サイズ ──
  const [kPos,  setKPos]  = useState(() => ({
    x: Math.max(10, window.innerWidth - 264),
    y: 64,
  }));
  const [kSize, setKSize] = useState({ w: 244, h: null }); // null = auto
  const panelRef = useRef(null);

  const getColor = (li) => LIST_COLORS[li % LIST_COLORS.length];

  const getTotal = (list) =>
    ["honsha","hosho","kouji","tsuika","nebiki"]
      .reduce((s, k) => s + (parseInt(list[k]) || 0), 0);

  const updateField = useCallback((li, field, val) => {
    setLists(prev => prev.map((l, i) => i === li ? { ...l, [field]: val } : l));
  }, []);

  const pressKey = (key) => {
    if (activeField === "camera") return;
    setInputBuf(prev => {
      let next = prev;
      if      (key === "AC")  { next = ""; }
      else if (key === "C")   { next = prev.slice(0, -1); }
      else if (key === "00")  { next = (prev && prev !== "0") ? prev + "00" : prev; }
      else if (key === "-")   { next = prev.startsWith("-") ? prev.slice(1) : (prev ? "-" + prev : ""); }
      else {
        next = (prev === "0") ? key : prev + key;
        if (next.replace("-","").length > 10) return prev;
      }
      updateField(activeList, activeField, next.replace(/[^0-9\-]/g, ""));
      return next;
    });
  };

  const selectCell = (li, field) => {
    setActiveList(li);
    setActiveField(field);
    setInputBuf(lists[li][field] || "");
  };

  const clearList = (li) => {
    setLists(prev => prev.map((l, i) => i === li ? { ...l, ...emptyData() } : l));
    if (li === activeList) setInputBuf("");
  };

  const removeList = (li) => {
    setLists(prev => prev.filter((_, i) => i !== li));
    setActiveList(prev => (prev >= li && prev > 0) ? prev - 1 : prev);
  };

  const setHyoji = () => {
    const total = getTotal(lists[activeList]);
    updateField(activeList, "hyoji", String(total));
    setInputBuf(String(total));
    setActiveField("hyoji");
  };

  const focusZaichi = () => {
    setActiveField("zaichi");
    setInputBuf(lists[activeList].zaichi || "");
  };

  const applyZaichiDiscount = (li) => {
    const list   = lists[li];
    const hyoji  = parseInt(list.hyoji)  || 0;
    const zaichi = parseInt(list.zaichi) || 0;
    if (!hyoji || !zaichi) return;
    const disc = hyoji - zaichi;
    if (disc < 0) return;
    updateField(li, "nebiki", String(-disc));
    if (li === activeList) { setActiveField("nebiki"); setInputBuf(String(-disc)); }
  };

  const fieldLabel = (key) => FIELDS.find(f => f.key === key)?.label ?? key;

  // ── ドラッグ開始 ──
  const startDrag = (e) => {
    if (e.type === "touchstart") e.preventDefault();
    const isTouch = e.type === "touchstart";
    const cx0 = isTouch ? e.touches[0].clientX : e.clientX;
    const cy0 = isTouch ? e.touches[0].clientY : e.clientY;
    const ox = cx0 - kPos.x;
    const oy = cy0 - kPos.y;

    const onMove = (ev) => {
      const cx = isTouch ? ev.touches[0].clientX : ev.clientX;
      const cy = isTouch ? ev.touches[0].clientY : ev.clientY;
      setKPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, cx - ox)),
        y: Math.max(0, Math.min(window.innerHeight - 60, cy - oy)),
      });
    };
    const onEnd = () => {
      window.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
      window.removeEventListener(isTouch ? "touchend"  : "mouseup",   onEnd);
    };
    window.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
    window.addEventListener(isTouch ? "touchend"  : "mouseup",   onEnd);
  };

  // ── リサイズ開始 ──
  const startResize = (e) => {
    e.stopPropagation();
    if (e.type === "touchstart") e.preventDefault();
    const isTouch = e.type === "touchstart";
    const sx = isTouch ? e.touches[0].clientX : e.clientX;
    const sy = isTouch ? e.touches[0].clientY : e.clientY;
    // 現在の実際の高さを取得
    const sw = kSize.w;
    const sh = panelRef.current ? panelRef.current.offsetHeight : 480;

    const onMove = (ev) => {
      const cx = isTouch ? ev.touches[0].clientX : ev.clientX;
      const cy = isTouch ? ev.touches[0].clientY : ev.clientY;
      setKSize({
        w: Math.max(200, sw + cx - sx),
        h: Math.max(280, sh + cy - sy),
      });
    };
    const onEnd = () => {
      window.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
      window.removeEventListener(isTouch ? "touchend"  : "mouseup",   onEnd);
    };
    window.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
    window.addEventListener(isTouch ? "touchend"  : "mouseup",   onEnd);
  };

  // ── フローティングテンキー ──
  const keypadPanel = createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: kPos.x, top: kPos.y,
        width: kSize.w,
        height: kSize.h ?? "auto",
        background: "#fff",
        borderRadius: 12,
        border: "1.5px solid #E2E8F0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        userSelect: "none",
        minWidth: 200,
      }}
    >
      {/* ── ドラッグハンドル ── */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          padding: "7px 10px",
          background: "#F7FAFC",
          borderBottom: "1.5px solid #E2E8F0",
          cursor: "move",
          display: "flex", alignItems: "center", gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display:"flex", flexDirection:"column", gap:3, opacity:0.5 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:18, height:2, background:"#718096", borderRadius:1 }}/>
          ))}
        </div>
        <div style={{ fontSize:11, color:"#A0AEC0", flex:1 }}>見積もり電卓</div>
        <div style={{ fontSize:9, color:"#CBD5E0" }}>↔↕</div>
      </div>

      {/* スクロール可能コンテンツ */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>

        {/* List選択タブ */}
        <div style={{ display:"flex", borderBottom:"1.5px solid #E2E8F0", overflowX:"auto", flexShrink:0 }}>
          {lists.map((list, li) => {
            const color    = getColor(li);
            const isActive = activeList === li;
            return (
              <div
                key={li}
                onClick={() => { setActiveList(li); setInputBuf(lists[li][activeField] || ""); }}
                style={{
                  flex:"0 0 auto", minWidth:58,
                  background: isActive ? color : "#F7FAFC",
                  borderRight:"1px solid #E2E8F0",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", transition:"background 0.12s",
                  padding:"6px 4px", position:"relative",
                }}
              >
                <input
                  value={list.name}
                  onChange={e => setLists(prev => prev.map((l, i) => i === li ? { ...l, name: e.target.value } : l))}
                  onClick={e => e.stopPropagation()}
                  onFocus={e => { e.stopPropagation(); e.target.select(); }}
                  style={{
                    background:"transparent", border:"none", outline:"none",
                    color: isActive ? "#fff" : "#718096",
                    fontSize:11, fontWeight: isActive ? 800 : 500,
                    textAlign:"center", width:44, cursor:"pointer",
                    caretColor: isActive ? "#fff" : "#718096",
                  }}
                />
                {lists.length > 1 && isActive && (
                  <button
                    onClick={e => { e.stopPropagation(); removeList(li); }}
                    style={{
                      position:"absolute", top:1, right:1,
                      background:"rgba(255,255,255,0.25)", border:"none",
                      borderRadius:3, color:"#fff", fontSize:9,
                      cursor:"pointer", padding:"0 3px", lineHeight:"14px",
                    }}
                  >×</button>
                )}
              </div>
            );
          })}
        </div>

        {/* フィールドタブ */}
        <div style={{ display:"flex", borderBottom:"1.5px solid #E2E8F0", background:"#F7FAFC", flexShrink:0 }}>
          {KEYPAD_FIELD_TABS.map(({ key, label, isCamera }) => {
            const isActive = activeField === key;
            const color    = getColor(activeList);
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveField(key);
                  setInputBuf(!isCamera ? (lists[activeList][key] || "") : "");
                }}
                style={{
                  flex:1, padding:"7px 2px",
                  background: isActive ? "#fff" : "transparent",
                  color: isActive ? color : "#999",
                  border:"none",
                  borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                  borderRight:"1px solid #E2E8F0",
                  fontSize: isCamera ? 14 : 11, fontWeight: isActive ? 800 : 500,
                  cursor:"pointer",
                }}
              >{label}</button>
            );
          })}
        </div>

        {/* 数字キー */}
        <div style={{ padding:"8px 8px 0", flexShrink:0 }}>
          {[["7","8","9"],["4","5","6"],["1","2","3"],["0","00","⌫"]].map((row, ri) => (
            <div key={ri} style={{ display:"flex", gap:5, marginBottom:5 }}>
              {row.map(key => {
                const isDel = key === "⌫";
                return (
                  <button
                    key={key}
                    onClick={() => pressKey(isDel ? "C" : key)}
                    style={{
                      flex:1, height:52,
                      background: isDel ? "#EBF8FF" : "#F0F4F8",
                      color: isDel ? "#3182CE" : "#1A6FC4",
                      border:"none", borderRadius:9,
                      fontSize: isDel ? 18 : 24, fontWeight:700,
                      cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
                      transition:"transform 0.08s",
                    }}
                    onMouseDown={e => e.currentTarget.style.transform="scale(0.92)"}
                    onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                  >{key}</button>
                );
              })}
            </div>
          ))}

          {/* AC / C / − */}
          <div style={{ display:"flex", gap:5, marginBottom:8 }}>
            {[["AC","#2D3748","#fff"],["C","#4A5568","#fff"],["−","#4A5568","#fff"]].map(([key,bg,fg]) => (
              <button
                key={key}
                onClick={() => pressKey(key === "−" ? "-" : key)}
                style={{
                  flex:1, height:46,
                  background:bg, color:fg,
                  border:"none", borderRadius:9,
                  fontSize:14, fontWeight:800,
                  cursor:"pointer", boxShadow:"0 2px 6px rgba(0,0,0,0.15)",
                  transition:"transform 0.08s",
                }}
                onMouseDown={e => e.currentTarget.style.transform="scale(0.92)"}
                onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >{key}</button>
            ))}
          </div>
        </div>

        {/* 入力先表示 */}
        <div style={{
          background:"#F7FAFC", borderTop:"1px solid #E2E8F0",
          padding:"5px 10px", fontSize:10, color:"#718096", textAlign:"center", flexShrink:0,
        }}>
          入力先：
          <span style={{ fontWeight:700, color:getColor(activeList) }}>
            {lists[activeList]?.name}
          </span>
          {" / "}
          <span style={{ fontWeight:700, color:"#1A202C" }}>
            {fieldLabel(activeField)}
          </span>
        </div>

        {/* 表示価格 / 座値 */}
        <div style={{ display:"flex", gap:6, padding:"6px 8px 10px", flexShrink:0 }}>
          {[["表示価格", setHyoji], ["座値", focusZaichi]].map(([label, fn]) => (
            <button
              key={label}
              onClick={fn}
              style={{
                flex:1, padding:"8px 0",
                background:"#fff", color:"#4A5568",
                border:"1.5px solid #CBD5E0", borderRadius:7,
                fontSize:11, fontWeight:700, cursor:"pointer",
                transition:"all 0.12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#3182CE"; e.currentTarget.style.color="#3182CE"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#CBD5E0"; e.currentTarget.style.color="#4A5568"; }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* ── リサイズハンドル（右下） ── */}
      <div
        onMouseDown={startResize}
        onTouchStart={startResize}
        style={{
          position:"absolute", right:0, bottom:0,
          width:20, height:20,
          cursor:"se-resize",
          display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
          padding:"3px",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M6 10L10 6M10 10L10 10" stroke="#CBD5E0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {/* ── リスト列 ── */}
      <div style={{ display:"flex", gap:6, minWidth:"max-content", alignItems:"stretch" }}>
        {lists.map((list, li) => {
          const color = getColor(li);
          const total = getTotal(list);
          return (
            <div key={li} style={{
              width:185, display:"flex", flexDirection:"column",
              background:"#fff",
              border:`2px solid ${color}`,
              boxShadow:`2px 2px 0 ${color}55`,
              borderRadius:4, overflow:"hidden",
            }}>
              {/* 合計（最上部） */}
              <div style={{
                background:"#FAFAFA",
                borderBottom:`1px solid ${color}50`,
                padding:"8px 10px 6px",
              }}>
                <div style={{
                  textAlign:"right",
                  fontSize: Math.abs(total) >= 1000000 ? 20 : Math.abs(total) >= 100000 ? 24 : 28,
                  fontWeight:700,
                  color: total < 0 ? "#E53E3E" : "#1A202C",
                  fontVariantNumeric:"tabular-nums",
                  letterSpacing:-0.5,
                }}>
                  {total !== 0 ? fmt(total) : "0"}
                </div>
              </div>

              {/* 各フィールド行 */}
              <div style={{ flex:1 }}>
                {FIELDS.map(({ key, label }) => {
                  const val      = list[key];
                  const numVal   = parseInt(val) || 0;
                  const isActive = activeList === li && activeField === key;
                  const isEmpty  = !val;
                  const isHyoji  = key === "hyoji";
                  return (
                    <div
                      key={key}
                      onClick={() => !isHyoji && selectCell(li, key)}
                      style={{
                        borderBottom:"1px solid #EDF2F7",
                        background: isActive ? `${color}18` : "transparent",
                        padding:"3px 10px 4px",
                        cursor: isHyoji ? "default" : "pointer",
                        transition:"background 0.1s",
                        minHeight:42,
                      }}
                    >

                      <div style={{
                        textAlign:"right", fontSize:20, fontWeight:600,
                        color: isEmpty ? "#CBD5E0" : numVal < 0 ? "#E53E3E" : "#1A202C",
                        fontVariantNumeric:"tabular-nums",
                      }}>
                        {isEmpty ? "—" : fmt(val)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 座値から値引き適用 */}
              <div style={{ padding:"6px 8px 0" }}>
                <button
                  onClick={() => applyZaichiDiscount(li)}
                  style={{
                    width:"100%", padding:"6px 0",
                    background:`${color}18`, border:`1px solid ${color}50`,
                    borderRadius:3, color, fontSize:11, fontWeight:700, cursor:"pointer",
                  }}
                >座値から値引き適用</button>
              </div>

              {/* ボトム：AC + 削除 */}
              <div style={{
                display:"flex", gap:6, padding:"8px 8px 10px",
                borderTop:`1px solid ${color}30`, marginTop:6,
              }}>
                {lists.length > 1 && (
                  <button
                    onClick={() => removeList(li)}
                    style={{
                      flexShrink:0, padding:"8px 10px",
                      background:"#EDF2F7", border:"none", borderRadius:3,
                      color:"#718096", fontSize:13, fontWeight:700, cursor:"pointer",
                    }}
                  >✕</button>
                )}
                <button
                  onClick={() => clearList(li)}
                  style={{
                    flex:1, padding:"8px 0",
                    background:"#EDF2F7", border:"none", borderRadius:3,
                    color:"#4A5568", fontSize:15, fontWeight:800,
                    cursor:"pointer", letterSpacing:1,
                  }}
                >AC</button>
              </div>
            </div>
          );
        })}

        {/* ＋ 追加ボタン */}
        {lists.length < 8 && (
          <div
            onClick={() => {
              const next = lists.length;
              setLists(prev => [...prev, initList(`List${next + 1}`)]);
              setActiveList(next);
            }}
            style={{
              width:50, alignSelf:"stretch", minHeight:120,
              border:"2px dashed #CBD5E0", borderRadius:4,
              background:"#F7FAFC",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color:"#A0AEC0", fontSize:28, flexShrink:0,
              transition:"all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#3182CE"; e.currentTarget.style.color="#3182CE"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#CBD5E0"; e.currentTarget.style.color="#A0AEC0"; }}
          >＋</div>
        )}
      </div>

      {/* フローティングテンキー */}
      {keypadPanel}
    </>
  );
}
