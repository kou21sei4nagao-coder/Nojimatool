import { useState } from "react";
import { AC_MODELS, MAKER_COLORS } from "./data/acData.js";
import Top3View   from "./components/Top3View.jsx";
import FilterTab  from "./tabs/FilterTab.jsx";
import MakersTab  from "./tabs/MakersTab.jsx";
import MapTab     from "./tabs/MapTab.jsx";
import EstimateTab from "./tabs/EstimateTab.jsx";
import KoujiTab   from "./tabs/KoujiTab.jsx";
import GuideTab   from "./tabs/GuideTab.jsx";

// ── グローバルスタイル ────────────────────────────────────
const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; overflow: hidden; background: #F5F7FA; font-size: 16px; }
  html { margin: 0; padding: 0; }
  #root { width: 100% !important; max-width: 100% !important; margin: 0 !important; border: none !important; text-align: left !important; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #F0F2F5; }
  ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 3px; }
  button, div, span, a, p { -webkit-font-smoothing: antialiased; }
  .estimate-shell { container-type: inline-size; }
  @container (max-width: 920px) {
    .estimate-grid { grid-template-columns: minmax(270px, 1fr) minmax(250px, 0.9fr) !important; gap: 10px !important; padding: 12px !important; }
    .estimate-lists { grid-template-columns: minmax(0, 1fr) !important; min-width: 0 !important; }
    .estimate-card { min-width: 0 !important; }
    .estimate-card:not(.estimate-card-active) { display: none !important; }
    .estimate-keypad { min-width: 0 !important; }
    .estimate-keypad-list-tabs { gap: 6px !important; }
    .estimate-keypad-field-tabs { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 6px !important; }
    .estimate-keypad-field-tabs .estimate-camera-key { display: none !important; }
    .estimate-numbers { gap: 8px !important; }
    .estimate-numbers button { height: 58px !important; font-size: 26px !important; }
  }
  @container (max-width: 620px) {
    .estimate-grid { grid-template-columns: 1fr !important; }
  }
