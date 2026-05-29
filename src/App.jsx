import { useState } from "react";
import {
  FEATURES_DB, AC_MODELS, MAKERS, MAKER_COLORS,
  TATAMI_LIST, TATAMI_LABELS, TATAMI_KW, TATAMI_DISPLAY, GRADE_COLORS,
  MAKER_GUIDE, MAKER_FEATURES, FEATURE_ITEMS, FEATURE_ICONS, markColor,
  FULL_RANKING, TOP3,
} from "./data/acData.js";
import AirPurifyCompare from "./components/AirPurifyCompare.jsx";
import { Top3Card, Chip, FilterStep, FeatureCard } from "./components/CommonParts.jsx";

const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; overflow: hidden; background: #F5F7FA; font-size: 16px; }
  html { margin: 0; padding: 0; }
  #root { width: 100% !important; max-width: 100% !important; margin: 0 !important; border: none !important; text-align: left !important; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #F0F2F5; }
  ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 3px; }
  /* 全体フォントサイズ底上げ */
  button, div, span, a, p { -webkit-font-smoothing: antialiased; }
  .estimate-shell { container-type: inline-size; }
  @container (max-width: 920px) {
    .estimate-grid {
      grid-template-columns: minmax(270px, 1fr) minmax(250px, 0.9fr) !important;
      gap: 10px !important;
      padding: 12px !important;
    }
    .estimate-lists {
      grid-template-columns: minmax(0, 1fr) !important;
      min-width: 0 !important;
    }
    .estimate-card {
      min-width: 0 !important;
    }
    .estimate-card:not(.estimate-card-active) {
      display: none !important;
    }
    .estimate-keypad {
      min-width: 0 !important;
    }
    .estimate-keypad-list-tabs {
      gap: 6px !important;
    }
    .estimate-keypad-field-tabs {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 6px !important;
    }
    .estimate-keypad-field-tabs .estimate-camera-key {
      display: none !important;
    }
    .estimate-numbers {
      gap: 8px !important;
    }
    .estimate-numbers button {
      height: 58px !important;
      font-size: 26px !important;
    }
  }
  @container (max-width: 620px) {
    .estimate-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

// ── メイン ───────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("map"); // map | filter | makers | kouji | guide

  // 絞り込み状態
  const [maker, setMaker]         = useState(null);
  const [tatami, setTatami]       = useState(null);
  const [filterOpt, setFilterOpt] = useState(null);
  const [ecoOpt, setEcoOpt]       = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // 機能ガイド
  const [selectedFeature, setSelectedFeature] = useState(null);

  // メーカー特徴
  const [selectedMaker, setSelectedMaker] = useState(null);
  const [top3View, setTop3View] = useState(null);
  const [mapSelectedModel, setMapSelectedModel] = useState(null);

  // 見積もり
  const initCalc = () => ({ label:"", honka:"", nebiki:"", kouji:true, koujiType:0, options:[], hosho:"", hyoji:"", sokone:"", applied:false });
  const [calcs, setCalcs] = useState([initCalc(), initCalc(), initCalc()]);
  const [activeCalc, setActiveCalc] = useState(0);
  const [activeField, setActiveField] = useState("honka");
  const updateCalc = (i, key, val) => setCalcs(prev => prev.map((c, idx) => idx===i ? {...c, [key]:val} : c));
  const toggleOption = (i, opt) => setCalcs(prev => prev.map((c, idx) => idx===i ? {...c, options: c.options.includes(opt) ? c.options.filter(o=>o!==opt) : [...c.options, opt]} : c));

  const resetFilter = () => { setMaker(null); setTatami(null); setFilterOpt(null); setEcoOpt(null); setSelectedModel(null); };

  // 絞り込み結果
  const results = AC_MODELS.filter(m => {
    if (maker !== null && m.maker !== maker) return false;
    if (tatami !== null && m.tatami !== tatami) return false;
    if (filterOpt !== null && m.hasFilter !== filterOpt) return false;
    if (ecoOpt !== null && m.isEco !== ecoOpt) return false;
    return true;
  });

  const accentColor = maker ? MAKER_COLORS[maker] : "#1E90FF";
  const NAV_ITEMS = [["map","🗺️ 全体マップ"],["filter","🔍 絞り込む"],["makers","🏷️ メーカー特徴"],["kouji","🔧 工事内容"],["estimate","💰 見積もり"],["guide","📚 機能ガイド"]];
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [edgeSwipe, setEdgeSwipe] = useState(null);
  const startEdgeSwipe = (e) => {
    if (tabMenuOpen || e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (touch.clientX > 28) return;
    setEdgeSwipe({ startX:touch.clientX, startY:touch.clientY, x:touch.clientX, y:touch.clientY });
  };
  const moveEdgeSwipe = (e) => {
    if (!edgeSwipe || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setEdgeSwipe(prev => prev ? { ...prev, x:touch.clientX, y:touch.clientY } : prev);
  };
  const endEdgeSwipe = () => {
    if (!edgeSwipe) return;
    const dx = edgeSwipe.x - edgeSwipe.startX;
    const dy = Math.abs(edgeSwipe.y - edgeSwipe.startY);
    if (dx > 70 && dy < 70) setTabMenuOpen(true);
    setEdgeSwipe(null);
  };

  return (
    <div
      onTouchStart={startEdgeSwipe}
      onTouchMove={moveEdgeSwipe}
      onTouchEnd={endEdgeSwipe}
      onTouchCancel={() => setEdgeSwipe(null)}
      style={{ height:"100vh", background:"#F5F7FA", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", color:"#1A202C", display:"flex", flexDirection:"column", overflow:"hidden", width:"100vw" }}
    >
      <style>{globalStyle}</style>

      {tabMenuOpen && (
        <>
          <div onClick={() => setTabMenuOpen(false)} style={{
            position:"fixed", inset:0, zIndex:40, background:"rgba(26,32,44,0.08)",
          }} />
          <div style={{
            position:"fixed", top:0, left:0, bottom:0, width:260, zIndex:45,
            background:"#FFFFFF", borderRight:"1px solid #E2E8F0",
            boxShadow:"8px 0 24px rgba(0,0,0,0.14)", display:"flex", flexDirection:"column",
          }}>
            <div style={{ padding:"14px 14px 12px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={() => setTabMenuOpen(false)} style={{
                width:32, height:32, borderRadius:10, border:"1px solid #E2E8F0",
                background:"#F7FAFC", color:"#4A5568", cursor:"pointer", fontSize:16,
                flexShrink:0,
              }}>×</button>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#1A202C", whiteSpace:"nowrap" }}>エアコン コンサルツール</div>
                  <span style={{ fontSize:12, fontWeight:800, padding:"1px 7px", borderRadius:16, background:"linear-gradient(135deg, #667eea, #764ba2)", color:"#fff" }}>α</span>
                </div>
                <div style={{ fontSize:9, color:"#718096", letterSpacing:1 }}>nagao · AC GUIDE</div>
              </div>
            </div>
            <div style={{ padding:"8px 0" }}>
              {NAV_ITEMS.map(([key,label]) => (
                <button key={key} onClick={() => { setTab(key); setTabMenuOpen(false); }} style={{
                  width:"100%", padding:"13px 18px", background: tab===key ? "#EBF8FF" : "#FFFFFF", textAlign:"left",
                  border:"none", borderLeft:`4px solid ${tab===key ? accentColor : "transparent"}`,
                  color: tab===key ? "#1A202C" : "#718096", fontSize:15, fontWeight: tab===key ? 800 : 500,
                  cursor:"pointer",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* メインレイアウト */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* コンテンツエリア */}
        <div style={{ flex:1, minWidth:0, overflowY:"auto", padding:"12px 14px", background:"#F5F7FA" }}>


        {/* ══ 絞り込み結果 ══ */}
        {tab === "filter" && !selectedModel && !top3View && (
          <div>
            <div style={{
              background:"#FFFFFF", border:"1px solid #E2E8F0", borderRadius:12,
              padding:"12px 14px", marginBottom:14, boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
            }}>
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

            {/* 絞り込み結果 */}
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
                    textAlign:"left", transition:"all 0.18s",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
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
        )}

        {/* ══ Top3比較ページ ══ */}
        {(tab === "filter" || tab === "map") && !selectedModel && top3View && (() => {
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

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {items.map(item => {
                  const model = AC_MODELS.find(m => m.model === item.model);
                  return (
                    <div key={item.rank} style={{ background:"#FFFFFF", borderRadius:16, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", border:`2px solid ${color}30`, overflow:"hidden" }}>
                      {/* ランク */}
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
                        {/* 型番 */}
                        <div style={{ fontSize:15, color:"#4A5568", marginBottom:10 }}>
                          {item.model}　{model ? `${model.tatami}畳 / ${TATAMI_KW[model.tatami]}kW` : ""}
                        </div>

                        {/* 一言でいうと */}
                        <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:14, padding:"10px 12px", background:"#F0FFF4", borderRadius:10, border:"1px solid #C6F6D5" }}>
                          <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
                          <div>
                            <div style={{ fontSize:14, fontWeight:700, color:"#276749", marginBottom:2 }}>一言でいうと</div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.summary || item.point}</div>
                          </div>
                        </div>

                        {/* そのまま使えるトーク */}
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

                        {/* 機能タグ */}
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
                  <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:4 }}>
                    📋 6・10畳 全機種ランキング
                  </div>
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

              {/* Top3ランキング */}
            {[
              { label:"6・10畳 おすすめ", group:"small" },
              { label:"14・18畳 おすすめ", group:"large" },
            ].map(({ label, group }) => (
              <div key={group} style={{ marginBottom:24 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#4A5568", marginBottom:10 }}>⭐ {label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  {[
                    { key:"noFilter", label:"自動掃除なし", color:"#4A5568", icon:"🔲" },
                    { key:"hasFilter", label:"自動掃除あり ✨", color:"#38A169", icon:"✨" },
                    { key:"eco", label:"超省エネモデル ⚡", color:"#3182CE", icon:"⚡" },
                  ].map(({ key, label: catLabel, color }) => (
                    <div key={key} onClick={() => setTop3View({ group, key })} style={{
                      background:"#FFFFFF", border:`2px solid ${color}30`,
                      borderRadius:14, padding:"14px 16px", cursor:"pointer", textAlign:"left",
                      boxShadow:"0 2px 6px rgba(0,0,0,0.06)", transition:"all 0.18s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = color+"30"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"; }}
                    >
                      <div style={{ fontSize:14, fontWeight:700, color, marginBottom:10 }}>{catLabel}</div>
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
                      {/* 4位以降ボタン */}
                      {group === "small" && FULL_RANKING[key].length > 3 && (
                        <div onClick={(e) => { e.stopPropagation(); setTop3View({ group, key }); }} style={{
                          display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                          width:"100%", marginTop:6, padding:"6px",
                          background:"none", border:`1px dashed ${color}60`,
                          borderRadius:8, cursor:"pointer", color, fontSize:15, fontWeight:600,
                        }}>
                          ・・・ {FULL_RANKING[key].length - 3}機種以上 全ランキングを見る →
                        </div>
                      )}
                      <div style={{ fontSize:15, color, marginTop:8, fontWeight:600, textAlign:"right" }}>詳細を比較する →</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>

          );
        })()}

        {/* ══ 機種詳細 ══ */}
        {tab === "filter" && selectedModel && (
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
        )}

        {/* ══ メーカー特徴 ══ */}
        {tab === "makers" && !selectedMaker && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#7090A8", letterSpacing:2, marginBottom:16 }}>◼ メーカー別コンサルポイント</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {MAKERS.map(m => {
                const g = MAKER_GUIDE[m];
                return (
                  <div key={m} style={{ background:`${g.color}10`, border:`1px solid ${g.color}40`, borderRadius:18, padding:"18px 20px" }}>
                    {/* ヘッダー */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:g.color }}>{m}</div>
                        <div style={{ fontSize:15, color:"#5070A0", marginTop:2 }}>「{g.catch}」</div>
                      </div>
                      <button onClick={() => setSelectedMaker(m)} style={{
                        background:`${g.color}20`, border:`1px solid ${g.color}50`,
                        borderRadius:8, padding:"4px 12px", cursor:"pointer", color:g.color, fontSize:15, fontWeight:700,
                      }}>詳細</button>
                    </div>

                    {/* コンサルポイント */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {g.consulPoints.map((point, i) => (
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                          <span style={{ color:g.color, fontSize:14, marginTop:1, flexShrink:0 }}>▶</span>
                          <div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#E8EDF5" }}>{point.title}</div>
                            <div style={{ fontSize:14, color:"#6080A0", lineHeight:1.6, marginTop:2 }}>{point.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 刺さるお客様 */}
                    <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${g.color}25` }}>
                      <div style={{ fontSize:14, color:"#2D3748", fontWeight:700, letterSpacing:1, marginBottom:6 }}>🎯 こんなお客様に</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {g.target.split(" / ").map((t, i) => (
                          <span key={i} style={{ fontSize:15, padding:"3px 10px", borderRadius:10, background:`${g.color}18`, color:g.color, border:`1px solid ${g.color}35` }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* こんなお客様には */}
            <div style={{ fontSize:14, fontWeight:700, color:"#7090A8", letterSpacing:2, margin:"24px 0 12px" }}>◼ お悩み別おすすめメーカー</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                ["💧","乾燥・加湿が気になる","ダイキン","#00A0E9"],
                ["🌬️","空気清浄・アレルギー","Panasonic","#0047AA"],
                ["👁️","風が苦手・快眠重視","三菱電機","#E60012"],
                ["🧊","臭い・カビが気になる","日立","#CE0F0F"],
                ["🌀","換気しながら冷暖房","東芝","#E60020"],
                ["🔥","暖房重視・寒がり","富士通 / ゼネラル","#FF6B00"],
                ["⚡","ペット・消臭重視","シャープ","#555"],
                ["💰","コスパ重視","ゼネラル / シャープ","#888"],
              ].map(([icon,label,maker,color]) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:14, color:"#A0B8D0" }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color }}>{maker}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "makers" && selectedMaker && (() => {
          const g = MAKER_GUIDE[selectedMaker];
          return (
            <div>
              <button onClick={() => setSelectedMaker(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:16 }}>← 一覧に戻る</button>

              {/* ヘッダー */}
              <div style={{ background:`linear-gradient(135deg, ${g.color}30, ${g.color}10)`, border:`1px solid ${g.color}60`, borderRadius:20, padding:"16px 24px", marginBottom:16 }}>
                <div style={{ fontSize:22, fontWeight:700 }}>{selectedMaker}</div>
                <div style={{ fontSize:15, color:g.color, fontWeight:700, marginTop:4 }}>「{g.catch}」</div>
              </div>

              {/* スコア */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
                {FEATURE_ITEMS.map(item => {
                  const f = MAKER_FEATURES[item][selectedMaker];
                  return (
                    <div key={item} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${markColor(f.mark)}40`, borderRadius:12, padding:"12px" }}>
                      <div style={{ fontSize:14 }}>{FEATURE_ICONS[item]}</div>
                      <div style={{ fontSize:15, color:"#5070A0", margin:"4px 0" }}>{item}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:markColor(f.mark), marginBottom:4 }}>{f.mark}</div>
                      {f.mark !== "—" && <div style={{ fontSize:15, color:"#5070A0", lineHeight:1.5 }}>{f.text}</div>}
                    </div>
                  );
                })}
              </div>

              {/* 3カラム */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
                <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${g.color}40`, borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:g.color, fontWeight:700, letterSpacing:1, marginBottom:10 }}>💪 強み</div>
                  <div style={{ fontSize:15, color:"#A0C0D8", lineHeight:1.8 }}>{g.strength}</div>
                </div>
                <div style={{ background:"rgba(30,144,255,0.06)", border:"1px solid rgba(30,144,255,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:"#64B5F6", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🎯 刺さるお客様</div>
                  {g.target.split(" / ").map((t, i) => (
                    <div key={i} style={{ fontSize:15, color:"#7AAAC8", lineHeight:1.8, display:"flex", gap:6 }}>
                      <span style={{ color:"#1E90FF" }}>▶</span>{t}
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,80,80,0.05)", border:"1px solid rgba(255,80,80,0.2)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:"#FF8080", fontWeight:700, letterSpacing:1, marginBottom:10 }}>⚠️ 弱み・注意点</div>
                  <div style={{ fontSize:15, color:"#A07070", lineHeight:1.8 }}>{g.weak}</div>
                </div>
              </div>

              {/* 耐久性・独自技術・空気清浄 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
                <div style={{ background:"rgba(255,184,0,0.06)", border:"1px solid rgba(255,184,0,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:"#FFB800", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🛡️ 壊れにくさ・耐久性</div>
                  <div style={{ fontSize:15, color:"#C0A060", lineHeight:1.8 }}>{g.durability}</div>
                </div>
                <div style={{ background:"rgba(0,200,100,0.06)", border:"1px solid rgba(0,200,100,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:"#4CAF90", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🌬️ 空気清浄機能</div>
                  <div style={{ fontSize:15, color:"#70A890", lineHeight:1.8 }}>{g.airClean}</div>
                </div>
                <div style={{ background:"rgba(150,100,255,0.06)", border:"1px solid rgba(150,100,255,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:14, color:"#A080FF", fontWeight:700, letterSpacing:1, marginBottom:10 }}>⚙️ 独自技術</div>
                  <div style={{ fontSize:15, color:"#9080C0", lineHeight:1.8 }}>{g.tech}</div>
                </div>
              </div>

              {/* シリーズ早見表 */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:14, color:"#2D3748", fontWeight:700, letterSpacing:2, marginBottom:10 }}>📋 シリーズ早見表</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {g.series.map(s => (
                    <div key={s.name} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${g.color}30`, borderRadius:12, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ fontSize:15, fontWeight:700, color:g.color, minWidth:120 }}>{s.name}</div>
                      <div style={{ fontSize:14, color:"#7090A8", lineHeight:1.6 }}>{s.point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 接客Tips */}
              <div style={{ background:"#FFFBEB", border:"1px solid #F6E05E", borderRadius:16, padding:"16px 20px" }}>
                <div style={{ fontSize:14, color:"#B7791F", fontWeight:700, letterSpacing:1, marginBottom:8 }}>📋 接客Tips</div>
                <div style={{ fontSize:15, color:"#744210", lineHeight:1.8 }}>{g.tip}</div>
              </div>
            </div>
          );
        })()}


        {/* ══ マップ機種詳細 ══ */}
        {tab === "map" && mapSelectedModel && (
          <div>
            <button onClick={() => setMapSelectedModel(null)} style={{ background:"none", border:"none", color:"#4A5568", cursor:"pointer", fontSize:15, marginBottom:20 }}>← マップに戻る</button>
            <div style={{ background:"#FFFFFF", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:22, fontWeight:700, color:"#1A202C", marginBottom:4 }}>{mapSelectedModel.name}</div>
              {mapSelectedModel.desc && <div style={{ fontSize:14, color:"#4A5568", lineHeight:1.7, marginBottom:16, padding:"10px 14px", background:"#F7FAFC", borderRadius:8 }}>{mapSelectedModel.desc}</div>}

              {mapSelectedModel.model ? (
                <>
                  {/* 型番・畳数 */}
                  <div style={{ fontSize:13, color:"#718096", marginBottom:14 }}>
                    {mapSelectedModel.model.model}　{mapSelectedModel.model.tatami}畳 / {TATAMI_KW[mapSelectedModel.model.tatami]}kW
                  </div>
                  {/* 機能タグ */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                    {mapSelectedModel.model.hasFilter && <span style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"#F0FFF4", color:"#38A169", border:"1px solid #C6F6D5" }}>✨ 自動フィルター</span>}
                    {mapSelectedModel.model.isEco    && <span style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"#EBF8FF", color:"#3182CE", border:"1px solid #BEE3F8" }}>⚡ 超省エネ</span>}
                    {mapSelectedModel.model.features.filter(k => k !== "filter").map(k => {
                      const f = FEATURES_DB[k];
                      return f ? <span key={k} style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:`${f.color}10`, color:f.color, border:`1px solid ${f.color}30` }}>{f.icon} {f.name}</span> : null;
                    })}
                  </div>
                  {/* 機能ガイド */}
                  {mapSelectedModel.model.features.filter(k => k !== "filter").map(k => (
                    <FeatureCard key={k} featureKey={k} isStaffMode={false} highlight />
                  ))}
                </>
              ) : (
                <div style={{ textAlign:"center", padding:"32px", color:"#718096", background:"#F7FAFC", borderRadius:12 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🚧</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#4A5568", marginBottom:4 }}>詳細データ準備中</div>
                  <div style={{ fontSize:13, color:"#718096" }}>この機種のデータは順次追加予定です</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ 全体マップ ══ */}
        {tab === 'map' && !top3View && !mapSelectedModel && (() => {
          const C = ({ name, desc, bg='#FFFFFF', border='#E2E8F0', color='#1A202C', rank, warn, gray, modelKey }) => {
            const model = modelKey ? AC_MODELS.find(m => m.series === modelKey || m.model.includes(modelKey) || m.series.includes(name.replace('パナ','Panasonic').replace('パナ','CS'))) : null;
            const hasDetail = !gray;
            return (
            <div onClick={() => hasDetail && setMapSelectedModel({ name, desc, model })} style={{
              background: gray ? '#EDF2F7' : bg,
              border: `2px solid ${gray ? '#CBD5E0' : border}`,
              borderRadius:8, padding:'10px 12px',
              cursor: hasDetail ? 'pointer' : 'default',
              transition:'all 0.15s',
              minHeight:72, height:'100%', boxSizing:'border-box',
              display:'flex', flexDirection:'column',
            }}
              onMouseEnter={e => { if(hasDetail) e.currentTarget.style.boxShadow = `0 4px 12px ${border}60`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: desc ? 4 : 0 }}>
                <div style={{ fontSize:13, fontWeight:700, color: gray ? '#718096' : (warn ? '#C53030' : color) }}>
                  {!gray && (warn ? '⚠️ ' : '')}{!gray && name}
                </div>
                {rank && <span style={{
                  fontSize:11, fontWeight:700, padding:'2px 6px', borderRadius:6,
                  background: rank===1 ? '#276749' : rank===2 ? '#38A169' : '#E53E3E',
                  color:'#fff', flexShrink:0,
                }}>NO.{rank}</span>}
              </div>
              {desc && <div style={{ fontSize:11, color: gray ? '#718096' : '#4A5568', lineHeight:1.5, flex:1 }}>{desc}</div>}
              {hasDetail && <div style={{ fontSize:10, color, marginTop:'auto', textAlign:'right' }}>詳細 →</div>}
            </div>
            );
          };

          return (
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', marginBottom:12 }}>● 6・10畳 全体マップ</div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 3fr 2fr', gap:10 }}>

                {/* ===== スタンダード ===== */}
                <div>
                  <div style={{ background:'#38A169', borderRadius:'8px 8px 0 0', padding:'8px', textAlign:'center', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>スタンダード</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    <C name='アイリス' desc='最安、外気温50℃未対応（唯一）' bg='#FED7D7' border='#E53E3E' color='#C53030' warn />
                    <C name='パナ J' desc='世の中では人気。ナノイーで抑制。指名買いが多い' />
                    <C name='日立 D' desc='凍結洗浄で内部を凍らせて清潔に' bg='#FEFCBF' border='#ECC94B' />
                    <C name='ダイキン E' desc='隠蔽推奨モデル。空気清浄＆水洗浄◎' bg='#FEFCBF' border='#ECC94B' color='#00A0E9' />
                    <C name='東芝 M' desc='上下ルーバー。高さ25cm。他社国内最安' />
                    <C name='ゼネラル L' desc='2027年省エネ基準達成。ゼロエミ入口' />
                    <C name='シャープ DG' desc='上下ルーバー。プラズマクラスター。組立定番外' />
                    <C name='節電比較コーナー' gray />
                  </div>
                </div>

                {/* ===== 自動フィルター掃除（3列） ===== */}
                <div>
                  <div style={{ background:'#D69E2E', borderRadius:'8px 8px 0 0', padding:'8px', textAlign:'center', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>自動フィルター掃除</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
                    <C name='東芝 DX' desc='お掃除機能最安。無風感で冷房苦手な方に' />
                    <C name='ダイキン C' desc='隠蔽推奨。高さ25cm。FNの方がお得' border='#E53E3E' color='#E53E3E' />
                    <C name='パナ EX' desc='自動排出かBOX式。換気ヘッド必要なケース多い' color='#0047AA' border='#0047AA' />
                    <C name='日立 G' desc='お掃除入口。凍結洗浄。ジャパ対抗多し' bg='#FED7D7' border='#FC8181' rank={3} />
                    <C name='日立 WN' desc='良湿モデル。高さ最小。ファンロボ搭載' bg='#C6F6D5' border='#38A169' rank={2} />
                    <C name='ダイキン FN' desc='良湿モデル。内部ファンカビ対策加工、日本製' bg='#C6F6D5' border='#276749' color='#276749' rank={1} />
                    <C name='シャープ V' desc='高さ25cm・コスパ◎。良湿モデル入口。プラズマ' bg='#FED7E2' border='#F687B3' />
                    <C name='モニター' gray />
                    <C name='湿度体感BOX' gray />
                    <C name='三菱 R' desc='お掃除は自分でしたい方向けに。日本製' color='#E60012' border='#E60012' />
                    <C name='外カバー' gray />
                    <C name='ダイキン室外機訴求' bg='#BEE3F8' border='#3182CE' color='#2B6CB0' />
                  </div>
                </div>

                {/* ===== 超省エネ ===== */}
                <div>
                  <div style={{ background:'#E53E3E', borderRadius:'8px 8px 0 0', padding:'8px', textAlign:'center', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>超省エネ</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    <C name='シャープ R' desc='感動最安。電気代コンサルならVの省エネモデル' />
                    <C name='ダイキン A' desc='Rシリーズの加湿換気なしモデル' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
                    <C name='日立 X' desc='内部銅合金で水の通り道も凍結。空気清浄機で脱臭' bg='#BEE3F8' border='#3182CE' color='#CE0F0F' />
                    <C name='ダイキン R' desc='換気・暖房時加湿。穴問題あり' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
                    <C name='パナ X' desc='条件付きで標準工事費込。複数台割なし' color='#0047AA' border='#0047AA' />
                    <C name='エアコンオプション' gray />
                    <C name='三菱 ZW' desc='エモコで体温判断し人にフォーカス' color='#E60012' border='#E60012' />
                    <C name='エアコンオプション' gray />
                  </div>
                </div>

              </div>

            {/* ── おすすめTop3ランキング ── */}
            <div style={{ marginTop:28 }}>
              {[
                { label:'6・10畳 おすすめ', group:'small' },
              ].map(({ label, group }) => (
                <div key={group} style={{ marginBottom:24 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:'#4A5568', marginBottom:10 }}>⭐ {label}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                    {[
                      { key:'noFilter', label:'自動掃除なし', color:'#4A5568' },
                      { key:'hasFilter', label:'自動掃除あり ✨', color:'#38A169' },
                      { key:'eco', label:'超省エネモデル ⚡', color:'#3182CE' },
                    ].map(({ key, label: catLabel, color }) => (
                      <div key={key} onClick={() => setTop3View({ group, key })} style={{
                        background:'#FFFFFF', border:`2px solid ${color}30`,
                        borderRadius:14, padding:'14px 16px', cursor:'pointer', textAlign:'left',
                        boxShadow:'0 2px 6px rgba(0,0,0,0.06)', transition:'all 0.18s',
                      }}>
                        <div style={{ fontSize:14, fontWeight:700, color, marginBottom:10 }}>{catLabel}</div>
                        {TOP3[group][key].map(item => (
                          <div key={item.rank} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                            <div style={{
                              width:20, height:20, borderRadius:6, flexShrink:0,
                              background: item.rank===1 ? '#FFD700' : item.rank===2 ? '#C0C0C0' : '#CD7F32',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:13, fontWeight:700, color:'#fff',
                            }}>{item.rank}</div>
                            <div>
                              <div style={{ fontSize:13, fontWeight:700, color:'#1A202C' }}>{item.maker} {item.series}</div>
                              <div style={{ fontSize:12, color:'#4A5568' }}>{item.model}</div>
                            </div>
                          </div>
                        ))}
                        {group === 'small' && FULL_RANKING[key].length > 3 && (
                          <div style={{ fontSize:12, color, marginTop:6, fontWeight:600 }}>・・・全ランキングを見る →</div>
                        )}
                        <div style={{ fontSize:13, color, marginTop:4, fontWeight:600, textAlign:'right' }}>詳細を比較する →</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── 14・18・20・23畳 全体マップ ── */}
            <div style={{ marginTop:32 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', marginBottom:12 }}>● 14・18・20・23畳 全体マップ</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr 4fr', gap:10 }}>

                {/* ===== スタンダード（1列） ===== */}
                <div>
                  <div style={{ background:'#38A169', borderRadius:'8px 8px 0 0', padding:'8px', textAlign:'center', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>スタンダード</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:6 }}>
                    <C name='日立 D' desc='凍結洗浄で内部を凍らせて清潔に' bg='#FEFCBF' border='#ECC94B' />
                    <C name='パナ J' desc='世の中では人気。ナノイーで抑制。指名買いが多い' />
                    <C name='ダイキン E' desc='隠蔽推奨モデル。空気清浄＆水洗浄◎' bg='#FEFCBF' border='#ECC94B' color='#00A0E9' />
                    <C name='三菱 GE' desc='お掃除なし。コスパ重視。日本製' color='#E60012' border='#E60012' />
                  </div>
                </div>

                {/* ===== 自動フィルター掃除（2列） ===== */}
                <div>
                  <div style={{ background:'#D69E2E', borderRadius:'8px 8px 0 0', padding:'8px', textAlign:'center', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>自動フィルター掃除</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    <C name='日立 G' desc='お掃除入口。凍結洗浄。ジャパ対抗多し' bg='#FED7D7' border='#FC8181' rank={3} />
                    <C name='東芝 DZ' desc='上下ルーバー。高さ25cm。他社国内最安' />
                    <C name='ゼネラル W' desc='2027年省エネ基準達成。ゼロエミ入口' />
                    <C name='日立 WN' desc='良湿モデル。高さ最小。ファンロボ搭載' bg='#C6F6D5' border='#38A169' rank={2} />
                    <C name='シャープ V' desc='高さ25cm・コスパ◎。良湿モデル入口。プラズマ' bg='#FED7E2' border='#F687B3' />
                    <C name='パナ EX' desc='自動排出かBOX式。換気ヘッド必要なケース多い' color='#0047AA' border='#0047AA' />
                    <C name='三菱 R' desc='お掃除は自分でしたい方向けに。日本製' color='#E60012' border='#E60012' />
                    <C name='ダイキン F' desc='良湿モデル。内部ファンカビ対策加工、日本製' bg='#C6F6D5' border='#276749' color='#276749' rank={1} />
                  </div>
                </div>

                {/* ===== 超省エネ（左右を結合して4列グリッド） ===== */}
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, marginBottom:8 }}>
                    <div style={{ background:'#E53E3E', borderRadius:'8px 0 0 0', padding:'8px', textAlign:'center' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>超省エネ</div>
                    </div>
                    <div style={{ background:'#3182CE', borderRadius:'0 8px 0 0', padding:'8px', textAlign:'center' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>超省エネ</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6 }}>
                    {/* 1段目 */}
                    <C name='シャープ R' desc='感動最安。電気代コンサルならVの省エネモデル' />
                    <C name='パナ X' desc='条件付きで標準工事費込。複数台割なし' color='#0047AA' border='#0047AA' />
                    <C name='' gray />
                    <C name='パナ X' desc='省エネ最強。ナノイーX全部入り' color='#0047AA' border='#0047AA' />
                    {/* 2段目 */}
                    <C name='日立 X' desc='内部銅合金で水の通り道も凍結。空気清浄機で脱臭' bg='#BEE3F8' border='#3182CE' color='#CE0F0F' />
                    <C name='ダイキン A' desc='Rシリーズの加湿換気なしモデル' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
                    <C name='ダイキン R' desc='換気・暖房時加湿。穴問題あり' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
                    <C name='日立 X' desc='内部銅合金で水の通り道も凍結' bg='#BEE3F8' border='#3182CE' color='#CE0F0F' />
                    {/* 3段目 */}
                    <C name='' gray />
                    <C name='三菱 Z' desc='エモコで体温判断し人にフォーカス' color='#E60012' border='#E60012' />
                    <C name='パナ LV' desc='パナソニック上位省エネモデル' color='#0047AA' border='#0047AA' />
                    <C name='ダイキン R' desc='換気・暖房時加湿' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
                    {/* 4段目 */}
                    <C name='' gray />
                    <C name='東芝 DR' desc='換気・穴問題あり' />
                    <C name='' gray />
                    <C name='三菱 Z' desc='エモコで体温判断し人にフォーカス' color='#E60012' border='#E60012' />
                  </div>
                </div>

              </div>
            </div>

            {/* ── 14・18畳 おすすめTop3ランキング ── */}
            <div style={{ marginTop:28 }}>
              {[{ label:'14・18畳 おすすめ', group:'large' }].map(({ label, group }) => (
                <div key={group} style={{ marginBottom:24 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:'#4A5568', marginBottom:10 }}>⭐ {label}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                    {[
                      { key:'noFilter', label:'自動掃除なし', color:'#4A5568' },
                      { key:'hasFilter', label:'自動掃除あり ✨', color:'#38A169' },
                      { key:'eco', label:'超省エネモデル ⚡', color:'#3182CE' },
                    ].map(({ key, label: catLabel, color }) => (
                      <div key={key} onClick={() => setTop3View({ group, key })} style={{
                        background:'#FFFFFF', border:`2px solid ${color}30`,
                        borderRadius:14, padding:'14px 16px', cursor:'pointer', textAlign:'left',
                        boxShadow:'0 2px 6px rgba(0,0,0,0.06)', transition:'all 0.18s',
                      }}>
                        <div style={{ fontSize:14, fontWeight:700, color, marginBottom:10 }}>{catLabel}</div>
                        {TOP3[group][key].map(item => (
                          <div key={item.rank} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                            <div style={{
                              width:20, height:20, borderRadius:6, flexShrink:0,
                              background: item.rank===1 ? '#FFD700' : item.rank===2 ? '#C0C0C0' : '#CD7F32',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:13, fontWeight:700, color:'#fff',
                            }}>{item.rank}</div>
                            <div>
                              <div style={{ fontSize:13, fontWeight:700, color:'#1A202C' }}>{item.maker} {item.series}</div>
                              <div style={{ fontSize:12, color:'#4A5568' }}>{item.model}</div>
                            </div>
                          </div>
                        ))}
                        <div style={{ fontSize:13, color, marginTop:4, fontWeight:600, textAlign:'right' }}>詳細を比較する →</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            </div>
          );
        })()}

        {/* ══ 見積もり ══ */}
        {tab === "estimate" && (() => {
          const KOUJI_OPTIONS = [
            { label:"6・10畳用",   price:20000 },
            { label:"14・18畳用",  price:25000 },
            { label:"20・23畳用",  price:30000 },
          ];
          const OPTIONS = [
            { key:"drain",   label:"ドレン断熱",  price:3000 },
            { key:"hole",    label:"穴あけ",      price:8000 },
            { key:"extend",  label:"配管延長",    price:5000 },
            { key:"kakudai", label:"隠蔽配管",    price:50000 },
            { key:"remove",  label:"取り外し",    price:3000 },
            { key:"rack",    label:"室外機架台",  price:8000 },
            { key:"v200",    label:"200V工事",    price:20000 },
          ];
          const calcTotal = (c) => {
            const honka = parseInt(c.honka.replace(/,/g,'')) || 0;
            const nebiki = parseInt(c.nebiki.replace(/,/g,'')) || 0;
            const koujiPrice = KOUJI_OPTIONS[c.koujiType || 0].price;
            const kouji = c.kouji ? koujiPrice : 0;
            const opts = OPTIONS.filter(o => c.options.includes(o.key)).reduce((s, o) => s + o.price, 0);
            const hosho = parseInt(c.hosho) || 0;
            return honka - nebiki + kouji + opts + hosho;
          };
          const fmt = (n) => n.toLocaleString('ja-JP');
          const COLORS = ["#0047AA","#38A169","#D69E2E"];
          const keypadTargets = {
            honka: "本体",
            nebiki: "値引",
            hosho: "保証",
            hyoji: "表示価格",
            sokone: "底値",
          };
          const setActive = (i, field) => {
            setActiveCalc(i);
            setActiveField(field);
          };
          const appendKey = (key) => {
            const editable = ["honka","nebiki","hosho","hyoji","sokone"];
            if (!editable.includes(activeField)) return;
            const current = String(calcs[activeCalc]?.[activeField] || "");
            if (key === "back") {
              updateCalc(activeCalc, activeField, current.slice(0, -1));
              return;
            }
            if (key === "clear") {
              updateCalc(activeCalc, activeField, "");
              return;
            }
            if (key === "reset") {
              setCalcs(prev => prev.map((c, idx) => idx === activeCalc ? initCalc() : c));
              return;
            }
            updateCalc(activeCalc, activeField, `${current}${key}`);
          };
          const applyAssist = (i) => {
            const c = calcs[i];
            const hyoji = parseInt(c.hyoji) || 0;
            const sokone = parseInt(c.sokone) || 0;
            const maxBiki = (hyoji + KOUJI_OPTIONS[c.koujiType || 0].price) - sokone;
            if (maxBiki <= 0) return;
            updateCalc(i, "honka", String(hyoji));
            updateCalc(i, "nebiki", String(maxBiki));
          };
          const numberStyle = {
            height:64, borderRadius:8, border:"1px solid #CBD5E0",
            background:"#FFFFFF", color:"#2B6CB0",
            fontSize:30, fontWeight:800, cursor:"pointer",
            boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
          };
          const opStyle = {
            ...numberStyle,
            background:"#4A5568", color:"#fff",
            fontSize:30,
          };
          const smallKeyStyle = {
            height:46, borderRadius:8, border:"1px solid #CBD5E0",
            background:"#FFFFFF", color:"#2B6CB0",
            fontSize:18, fontWeight:800, cursor:"pointer",
            boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
          };
          const inputLine = (c, i, field, label, value, negative=false) => {
            const isActive = activeCalc === i && activeField === field;
            return (
              <div onClick={() => setActive(i, field)} style={{
                minHeight:68, padding:"8px 10px 6px",
                background:isActive ? "#EBF8FF" : "#FFFFFF",
                borderBottom:"1px solid #E4E7EC", cursor:"pointer",
              }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>{label}</div>
                <input
                  type="text"
                  value={value}
                  onFocus={() => setActive(i, field)}
                  onChange={e => updateCalc(i, field, e.target.value.replace(/[^\d]/g, ""))}
                  style={{
                    width:"100%", border:"none", outline:"none", background:"transparent",
                    textAlign:"right", fontSize:28, lineHeight:1.1,
                    color:negative ? "#E60020" : "#1A202C", fontWeight:600,
                  }}
                />
              </div>
            );
          };

          return (
            <div className="estimate-shell">
              <div className="estimate-grid" style={{
                display:"grid", gridTemplateColumns:"minmax(620px, 1fr) 420px", gap:18,
                background:"#FFFFFF", padding:16, borderRadius:16,
                border:"1px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
              }}>
                <div className="estimate-lists" style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(190px, 1fr))", gap:10 }}>
                  {calcs.slice(0, 3).map((c, i) => {
                    const color = COLORS[i % COLORS.length];
                    const selected = activeCalc === i;
                    const koujiPrice = c.kouji ? KOUJI_OPTIONS[c.koujiType || 0].price : 0;
                    const selectedOptions = OPTIONS.filter(o => c.options.includes(o.key));
                    const totalText = fmt(calcTotal(c));
                    const totalFontSize = totalText.length >= 9 ? 20 : totalText.length >= 7 ? 24 : 28;
                    return (
                      <div key={i} className={`estimate-card ${selected ? "estimate-card-active" : ""}`} style={{ display:"flex", flexDirection:"column", minHeight:650 }}>
                        <div onClick={() => setActiveCalc(i)} style={{
                          height:58, background:selected ? "#EBF8FF" : "#F7FAFC",
                          border:`1px solid ${selected ? color : "#E2E8F0"}`,
                          borderBottom:"none", display:"flex", alignItems:"center", justifyContent:"space-between",
                          gap:8, padding:"0 12px", cursor:"pointer", borderRadius:"10px 10px 0 0",
                          overflow:"hidden",
                        }}>
                          <input
                            value={c.label}
                            onChange={e => updateCalc(i, "label", e.target.value)}
                            placeholder={`List${i + 1}`}
                            style={{
                              flex:"1 1 52px", minWidth:44, border:"none", background:"transparent", outline:"none",
                              color:"#1A202C", fontSize:16, fontWeight:800,
                            }}
                          />
                          <div style={{
                            color:color, fontSize:totalFontSize, fontWeight:800,
                            lineHeight:1, whiteSpace:"nowrap", flexShrink:0, textAlign:"right",
                          }}>{totalText}</div>
                        </div>

                        <div style={{
                          flex:1, background:"#fff", border:`1px solid ${selected ? color : "#E2E8F0"}`,
                          display:"grid", gridTemplateRows:"repeat(9, minmax(64px, auto))",
                          borderRadius:"0 0 10px 10px", overflow:"hidden",
                        }}>
                          {inputLine(c, i, "honka", "本体", c.honka)}
                          {inputLine(c, i, "hosho", "保証", c.hosho)}
                          <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                            <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>標準工事</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                              {KOUJI_OPTIONS.map((opt, ki) => {
                                const sel = c.kouji && c.koujiType === ki;
                                return (
                                  <button key={opt.label} onClick={() => { updateCalc(i, "koujiType", ki); updateCalc(i, "kouji", true); setActiveCalc(i); }} style={{
                                    border:`1px solid ${sel ? color : "#D1D5DB"}`, borderRadius:6,
                                    background:sel ? "#EFF6FF" : "#fff", color:sel ? color : "#374151",
                                    padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                                  }}>{opt.label}</button>
                                );
                              })}
                              <button onClick={() => { updateCalc(i, "kouji", false); setActiveCalc(i); }} style={{
                                border:`1px solid ${!c.kouji ? "#E60020" : "#D1D5DB"}`, borderRadius:6,
                                background:!c.kouji ? "#FFF1F2" : "#fff", color:!c.kouji ? "#E60020" : "#374151",
                                padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                              }}>なし</button>
                            </div>
                            <div style={{ marginTop:4, textAlign:"right", fontSize:22, color:"#1A202C", fontWeight:700 }}>{koujiPrice ? fmt(koujiPrice) : ""}</div>
                          </div>
                          <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                            <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>追加工事</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                              {OPTIONS.map(opt => {
                                const on = c.options.includes(opt.key);
                                return (
                                  <button key={opt.key} onClick={() => { toggleOption(i, opt.key); setActiveCalc(i); }} style={{
                                    border:`1px solid ${on ? color : "#D1D5DB"}`, borderRadius:6,
                                    background:on ? "#EFF6FF" : "#fff", color:on ? color : "#374151",
                                    padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                                  }}>{opt.label}</button>
                                );
                              })}
                            </div>
                            <div style={{ marginTop:4, textAlign:"right", fontSize:22, color:"#1A202C", fontWeight:700 }}>
                              {selectedOptions.length ? fmt(selectedOptions.reduce((s, o) => s + o.price, 0)) : ""}
                            </div>
                          </div>
                          {inputLine(c, i, "nebiki", "値引き", c.nebiki, true)}
                          {inputLine(c, i, "hyoji", "表示価格", c.hyoji)}
                          {inputLine(c, i, "sokone", "底値", c.sokone)}
                          <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                            <button onClick={() => applyAssist(i)} style={{
                              width:"100%", height:40, border:"none", borderRadius:8,
                              background:"#276749", color:"#fff", fontWeight:900, cursor:"pointer",
                            }}>底値から値引き適用</button>
                          </div>
                          <div style={{ minHeight:68, padding:"8px 10px", textAlign:"right" }}>
                            <div style={{ color:"#E60020", fontSize:26, fontWeight:700 }}>-{fmt(parseInt(c.nebiki) || 0)}</div>
                          </div>
                        </div>

                        <button onClick={() => setCalcs(prev => prev.map((calc, idx) => idx === i ? initCalc() : calc))} style={{
                          marginTop:8, height:46, borderRadius:8, border:"1px solid #CBD5E0",
                          background:"#F7FAFC", color:"#2B6CB0",
                          fontSize:22, fontWeight:900, cursor:"pointer",
                        }}>AC</button>
                      </div>
                    );
                  })}
                </div>

                <div className="estimate-keypad" style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div className="estimate-keypad-list-tabs" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
                    {[0,1,2].map(i => (
                      <button key={i} onClick={() => setActiveCalc(i)} style={{
                        ...smallKeyStyle,
                        background:activeCalc === i ? "#EBF8FF" : smallKeyStyle.background,
                        borderColor:activeCalc === i ? COLORS[i] : "#CBD5E0",
                        color:activeCalc === i ? COLORS[i] : "#2B6CB0",
                        fontSize:18,
                      }}>List{i + 1}</button>
                    ))}
                  </div>
                  <div className="estimate-keypad-field-tabs" style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, alignItems:"center" }}>
                    <div style={{ fontSize:28, textAlign:"center", color:"#718096" }}>⚙</div>
                    {["honka","nebiki","hosho"].map(field => (
                      <button key={field} onClick={() => setActiveField(field)} style={{
                        ...smallKeyStyle,
                        background:activeField === field ? "#F0FFF4" : smallKeyStyle.background,
                        borderColor:activeField === field ? "#38A169" : "#CBD5E0",
                        color:activeField === field ? "#276749" : "#2B6CB0",
                        fontSize:15,
                      }}>{keypadTargets[field]}</button>
                    ))}
                    <button type="button" className="estimate-camera-key" style={{ ...smallKeyStyle, fontSize:20, cursor:"default", color:"#718096" }}>📷</button>
                  </div>
                  <div className="estimate-numbers" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
                    {["7","8","9","4","5","6","1","2","3","0","00","back"].map(key => (
                      <button key={key} onClick={() => appendKey(key)} style={numberStyle}>{key === "back" ? "⌫" : key}</button>
                    ))}
                    <button onClick={() => appendKey("reset")} style={opStyle}>AC</button>
                    <button onClick={() => appendKey("clear")} style={opStyle}>C</button>
                    <button onClick={() => appendKey("clear")} style={opStyle}>−</button>
                  </div>
                  <div style={{
                    background:"#F7FAFC", border:"1px solid #E2E8F0",
                    borderRadius:10, padding:12, color:"#1A202C",
                  }}>
                    <div style={{ fontSize:13, fontWeight:800, marginBottom:8 }}>
                      入力先：List{activeCalc + 1} / {keypadTargets[activeField]}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {["hyoji","sokone"].map(field => (
                        <button key={field} onClick={() => setActiveField(field)} style={{
                          border:`1px solid ${activeField === field ? "#38A169" : "#CBD5E0"}`, borderRadius:8,
                          background:activeField === field ? "#F0FFF4" : "#FFFFFF",
                          color:activeField === field ? "#276749" : "#4A5568",
                          padding:"9px 8px", fontSize:13, fontWeight:800, cursor:"pointer",
                        }}>{keypadTargets[field]}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "kouji" && (
          <div>
            {/* ヒアリングポイント */}
            <div style={{ background:"#FFFBEB", border:"1px solid #F6E05E", borderRadius:16, padding:"16px 20px", marginBottom:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#B7791F", marginBottom:12 }}>📋 まずお客様にヒアリングすること</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { q:"設置場所はどこですか？", hint:"部屋の広さ・階数・室外機の置き場所" },
                  { q:"配管穴はすでにありますか？", hint:"ない場合は穴あけ工事が必要" },
                  { q:"配管はどこを通しますか？", hint:"壁の外・天井裏など" },
                  { q:"室外機の設置場所はどこですか？", hint:"ベランダ・地面・屋根置きなど" },
                  { q:"今のエアコンを外す必要がありますか？", hint:"撤去・処分が必要か" },
                  { q:"電源コンセントはありますか？", hint:"100V・200Vの確認" },
                ].map((item, i) => (
                  <div key={i} style={{ background:"#FFFFFF", borderRadius:10, padding:"10px 14px", border:"1px solid #E2E8F0" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:3 }}>❓ {item.q}</div>
                    <div style={{ fontSize:15, color:"#4A5568" }}>{item.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 標準工事 */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:12 }}>
                ✅ 標準工事（必ず含まれる）
                <span style={{ fontSize:15, color:"#4A5568", fontWeight:400, marginLeft:8 }}>※価格は目安・要確認</span>
              </div>
              <div style={{ background:"#FFFFFF", borderRadius:16, border:"1px solid #E2E8F0", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                {[
                  { name:"エアコン本体取り付け", desc:"室内機を壁に取り付けます。専用の取り付け金具を使用します。", price:"標準工事費に含む" },
                  { name:"室外機設置・接続", desc:"室外機を設置し、配管で室内機と接続します。", price:"標準工事費に含む" },
                  { name:"配管工事", desc:"室内機と室外機をつなぐ冷媒配管・電線・ドレンホースを通します。", price:"標準工事費に含む" },
                  { name:"真空引き（エアパージ）", desc:"配管内の空気・水分を抜いて冷媒ガスを正しく機能させます。必ず必要な作業です。", price:"標準工事費に含む" },
                  { name:"試運転・動作確認", desc:"工事完了後に実際に動作させて問題がないか確認します。", price:"標準工事費に含む" },
                ].map((item, i) => (
                  <div key={i} style={{ padding:"14px 18px", borderBottom: i < 4 ? "1px solid #F0F4F8" : "none", display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:3 }}>{item.name}</div>
                      <div style={{ fontSize:14, color:"#4A5568", lineHeight:1.6 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize:14, color:"#38A169", fontWeight:700, whiteSpace:"nowrap" }}>{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 追加工事 */}
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:12 }}>⚠️ 追加工事（状況によって必要）</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { name:"ドレンホース断熱処理", icon:"💧", color:"#3182CE", img:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80", desc:"ドレンホース（排水ホース）に断熱材を巻く工事です。", why:"夏場にドレンホースが結露して水滴が垂れるのを防ぎます。特に室内を通る部分に必要です。", when:"配管が室内を通る場合・結露が気になる場合", price:"別途 ¥3,000〜5,000程度" },
                  { name:"配管穴あけ工事", icon:"🔩", color:"#D69E2E", img:"https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80", desc:"エアコン用の配管を通す穴を壁に開ける工事です。", why:"新規設置や穴の位置が合わない場合に必要です。コンクリート・タイルは追加費用がかかります。", when:"配管穴がない場合・既存穴の位置が合わない場合", price:"別途 ¥5,000〜15,000程度（素材による）" },
                  { name:"配管延長工事", icon:"📏", color:"#4A5568", img:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", desc:"室内機と室外機をつなぐ配管を延長する工事です。", why:"標準の配管長（約3〜4m）より距離が長い場合に必要です。", when:"室外機を離れた場所に設置する場合", price:"別途 ¥1,000〜2,000/m程度" },
                  { name:"隠蔽配管工事", icon:"🏠", color:"#805AD5", img:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", desc:"配管を壁の中や天井裏に隠して通す工事です。", why:"見た目をスッキリさせたい場合に行います。工事が複雑になるため費用が高くなります。", when:"配管を見せたくない場合・新築・リフォーム時", price:"別途 ¥30,000〜100,000程度" },
                  { name:"既設エアコン取り外し・処分", icon:"🗑️", color:"#E53E3E", img:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", desc:"古いエアコンを取り外してリサイクル処分する工事です。", why:"家電リサイクル法により、エアコンは適正に処分する必要があります。", when:"今のエアコンを取り外す場合", price:"取り外し ¥3,000〜5,000 ＋ リサイクル料金" },
                  { name:"室外機架台設置", icon:"🔧", color:"#2D3748", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", desc:"室外機を地面・壁・屋根などに設置するための架台を取り付ける工事です。", why:"室外機を安定して設置するために必要です。設置場所によって種類が異なります。", when:"ベランダ以外に設置する場合・壁掛け・屋根置きの場合", price:"別途 ¥5,000〜20,000程度（種類による）" },
                  { name:"200V電源工事", icon:"⚡", color:"#D69E2E", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", desc:"100Vのコンセントを200Vに変更する電気工事です。", why:"大型エアコン（14畳以上）は200V電源が必要な場合があります。", when:"200V対応エアコンを設置するが100Vコンセントしかない場合", price:"別途 ¥15,000〜30,000程度" },
                ].map((item, i) => (
                  <div key={i} style={{ background:"#FFFFFF", borderRadius:14, border:`1px solid ${item.color}30`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"120px 1fr" }}>
                      {/* 写真エリア */}
                      <div style={{ background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"120px", fontSize:40 }}>
                        {item.icon}
                      </div>
                      {/* 内容 */}
                      <div>
                        <div style={{ background:`${item.color}10`, padding:"10px 14px", display:"flex", alignItems:"center", gap:8, borderBottom:`1px solid ${item.color}20` }}>
                          <span style={{ fontSize:18 }}>{item.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.name}</div>
                            <div style={{ fontSize:15, color:item.color, fontWeight:600 }}>{item.price}</div>
                          </div>
                        </div>
                        <div style={{ padding:"10px 14px" }}>
                          <div style={{ fontSize:14, color:"#4A5568", lineHeight:1.7, marginBottom:8 }}>{item.desc}</div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                            <div style={{ background:"#F7FAFC", borderRadius:8, padding:"6px 8px" }}>
                              <div style={{ fontSize:14, color:"#4A5568", fontWeight:700, marginBottom:2 }}>なぜ必要？</div>
                              <div style={{ fontSize:15, color:"#4A5568", lineHeight:1.5 }}>{item.why}</div>
                            </div>
                            <div style={{ background:"#F7FAFC", borderRadius:8, padding:"6px 8px" }}>
                              <div style={{ fontSize:14, color:"#4A5568", fontWeight:700, marginBottom:2 }}>こんな時に必要</div>
                              <div style={{ fontSize:15, color:"#4A5568", lineHeight:1.5 }}>{item.when}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "guide" && !selectedFeature && (
          <div>
            {/* 空気浄化技術比較 */}
            <AirPurifyCompare />

            <div style={{ fontSize:14, fontWeight:700, color:"#4A5568", letterSpacing:2, margin:"24px 0 12px" }}>◼ 機能ガイド一覧</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {Object.entries(FEATURES_DB).map(([key, f]) => (
                <button key={key} onClick={() => setSelectedFeature(key)} style={{
                  background:"#FFFFFF", border:"1px solid #E2E8F0",
                  borderRadius:16, padding:"14px 18px", cursor:"pointer", color:"#1A202C",
                  textAlign:"left", display:"flex", alignItems:"center", gap:14, transition:"all 0.18s",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  <span style={{ fontSize:26 }}>{f.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{f.name}</div>
                    <div style={{ fontSize:14, color:"#4A5568" }}>{f.maker}　·　{f.tagline}</div>
                  </div>
                  <span style={{ color:"#718096", fontSize:14 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "guide" && selectedFeature && (
          <div>
            <button onClick={() => setSelectedFeature(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:20 }}>← 機能一覧に戻る</button>
            <FeatureCard featureKey={selectedFeature} isStaffMode={false} highlight={false} />
          </div>
        )}
        </div> {/* 右コンテンツエリア終わり */}
      </div> {/* メインレイアウト終わり */}
    </div>
  );
}
