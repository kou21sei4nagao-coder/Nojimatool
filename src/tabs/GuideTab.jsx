import { FEATURES_DB } from "../data/acData.js";
import AirPurifyCompare from "../components/AirPurifyCompare.jsx";
import FeatureCard from "../components/FeatureCard.jsx";

export default function GuideTab({ selectedFeature, setSelectedFeature }) {
  // ── 機能詳細 ──
  if (selectedFeature) {
    return (
      <div>
        <button onClick={() => setSelectedFeature(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:20 }}>← 機能一覧に戻る</button>
        <FeatureCard featureKey={selectedFeature} isStaffMode={false} highlight={false} />
      </div>
    );
  }

  // ── 機能一覧 ──
  return (
    <div>
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
  );
}
