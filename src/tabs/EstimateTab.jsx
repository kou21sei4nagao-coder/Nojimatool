import { useState } from "react";

const COLORS = ["#0047AA","#38A169","#D69E2E","#805AD5","#E53E3E","#DD6B20","#2C7A7B","#702459"];
const ROWS   = 8; // 入力欄の行数
const fmt    = (n) => n.toLocaleString("ja-JP");

const initPlan = (name) => ({ name, values: Array(ROWS).fill("") });

export default function EstimateTab() {
  const [plans, setPlans] = useState([
    initPlan("プランA"),
    initPlan("プランB"),
    initPlan("プランC"),
  ]);

  // ── ヘルパー ──────────────────────────────────────────────
  const getTotal = (plan) =>
    plan.values.reduce((s, v) => s + (parseInt(v) || 0), 0);

  const updateName = (ci, name) =>
    setPlans(prev => prev.map((p, i) => i === ci ? { ...p, name } : p));

  const updateValue = (ci, ri, raw) => {
    const num = raw.replace(/[^\d]/g, "");
    setPlans(prev => prev.map((p, i) =>
      i === ci ? { ...p, values: p.values.map((v, j) => j === ri ? num : v) } : p
    ));
  };

  const addPlan = () =>
    setPlans(prev => [...prev, initPlan(`プラン${"ABCDEFGH"[prev.length] || prev.length + 1}`)]);

  const removePlan = (ci) =>
    setPlans(prev => prev.filter((_, i) => i !== ci));

  return (
    <div style={{ overflowX: "auto", paddingBottom: 12 }}>
      <div style={{ display: "flex", gap: 10, minWidth: "max-content", alignItems: "flex-start" }}>

        {plans.map((plan, ci) => {
          const color = COLORS[ci % COLORS.length];
          const total = getTotal(plan);

          return (
            <div key={ci} style={{
              width: 190, borderRadius: 14,
              border: `2px solid ${color}40`,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              background: "#fff",
            }}>
              {/* ─ ヘッダー：プラン名 ─ */}
              <div style={{
                background: color, padding: "10px 12px",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <input
                  value={plan.name}
                  onChange={e => updateName(ci, e.target.value)}
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    borderBottom: "1.5px solid rgba(255,255,255,0.5)",
                    color: "#fff", fontSize: 14, fontWeight: 700, outline: "none",
                  }}
                />
                {plans.length > 1 && (
                  <button onClick={() => removePlan(ci)} style={{
                    background: "rgba(255,255,255,0.2)", border: "none",
                    borderRadius: 5, color: "#fff", fontSize: 13,
                    cursor: "pointer", padding: "1px 7px", flexShrink: 0,
                  }}>✕</button>
                )}
              </div>

              {/* ─ 合計 ─ */}
              <div style={{
                background: `${color}12`, padding: "10px 14px",
                textAlign: "right", borderBottom: `2px solid ${color}25`,
              }}>
                <div style={{ fontSize: 11, color: "#718096", marginBottom: 2 }}>合計</div>
                <div style={{
                  fontSize: total >= 1000000 ? 18 : total >= 100000 ? 22 : 26,
                  fontWeight: 800, color,
                }}>
                  {fmt(total)}
                </div>
              </div>

              {/* ─ 入力欄（ラベルなし） ─ */}
              {plan.values.map((v, ri) => (
                <div key={ri} style={{ borderBottom: "1px solid #F0F4F8" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={v ? parseInt(v).toLocaleString("ja-JP") : ""}
                    onChange={e => updateValue(ci, ri, e.target.value.replace(/,/g, ""))}
                    placeholder="—"
                    style={{
                      width: "100%", padding: "11px 14px",
                      border: "none", outline: "none",
                      textAlign: "right", fontSize: 20, fontWeight: 600,
                      background: "transparent", color: "#1A202C",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.background = `${color}08`}
                    onBlur={e => e.target.style.background = "transparent"}
                  />
                </div>
              ))}
            </div>
          );
        })}

        {/* ─ ＋ 追加ボタン ─ */}
        <div
          onClick={addPlan}
          style={{
            width: 56, minHeight: 200, borderRadius: 14,
            border: "2px dashed #CBD5E0", background: "#F7FAFC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#A0AEC0", fontSize: 28,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#3182CE"; e.currentTarget.style.color = "#3182CE"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.color = "#A0AEC0"; }}
        >＋</div>

      </div>
    </div>
  );
}
