import { MAKERS, MAKER_GUIDE, MAKER_FEATURES, FEATURE_ITEMS, FEATURE_ICONS, markColor } from "../data/acData.js";

export default function MakersTab({ selectedMaker, setSelectedMaker }) {
  // ── メーカー詳細 ──
  if (selectedMaker) {
    const g = MAKER_GUIDE[selectedMaker];
    return (
      <div>
        <button onClick={() => setSelectedMaker(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:16 }}>← 一覧に戻る</button>

        <div style={{ background:`linear-gradient(135deg, ${g.color}30, ${g.color}10)`, border:`1px solid ${g.color}60`, borderRadius:20, padding:"16px 24px", marginBottom:16 }}>
          <div style={{ fontSize:22, fontWeight:700 }}>{selectedMaker}</div>
          <div style={{ fontSize:15, color:g.color, fontWeight:700, marginTop:4 }}>「{g.catch}」</div>
        </div>

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

        <div style={{ background:"#FFFBEB", border:"1px solid #F6E05E", borderRadius:16, padding:"16px 20px" }}>
          <div style={{ fontSize:14, color:"#B7791F", fontWeight:700, letterSpacing:1, marginBottom:8 }}>📋 接客Tips</div>
          <div style={{ fontSize:15, color:"#744210", lineHeight:1.8 }}>{g.tip}</div>
        </div>
      </div>
    );
  }

  // ── メーカー一覧 ──
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:700, color:"#7090A8", letterSpacing:2, marginBottom:16 }}>◼ メーカー別コンサルポイント</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {MAKERS.map(m => {
          const g = MAKER_GUIDE[m];
          return (
            <div key={m} style={{ background:`${g.color}10`, border:`1px solid ${g.color}40`, borderRadius:18, padding:"18px 20px" }}>
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
  );
}
