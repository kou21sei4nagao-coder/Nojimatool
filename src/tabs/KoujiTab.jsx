// 工事内容タブ（完全に静的なコンテンツ）
export default function KoujiTab() {
  return (
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
            { name:"ドレンホース断熱処理", icon:"💧", color:"#3182CE", desc:"ドレンホース（排水ホース）に断熱材を巻く工事です。", why:"夏場にドレンホースが結露して水滴が垂れるのを防ぎます。特に室内を通る部分に必要です。", when:"配管が室内を通る場合・結露が気になる場合", price:"別途 ¥3,000〜5,000程度" },
            { name:"配管穴あけ工事", icon:"🔩", color:"#D69E2E", desc:"エアコン用の配管を通す穴を壁に開ける工事です。", why:"新規設置や穴の位置が合わない場合に必要です。コンクリート・タイルは追加費用がかかります。", when:"配管穴がない場合・既存穴の位置が合わない場合", price:"別途 ¥5,000〜15,000程度（素材による）" },
            { name:"配管延長工事", icon:"📏", color:"#4A5568", desc:"室内機と室外機をつなぐ配管を延長する工事です。", why:"標準の配管長（約3〜4m）より距離が長い場合に必要です。", when:"室外機を離れた場所に設置する場合", price:"別途 ¥1,000〜2,000/m程度" },
            { name:"隠蔽配管工事", icon:"🏠", color:"#805AD5", desc:"配管を壁の中や天井裏に隠して通す工事です。", why:"見た目をスッキリさせたい場合に行います。工事が複雑になるため費用が高くなります。", when:"配管を見せたくない場合・新築・リフォーム時", price:"別途 ¥30,000〜100,000程度" },
            { name:"既設エアコン取り外し・処分", icon:"🗑️", color:"#E53E3E", desc:"古いエアコンを取り外してリサイクル処分する工事です。", why:"家電リサイクル法により、エアコンは適正に処分する必要があります。", when:"今のエアコンを取り外す場合", price:"取り外し ¥3,000〜5,000 ＋ リサイクル料金" },
            { name:"室外機架台設置", icon:"🔧", color:"#2D3748", desc:"室外機を地面・壁・屋根などに設置するための架台を取り付ける工事です。", why:"室外機を安定して設置するために必要です。設置場所によって種類が異なります。", when:"ベランダ以外に設置する場合・壁掛け・屋根置きの場合", price:"別途 ¥5,000〜20,000程度（種類による）" },
            { name:"200V電源工事", icon:"⚡", color:"#D69E2E", desc:"100Vのコンセントを200Vに変更する電気工事です。", why:"大型エアコン（14畳以上）は200V電源が必要な場合があります。", when:"200V対応エアコンを設置するが100Vコンセントしかない場合", price:"別途 ¥15,000〜30,000程度" },
          ].map((item, i) => (
            <div key={i} style={{ background:"#FFFFFF", borderRadius:14, border:`1px solid ${item.color}30`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"120px 1fr" }}>
                <div style={{ background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"120px", fontSize:40 }}>
                  {item.icon}
                </div>
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
  );
}
