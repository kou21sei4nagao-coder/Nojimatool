import { AC_MODELS, FEATURES_DB, TATAMI_KW, TOP3, FULL_RANKING } from "../data/acData.js";

export default function Top3View({ top3View, setTop3View }) {
  const catLabels = { noFilter:"自動掃除なし", hasFilter:"自動掃除あり ✨", eco:"超省エネモデル ⚡" };
  const catColors = { noFilter:"#718096", hasFilter:"#38A169", eco:"#3182CE" };
  const groupLabels = { small:"6・10畳", large:"14・18畳" };
  const items = TOP3[top3View.group][top3View.key];
  const color = catColors[top3View.key];

  return (
    <div>
      <button onClick={() => setTop3View(null)} style={{ background:"none", border:"none", color:"#4A5568", cursor:"pointer", fontSize:15, marginBottom:16 }}>← 戻る</button>
      <div style={{ fontSize:16, fontWeight:700, color:"#1A202C", marginBottom:4 }}>
        {groupLabels[top3View.group]}　{catLabels[top3View.key]}
      </div>
      <div style={{ fontSize:14, color:"#4A5568", marginBottom:20 }}>おすすめTop3の比較</div>

      {/* Top3カード */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        {items.map(item => {
          const model = AC_MODELS.find(m => m.model === item.model);
          return (
            <div key={item.rank} style={{ background:"#FFFFFF", borderRadius:16, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", border:`2px solid ${color}30`, overflow:"hidden" }}>
              <div style={{ background:`${color}15`, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:28, height:28, borderRadius:8,
                  background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : "#CD7F32",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, fontWeight:700, color:"#fff",
                }}>{item.rank}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker}</div>
                  <div style={{ fontSize:14, color:"#4A5568" }}>{item.series}</div>
                </div>
              </div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:15, color:"#4A5568", marginBottom:10 }}>
                  {item.model}　{model ? `${model.tatami}畳 / ${TATAMI_KW[model.tatami]}kW` : ""}
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:14, padding:"10px 12px", background:"#F0FFF4", borderRadius:10, border:"1px solid #C6F6D5" }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#276749", marginBottom:2 }}>一言でいうと</div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.summary || item.point}</div>
                  </div>
                </div>
                {item.talks && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#2B6CB0", marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>
                      <span>🗣️</span> そのまま使えるトーク
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {item.talks.map((talk, i) => (
                        <div key={i} style={{ fontSize:14, color:"#1A202C", lineHeight:1.7, padding:"10px 12px", background:"#EBF8FF", borderRadius:10, border:"1px solid #BEE3F8", borderLeft:`3px solid ${color}` }}>
                          {talk}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {model && (
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {model.hasFilter && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"#F0FFF4", color:"#38A169", border:"1px solid #C6F6D5" }}>✨ 自動フィルター</span>}
                    {model.isEco    && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"#EBF8FF", color:"#3182CE", border:"1px solid #BEE3F8" }}>⚡ 省エネ</span>}
                    {model.features.filter(k => k !== "filter").map(k => {
                      const f = FEATURES_DB[k];
                      return f ? <span key={k} style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:`${f.color}10`, color:f.color, border:`1px solid ${f.color}30` }}>{f.icon} {f.name}</span> : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 全機種ランキング（6・10畳のみ） */}
      {top3View.group === "small" && (
        <div style={{ marginTop:28 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:4 }}>📋 6・10畳 全機種ランキング</div>
          <div style={{ fontSize:14, color:"#4A5568", marginBottom:14 }}>展示している機種をすべておすすめ順で表示</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {FULL_RANKING[top3View.key].map((item, i) => (
              <div key={i} style={{
                background: item.warning ? "#FFF5F5" : "#FFFFFF",
                border:`1px solid ${item.warning ? "#FEB2B2" : "#E2E8F0"}`,
                borderRadius:14, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${item.warning ? "#FEB2B2" : "#F0F4F8"}`, background: item.warning ? "#FFF5F5" : "#F7FAFC" }}>
                  <div style={{
                    width:28, height:28, borderRadius:8, flexShrink:0,
                    background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : item.rank===3 ? "#CD7F32" : item.warning ? "#FC8181" : "#E2E8F0",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:700, color: item.rank<=3 ? "#fff" : item.warning ? "#fff" : "#718096",
                  }}>{item.rank}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker}　{item.series}</div>
                    <div style={{ fontSize:15, color:"#4A5568" }}>{item.model}</div>
                  </div>
                </div>
                <div style={{ padding:"12px 16px" }}>
                  {item.warning && (
                    <div style={{ background:"#FED7D7", borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:14, color:"#C53030", fontWeight:600 }}>
                      ⚠️ {item.warning}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8, marginBottom:10, padding:"8px 10px", background: item.warning ? "#FFF5F5" : "#F0FFF4", borderRadius:8 }}>
                    <span>💡</span>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1A202C" }}>{item.summary}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#2B6CB0", marginBottom:6 }}>🗣️ そのまま使えるトーク</div>
                  {item.talks.map((talk, j) => (
                    <div key={j} style={{ fontSize:14, color:"#1A202C", lineHeight:1.7, padding:"8px 12px", background:"#EBF8FF", borderRadius:8, marginBottom:6, borderLeft:`3px solid ${color}` }}>
                      {talk}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top3ランキング選択ボタン */}
      {[
        { label:"6・10畳 おすすめ", group:"small" },
        { label:"14・18畳 おすすめ", group:"large" },
      ].map(({ label, group }) => (
        <div key={group} style={{ marginBottom:24, marginTop:28 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#4A5568", marginBottom:10 }}>⭐ {label}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[
              { key:"noFilter", label:"自動掃除なし", color:"#4A5568" },
              { key:"hasFilter", label:"自動掃除あり ✨", color:"#38A169" },
              { key:"eco", label:"超省エネモデル ⚡", color:"#3182CE" },
            ].map(({ key, label: catLabel, color: c }) => (
              <div key={key} onClick={() => setTop3View({ group, key })} style={{
                background:"#FFFFFF", border:`2px solid ${c}30`,
                borderRadius:14, padding:"14px 16px", cursor:"pointer", textAlign:"left",
                boxShadow:"0 2px 6px rgba(0,0,0,0.06)", transition:"all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.boxShadow = `0 4px 12px ${c}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c+"30"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ fontSize:14, fontWeight:700, color:c, marginBottom:10 }}>{catLabel}</div>
                {TOP3[group][key].map(item => (
                  <div key={item.rank} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <div style={{
                      width:20, height:20, borderRadius:6, flexShrink:0,
                      background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : "#CD7F32",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:700, color:"#fff",
                    }}>{item.rank}</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker} {item.series}</div>
                      <div style={{ fontSize:14, color:"#4A5568" }}>{item.model}</div>
                    </div>
                  </div>
                ))}
                {group === "small" && FULL_RANKING[key].length > 3 && (
                  <div style={{ fontSize:15, color:c, marginTop:6, fontWeight:600 }}>・・・全ランキングを見る →</div>
                )}
                <div style={{ fontSize:15, color:c, marginTop:8, fontWeight:600, textAlign:"right" }}>詳細を比較する →</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
