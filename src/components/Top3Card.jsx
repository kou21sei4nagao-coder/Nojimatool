import { useState } from "react";
import { AC_MODELS, FEATURES_DB } from "../data/acData.js";

export default function Top3Card({ item, color }) {
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState({});
  const model = AC_MODELS.find(m => m.model === item.model);

  return (
    <div style={{ marginBottom:8 }}>
      <div onClick={() => setOpen(v => !v)} style={{
        display:"flex", gap:8, alignItems:"flex-start", width:"100%", textAlign:"left",
        background: open ? `${color}08` : "rgba(0,0,0,0.02)",
        border: `1px solid ${open ? color+"50" : "#E2E8F0"}`,
        borderRadius: open ? "10px 10px 0 0" : "10px",
        padding:"10px", cursor:"pointer", transition:"all 0.15s",
      }}>
        <div style={{
          width:22, height:22, borderRadius:6, flexShrink:0,
          background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : "#CD7F32",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:700, color:"#fff",
        }}>{item.rank}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A202C" }}>{item.maker} {item.series}</div>
          <div style={{ fontSize:14, color:"#4A5568" }}>{item.model}</div>
          <div style={{ fontSize:15, color:"#4A5568", marginTop:2, lineHeight:1.5 }}>{item.point}</div>
        </div>
        <span style={{ color, fontSize:15, flexShrink:0 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ background:"#F8FAFC", border:`1px solid ${color}30`, borderTop:"none", borderRadius:"0 0 10px 10px", padding:"12px 14px" }}>
          {model ? (
            <>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                {model.hasFilter && <span style={{ fontSize:15, padding:"3px 8px", borderRadius:8, background:"#F0FFF4", color:"#38A169", border:"1px solid #C6F6D5" }}>✨ 自動フィルター</span>}
                {model.isEco    && <span style={{ fontSize:15, padding:"3px 8px", borderRadius:8, background:"#EBF8FF", color:"#3182CE", border:"1px solid #BEE3F8" }}>⚡ 省エネ</span>}
                {model.features.filter(k => k !== "filter").map(k => {
                  const f = FEATURES_DB[k];
                  return f ? <span key={k} style={{ fontSize:15, padding:"3px 8px", borderRadius:8, background:`${f.color}10`, color:f.color, border:`1px solid ${f.color}30` }}>{f.icon} {f.name}</span> : null;
                })}
              </div>
              {model.features.filter(k => k !== "filter").map(k => {
                const f = FEATURES_DB[k];
                if (!f) return null;
                return (
                  <div key={k} style={{ marginBottom:8 }}>
                    <div style={{ fontSize:14, color:"#4A5568", lineHeight:1.7, marginBottom:6 }}>{f.customer}</div>
                    <button onClick={() => setVideoOpen(v => ({...v, [k]: !v[k]}))} style={{
                      background:"#FFF5F5", border:"1px solid #FEB2B2",
                      borderRadius:8, padding:"5px 12px",
                      color:"#C53030", fontSize:15, cursor:"pointer",
                    }}>▶ {f.name}の動画{videoOpen[k] ? "を閉じる" : "を見る"}</button>
                    {videoOpen[k] && (
                      <div style={{ marginTop:8, borderRadius:8, overflow:"hidden", aspectRatio:"16/9" }}>
                        <iframe width="100%" height="100%"
                          src={`https://www.youtube.com/embed/${f.youtubeId}?rel=0`}
                          title={f.name} frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen style={{ display:"block" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div style={{ fontSize:14, color:"#4A5568" }}>※ 型番をAC_MODELSに登録すると詳細が表示されます</div>
          )}
        </div>
      )}
    </div>
  );
}
