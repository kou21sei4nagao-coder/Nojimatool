import { useState } from "react";
import { FEATURES_DB } from "../data/acData.js";

export default function FeatureCard({ featureKey, isStaffMode, highlight }) {
  const f = FEATURES_DB[featureKey];
  const [open, setOpen] = useState(false);
  if (!f) return null;
  return (
    <div style={{
      background: "#FFFFFF",
      border: `1px solid ${highlight ? f.color+"55" : "#E2E8F0"}`,
      borderRadius: 16, padding: "18px 20px",
      boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <span style={{ fontSize:26 }}>{f.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{f.name}
            <span style={{ fontSize:15, color:"#4A5568", fontWeight:400, marginLeft:8 }}>{f.maker}</span>
          </div>
          <div style={{ fontSize:14, color:"#4A5568" }}>{f.tagline}</div>
        </div>
        {highlight && <span style={{ fontSize:15, color:f.color, background:f.color+"15", padding:"2px 8px", borderRadius:6, border:`1px solid ${f.color}40` }}>搭載機能</span>}
      </div>

      <div style={{ fontSize:15, color:"#4A5568", lineHeight:1.75, marginBottom:10 }}>{f.customer}</div>

      {isStaffMode && (
        <div style={{ background:"#FFFBEB", border:"1px solid #F6E05E", borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
          <div style={{ fontSize:15, color:"#B7791F", fontWeight:700, marginBottom:4 }}>📋 スタッフメモ</div>
          <div style={{ fontSize:14, color:"#744210", lineHeight:1.75 }}>{f.staff}</div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <a href={`https://youtu.be/${f.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:"#FF0000", borderRadius:10,
          padding:"8px 16px", color:"#fff", fontSize:14, fontWeight:700,
          textDecoration:"none",
        }}>▶ YouTubeで動画を見る</a>
        {f.extraVideos && f.extraVideos.map(v => (
          <a key={v.id} href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"#CC0000", borderRadius:10,
            padding:"8px 16px", color:"#fff", fontSize:14, fontWeight:700,
            textDecoration:"none",
          }}>▶ {v.label}</a>
        ))}
      </div>
    </div>
  );
}