`;

const NAV_ITEMS = [
  ["map",      "🗺️ 全体マップ"],
  ["filter",   "🔍 絞り込む"],
  ["makers",   "🏷️ メーカー特徴"],
  ["kouji",    "🔧 工事内容"],
  ["estimate", "💰 見積もり"],
  ["guide",    "📚 機能ガイド"],
];

// ── メイン ───────────────────────────────────────────────
export default function App() {
  // ── タブ ──
  const [tab, setTab] = useState("map");
  const [tabMenuOpen, setTabMenuOpen] = useState(false);

  // ── 絞り込み ──
  const [maker,      setMaker]      = useState(null);
  const [tatami,     setTatami]     = useState(null);
  const [filterOpt,  setFilterOpt]  = useState(null);
  const [ecoOpt,     setEcoOpt]     = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const resetFilter = () => { setMaker(null); setTatami(null); setFilterOpt(null); setEcoOpt(null); setSelectedModel(null); };
  const results = AC_MODELS.filter(m => {
    if (maker     !== null && m.maker     !== maker)     return false;
    if (tatami    !== null && m.tatami    !== tatami)    return false;
    if (filterOpt !== null && m.hasFilter !== filterOpt) return false;
    if (ecoOpt    !== null && m.isEco     !== ecoOpt)    return false;
    return true;
  });

  // ── メーカー特徴 ──
  const [selectedMaker, setSelectedMaker] = useState(null);

  // ── マップ ──
  const [top3View, setTop3View]             = useState(null);
  const [mapSelectedModel, setMapSelectedModel] = useState(null);

  // ── 機能ガイド ──
  const [selectedFeature, setSelectedFeature] = useState(null);

  // ── 見積もり ──
  const initCalc = () => ({ label:"", honka:"", nebiki:"", kouji:true, koujiType:0, options:[], hosho:"", hyoji:"", sokone:"", applied:false });
  const [calcs, setCalcs]           = useState([initCalc(), initCalc(), initCalc()]);
  const [activeCalc, setActiveCalc] = useState(0);
  const [activeField, setActiveField] = useState("honka");
  const updateCalc   = (i, key, val) => setCalcs(prev => prev.map((c, idx) => idx===i ? {...c, [key]:val} : c));
  const toggleOption = (i, opt)     => setCalcs(prev => prev.map((c, idx) => idx===i ? {...c, options: c.options.includes(opt) ? c.options.filter(o=>o!==opt) : [...c.options, opt]} : c));
  const addCalc    = () => setCalcs(prev => [...prev, initCalc()]);
  const removeCalc = (i) => setCalcs(prev => prev.filter((_, idx) => idx !== i));

  // ── スワイプでメニューを開く ──
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

  const accentColor = maker ? MAKER_COLORS[maker] : "#1E90FF";

  return (
    <div
      onTouchStart={startEdgeSwipe}
      onTouchMove={moveEdgeSwipe}
      onTouchEnd={endEdgeSwipe}
      onTouchCancel={() => setEdgeSwipe(null)}
      style={{ height:"100vh", background:"#F5F7FA", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", color:"#1A202C", display:"flex", flexDirection:"column", overflow:"hidden", width:"100vw" }}
    >
      <style>{globalStyle}</style>

      {/* ── スライドメニュー ── */}
      {tabMenuOpen && (
        <>
          <div onClick={() => setTabMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(26,32,44,0.08)" }} />
          <div style={{ position:"fixed", top:0, left:0, bottom:0, width:260, zIndex:45, background:"#FFFFFF", borderRight:"1px solid #E2E8F0", boxShadow:"8px 0 24px rgba(0,0,0,0.14)", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"14px 14px 12px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={() => setTabMenuOpen(false)} style={{ width:32, height:32, borderRadius:10, border:"1px solid #E2E8F0", background:"#F7FAFC", color:"#4A5568", cursor:"pointer", fontSize:16, flexShrink:0 }}>×</button>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#1A202C", whiteSpace:"nowrap" }}>エアコン コンサルツール</div>
                  <span style={{ fontSize:12, fontWeight:800, padding:"1px 7px", borderRadius:16, background:"linear-gradient(135deg, #667eea, #764ba2)", color:"#fff" }}>α</span>
                </div>
                <div style={{ fontSize:9, color:"#718096", letterSpacing:1 }}>nagao · AC GUIDE</div>
              </div>
            </div>
            <div style={{ padding:"8px 0" }}>
              {NAV_ITEMS.map(([key, label]) => (
                <button key={key} onClick={() => { setTab(key); setTabMenuOpen(false); }} style={{
                  width:"100%", padding:"13px 18px",
                  background: tab===key ? "#EBF8FF" : "#FFFFFF",
                  textAlign:"left", border:"none",
                  borderLeft:`4px solid ${tab===key ? accentColor : "transparent"}`,
                  color: tab===key ? "#1A202C" : "#718096",
                  fontSize:15, fontWeight: tab===key ? 800 : 500, cursor:"pointer",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── コンテンツエリア ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <div style={{ flex:1, minWidth:0, overflowY:"auto", padding:"12px 14px", background:"#F5F7FA" }}>

          {/* Top3比較ページ（filter / map タブ共通） */}
          {(tab === "filter" || tab === "map") && !selectedModel && top3View && (
            <Top3View top3View={top3View} setTop3View={setTop3View} />
          )}

          {/* 絞り込みタブ */}
          {tab === "filter" && !top3View && (
            <FilterTab
              maker={maker} setMaker={setMaker}
              tatami={tatami} setTatami={setTatami}
              filterOpt={filterOpt} setFilterOpt={setFilterOpt}
              ecoOpt={ecoOpt} setEcoOpt={setEcoOpt}
              selectedModel={selectedModel} setSelectedModel={setSelectedModel}
              accentColor={accentColor} resetFilter={resetFilter} results={results}
            />
          )}

          {/* メーカー特徴タブ */}
          {tab === "makers" && (
            <MakersTab selectedMaker={selectedMaker} setSelectedMaker={setSelectedMaker} />
          )}

          {/* 全体マップタブ */}
          {tab === "map" && !top3View && (
            <MapTab
              top3View={top3View} setTop3View={setTop3View}
              mapSelectedModel={mapSelectedModel} setMapSelectedModel={setMapSelectedModel}
            />
          )}

          {/* 見積もりタブ */}
          {tab === "estimate" && (
            <EstimateTab
              calcs={calcs} setCalcs={setCalcs}
              activeCalc={activeCalc} setActiveCalc={setActiveCalc}
              activeField={activeField} setActiveField={setActiveField}
              updateCalc={updateCalc} toggleOption={toggleOption} initCalc={initCalc}
            />
          )}

          {/* 工事内容タブ */}
          {tab === "kouji" && <KoujiTab />}

          {/* 機能ガイドタブ */}
          {tab === "guide" && (
            <GuideTab selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} />
          )}

        </div>
      </div>
    </div>
  );
}
