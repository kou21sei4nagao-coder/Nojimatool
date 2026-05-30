import { useState, useCallback } from "react";

// ── 定数 ──────────────────────────────────────────────────
const LIST_LABELS = ["List1", "List2", "List3"];
const LIST_COLORS = ["#0047AA", "#38A169", "#D69E2E"];

// フィールド定義
const FIELDS = [
  { key: "honsha",    label: "本体",       tab: "本体" },
  { key: "hosho",     label: "保証",       tab: "保証" },
  { key: "kouji",     label: "標準工事",   tab: null  },
  { key: "tsuika",    label: "追加工事",   tab: null  },
  { key: "nebiki",    label: "値引き",     tab: "値引" },
  { key: "hyoji",     label: "表示価格",   tab: null  },
  { key: "zaichi",    label: "座値",       tab: null  },
];

// テンキータブ（フィールド選択）
const KEYPAD_FIELD_TABS = [
  { key: "honsha",  label: "本体" },
  { key: "nebiki",  label: "値引" },
  { key: "hosho",   label: "保証" },
  { key: "camera",  label: "📷",  isCamera: true },
];

const fmt = (n) => {
  if (!n && n !== 0) return "";
  return parseInt(n).toLocaleString("ja-JP");
};

const initList = (name) => ({
  name,
  honsha:  "",
  hosho:   "",
  kouji:   "",
  tsuika:  "",
  nebiki:  "",
  hyoji:   "",
  zaichi:  "",
});

