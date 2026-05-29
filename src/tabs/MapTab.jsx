import { AC_MODELS, FEATURES_DB, TATAMI_KW, TOP3, FULL_RANKING } from "../data/acData.js";
import FeatureCard from "../components/FeatureCard.jsx";

// ── マップセル ──────────────────────────────────────────────
function MapCell({ name, desc, bg='#FFFFFF', border='#E2E8F0', color='#1A202C', rank, warn, gray, setMapSelectedModel }) {
  const hasDetail = !gray;
  const model = null; // 型番から詳細取得は将来対応
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
}

// ── Top3ランキングボタン群 ─────────────────────────────────
function Top3RankingButtons({ group, label, setTop3View }) {
  return (
    <div style={{ marginBottom:24 }}>
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
  );
}

// ── MapTab メイン ──────────────────────────────────────────
export default function MapTab({ top3View, setTop3View, mapSelectedModel, setMapSelectedModel }) {
  const C = (props) => <MapCell {...props} setMapSelectedModel={setMapSelectedModel} />;

  // ── マップ機種詳細 ──
  if (mapSelectedModel) {
    return (
      <div>
        <button onClick={() => setMapSelectedModel(null)} style={{ background:"none", border:"none", color:"#4A5568", cursor:"pointer", fontSize:15, marginBottom:20 }}>← マップに戻る</button>
        <div style={{ background:"#FFFFFF", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#1A202C", marginBottom:4 }}>{mapSelectedModel.name}</div>
          {mapSelectedModel.desc && <div style={{ fontSize:14, color:"#4A5568", lineHeight:1.7, marginBottom:16, padding:"10px 14px", background:"#F7FAFC", borderRadius:8 }}>{mapSelectedModel.desc}</div>}
          {mapSelectedModel.model ? (
            <>
              <div style={{ fontSize:13, color:"#718096", marginBottom:14 }}>
                {mapSelectedModel.model.model}　{mapSelectedModel.model.tatami}畳 / {TATAMI_KW[mapSelectedModel.model.tatami]}kW
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                {mapSelectedModel.model.hasFilter && <span style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"#F0FFF4", color:"#38A169", border:"1px solid #C6F6D5" }}>✨ 自動フィルター</span>}
                {mapSelectedModel.model.isEco    && <span style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"#EBF8FF", color:"#3182CE", border:"1px solid #BEE3F8" }}>⚡ 超省エネ</span>}
                {mapSelectedModel.model.features.filter(k => k !== "filter").map(k => {
                  const f = FEATURES_DB[k];
                  return f ? <span key={k} style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:`${f.color}10`, color:f.color, border:`1px solid ${f.color}30` }}>{f.icon} {f.name}</span> : null;
                })}
              </div>
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
    );
  }

  // ── 全体マップ ──
  return (
    <div>

      {/* ─── 6・10畳 全体マップ ─── */}
      <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', marginBottom:12 }}>● 6・10畳 全体マップ</div>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 3fr 2fr', gap:10 }}>

        {/* スタンダード */}
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

        {/* 自動フィルター掃除 */}
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

        {/* 超省エネ */}
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

      {/* 6・10畳 おすすめTop3 */}
      <div style={{ marginTop:28 }}>
        <Top3RankingButtons group="small" label="6・10畳 おすすめ" setTop3View={setTop3View} />
      </div>

      {/* ─── 14・18・20・23畳 全体マップ ─── */}
      <div style={{ marginTop:32 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', marginBottom:12 }}>● 14・18・20・23畳 全体マップ</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr 4fr', gap:10 }}>

          {/* スタンダード */}
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

          {/* 自動フィルター掃除 */}
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

          {/* 超省エネ（左右結合4列） */}
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
              <C name='シャープ R' desc='感動最安。電気代コンサルならVの省エネモデル' />
              <C name='パナ X' desc='条件付きで標準工事費込。複数台割なし' color='#0047AA' border='#0047AA' />
              <C name='' gray />
              <C name='パナ X' desc='省エネ最強。ナノイーX全部入り' color='#0047AA' border='#0047AA' />
              <C name='日立 X' desc='内部銅合金で水の通り道も凍結。空気清浄機で脱臭' bg='#BEE3F8' border='#3182CE' color='#CE0F0F' />
              <C name='ダイキン A' desc='Rシリーズの加湿換気なしモデル' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
              <C name='ダイキン R' desc='換気・暖房時加湿。穴問題あり' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
              <C name='日立 X' desc='内部銅合金で水の通り道も凍結' bg='#BEE3F8' border='#3182CE' color='#CE0F0F' />
              <C name='' gray />
              <C name='三菱 Z' desc='エモコで体温判断し人にフォーカス' color='#E60012' border='#E60012' />
              <C name='パナ LV' desc='パナソニック上位省エネモデル' color='#0047AA' border='#0047AA' />
              <C name='ダイキン R' desc='換気・暖房時加湿' bg='#BEE3F8' border='#3182CE' color='#00A0E9' />
              <C name='' gray />
              <C name='東芝 DR' desc='換気・穴問題あり' />
              <C name='' gray />
              <C name='三菱 Z' desc='エモコで体温判断し人にフォーカス' color='#E60012' border='#E60012' />
            </div>
          </div>
        </div>
      </div>

      {/* 14・18畳 おすすめTop3 */}
      <div style={{ marginTop:28 }}>
        <Top3RankingButtons group="large" label="14・18畳 おすすめ" setTop3View={setTop3View} />
      </div>

    </div>
  );
}
