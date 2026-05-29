import { MAKERS, MAKER_COLORS, TATAMI_LIST, TATAMI_LABELS, TATAMI_KW, FEATURES_DB, GRADE_COLORS } from "../data/acData.js";
import FeatureCard from "../components/FeatureCard.jsx";

export default function FilterTab({
  maker, setMaker, tatami, setTatami,
  filterOpt, setFilterOpt, ecoOpt, setEcoOpt,
  selectedModel, setSelectedModel,
  accentColor, resetFilter, results,
}) {
  // ── 機種詳細 ──
  if (selectedModel) {
    return (
      <div>
        <button onClick={() => setSelectedModel(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:20 }}>← 一覧に戻る</button>
        <div style={{ background:`${selectedModel.color}15`, border:`1px solid ${selectedModel.color}45`, borderRadius:20, padding:"22px 24px", marginBottom:24 }}>
          <div style={{ fontSize:14, color:"#5070A0", marginBottom:2 }}>{selectedModel.maker}</div>
          <div style={{ fontSize:24, fontWeight:700 }}>{selectedModel.series}</div>
          <div style={{ fontSize:14, color:"#5070A0", marginBottom:10 }}>
            {selectedModel.model}　{selectedModel.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:700 }}>{TATAMI_KW[selectedModel.tatami]}kW</span>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:GRADE_COLORS[selectedModel.grade]+"22", color:GRADE_COLORS[selectedModel.grade], border:`1px solid ${GRADE_COLORS[selectedModel.grade]}40` }}>{selectedModel.grade}</span>
            {selectedModel.hasFilter && <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター掃除</span>}
            {selectedModel.isEco    && <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 超省エネ</span>}
          </div>
        </div>
        {selectedModel.features.length > 0 ? (
          <>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>搭載機能</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {selectedModel.features.map(k => <FeatureCard key={k} featureKey={k} isStaffMode={false} highlight />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"32px 0", color:"#3A5070" }}>特記機能なし（ベーシックモデル）</div>
        )}
      </div>
    );
  }

  // ── 絞り込みフォーム + 結果一覧 ──
  return (
    <div>
      {/* フィルターバー */}
      <div style={{ background:"#FFFFFF", border:"1px solid #E2E8F0", borderRadius:12, padding:"12px 14px", marginBottom:14, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1.4fr 1fr 1fr auto", gap:10, alignItems:"start" }}>
          <div>
            <div style={{ fontSize:12, color:"#4A5568", fontWeight:800, marginBottom:6 }}>メーカー</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {MAKERS.map(m => (
                <button key={m} onClick={() => { setMaker(maker===m ? null : m); setTatami(null); setFilterOpt(null); setEcoOpt(null); }} style={{
                  border:`1px solid ${maker===m ? MAKER_COLORS[m] : "#E2E8F0"}`,
                  background:maker===m ? `${MAKER_COLORS[m]}16` : "#FFFFFF",
                  color:maker===m ? MAKER_COLORS[m] : "#4A5568",
                  borderRadius:8, padding:"5px 8px", fontSize:12, fontWeight:800, cursor:"pointer",
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#4A5568", fontWeight:800, marginBottom:6 }}>畳数</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {TATAMI_LIST.map(t => (
                <button key={t} onClick={() => setTatami(tatami===t ? null : t)} style={{
                  border:`1px solid ${tatami===t ? accentColor : "#E2E8F0"}`,
                  background:tatami===t ? `${accentColor}14` : "#FFFFFF",
                  color:tatami===t ? accentColor : "#4A5568",
                  borderRadius:8, padding:"5px 8px", fontSize:12, fontWeight:800, cursor:"pointer",
                }}>{TATAMI_LABELS[t]}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#4A5568", fontWeight:800, marginBottom:6 }}>自動掃除</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {[[null,"指定なし"],[true,"あり"],[false,"なし"]].map(([val,label]) => (
                <button key={String(val)} onClick={() => setFilterOpt(val)} style={{
                  border:`1px solid ${filterOpt===val ? "#38A169" : "#E2E8F0"}`,
                  background:filterOpt===val ? "#F0FFF4" : "#FFFFFF",
                  color:filterOpt===val ? "#276749" : "#4A5568",
                  borderRadius:8, padding:"5px 8px", fontSize:12, fontWeight:800, cursor:"pointer",
                }}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#4A5568", fontWeight:800, marginBottom:6 }}>省エネ</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {[[null,"指定なし"],[true,"省エネ"],[false,"通常"]].map(([val,label]) => (
                <button key={String(val)} onClick={() => setEcoOpt(val)} style={{
                  border:`1px solid ${ecoOpt===val ? "#3182CE" : "#E2E8F0"}`,
                  background:ecoOpt===val ? "#EBF8FF" : "#FFFFFF",
                  color:ecoOpt===val ? "#2B6CB0" : "#4A5568",
                  borderRadius:8, padding:"5px 8px", fontSize:12, fontWeight:800, cursor:"pointer",
                }}>{label}</button>
              ))}
            </div>
          </div>
          <button onClick={resetFilter} style={{
            alignSelf:"end", border:"1px solid #E2E8F0", background:"#F7FAFC",
            color:"#4A5568", borderRadius:8, padding:"7px 10px", fontSize:12, fontWeight:800, cursor:"pointer",
          }}>リセット</button>
        </div>
      </div>

      {/* 結果一覧 */}
      <div style={{ fontSize:15, color:"#4A5568", marginBottom:14 }}>
        絞り込み結果　<span style={{ fontSize:22, fontWeight:700, color:"#1A202C" }}>{results.length}</span> 件
      </div>
      {results.length === 0 ? (
        <div style={{ textAlign:"center", padding:"48px 0", color:"#3A5070" }}>条件に合う機種が見つかりませんでした</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {results.map(m => (
            <button key={m.id} onClick={() => setSelectedModel(m)} style={{
              background:"#FFFFFF", border:`1px solid ${m.color}40`,
              borderRadius:16, padding:"14px 18px", cursor:"pointer", color:"#1A202C",
              textAlign:"left", transition:"all 0.18s", boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.boxShadow = `0 4px 12px ${m.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = m.color+"40"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:15, padding:"2px 8px", borderRadius:5, background:GRADE_COLORS[m.grade]+"22", color:GRADE_COLORS[m.grade], border:`1px solid ${GRADE_COLORS[m.grade]}40` }}>{m.grade}</span>
                <span style={{ fontSize:15, color:"#5070A0" }}>{m.maker}</span>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color:"#1A202C" }}>{m.series}</div>
              <div style={{ fontSize:14, color:"#4A5568", marginBottom:8 }}>
                {m.model}　{m.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[m.tatami]}kW</span>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {m.hasFilter && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター</span>}
                {m.isEco    && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 省エネ</span>}
                {m.features.filter(k => k !== "filter").map(k => {
                  const f = FEATURES_DB[k];
                  return f ? <span key={k} style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}35` }}>{f.icon} {f.name}</span> : null;
                })}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