// ── メインコンポーネント ──────────────────────────────────
export default function EstimateTab() {
  const [lists, setLists] = useState([
    initList("List1"),
    initList("List2"),
    initList("List3"),
  ]);

  // テンキー状態
  const [activeList,  setActiveList]  = useState(0);            // 0,1,2
  const [activeField, setActiveField] = useState("honsha");     // フィールドキー
  const [inputBuf,    setInputBuf]    = useState("");           // 入力バッファ

  // ── 合計計算 ──
  const getTotal = (list) => {
    const nums = [list.honsha, list.hosho, list.kouji, list.tsuika]
      .map(v => parseInt(v) || 0);
    return nums.reduce((a, b) => a + b, 0);
  };

  // ── フィールド値を更新 ──
  const updateField = useCallback((li, field, val) => {
    setLists(prev => prev.map((l, i) =>
      i === li ? { ...l, [field]: val } : l
    ));
  }, []);

  // ── 座値から値引き適用 ──
  const applyZaichiDiscount = (li) => {
    const list   = lists[li];
    const zaichi = parseInt(list.zaichi) || 0;
    const hyoji  = parseInt(list.hyoji)  || 0;
    if (zaichi <= 0 || hyoji <= 0) return;
    const discount = hyoji - zaichi;
    if (discount < 0) return;
    updateField(li, "nebiki", String(discount));
    setActiveField("nebiki");
    setInputBuf(String(discount));
  };

  // ── テンキー押下 ──
  const pressKey = (key) => {
    if (activeField === "camera") return;

    setInputBuf(prev => {
      let next = prev;
      if (key === "AC") {
        next = "";
      } else if (key === "C") {
        next = prev.slice(0, -1);
      } else if (key === "00") {
        if (prev !== "" && prev !== "0") next = prev + "00";
      } else if (key === "-") {
        // マイナス：値引きフィールドのみ符号トグル
        if (prev.startsWith("-")) next = prev.slice(1);
        else if (prev !== "") next = "-" + prev;
      } else {
        // 数字
        if (prev === "0") next = key;
        else next = prev + key;
        // 最大10桁
        if (next.replace("-","").length > 10) return prev;
      }
      // フィールドに反映
      const cleanVal = next.replace(/[^0-9\-]/g, "");
      updateField(activeList, activeField, cleanVal);
      return next;
    });
  };

  // ── フィールド直接入力 ──
  const handleDirectInput = (li, field, raw) => {
    const num = raw.replace(/[^0-9]/g, "");
    updateField(li, field, num);
    if (li === activeList && field === activeField) {
      setInputBuf(num);
    }
  };

  // ── アクティブフィールド変更 ──
  const selectCell = (li, field) => {
    setActiveList(li);
    setActiveField(field);
    setInputBuf(lists[li][field] || "");
  };

  // ── 表示価格ボタン → 計算値をhyojiにセット ──
  const setHyoji = () => {
    const total = getTotal(lists[activeList]);
    updateField(activeList, "hyoji", String(total));
    setInputBuf(String(total));
    setActiveField("hyoji");
  };

  // ── 座値ボタン → zaichiをhyojiにセット（入力待ち） ──
  const focusZaichi = () => {
    setActiveField("zaichi");
    setInputBuf(lists[activeList].zaichi || "");
  };

  // ── フィールドラベル取得 ──
  const fieldLabel = (key) => FIELDS.find(f => f.key === key)?.label ?? key;

  // ── 列の色 ──
  const getColor = (li) => LIST_COLORS[li] ?? "#555";

  return (
    <div style={{ display: "flex", gap: 10, height: "100%", alignItems: "flex-start" }}>

      {/* ── 左側：リスト列 ── */}
      <div style={{ flex: 1, overflowX: "auto", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
          {lists.map((list, li) => {
            const color = getColor(li);
            const total = getTotal(list);
            return (
              <div key={li} style={{
                width: 190, background: "#fff", borderRadius: 12,
                border: `1.5px solid ${color}30`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}>
                {/* ヘッダー */}
                <div style={{
                  background: `${color}12`, borderBottom: `2px solid ${color}30`,
                  padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color }}>{list.name}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 20, fontWeight: 800, color }}>
                    {total > 0 ? fmt(total) : "—"}
                  </div>
                </div>

                {/* 各行 */}
                {FIELDS.map(({ key, label }) => {
                  const isActive = activeList === li && activeField === key;
                  const val = list[key];
                  const isReadonly = key === "hyoji"; // 表示価格は自動計算
                  return (
                    <div key={key} style={{
                      borderBottom: "1px solid #F0F4F8",
                      background: isActive ? `${color}0D` : "transparent",
                      transition: "background 0.12s",
                    }}>
                      <div style={{ fontSize: 10, color: "#999", padding: "5px 12px 0", letterSpacing: 0.3 }}>{label}</div>
                      <input
                        readOnly={isReadonly}
                        type="text"
                        inputMode="numeric"
                        value={val ? fmt(val) : ""}
                        onChange={e => !isReadonly && handleDirectInput(li, key, e.target.value.replace(/,/g, ""))}
                        onFocus={() => selectCell(li, key)}
                        placeholder="—"
                        style={{
                          width: "100%", padding: "3px 12px 7px",
                          border: "none", outline: "none",
                          textAlign: "right", fontSize: 20, fontWeight: 600,
                          background: "transparent", color: "#1A202C",
                          boxSizing: "border-box", cursor: isReadonly ? "default" : "text",
                        }}
                      />
                    </div>
                  );
                })}

                {/* 座値から値引き適用ボタン */}
                <div style={{ padding: "10px 10px 12px" }}>
                  <button
                    onClick={() => applyZaichiDiscount(li)}
                    style={{
                      width: "100%", padding: "9px 0",
                      background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                      color: "#fff", border: "none", borderRadius: 8,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      boxShadow: `0 2px 6px ${color}40`,
                    }}
                  >座値から値引き適用</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 右側：テンキー ── */}
      <div style={{
        width: 244, flexShrink: 0,
        background: "#fff", borderRadius: 14,
        border: "1.5px solid #E2E8F0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        overflow: "hidden",
        position: "sticky", top: 0,
      }}>
        {/* List選択タブ */}
        <div style={{ display: "flex", borderBottom: "1.5px solid #E2E8F0" }}>
          {LIST_LABELS.map((label, li) => {
            const color = getColor(li);
            const isActive = activeList === li;
            return (
              <button key={li} onClick={() => { setActiveList(li); setInputBuf(lists[li][activeField] || ""); }} style={{
                flex: 1, padding: "9px 0",
                background: isActive ? color : "#F7FAFC",
                color: isActive ? "#fff" : "#718096",
                border: "none", borderRight: li < 2 ? "1px solid #E2E8F0" : "none",
                fontSize: 13, fontWeight: isActive ? 800 : 500,
                cursor: "pointer", transition: "all 0.12s",
              }}>{label}</button>
            );
          })}
        </div>

        {/* フィールドタブ */}
        <div style={{ display: "flex", borderBottom: "1.5px solid #E2E8F0", background: "#F7FAFC" }}>
          {KEYPAD_FIELD_TABS.map(({ key, label, isCamera }) => {
            const isActive = activeField === key;
            const color = getColor(activeList);
            return (
              <button key={key} onClick={() => {
                setActiveField(key);
                setInputBuf(!isCamera ? (lists[activeList][key] || "") : "");
              }} style={{
                flex: 1, padding: "7px 4px",
                background: isActive ? "#fff" : "transparent",
                color: isActive ? color : "#999",
                border: "none",
                borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                borderRight: "1px solid #E2E8F0",
                fontSize: isCamera ? 16 : 12, fontWeight: isActive ? 800 : 500,
                cursor: "pointer", transition: "all 0.12s",
              }}>{label}</button>
            );
          })}
        </div>

        {/* テンキーグリッド */}
        <div style={{ padding: "10px 10px 0" }}>
          {[
            ["7","8","9"],
            ["4","5","6"],
            ["1","2","3"],
            ["0","00","⌫"],
          ].map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => pressKey(key === "⌫" ? "C" : key)}
                  style={{
                    flex: 1, height: 58,
                    background: key === "⌫" ? "#EBF8FF" : "#F0F4F8",
                    color: key === "⌫" ? "#3182CE" : "#1A6FC4",
                    border: "none", borderRadius: 10,
                    fontSize: key === "⌫" ? 20 : 26, fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    transition: "all 0.1s",
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >{key}</button>
              ))}
            </div>
          ))}

          {/* AC / C / − */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {[["AC","#2D3748","#fff"], ["C","#4A5568","#fff"], ["−","#4A5568","#fff"]].map(([key, bg, fg]) => (
              <button
                key={key}
                onClick={() => pressKey(key === "−" ? "-" : key)}
                style={{
                  flex: 1, height: 52,
                  background: bg, color: fg,
                  border: "none", borderRadius: 10,
                  fontSize: 16, fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "all 0.1s",
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >{key}</button>
            ))}
          </div>
        </div>

        {/* 入力先表示 */}
        <div style={{
          background: "#F7FAFC", borderTop: "1px solid #E2E8F0",
          padding: "6px 12px",
          fontSize: 11, color: "#718096", textAlign: "center",
          letterSpacing: 0.3,
        }}>
          入力先：<span style={{ fontWeight: 700, color: getColor(activeList) }}>
            {LIST_LABELS[activeList]}
          </span>
          {" / "}
          <span style={{ fontWeight: 700, color: "#1A202C" }}>
            {fieldLabel(activeField)}
          </span>
        </div>

        {/* 表示価格 / 座値 ボタン */}
        <div style={{ display: "flex", gap: 8, padding: "8px 10px 12px" }}>
          <button
            onClick={setHyoji}
            style={{
              flex: 1, padding: "9px 0",
              background: "#fff", color: "#4A5568",
              border: "1.5px solid #CBD5E0", borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#3182CE"; e.currentTarget.style.color = "#3182CE"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.color = "#4A5568"; }}
          >表示価格</button>
          <button
            onClick={focusZaichi}
            style={{
              flex: 1, padding: "9px 0",
              background: "#fff", color: "#4A5568",
              border: "1.5px solid #CBD5E0", borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#3182CE"; e.currentTarget.style.color = "#3182CE"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.color = "#4A5568"; }}
          >座値</button>
        </div>
      </div>
    </div>
  );
}
