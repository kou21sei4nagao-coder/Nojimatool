import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const fmt = (n) => (parseInt(n) || 0).toLocaleString('ja-JP');
const COLORS = ["#0047AA","#38A169","#D69E2E","#805AD5","#E53E3E","#DD6B20","#2C7A7B","#702459"];

export default function EstimateTab({
  calcs, setCalcs, activeCalc, setActiveCalc, activeField, setActiveField,
  updateCalc, toggleOption, initCalc, addCalc, removeCalc,
}) {
  // ── ドラッグ ──────────────────────────────────────────────
  const [keypadPos, setKeypadPos] = useState(() => ({
    x: Math.max(0, window.innerWidth - 450),
    y: 60,
  }));
  const [scale, setScale]   = useState(1.0);
  const isDragging  = useRef(false);
  const isResizing  = useRef(false);
  const dragOffset  = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, s: 1.0 });

  useEffect(() => {
    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      if (isDragging.current) {
        setKeypadPos({
          x: Math.max(0, Math.min(window.innerWidth  - 430, cx - dragOffset.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, cy - dragOffset.current.y)),
        });
      }
      if (isResizing.current) {
        const newScale = Math.max(0.5, Math.min(2.0,
          resizeStart.current.s + (cx - resizeStart.current.x) / 300
        ));
        setScale(newScale);
      }
    };
    const onEnd = () => { isDragging.current = false; isResizing.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onEnd);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onEnd);
    };
  }, []);

  const onDragStart = (e) => {
    e.preventDefault();
    isDragging.current = true;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: cx - keypadPos.x, y: cy - keypadPos.y };
  };
  const onResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    resizeStart.current = { x: cx, s: scale };
  };

  // ── テンキー入力 ──────────────────────────────────────────
  // calcs[i].amount が各プランの金額
  const appendKey = (key) => {
    const current = String(calcs[activeCalc]?.amount || "");
    if (key === "back")  { updateCalc(activeCalc, "amount", current.slice(0, -1)); return; }
    if (key === "clear") { updateCalc(activeCalc, "amount", ""); return; }
    if (key === "reset") { setCalcs(prev => prev.map((c, idx) => idx === activeCalc ? initCalc() : c)); return; }
    updateCalc(activeCalc, "amount", `${current}${key}`);
  };

  const numberStyle = {
    height:64, borderRadius:8, border:"1px solid #CBD5E0",
    background:"#FFFFFF", color:"#2B6CB0",
    fontSize:30, fontWeight:800, cursor:"pointer",
    boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
  };
  const opStyle = { ...numberStyle, background:"#4A5568", color:"#fff" };
  const smallKeyStyle = {
    height:46, borderRadius:8, border:"1px solid #CBD5E0",
    background:"#FFFFFF", color:"#2B6CB0",
    fontSize:15, fontWeight:800, cursor:"pointer",
    boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
  };

  return (
    <div className="estimate-shell">

      {/* ─── カード列 ─── */}
      <div style={{
        background:"#FFFFFF", padding:16, borderRadius:16,
        border:"1px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
        overflowX:"auto",
      }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${calcs.length}, minmax(160px, 1fr))`, gap:10, minWidth:"max-content", width:"100%" }}>
          {calcs.map((c, i) => {
            const color   = COLORS[i % COLORS.length];
            const selected = activeCalc === i;
            const amount   = parseInt(c.amount) || 0;
            const dispLen  = fmt(amount).length;
            const fontSize = dispLen >= 9 ? 22 : dispLen >= 7 ? 28 : 36;

            return (
              <div key={i} onClick={() => setActiveCalc(i)} style={{
                display:"flex", flexDirection:"column",
                border:`2px solid ${selected ? color : "#E2E8F0"}`,
                borderRadius:12, overflow:"hidden", cursor:"pointer",
                background: selected ? `${color}06` : "#FAFAFA",
                transition:"all 0.15s",
              }}>
                {/* ヘッダー */}
                <div style={{
                  background: selected ? color : "#F0F4F8",
                  padding:"8px 10px",
                  display:"flex", alignItems:"center", gap:6,
                }}>
                  <input
                    value={c.label}
                    onChange={e => { e.stopPropagation(); updateCalc(i, "label", e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    placeholder={`プラン${i + 1}`}
                    style={{
                      flex:1, border:"none", background:"transparent", outline:"none",
                      color: selected ? "#fff" : "#1A202C",
                      fontSize:15, fontWeight:800, minWidth:0,
                    }}
                  />
                  {calcs.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); removeCalc(i); setActiveCalc(Math.max(0, i - 1)); }} style={{
                      width:22, height:22, borderRadius:5, border:"none",
                      background:"rgba(0,0,0,0.15)", color: selected ? "#fff" : "#666",
                      fontSize:12, cursor:"pointer", flexShrink:0,
                    }}>✕</button>
                  )}
                </div>

                {/* 金額表示 */}
                <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 12px", minHeight:100 }}>
                  <div style={{ fontSize, fontWeight:800, color: selected ? color : "#1A202C", lineHeight:1 }}>
                    ¥{fmt(amount)}
                  </div>
                </div>

                {/* ACボタン */}
                <button onClick={e => { e.stopPropagation(); setCalcs(prev => prev.map((calc, idx) => idx===i ? initCalc() : calc)); }} style={{
                  height:38, border:"none", borderTop:"1px solid #E2E8F0",
                  background:"#F7FAFC", color:"#718096", fontSize:13, fontWeight:700, cursor:"pointer",
                }}>AC</button>
              </div>
            );
          })}
        </div>

        {/* ＋ 追加 ／ － 削除 */}
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <button onClick={addCalc} style={{
            flex:1, height:42, borderRadius:8, border:"2px dashed #CBD5E0",
            background:"#F7FAFC", color:"#718096", fontSize:16, fontWeight:800, cursor:"pointer",
          }}>＋ 追加</button>
          <button
            onClick={() => { if (calcs.length <= 1) return; removeCalc(activeCalc); setActiveCalc(Math.max(0, activeCalc - 1)); }}
            disabled={calcs.length <= 1}
            style={{
              flex:1, height:42, borderRadius:8, border:"2px dashed #CBD5E0",
              background: calcs.length <= 1 ? "#F0F0F0" : "#FFF5F5",
              color: calcs.length <= 1 ? "#CBD5E0" : "#E53E3E",
              fontSize:16, fontWeight:800, cursor: calcs.length <= 1 ? "default" : "pointer",
            }}
          >－ 削除</button>
        </div>
      </div>

      {/* ─── フローティング テンキー（portal で body 直下に描画） ─── */}
      {createPortal(
      <div style={{
        position:"fixed", left:keypadPos.x, top:keypadPos.y, zIndex:9999,
        width:420, background:"#FFFFFF", borderRadius:14,
        border:"1px solid #E2E8F0", boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
        padding:12, userSelect:"none",
        transform:`scale(${scale})`, transformOrigin:"top left",
      }}>
        <div style={{ position:"relative" }}>

          {/* ドラッグハンドル + サイズ調整 */}
          <div style={{ display:"flex", alignItems:"center", gap:6, paddingBottom:8, marginBottom:8, borderBottom:"1px solid #E2E8F0" }}>
            <div
              onMouseDown={onDragStart}
              onTouchStart={onDragStart}
              style={{ flex:1, textAlign:"center", cursor:"grab", color:"#A0AEC0", fontSize:13, letterSpacing:2 }}
            >
              ⠿⠿⠿ 移動
            </div>
            <button onClick={() => setScale(s => Math.max(0.5, Math.round((s - 0.1) * 10) / 10))} style={{
              width:34, height:34, borderRadius:8, border:"1px solid #E2E8F0",
              background:"#F7FAFC", color:"#4A5568", fontSize:20, fontWeight:800, cursor:"pointer",
            }}>−</button>
            <div style={{ fontSize:12, color:"#718096", minWidth:32, textAlign:"center" }}>
              {Math.round(scale * 100)}%
            </div>
            <button onClick={() => setScale(s => Math.min(2.0, Math.round((s + 0.1) * 10) / 10))} style={{
              width:34, height:34, borderRadius:8, border:"1px solid #E2E8F0",
              background:"#F7FAFC", color:"#4A5568", fontSize:20, fontWeight:800, cursor:"pointer",
            }}>＋</button>
          </div>

          {/* 入力先 + List選択タブ */}
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${calcs.length}, 1fr)`, gap:6, marginBottom:10 }}>
            {calcs.map((c, i) => (
              <button key={i} onClick={() => setActiveCalc(i)} style={{
                ...smallKeyStyle,
                background: activeCalc === i ? `${COLORS[i%COLORS.length]}15` : "#F7FAFC",
                borderColor: activeCalc === i ? COLORS[i%COLORS.length] : "#CBD5E0",
                color: activeCalc === i ? COLORS[i%COLORS.length] : "#718096",
              }}>L{i + 1}</button>
            ))}
          </div>

          {/* 現在の入力値プレビュー */}
          <div style={{
            textAlign:"right", padding:"6px 12px", marginBottom:8,
            background:"#F7FAFC", borderRadius:8, border:"1px solid #E2E8F0",
            fontSize:24, fontWeight:700, color: COLORS[activeCalc % COLORS.length],
            minHeight:42,
          }}>
            ¥{fmt(calcs[activeCalc]?.amount || 0)}
          </div>

          {/* 数字キー */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:10 }}>
            {["7","8","9","4","5","6","1","2","3","0","00","back"].map(key => (
              <button key={key} onClick={() => appendKey(key)} style={numberStyle}>
                {key === "back" ? "⌫" : key}
              </button>
            ))}
            <button onClick={() => appendKey("reset")} style={opStyle}>AC</button>
            <button onClick={() => appendKey("clear")} style={opStyle}>C</button>
            <button style={{ ...opStyle, background:"#E2E8F0", color:"#718096", cursor:"default" }}>　</button>
          </div>

          {/* リサイズハンドル（右下角・大きめ） */}
          <div
            onMouseDown={onResizeStart}
            onTouchStart={onResizeStart}
            style={{
              position:"absolute", right:0, bottom:0,
              width:44, height:44, borderRadius:"0 0 14px 0",
              cursor:"nwse-resize",
              background:"linear-gradient(135deg, transparent 55%, #CBD5E0 55%)",
              display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
              padding:"4px 6px", color:"#A0AEC0", fontSize:16,
            }}
          >⤡</div>
        </div>
      </div>
      , document.body)}

    </div>
  );
}
