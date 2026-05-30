import { useState, useCallback, useRef, useEffect } from "react";

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
  { key: "r8",      label: "" },
  { key: "r9",      label: "" },
  { key: "r10",     label: "" },
  { key: "r11",     label: "" },
  { key: "r12",     label: "" },
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
  name,
  honsha:"", hosho:"", kouji:"", tsuika:"", nebiki:"", hyoji:"", zaichi:"",
  r8:"", r9:"", r10:"", r11:"", r12:"",
});

const emptyData = () => ({
  honsha:"", hosho:"", kouji:"", tsuika:"", nebiki:"", hyoji:"", zaichi:"",
  r8:"", r9:"", r10:"", r11:"", r12:"",
});

// ── スライド削除機能付きの行コンポーネント ─────────────────────
function FieldRow({ li, fieldKey, val, isActive, selectCell, onDelete, onLongPress }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const longPressTimerRef = useRef(null);

  const startLongPressTimer = () => {
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      onLongPress(li, fieldKey);
      setSwipeOffset(0);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 600);
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  // タッチ開始
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    startXRef.current = clientX - swipeOffset;
    touchStartXRef.current = clientX;
    touchStartYRef.current = clientY;
    touchStartTimeRef.current = Date.now();
    startLongPressTimer();
  };

  // タッチ移動
  const handleTouchMove = (e) => {
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const diffY = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      clearLongPressTimer();
    }
    const newOffset = Math.max(-60, Math.min(0, e.touches[0].clientX - startXRef.current));
    setSwipeOffset(newOffset);
  };

  // タッチ終了
  const handleTouchEnd = (e) => {
    setIsDragging(false);
    clearLongPressTimer();

    const elapsed = Date.now() - touchStartTimeRef.current;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = Math.abs(endX - touchStartXRef.current);
    const diffY = Math.abs(endY - touchStartYRef.current);

    // 短いタップかつ指の移動が極めて小さい場合は、即座にセルを選択（タップ応答性向上）
    if (elapsed < 250 && diffX < 6 && diffY < 6) {
      if (swipeOffset === -60) {
        setSwipeOffset(0);
      } else {
        selectCell(li, fieldKey);
      }
      return;
    }

    if (swipeOffset < -25) {
      setSwipeOffset(-60);
    } else {
      setSwipeOffset(0);
    }
  };

  // マウスドラッグ開始 (PCやシミュレータ用)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX - swipeOffset;
    const startY = e.clientY;
    const startTime = Date.now();
    let lastOffset = swipeOffset;
    startLongPressTimer();

    const handleMouseMove = (ev) => {
      const diffX = ev.clientX - e.clientX;
      const diffY = ev.clientY - startY;
      if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
        clearLongPressTimer();
      }
      const newOffset = Math.max(-60, Math.min(0, ev.clientX - startX));
      lastOffset = newOffset;
      setSwipeOffset(newOffset);
    };

    const handleMouseUp = (ev) => {
      setIsDragging(false);
      clearLongPressTimer();

      const elapsed = Date.now() - startTime;
      const diffX = Math.abs(ev.clientX - e.clientX);
      const diffY = Math.abs(ev.clientY - startY);

      if (elapsed < 250 && diffX < 6 && diffY < 6) {
        if (swipeOffset === -60) {
          setSwipeOffset(0);
        } else {
          selectCell(li, fieldKey);
        }
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        return;
      }

      if (lastOffset < -25) {
        setSwipeOffset(-60);
      } else {
        setSwipeOffset(0);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (!val) {
      setSwipeOffset(0);
    }
  }, [val]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const numVal = parseInt(val) || 0;
  const isEmpty = !val;

  return (
    <div style={{
      position: "relative",
      height: 50,
      flexShrink: 0,
      borderBottom: "1px solid #EDF2F7",
      overflow: "hidden",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    }}>
      {/* 背面の削除ボタン */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(li, fieldKey);
          setSwipeOffset(0);
        }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 60,
          background: "#E53E3E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF",
          fontSize: 12,
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 1,
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        削除
      </div>

      {/* 前面のスライドするセル本体 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (swipeOffset === -60) {
            setSwipeOffset(0);
          } else {
            selectCell(li, fieldKey);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? "none" : "transform 0.15s ease-out",
          background: isActive ? "#EDF2F7" : "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "6px 14px",
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          touchAction: "pan-y",
        }}
      >
        <div style={{
          textAlign: "right",
          fontSize: 22,
          fontWeight: 700,
          color: isEmpty ? "#E2E8F0" : numVal < 0 ? "#E53E3E" : "#1A202C",
          fontVariantNumeric: "tabular-nums",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}>
          {isEmpty ? "—" : fmt(val)}
        </div>
      </div>
    </div>
  );
}

// ── メインコンポーネント ──────────────────────────────────────
export default function EstimateTab() {
  const [lists, setLists] = useState([
    initList("List1"), initList("List2"), initList("List3"),
  ]);

  const [activeList,  setActiveList]  = useState(0);
  const [activeField, setActiveField] = useState("honsha");
  const [inputBuf,    setInputBuf]    = useState("");
  const [memory,      setMemory]      = useState(0);

  const getColor = (li) => LIST_COLORS[li % LIST_COLORS.length];

  const getTotal = (list) =>
    ["honsha","hosho","kouji","tsuika","nebiki","r8","r9","r10","r11","r12"]
      .reduce((s, k) => s + (parseInt(list[k]) || 0), 0);

  const updateField = useCallback((li, field, val) => {
    setLists(prev => prev.map((l, i) => i === li ? { ...l, [field]: val } : l));
  }, []);

  const pressKey = (key) => {
    if (activeField === "camera") return;
    setInputBuf(prev => {
      let next = prev;
      if      (key === "AC")  { next = ""; }
      else if (key === "C" || key === "⌫")   { next = prev.slice(0, -1); }
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

  const applyZaichiDiscount = (li) => {
    const list   = lists[li];
    const hyoji  = parseInt(list.hyoji)  || 0;
    const zaichi = parseInt(list.zaichi) || 0;
    if (!hyoji || !zaichi) return;
    const diff = hyoji - zaichi;
    if (diff < 0) return;
    updateField(li, "nebiki", String(-diff));
    if (li === activeList) { setActiveField("nebiki"); setInputBuf(String(-diff)); }
  };

  const deleteCell = useCallback((li, field) => {
    const delIdx = FIELDS.findIndex(f => f.key === field);
    if (delIdx === -1) return;

    setLists(prev => prev.map((list, i) => {
      if (i !== li) return list;

      const newList = { ...list };
      for (let j = delIdx; j < FIELDS.length - 1; j++) {
        const nextKey = FIELDS[j + 1].key;
        const currKey = FIELDS[j].key;
        newList[currKey] = list[nextKey] || "";
      }
      newList[FIELDS[FIELDS.length - 1].key] = "";
      return newList;
    }));

    if (li === activeList) {
      const activeIdx = FIELDS.findIndex(f => f.key === activeField);
      if (activeIdx === delIdx) {
        const nextKey = FIELDS[delIdx + 1]?.key;
        setInputBuf(nextKey ? (lists[li][nextKey] || "") : "");
      } else if (activeIdx > delIdx) {
        const prevKey = FIELDS[activeIdx - 1]?.key;
        if (prevKey) {
          setActiveField(prevKey);
          setInputBuf(lists[li][FIELDS[activeIdx].key] || "");
        }
      }
    }
  }, [activeList, activeField, lists]);

  const shiftDownCell = useCallback((li, field) => {
    const idx = FIELDS.findIndex(f => f.key === field);
    if (idx === -1) return;

    setLists(prev => prev.map((list, i) => {
      if (i !== li) return list;

      const newList = { ...list };
      for (let j = FIELDS.length - 1; j > idx; j--) {
        const prevKey = FIELDS[j - 1].key;
        const currKey = FIELDS[j].key;
        newList[currKey] = list[prevKey] || "";
      }
      newList[FIELDS[idx].key] = "";
      return newList;
    }));

    if (li === activeList) {
      const activeIdx = FIELDS.findIndex(f => f.key === activeField);
      if (activeIdx === idx) {
        setInputBuf("");
      } else if (activeIdx > idx) {
        const prevKey = FIELDS[activeIdx - 1]?.key;
        setInputBuf(prevKey ? (lists[li][prevKey] || "") : "");
      }
    }
  }, [activeList, activeField, lists]);

  const fieldLabel = (key) => FIELDS.find(f => f.key === key)?.label ?? key;

  const renderDigitKey = (key) => (
    <button
      key={key}
      onClick={() => pressKey(key === "." ? "-" : key)}
      style={{
        flex: 1, height: 46,
        background: "linear-gradient(to bottom, #E8ECF2, #B8C4D6)",
        border: "1px solid #9BA9C1", borderRadius: 8,
        color: "#0F265C", fontSize: 20, fontWeight: "bold",
        cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        transition: "transform 0.08s",
      }}
      onMouseDown={e => e.currentTarget.style.transform="scale(0.92)"}
      onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
    >
      {key}
    </button>
  );

  const renderOpKey = (key, onClick) => (
    <button
      key={key}
      onClick={onClick}
      style={{
        flex: 1, height: 42,
        background: "linear-gradient(to bottom, #6B7D93, #38485A)",
        border: "1px solid #232F3D", borderRadius: 8,
        color: "#FFF", fontSize: 18, fontWeight: "bold",
        cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        transition: "transform 0.08s",
      }}
      onMouseDown={e => e.currentTarget.style.transform="scale(0.92)"}
      onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
    >
      {key}
    </button>
  );

  return (
    <div style={{
      display: "flex",
      gap: 12,
      minHeight: "calc(100vh - 120px)",
      width: "100%",
      background: "#0C1E43",
      padding: 12,
      boxSizing: "border-box",
      borderRadius: 12,
      color: "#FFF",
      overscrollBehavior: "none",
    }}>
      {/* ── 左側：リスト列コンテナ ── */}
      <div style={{
        flex: 1,
        overflowX: "auto",
        display: "flex",
        gap: 10,
        alignItems: "stretch",
        overscrollBehaviorX: "none",
      }}>
        {lists.map((list, li) => {
          const isActive = activeList === li;
          const color = getColor(li);
          const total = getTotal(list);
          return (
            <div
              key={li}
              onClick={() => setActiveList(li)}
              style={{
                flex: "1 1 260px",
                minWidth: 220,
                maxWidth: 450,
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: isActive ? `3.5px solid #1E88E5` : `1.5px solid #CBD5E0`,
                boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* リスト名ヘッダー */}
              <div style={{
                background: color,
                padding: "6px 8px 6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <input
                  value={list.name}
                  onChange={e => setLists(prev => prev.map((l, i) => i === li ? { ...l, name: e.target.value } : l))}
                  onFocus={e => e.target.select()}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#fff", fontSize: 13, fontWeight: 800, minWidth: 0,
                  }}
                />
                {lists.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeList(li);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 4,
                      color: "#fff", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", padding: "1px 7px", flexShrink: 0,
                    }}
                  >×</button>
                )}
              </div>

              {/* 合計金額ヘッダー */}
              <div style={{
                background: "#FAFAFA",
                borderBottom: `2.5px solid ${color}`,
                padding: "10px 14px 8px",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }}>
                <div style={{
                  textAlign: "right",
                  fontSize: 28,
                  fontWeight: 800,
                  color: total < 0 ? "#E53E3E" : "#0F265C",
                  fontVariantNumeric: "tabular-nums",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                }}>
                  {total !== 0 ? fmt(total) : "0"}
                </div>
              </div>

              {/* フィールド行 */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                maxHeight: 450,
                overscrollBehaviorY: "none",
              }}>
                {FIELDS.map(({ key, label }) => {
                  const val = list[key];
                  const isRowActive = activeList === li && activeField === key;

                  return (
                    <FieldRow
                      key={key}
                      li={li}
                      fieldKey={key}
                      val={val}
                      isActive={isRowActive}
                      selectCell={selectCell}
                      onDelete={deleteCell}
                      onLongPress={shiftDownCell}
                    />
                  );
                })}
              </div>

              {/* 座値から値引き適用 */}
              <div style={{ padding: "6px 8px 0" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    applyZaichiDiscount(li);
                  }}
                  style={{
                    width: "100%", padding: "8px 0",
                    background: `${color}18`, border: `1.5px solid ${color}50`,
                    borderRadius: 4, color, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >座値から値引き適用</button>
              </div>

              {/* ACボタン */}
              <div style={{ padding: "10px 12px 12px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearList(li);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: "linear-gradient(to bottom, #F7FAFC, #CBD5E0)",
                    border: "1.5px solid #A0AEC0",
                    borderRadius: 8,
                    color: "#0F265C",
                    fontSize: 18,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.08s",
                  }}
                  onMouseDown={e => e.currentTarget.style.transform="scale(0.97)"}
                  onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                >
                  AC
                </button>
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
              width: 60,
              alignSelf: "stretch",
              minHeight: 120,
              border: "2px dashed rgba(255,255,255,0.3)",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 32,
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.8)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; e.currentTarget.style.color="rgba(255,255,255,0.4)"; }}
          >＋</div>
        )}
      </div>

      {/* ── 右側：固定電卓テンキー ── */}
      <div style={{
        width: 320,
        background: "#08132D",
        borderRadius: 12,
        border: "1.5px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        padding: 12,
        flexShrink: 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        userSelect: "none",
      }}>
        {/* List選択タブ */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {lists.map((list, li) => {
            const isActive = activeList === li;
            return (
              <button
                key={li}
                onClick={() => {
                  setActiveList(li);
                  setInputBuf(lists[li][activeField] || "");
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  background: isActive 
                    ? "linear-gradient(to bottom, #4299E1, #3182CE)" 
                    : "linear-gradient(to bottom, #FFFFFF, #E2E8F0)",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 20,
                  color: isActive ? "#FFE000" : "#2B6CB0",
                  fontSize: 12,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  textAlign: "center",
                }}
              >
                {list.name}
              </button>
            );
          })}
        </div>

        {/* コントロール行: ⚙️, MC, M+, M-, 📷 */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button style={{
            flex: 1, height: 42,
            background: "linear-gradient(to bottom, #4A5568, #2D3748)",
            border: "1px solid #1A202C", borderRadius: 8,
            color: "#FFF", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>⚙️</button>
          
          <button 
            onClick={() => setMemory(0)}
            style={{
              flex: 1, height: 42,
              background: "linear-gradient(to bottom, #3A4A5D, #1E2833)",
              border: "1px solid #10161C", borderRadius: 8,
              color: "#A0AEC0", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            }}
          >MC</button>
          
          <button 
            onClick={() => setMemory(prev => prev + (parseInt(lists[activeList][activeField]) || 0))}
            style={{
              flex: 1, height: 42,
              background: "linear-gradient(to bottom, #FFFFFF, #E2E8F0)",
              border: "1px solid #CBD5E0", borderRadius: 8,
              color: "#2B6CB0", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            }}
          >M+</button>

          <button 
            onClick={() => setMemory(prev => prev - (parseInt(lists[activeList][activeField]) || 0))}
            style={{
              flex: 1, height: 42,
              background: "linear-gradient(to bottom, #FFFFFF, #E2E8F0)",
              border: "1px solid #CBD5E0", borderRadius: 8,
              color: "#2B6CB0", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            }}
          >M-</button>

          <button 
            onClick={() => setActiveField("camera")}
            style={{
              flex: 1, height: 42,
              background: "linear-gradient(to bottom, #4A5568, #2D3748)",
              border: "1px solid #1A202C", borderRadius: 8,
              color: "#FFF", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >📷</button>
        </div>

        {/* コントロール行: フィールド選択 */}
        <div style={{ display: "flex", gap: 4, marginBottom: 10, background: "rgba(255,255,255,0.05)", padding: 3, borderRadius: 8 }}>
          {KEYPAD_FIELD_TABS.map(({ key, label, isCamera }) => {
            const isActive = activeField === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveField(key);
                  setInputBuf(!isCamera ? (lists[activeList][key] || "") : "");
                }}
                style={{
                  flex: 1, padding: "8px 2px",
                  background: isActive ? "linear-gradient(to bottom, #FFFFFF, #E2E8F0)" : "transparent",
                  color: isActive ? "#0F265C" : "#A0AEC0",
                  border: "none",
                  borderRadius: 6,
                  fontSize: isCamera ? 14 : 11, fontWeight: "bold",
                  cursor: "pointer",
                }}
              >{label}</button>
            );
          })}
        </div>

        {/* 入力先表示ステータス */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 11,
          color: "#CBD5E0",
          textAlign: "center",
          marginBottom: 10,
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          入力先：
          <span style={{ fontWeight: 700, color: "#4299E1" }}>
            {lists[activeList]?.name}
          </span>
          {" / "}
          <span style={{ fontWeight: 700, color: "#FFF" }}>
            {fieldLabel(activeField)}
          </span>
          {memory !== 0 && (
            <span style={{ marginLeft: 8, color: "#ED8936" }}>
              (M: {fmt(memory)})
            </span>
          )}
        </div>

        {/* 電卓ボタングリッド */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["7", "8", "9"].map(key => renderDigitKey(key))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["4", "5", "6"].map(key => renderDigitKey(key))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["1", "2", "3"].map(key => renderDigitKey(key))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["0", "00", "."].map(key => renderDigitKey(key))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {renderOpKey("🔃", () => pressKey("−"))}
            {renderOpKey("×", () => {})}
            {renderOpKey("＋", () => {})}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {renderOpKey("C", () => pressKey("AC"))}
            {renderOpKey("÷", () => {})}
            {renderOpKey("－", () => {})}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {renderOpKey("↩", () => pressKey("⌫"))}
            {renderOpKey("↪", () => {})}
            {renderOpKey("＝", () => setHyoji())}
          </div>
        </div>
      </div>
    </div>
  );
}
