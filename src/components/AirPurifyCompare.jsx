export default function AirPurifyCompare() {
  const techs = [
    {
      id:'daikin', maker:'ダイキン', name:'ストリーマ', color:'#178BE0',
      rankNum:1,
      rank:'破壊力 最強', rankDesc:'菌を芯から焼き切る',
      catchCopy:'エアコン内部を\n焼き切って清潔に',
      icon:'🔥', strong:'カビ・内部除菌',
      points: [
        { title:'吸い込んで内部で強力分解', desc:'空気中のウイルスや花粉を吸い込み、エアコン内部のストリーマ放電で芯から「焼き切って」無力化します。他社が菌を「気絶させる」のに対し、ダイキンは完全消滅させます。' },
        { title:'フィルターや内部の部品も除菌', desc:'部屋の空気だけでなく、汚れが溜まりやすいエアコン内部のフィルターや熱交換器も同時に除菌し、常に清潔な風をキープします。' },
      ],
      target:'「エアコンをつけると臭い」が気になる人',
    },
    {
      id:'panasonic', maker:'Panasonic', name:'ナノイーX', color:'#0047AA',
      rankNum:2,
      rank:'浸透力 最強', rankDesc:'繊維の奥まで届く',
      catchCopy:'布製品の奥まで\n染み込んで脱臭',
      icon:'💧', strong:'ニオイ・花粉・保湿',
      points: [
        { title:'繊維の奥まで入り込む脱臭力', desc:'水のカプセルに包まれているため他社のイオンより長く生き残り、ソファやカーテンの繊維の奥深くまで入り込んで焼肉・タバコ・ペットのニオイを元から脱臭します。' },
        { title:'日本の主要な花粉を抑制', desc:'スギやヒノキなど、日本全国の主要な花粉を無力化する効果が高く、一年中空気を綺麗に保ちます。' },
        { title:'肌や髪のうるおいキープ', desc:'空気中の汚れを抑えつつ、水由来のイオンがお肌や髪にうるおいを与える美容効果も備えています。' },
      ],
      target:'ペット・料理・タバコのニオイが気になる人',
    },
    {
      id:'sharp', maker:'シャープ', name:'プラズマクラスター', color:'#D4820A',
      rankNum:3,
      rank:'空間制圧力 最強', rankDesc:'部屋全体を一気にカバー',
      catchCopy:'部屋中に広がって\n花粉・ホコリを落とす',
      icon:'🌪️', strong:'花粉・ホコリ・消臭',
      points: [
        { title:'空間まるごと除菌', desc:'大量のイオンを部屋中に一気に放出し、空気中の静電気をスッと消し去る「空間の制圧力」が最強です。花粉やホコリを素早く床に落とします。' },
        { title:'静電気を抑えてホコリを落とす', desc:'壁やカーテンに花粉やホコリが張り付くのを防ぎ、床に落として掃除機で吸いやすくします。' },
        { title:'部屋干し臭のスポット消臭', desc:'部屋干しのイヤな生乾き臭や、服に付いた汗のニオイなどを消臭するのにも優れています。' },
      ],
      target:'花粉症・ホコリが部屋に舞うのが気になる人',
    },
  ];

  return (
    <div style={{ background:'#FFFFFF', borderRadius:16, border:'0.5px solid #E2E8F0', padding:'18px 20px', marginBottom:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', marginBottom:4 }}>3大空気浄化技術の比較</div>
      <div style={{ fontSize:14, color:'#718096', marginBottom:16 }}>お客様のお悩みに合わせて選べます</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
        {techs.map(t => (
          <div key={t.id} style={{ background:t.color+'06', borderRadius:14, padding:'16px', border:'1.5px solid '+t.color+'30' }}>
            <div style={{ background:t.color, borderRadius:10, padding:'8px 12px', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0 }}>
                {t.rankNum}
              </div>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{t.rank}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)' }}>{t.rankDesc}</div>
              </div>
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:t.color, marginBottom:4 }}>{t.maker}「{t.name}」</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#1A202C', lineHeight:1.4, marginBottom:10, whiteSpace:'pre-line' }}>{t.catchCopy}</div>
            <div style={{ display:'inline-block', fontSize:15, fontWeight:700, padding:'4px 10px', borderRadius:20, background:t.color+'15', color:t.color, border:'1px solid '+t.color+'30', marginBottom:14 }}>
              ✓ {t.strong}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {t.points.map((p, i) => (
                <div key={i}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#1A202C', marginBottom:2 }}>▶ {p.title}</div>
                  <div style={{ fontSize:15, color:'#4A5568', lineHeight:1.7, paddingLeft:10 }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, paddingTop:10, borderTop:'1px solid '+t.color+'20', fontSize:15, color:t.color, fontWeight:600 }}>
              👤 {t.target}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
