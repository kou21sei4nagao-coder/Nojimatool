// ── 機能データベース ─────────────────────────────────────
export const FEATURES_DB = {
  nanoe: {
    name: "ナノイーX", maker: "Panasonic", icon: "🌬️",
    tagline: "空気中の菌・ウイルス・花粉を抑制",
    customer: "空気中に漂う目に見えない菌やウイルス、花粉を抑制するPanasonic独自の技術です。お部屋全体の空気をきれいに保ちます。",
    staff: "OHラジカル含有ナノサイズの水粒子。濃度は従来比48倍。アレルギー・ペット臭・タバコ臭にも効果あり。「空気清浄機いらずになりますよ」のトークが刺さる。",
    youtubeId: "tVnDBrHa0AU", color: "#0047AA",
  },
  urusara: {
    name: "うるさらX", maker: "ダイキン", icon: "💧",
    tagline: "外の空気から水分を取り込んで加湿",
    customer: "外の空気から水分を集めて加湿するため、給水タンクが不要。冬の乾燥対策に最適で、肌・喉・目の乾燥を防ぎます。",
    staff: "業界唯一の外気吸収加湿。加湿器を別途買う必要がなくなる点を強調。「加湿器代と電気代が節約できますよ」。特に寝室・子供部屋に響く。",
    youtubeId: "yhrY5DHDnf8", color: "#00A0E9",
  },
  mugei: {
    name: "ムーブアイmirAI", maker: "三菱電機", icon: "👁️",
    tagline: "人を感知して風を自動コントロール",
    customer: "部屋の中の人の位置・姿勢・体温を検知して、風を当てる・当てないを自動で調整。直接風が当たらないので体が冷えすぎません。",
    staff: "床温度・人体温度・日射を同時センシング。「エアコンの風が苦手」というお客様への切り口として最強。快眠モードは就寝後に自動で温度調整するので睡眠の質も訴求できる。",
    youtubeId: "1aRl8KMKOBE", color: "#E60012",
  },
  touketsu: {
    name: "凍結洗浄", maker: "日立", icon: "🧊",
    tagline: "熱交換器を氷で包んで一気に洗浄",
    customer: "エアコン内部を意図的に凍らせ、その氷が溶けるときに汚れをまとめて洗い流します。カビや細菌が繁殖しにくい清潔な状態を保てます。",
    staff: "業界初の技術。「エアコンの嫌な臭い」に悩んでいるお客様に響く。年1回のプロクリーニング代が節約できる点も訴求ポイント。",
    youtubeId: "AkpLMOKVMwk", color: "#CE0F0F",
  },
  kanki: {
    name: "換気機能", maker: "東芝", icon: "🌀",
    tagline: "エアコンをつけたまま換気できる",
    customer: "窓を開けなくても外気を取り込んで換気できます。冷暖房の効率を下げずに空気の入れ替えができるので、コロナ以降特に人気の機能です。",
    staff: "業界唯一の給気換気機能。「窓開けると暑くなる」「花粉が入る」という不満を解決。特にリビングに設置するお客様に響く。",
    youtubeId: "TuCkgDsUkMQ", color: "#E60020",
  },
  filter: {
    name: "自動フィルター掃除", maker: "各社共通", icon: "✨",
    tagline: "フィルター掃除が不要に",
    customer: "運転するたびに自動でフィルターのホコリを取り除き、ダストボックスに溜めます。お手入れの手間が大幅に減り、常に効率よく動きます。",
    staff: "掃除頻度は機種により異なる（2週間〜1ヶ月に1回のダストボックス掃除のみ）。「フィルター掃除が面倒」「高い場所に設置するので掃除しにくい」というお客様に必須提案。省エネ効果もある。",
    youtubeId: "keFOjfw9jLk", color: "#4CAF50",
    extraVideos: [
      { id:"QbmMPoK_Ll8", label:"三菱電機 フィルターおそうじメカ" },
      { id:"Yo9E4cuaho4", label:"ゼネラル フィルター自動おそうじ" },
      { id:"LNxKUmZ58bY", label:"ダイキン ダストボックスのお手入れ" },
      { id:"vjZWxLxm-T4", label:"ダイキン フィルターのお手入れ" },
    ],
  },
  plasma: {
    name: "プラズマクラスター25000", maker: "シャープ", icon: "⚡",
    tagline: "プラスとマイナスのイオンで除菌・消臭",
    customer: "空気中にプラスとマイナスのイオンを放出し、浮遊菌やウイルスを分解・除去します。ペットや料理の気になる臭いも抑えます。",
    staff: "数値が高いほど効果が高い（25000は最高グレード）。ウイルス除去率99.9%以上（Sharp発表）。ペット・タバコ・料理臭に悩むお客様に刺さる。",
    youtubeId: "OhmIG1hXbAg", color: "#555",
  },
  konan_fujitsu: {
    name: "ハイパワー暖房", maker: "富士通", icon: "🔥",
    tagline: "外気−25℃でも強力暖房（富士通）",
    customer: "極寒の環境でも暖房能力が落ちにくい設計です。「エアコンの暖房は寒い」というイメージを覆す、パワフルな暖房性能を持っています。",
    staff: "寒冷地仕様モデルは−25℃対応。「暖房はガスファンヒーターじゃないと」というお客様への切り返しに使える。",
    youtubeId: "vRJjEMIa9Cg", color: "#FF6B00",
  },
  konan_general: {
    name: "ハイパワー暖房", maker: "ゼネラル", icon: "🔥",
    tagline: "外気−25℃でも強力暖房（ゼネラル）",
    customer: "極寒の環境でも暖房能力が落ちにくい設計です。「エアコンの暖房は寒い」というイメージを覆す、パワフルな暖房性能を持っています。",
    staff: "ゼネラルブランドは富士通ゼネラル製造。性能は同等だが展示・販路が異なる。寒冷地向けとしての訴求ポイントは富士通と同様。",
    youtubeId: "vRJjEMIa9Cg", color: "#E87B00",
  },
};

// ── 機種データ ───────────────────────────────────────────
export const AC_MODELS = [
  // Panasonic（6畳）
  { id:1,  maker:"Panasonic", series:"エオリア GJR", model:"CS-226GJR-W",  tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",  features:["nanoe"],          color:"#0047AA" },
  { id:2,  maker:"Panasonic", series:"エオリア EX",  model:"CS-EX226D-W",  tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["nanoe","filter"], color:"#0047AA" },
  { id:3,  maker:"Panasonic", series:"エオリア GX",  model:"CS-GX226D-W",  tatami:6,  hasFilter:false, isEco:true,  grade:"スタンダード",  features:["nanoe"],          color:"#0047AA" },
  { id:4,  maker:"Panasonic", series:"エオリア C",   model:"CS-C226D-W",   tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",  features:[],                 color:"#0047AA" },
  // Panasonic（10畳）
  { id:11, maker:"Panasonic", series:"エオリア GX",  model:"CS-GX286D-W",  tatami:10, hasFilter:false, isEco:true,  grade:"スタンダード",  features:["nanoe"],          color:"#0047AA" },
  { id:12, maker:"Panasonic", series:"エオリア X",   model:"CS-X286D-W",   tatami:10, hasFilter:true,  isEco:true,  grade:"ハイグレード",  features:["nanoe","filter"], color:"#0047AA" },
  { id:13, maker:"Panasonic", series:"エオリア C",   model:"CS-C286D-W",   tatami:10, hasFilter:false, isEco:false, grade:"スタンダード",  features:[],                 color:"#0047AA" },
  { id:14, maker:"Panasonic", series:"エオリア TX",  model:"CS-TX286D-W",  tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["nanoe","filter"], color:"#0047AA" },
  { id:15, maker:"Panasonic", series:"エオリア TX2", model:"CS-TX286D2-W", tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["nanoe","filter"], color:"#0047AA" },
  { id:16, maker:"Panasonic", series:"エオリア UX",  model:"CS-UX286D-W",  tatami:10, hasFilter:true,  isEco:true,  grade:"ハイグレード",  features:["nanoe","filter"], color:"#0047AA" },
  // Daikin
  { id:6,  maker:"ダイキン",        series:"うるさらX",          model:"AN224ARP-W",  tatami:6,  hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["urusara","filter"],color:"#00A0E9" },
  { id:7,  maker:"ダイキン",        series:"うるさらX",          model:"AN284ARP-W",  tatami:10, hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["urusara","filter"],color:"#00A0E9" },
  { id:8,  maker:"ダイキン",        series:"うるさらX",          model:"AN404ARP-W",  tatami:14, hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["urusara","filter"],color:"#00A0E9" },
  { id:9,  maker:"ダイキン",        series:"Eシリーズ",          model:"AN224AES-W",  tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                  color:"#00A0E9" },
  { id:10, maker:"ダイキン",        series:"Eシリーズ",          model:"AN284AES-W",  tatami:10, hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                  color:"#00A0E9" },
  // 三菱電機
  { id:11, maker:"三菱電機",       series:"霧ヶ峰Zシリーズ",    model:"MSZ-ZW224S",  tatami:6,  hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["mugei","filter"],  color:"#E60012" },
  { id:12, maker:"三菱電機",       series:"霧ヶ峰Zシリーズ",    model:"MSZ-ZW284S",  tatami:10, hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["mugei","filter"],  color:"#E60012" },
  { id:13, maker:"三菱電機",       series:"霧ヶ峰Zシリーズ",    model:"MSZ-ZW404S",  tatami:14, hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["mugei","filter"],  color:"#E60012" },
  { id:14, maker:"三菱電機",       series:"霧ヶ峰GEシリーズ",   model:"MSZ-GE224S",  tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                  color:"#E60012" },
  // 日立
  { id:15, maker:"日立",           series:"白くまくん Wシリーズ",model:"RAS-W224M",   tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["touketsu","filter"],color:"#CE0F0F" },
  { id:16, maker:"日立",           series:"白くまくん Wシリーズ",model:"RAS-W284M",   tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["touketsu","filter"],color:"#CE0F0F" },
  { id:17, maker:"日立",           series:"白くまくん Xシリーズ",model:"RAS-X224M",   tatami:6,  hasFilter:true,  isEco:true,  grade:"ハイグレード",   features:["touketsu","filter"],color:"#CE0F0F" },
  { id:18, maker:"日立",           series:"白くまくん Eシリーズ",model:"RAS-E224M",   tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                  color:"#CE0F0F" },
  // 富士通
  { id:19, maker:"富士通",         series:"ノクリア Zシリーズ",  model:"AS-Z224N2",   tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["konan_fujitsu","filter"], color:"#FF6B00" },
  { id:20, maker:"富士通",         series:"ノクリア Zシリーズ",  model:"AS-Z284N2",   tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["konan_fujitsu","filter"], color:"#FF6B00" },
  { id:21, maker:"富士通",         series:"ノクリア Cシリーズ",  model:"AS-C224N",    tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                         color:"#FF6B00" },
  // ゼネラル
  { id:29, maker:"ゼネラル",       series:"Aシリーズ",           model:"AG-Z224N2",   tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["konan_general","filter"], color:"#E87B00" },
  { id:30, maker:"ゼネラル",       series:"Aシリーズ",           model:"AG-Z284N2",   tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["konan_general","filter"], color:"#E87B00" },
  { id:31, maker:"ゼネラル",       series:"Cシリーズ",           model:"AG-C224N",    tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                         color:"#E87B00" },
  // Sharp
  { id:22, maker:"シャープ",        series:"AYシリーズ H",       model:"AY-N28DH",    tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["plasma","filter"], color:"#444" },
  { id:23, maker:"シャープ",        series:"AYシリーズ H",       model:"AY-N22DH",    tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["plasma","filter"], color:"#444" },
  { id:24, maker:"シャープ",        series:"AYシリーズ",         model:"AY-P22DH",    tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:["plasma"],          color:"#444" },
  // Toshiba
  { id:25, maker:"東芝",            series:"大清快 Gシリーズ",   model:"RAS-G224DRH", tatami:6,  hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["kanki","filter"],  color:"#E60020" },
  { id:26, maker:"東芝",            series:"大清快 Gシリーズ",   model:"RAS-G284DRH", tatami:10, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["kanki","filter"],  color:"#E60020" },
  { id:27, maker:"東芝",            series:"大清快 Gシリーズ",   model:"RAS-G404DRH", tatami:14, hasFilter:true,  isEco:true,  grade:"スタンダード+", features:["kanki","filter"],  color:"#E60020" },
  { id:28, maker:"東芝",            series:"大清快 Eシリーズ",   model:"RAS-E224DRH", tatami:6,  hasFilter:false, isEco:false, grade:"スタンダード",   features:[],                  color:"#E60020" },
];

export const MAKERS = ["Panasonic","ダイキン","三菱電機","日立","富士通","ゼネラル","シャープ","東芝"];
export const MAKER_COLORS = { Panasonic:"#0047AA", "ダイキン":"#00A0E9", "三菱電機":"#E60012", "日立":"#CE0F0F", "富士通":"#FF6B00", "ゼネラル":"#E87B00", "シャープ":"#444", "東芝":"#E60020" };
export const TATAMI_LIST = [6, 8, 10, 12, 14, 18, 20, 23];
export const TATAMI_LABELS = { 6:"6畳", 8:"8畳", 10:"10畳", 12:"12畳", 14:"14畳", 18:"18畳", 20:"20畳", 23:"23畳" };
export const TATAMI_KW = { 6:2.2, 8:2.5, 10:2.8, 12:3.6, 14:4.0, 18:5.6, 20:6.3, 23:7.1 };
export const TATAMI_DISPLAY = [6, 10, 14, 18, 20, 23];
export const GRADE_COLORS = { "ハイグレード":"#FFB800", "スタンダード+":"#64B5F6", "スタンダード":"#81C784" };

// ── メーカー特徴データ ────────────────────────────────────
export const MAKER_GUIDE = {
  "Panasonic": {
    color: "#0047AA", icon: "🔵",
    catch: "空気清浄といえばパナソニック",
    strength: "ナノイーXによる圧倒的な空気清浄・除菌力。アレルギーやペットが気になる家庭に強い。",
    target: "花粉症・アレルギー持ち / ペットがいる家庭 / 空気清浄機を別で持ちたくない人",
    weak: "加湿機能はなし（ダイキンのうるさらXに劣る）",
    durability: "耐久性は業界トップクラス。故障率が低く修理対応も全国で充実。10年以上使えるケースも多い。",
    airClean: "【ナノイーX】OHラジカルを含むナノサイズの水粒子を放出。菌・ウイルス・花粉・カビ菌・臭いを抑制。濃度は従来比48倍で業界最高レベル。空気清浄機いらずと言われるほどの実力。",
    tech: "AIが部屋の環境・使用状況を学習して自動で最適運転。フィルター自動掃除はダストボックスに溜まる方式で手間いらず。",
    consulPoints: [
      { title:"「空気清浄機いらずになりますよ」", desc:"ナノイーXは業界最高レベルの空気清浄・除菌力。別途空気清浄機を買う必要がなくなる可能性がある。" },
      { title:"花粉・アレルギーに一番強い", desc:"OHラジカルが花粉・ウイルス・ペットの毛を抑制。アレルギー持ちのお客様には真っ先に提案。" },
      { title:"耐久性トップクラスで長く使える", desc:"故障率が低く10年以上使えるケースも多い。長期コスパで見るとお得感を出せる。" },
    ],
    series: [
      { name:"Xシリーズ",  point:"最上位。ナノイーX＋自動掃除＋AI。全部入り。" },
      { name:"EXシリーズ", point:"X系の一つ下。自動掃除あり。コスパ良好。" },
      { name:"GXシリーズ", point:"省エネ重視。自動掃除なし。電気代を抑えたい人向け。" },
      { name:"Jシリーズ",  point:"ベーシックモデル。機能は最小限。とにかく安く済ませたい人向け。" },
    ],
    tip: "「ナノイーX」はお客様への説明がしやすい。「空気清浄機が要らなくなる可能性がありますよ」という一言が効果的。",
  },
  "ダイキン": {
    color: "#00A0E9", icon: "💧",
    catch: "乾燥対策・加湿ならダイキン一択",
    strength: "「うるさらX」は業界唯一の外気吸収加湿機能を搭載。給水不要で冬の乾燥をしっかりケア。",
    target: "乾燥が気になる人 / 肌・喉・目の乾燥に悩む人 / 加湿器を別で置きたくない人",
    weak: "うるさらXは価格が高め。ダクト工事が必要な場合も。",
    durability: "業界トップクラスの耐久性。「ダイキンは壊れない」という評判が根強く、長期使用者が多い。修理部品の供給も長期間対応。",
    airClean: "【ストリーマ】高速で電子を放出し、有害物質を酸化分解する独自技術。カビ・花粉・ウイルスを強力に分解。空気清浄機能単体としてはやや控えめだが、うるさらXの加湿との組み合わせで快適な空気環境を実現。",
    tech: "「うるさらX」は室外機から外気の水分を取り込んで加湿。給水タンク不要で加湿器を別途買う必要なし。内部自動洗浄で熱交換器をウイルス・カビから守る。",
    consulPoints: [
      { title:"「加湿器いらずになりますよ」", desc:"うるさらXは外気から水分を集めて加湿。給水タンク不要。冬の乾燥に悩む人への最強提案。" },
      { title:"肌・喉・目の乾燥が気になる人に", desc:"就寝中も自動で加湿してくれるので寝室・子供部屋に最適。" },
      { title:"ダイキンは壊れにくいで有名", desc:"業界最高レベルの耐久性。「長く使いたい」お客様への安心感が違う。" },
    ],
    series: [
      { name:"うるさらX",  point:"最上位。加湿機能搭載。乾燥に悩むお客様への最強提案。" },
      { name:"Eシリーズ",  point:"加湿なし。ベーシックなダイキン。" },
    ],
    tip: "「加湿器代わりになりますよ」は刺さりやすい。特に寝室・子供部屋への設置を考えている人に。",
  },
  "三菱電機": {
    color: "#E60012", icon: "👁️",
    catch: "風が苦手な人・快眠重視ならコレ",
    strength: "「ムーブアイmirAI」が人の位置・体温を検知して風を自動制御。直接風が当たらず体が冷えにくい。",
    target: "エアコンの風が苦手な人 / 寝室に設置する人 / 小さい子供・高齢者がいる家庭",
    weak: "上位機種は価格が高め。",
    durability: "耐久性は高く評価されている。霧ヶ峰ブランドは長年の実績があり、故障が少ないと現場での評判も良い。",
    airClean: "【ムーブアイ＋花粉センサー】花粉や微細なホコリを検知して自動で運転強化。ナノイーXのような独自除菌技術はないが、センサーの精度が高く空気の汚れに素早く反応。",
    tech: "「ムーブアイmirAI」は赤外線センサーで人の位置・姿勢・体温・日射を同時検知。風を当てたくない人には「人がいる方向から風を外す」設定も可能。快眠モードは就寝後に自動で温度調整。",
    consulPoints: [
      { title:"「エアコンの風が苦手」人への切り札", desc:"ムーブアイmirAIが人を感知して風を自動コントロール。直接風が当たらないから体が冷えすぎない。" },
      { title:"寝室に設置するなら三菱電機", desc:"快眠モードで就寝後に自動で温度調整。朝まで快適な睡眠をサポート。" },
      { title:"子供・高齢者がいる家庭に最適", desc:"人の体温・姿勢を検知して自動調整。温度変化に敏感な人がいる家庭に特におすすめ。" },
    ],
    series: [
      { name:"霧ヶ峰Zシリーズ",  point:"最上位。ムーブアイmirAI搭載。快眠サポートも充実。" },
      { name:"霧ヶ峰GEシリーズ", point:"ベーシック。ムーブアイなし。コスパ重視向け。" },
    ],
    tip: "「エアコンの風で体が冷えすぎる」という悩みを持つお客様への切り口として最強。就寝中に温度を自動調整する快眠モードもセットで提案できる。",
  },
  "日立": {
    color: "#CE0F0F", icon: "🧊",
    catch: "内部の清潔さ・カビが気になる人に",
    strength: "業界初の「凍結洗浄」で熱交換器を氷で洗浄。カビ・細菌が繁殖しにくく、嫌な臭いを防ぐ。",
    target: "エアコンの臭いが気になる人 / 清潔さを重視する人 / クリーニング費用を節約したい人",
    weak: "空気清浄・加湿など付加機能は他社に劣る場合も。",
    durability: "耐久性は高水準。ステンレスを内部に使用した「ステンレス・クリーン」仕様で錆びにくく長持ち。修理対応も全国で充実している。",
    airClean: "【ステンレス・クリーン＋凍結洗浄】空気清浄機能というより「内部清潔」に特化。熱交換器を凍らせて氷で汚れを洗い流す業界初の技術。カビ・細菌の繁殖を防いで嫌な臭いを根本から解消。くらしカメラAIで空気の汚れも検知。",
    tech: "「凍結洗浄」は内部を意図的に凍らせ、溶けた水で汚れを洗い流す仕組み。ステンレス素材を使用することで錆びにくく衛生的。AIカメラが生活リズムを学習して自動運転。",
    consulPoints: [
      { title:"「エアコンつけると臭い」人への最強提案", desc:"凍結洗浄で内部のカビ・汚れを氷で一気に洗浄。業界唯一の技術で嫌な臭いを根本から解消。" },
      { title:"年1回のプロ洗浄が不要になる可能性", desc:"凍結洗浄で内部を常に清潔に保つのでクリーニング費用の節約になる点も訴求できる。" },
      { title:"ステンレス素材で長持ち・清潔", desc:"内部にステンレスを使用しているので錆びにくく衛生的。清潔さを重視するお客様に刺さる。" },
    ],
    series: [
      { name:"白くまくん Xシリーズ", point:"最上位。凍結洗浄＋AIフル搭載。" },
      { name:"白くまくん Wシリーズ", point:"凍結洗浄あり。コスパ良好なミドルレンジ。" },
      { name:"白くまくん Eシリーズ", point:"ベーシック。凍結洗浄なし。" },
    ],
    tip: "「エアコンをつけると最初なんか臭い…」という経験があるお客様に凍結洗浄は刺さる。年1回のプロ洗浄が不要になる可能性も訴求できる。",
  },
  "富士通": {
    color: "#FF6B00", icon: "🔥",
    catch: "暖房重視・寒がりな人に",
    strength: "ハイパワー暖房が強み。寒冷地でも暖房能力が落ちにくく、「エアコンは寒い」イメージを覆す。",
    target: "暖房をメインで使いたい人 / 寒がりな人 / ガスヒーターから乗り換えたい人",
    weak: "空気清浄・加湿など他社独自機能は少なめ。",
    durability: "耐久性は平均的。故障率は特別低いわけではないが、修理対応は充実。寒冷地での使用実績が豊富で信頼性は高い。",
    airClean: "【プラズマイオン】独自のイオン技術で浮遊菌やカビ菌を抑制。パナソニックのナノイーXやシャープのプラズマクラスターほど有名ではないが、基本的な除菌・消臭効果はある。",
    tech: "独自のハイパワー圧縮機で外気-25℃でも高い暖房能力を維持。フィルター自動掃除は10年相当掃除不要を謳う機種もあり。",
    consulPoints: [
      { title:"「エアコンの暖房は寒い」を覆せる", desc:"ハイパワー暖房で外気-25℃でも能力が落ちにくい。「ガスヒーターじゃないと温まらない」というお客様への切り返しに使える。" },
      { title:"暖房メインで使いたい人に最適", desc:"冬場の暖房性能に特化したモデル。寒がりなお客様や北向きの部屋に設置するケースに強い。" },
    ],
    series: [
      { name:"ノクリア Zシリーズ", point:"最上位。ハイパワー暖房＋自動掃除。" },
      { name:"ノクリア Cシリーズ", point:"ベーシック。コスパ重視向け。" },
    ],
    tip: "「暖房はガスファンヒーターじゃないと温まらない」というお客様への切り返しに使える。電気代・環境面でのメリットも合わせて提案しやすい。",
  },
  "ゼネラル": {
    color: "#E87B00", icon: "🔥",
    catch: "富士通と同じ性能・お得な価格",
    strength: "富士通ゼネラル製造の別ブランド。暖房性能・省エネ性能は富士通と同等でコスパが高い。",
    target: "富士通と同じ。暖房重視・コスパ重視向け。",
    weak: "認知度が富士通より低め。知らないお客様も多い。",
    durability: "富士通と同じ工場・同じ部品で製造。耐久性・品質は富士通と同等。",
    airClean: "【プラズマイオン】富士通と同じ技術を搭載。基本的な除菌・消臭効果あり。",
    tech: "製造は富士通ゼネラルで富士通と同一。販売チャネルと価格帯が異なるだけで中身は同等。ゼネラルブランドの方が価格が抑えられているケースが多い。",
    consulPoints: [
      { title:"「富士通と同じ性能で少し安い」", desc:"富士通ゼネラルが同じ工場で製造。性能は同等でお得感を出せる。知名度が低いので説明が必要。" },
      { title:"暖房重視かつコスパを求める人に", desc:"富士通のハイパワー暖房と同等性能。価格が抑えめなのでコスパで訴求できる。" },
    ],
    series: [
      { name:"Aシリーズ", point:"ゼネラルの主力。性能は富士通ノクリアZと同等。" },
      { name:"Cシリーズ", point:"ベーシック。コスパ重視向け。" },
    ],
    tip: "「富士通ゼネラルが作っているので性能は同じです」という説明で安心してもらえる。展示場所が富士通と分かれているため混同しないよう注意。",
  },
  "シャープ": {
    color: "#444", icon: "⚡",
    catch: "消臭・ペット臭ならシャープ",
    strength: "「プラズマクラスター25000」で浮遊菌・ウイルス・臭いを抑制。ペットや料理の臭いに強い。",
    target: "ペットがいる家庭 / タバコ臭・料理臭が気になる人 / 小さい子供がいる家庭",
    weak: "加湿・換気など独自機能は他社に劣る部分も。耐久性がやや心配という声も。",
    durability: "耐久性はやや平均以下との声もあり。10年超の長期使用を前提にするなら他社の方が安心という意見も。価格が抑えめなのでコスパ重視なら選択肢。",
    airClean: "【プラズマクラスター25000】プラス・マイナスのイオンを空気中に放出し、浮遊菌・ウイルスを99.9%以上（Sharp発表）抑制。数値が高いほど効果が高く「25000」は最上位グレード。ペット臭・タバコ臭・料理臭の消臭効果も高い。",
    tech: "プラズマクラスターは空気清浄機でも広く採用されている実績ある技術。エアコン内部にも噴射して内部のカビ抑制にも効果あり。",
    consulPoints: [
      { title:"ペット臭・タバコ臭・料理臭に一番強い", desc:"プラズマクラスター25000でウイルス99.9%抑制・消臭効果も高い。ペットがいるお客様に特に刺さる。" },
      { title:"「25000」は最高グレード", desc:"数値が高いほど効果が高い。「25000」はシャープの最上位グレードであることを強調すると納得感が出る。" },
    ],
    series: [
      { name:"AYシリーズ H", point:"プラズマクラスター25000搭載。自動掃除あり。" },
      { name:"AYシリーズ",   point:"プラズマクラスター搭載。自動掃除なし。" },
    ],
    tip: "「プラズマクラスター25000」は数値が高いほど効果が高い点をアピール。ペット・タバコ・料理臭に悩むお客様に特に響く。",
  },
  "東芝": {
    color: "#E60020", icon: "🌀",
    catch: "換気しながら冷暖房できる唯一のメーカー",
    strength: "業界唯一の給気換気機能。窓を開けずに換気できるので、花粉シーズンや冷暖房中でも空気の入れ替えが可能。",
    target: "換気を重視する人 / 花粉が気になる人 / コロナ以降の換気ニーズ",
    weak: "換気以外の独自機能（空気清浄・加湿）は他社に劣る部分も。",
    durability: "耐久性は平均的。特別弱いわけではないが、突出して強いわけでもない。修理対応は問題なし。",
    airClean: "【エアフレッシュ（換気）】空気清浄というより「換気」に特化。外気を取り込んで室内の空気を入れ替える業界唯一の機能。ウイルスや汚染物質を薄める効果があり、コロナ以降特に注目されている。",
    tech: "給気換気機能はダクト工事不要でエアコン本体だけで換気が可能。ムーブアイ極で人の体温・位置を検知して快適な温度制御も実現。",
    consulPoints: [
      { title:"「窓を開けずに換気できる」唯一のメーカー", desc:"エアコンをつけたまま外気を取り込める業界唯一の機能。冷暖房効率を下げずに換気できる。" },
      { title:"花粉・虫が入らずに換気できる", desc:"「窓を開けると花粉が入る」「虫が入る」「冷気が逃げる」というお客様の悩みを一気に解決。" },
      { title:"コロナ以降の換気ニーズに対応", desc:"感染対策として換気を意識するお客様が増えている。リビング・LDKへの設置に特に刺さる。" },
    ],
    series: [
      { name:"大清快 Gシリーズ", point:"換気機能搭載。省エネ・自動掃除あり。" },
      { name:"大清快 Eシリーズ", point:"ベーシック。換気機能なし。" },
    ],
    tip: "「窓を開けると花粉や虫が入る」「開けると冷気が逃げる」という悩みを解決できる唯一のエアコン。特にリビング・LDKへの設置検討者に刺さる。",
  },
};

// ── メーカー比較データ ────────────────────────────────────
export const MAKER_FEATURES = {
  空気清浄: {
    "Panasonic": { mark:"◎", text:"ナノイーX｜菌・ウイルス・花粉を抑制。業界最高レベル" },
    "ダイキン":  { mark:"○", text:"ストリーマ｜有害物質を酸化分解" },
    "三菱電機":  { mark:"△", text:"花粉センサー｜検知して自動強化" },
    "日立":      { mark:"△", text:"くらしカメラ｜空気の汚れを検知" },
    "富士通":    { mark:"△", text:"プラズマイオン｜基本的な除菌・消臭" },
    "ゼネラル":  { mark:"△", text:"プラズマイオン｜基本的な除菌・消臭" },
    "シャープ":  { mark:"○", text:"プラズマクラスター25000｜ウイルス99.9%抑制・消臭" },
    "東芝":      { mark:"—", text:"なし" },
  },
  内部洗浄: {
    "Panasonic": { mark:"○", text:"フィルター自動掃除｜ダストボックスに自動収集" },
    "ダイキン":  { mark:"○", text:"水内部クリーン｜内部を水で自動洗浄" },
    "三菱電機":  { mark:"○", text:"フィルター自動掃除｜自動でホコリを除去" },
    "日立":      { mark:"◎", text:"凍結洗浄｜熱交換器を凍らせて一気に洗浄。業界唯一" },
    "富士通":    { mark:"○", text:"フィルター自動掃除｜10年相当掃除不要の機種も" },
    "ゼネラル":  { mark:"○", text:"フィルター自動掃除｜自動でホコリを除去" },
    "シャープ":  { mark:"○", text:"フィルター自動掃除｜自動でホコリを除去" },
    "東芝":      { mark:"○", text:"フィルター自動掃除｜自動でホコリを除去" },
  },
  加湿: {
    "Panasonic": { mark:"—", text:"なし" },
    "ダイキン":  { mark:"◎", text:"うるさらX｜外気から水分を取り込む業界唯一の加湿機能。給水不要" },
    "三菱電機":  { mark:"—", text:"なし" },
    "日立":      { mark:"—", text:"なし" },
    "富士通":    { mark:"—", text:"なし" },
    "ゼネラル":  { mark:"—", text:"なし" },
    "シャープ":  { mark:"—", text:"なし" },
    "東芝":      { mark:"—", text:"なし" },
  },
  換気: {
    "Panasonic": { mark:"—", text:"なし" },
    "ダイキン":  { mark:"—", text:"なし" },
    "三菱電機":  { mark:"—", text:"なし" },
    "日立":      { mark:"—", text:"なし" },
    "富士通":    { mark:"—", text:"なし" },
    "ゼネラル":  { mark:"—", text:"なし" },
    "シャープ":  { mark:"—", text:"なし" },
    "東芝":      { mark:"◎", text:"エアフレッシュ｜窓を開けずに換気できる業界唯一の機能" },
  },
  センサー: {
    "Panasonic": { mark:"○", text:"AIセンサー｜部屋の環境を学習して自動運転" },
    "ダイキン":  { mark:"○", text:"AIセンサー｜生活リズムを学習" },
    "三菱電機":  { mark:"◎", text:"ムーブアイmirAI｜人の位置・体温・姿勢を検知。風を自動制御" },
    "日立":      { mark:"○", text:"くらしカメラAI｜生活リズムを学習して自動運転" },
    "富士通":    { mark:"△", text:"基本センサー｜温度・湿度検知のみ" },
    "ゼネラル":  { mark:"△", text:"基本センサー｜温度・湿度検知のみ" },
    "シャープ":  { mark:"△", text:"AI快適自動｜基本的な自動運転" },
    "東芝":      { mark:"○", text:"ムーブアイ極｜人の体温・位置を検知" },
  },
  耐久性: {
    "Panasonic": { mark:"◎", text:"業界トップクラス。故障率低く修理対応も充実" },
    "ダイキン":  { mark:"◎", text:"「ダイキンは壊れない」評判。長期使用者が多い" },
    "三菱電機":  { mark:"○", text:"霧ヶ峰ブランドの実績あり。故障少ない" },
    "日立":      { mark:"○", text:"ステンレス素材で錆びにくく長持ち" },
    "富士通":    { mark:"△", text:"平均的。寒冷地での使用実績は豊富" },
    "ゼネラル":  { mark:"△", text:"富士通と同等。平均的な耐久性" },
    "シャープ":  { mark:"△", text:"やや平均以下との声も。価格が抑えめ" },
    "東芝":      { mark:"△", text:"平均的。特別弱いわけではない" },
  },
};
export const FEATURE_ITEMS = ["空気清浄","内部洗浄","加湿","換気","センサー","耐久性"];
export const FEATURE_ICONS = { 空気清浄:"🌬️", 内部洗浄:"🧊", 加湿:"💧", 換気:"🌀", センサー:"👁️", 耐久性:"🛡️" };
export const markColor = (m) => m === "◎" ? "#4CAF50" : m === "○" ? "#64B5F6" : m === "△" ? "#888" : "#444";

// ── 6・10畳 全機種ランキング ──────────────────────────────
export const FULL_RANKING = {
  noFilter: [
    { rank:1, maker:"ダイキン",        model:"AN226AES-W / AN286AES-W",   series:"Eシリーズ",
      summary:"壊れにくさ業界トップ。シンプルで長く使える",
      talks:["「ダイキンは空調専業メーカーで業務用エアコンも作っているので耐久性が抜群です！シンプルなモデルですが長く使えますよ。」"],
      warning: null,
    },
    { rank:2, maker:"Panasonic",      model:"CS-226DJR-W / CS-286DJR-W", series:"エオリア DJR",
      summary:"ナノイー搭載でニオイも取れてコスパ良好",
      talks:["「パナソニックはナノイーでお部屋のニオイも取ってくれます。耐久性も高くて長く使えるコスパの良いモデルです！」"],
      warning: null,
    },
    { rank:3, maker:"日立",            model:"RAS-DR2226S / RAS-DR2826S", series:"白くまくん DR",
      summary:"ステンレス素材で清潔・長持ち",
      talks:["「日立はフラップ部分にステンレスを使っているのでカビが付きにくく、長く清潔に使えますよ！」"],
      warning: null,
    },
    { rank:4, maker:"東芝",            model:"RASV221M / RASV281M",       series:"大清快 Vシリーズ",
      summary:"コンパクトサイズで設置しやすい",
      talks:["「東芝はコンパクトサイズが特徴で、狭い場所への設置に向いています。」"],
      warning: null,
    },
    { rank:5, maker:"アイリスオーヤマ", model:"IRA2206R",                  series:"ベーシックモデル",
      summary:"⚠️ 価格は安いが耐久性に注意",
      talks:[
        "「価格はお手頃ですが、耐熱温度が他社より低く、真夏の室外機が高温になる環境では故障しやすいというデータがあります。」",
        "「5〜6年での買い替えを前提にするならいいですが、長く使いたいなら他のメーカーの方がトータルコストはお得になることが多いですよ。」",
      ],
      warning: "耐熱温度が低く壊れやすい。長期使用には不向き。",
    },
  ],
  hasFilter: [
    { rank:1, maker:"ダイキン",        model:"AN226AFNS-W / AN286AFNS-W", series:"Fシリーズ（ノジマモデル）",
      summary:"耐久性＋自動掃除。ノジマ限定でコスパ良好",
      talks:["「ダイキンの耐久性はそのままに自動掃除も付いたノジマ限定モデルです。コスパが一番いいですよ！」"],
      warning: null,
    },
    { rank:2, maker:"Panasonic",      model:"CS-EX226D-W / CS-EX286D-W", series:"エオリア EX",
      summary:"ナノイーX＋自動掃除。手入れ楽で全部入り",
      talks:["「自動でフィルターを掃除してくれて、さらにナノイーXでお部屋のニオイも取ってくれます。お手入れがほぼゼロになりますよ！」"],
      warning: null,
    },
    { rank:3, maker:"日立",            model:"RAS-WN2225S / RAS-WN2825S", series:"白くまくん WN（ノジマモデル）",
      summary:"凍結洗浄＋自動掃除。臭い対策最強",
      talks:["「凍結洗浄で内部をカチカチに凍らせて一気に洗浄するので、エアコンの嫌な臭いが出にくいんです！自動掃除もついているので手間もかかりません。」"],
      warning: null,
    },
    { rank:4, maker:"日立",            model:"RASXR2226S / RASXR2826S",   series:"白くまくん XR",
      summary:"凍結洗浄＋最上位モデル。機能全部入り",
      talks:["「日立の最上位モデルです。凍結洗浄に加えてAI機能も充実していて、長期間清潔に使えます。」"],
      warning: null,
    },
    { rank:5, maker:"三菱電機",        model:"MSZR2226 / MSZR2826",       series:"霧ヶ峰 Rシリーズ",
      summary:"ムーブアイ搭載。風が苦手な人に",
      talks:["「三菱のムーブアイが人の位置を感知して風を自動調整します。エアコンの風が苦手なお客様に特におすすめです！」"],
      warning: null,
    },
    { rank:6, maker:"シャープ",        model:"AYU22V / AYU28V",           series:"AY Vシリーズ",
      summary:"プラズマクラスター搭載でペット臭に強い",
      talks:["「プラズマクラスターでペット臭やタバコ臭に強いです。自動掃除もついています！」"],
      warning: null,
    },
  ],
  eco: [
    { rank:1, maker:"ダイキン",        model:"AN226ACS-W / AN286ACS-W",   series:"Aシリーズ（超省エネ）",
      summary:"超省エネ＋ダイキンの耐久性",
      talks:["「省エネ性能★★★の超省エネモデルです。ダイキンの耐久性もそのままなので長く電気代を抑えられますよ！」"],
      warning: null,
    },
    { rank:2, maker:"Panasonic",      model:"CSX226D / CSX286D",         series:"エオリア X（超省エネ）",
      summary:"省エネ最強＋ナノイーX全部入り",
      talks:["「パナソニックの最上位モデルで省エネ性能がトップクラスです。ナノイーXで空気清浄もしてくれる全部入りですよ！」"],
      warning: null,
    },
    { rank:3, maker:"日立",            model:"RASXR2226S / RASXR2826S",   series:"白くまくん XR（超省エネ）",
      summary:"超省エネ＋凍結洗浄＋日立最上位",
      talks:["「省エネ★★★の超省エネに加えて凍結洗浄も搭載。日立の最上位モデルです！」"],
      warning: null,
    },
    { rank:4, maker:"三菱電機",        model:"MSZZW2226 / MSZZW2826",     series:"霧ヶ峰 ZWシリーズ（超省エネ）",
      summary:"超省エネ＋ムーブアイ。快眠重視の方に",
      talks:["「省エネ性能が高くてムーブアイも搭載。寝室に設置する方には特におすすめです！」"],
      warning: null,
    },
    { rank:5, maker:"ダイキン",        model:"AN226ARS / AN286ARS",       series:"うるさらX（加湿＋超省エネ）",
      summary:"超省エネ＋加湿機能。乾燥対策も同時に",
      talks:["「省エネ最高レベルでありながら外の空気から水分を集めて加湿もしてくれます。加湿器いらずになるかもしれませんよ！」"],
      warning: null,
    },
  ],
};

// ── Top3データ ────────────────────────────────────────
export const TOP3 = {
  "small": {
    noFilter: [
      { rank:1, maker:"ダイキン",   model:"AN226AES-W / AN286AES-W",   series:"Eシリーズ",
        point:"頑丈で、中を強力除菌するエアコン", summary:"頑丈で、中を強力除菌するエアコン",
        talks:[
          "「『ストリーマ』という独自の強力な電気で、中のカビ菌を芯から焼き切ってくれるので清潔です！」",
          "「外に置く室外機がすごく頑丈なので、真夏の猛暑でも冷房の効きが落ちずにしっかり冷やしてくれますよ。」",
        ]
      },
      { rank:2, maker:"Panasonic", model:"CS-226DJR-W / CS-286DJR-W", series:"エオリア DJR",
        point:"お部屋のニオイも取れるエアコン", summary:"お部屋のニオイも取れるエアコン",
        talks:[
          "「冷房しながら『ナノイー』を出してくれるので、ソファに染み付いた料理やペットのニオイまで脱臭してくれます！」",
          "「冷房のときに出る水滴で中の汚れを浮かせて流すので、エアコンの中もキレイに保てますよ。」",
        ]
      },
      { rank:3, maker:"日立",      model:"RAS-DR2226S / RAS-DR2826S", series:"白くまくん DR",
        point:"中が一番汚れないエアコン", summary:"中が一番汚れないエアコン",
        talks:[
          "「独自の『凍結洗浄』で、中の部品を凍らせて一気に汚れを洗い流すので、カビや菌が発生しづらいんです！」",
          "「風が出るフラップ部分がキッチンのようなステンレスなので、カビやホコリが付きにくいんですよ。」",
        ]
      },
    ],
    hasFilter: [
      { rank:1, maker:"Panasonic", model:"CS-EX226D-W / CS-EX286D-W", series:"エオリア EX",
        point:"手入れ楽でニオイも取れる全部入り", summary:"手入れ楽でニオイも取れる全部入り",
        talks:[
          "「フィルターを自動で掃除してくれるので、掃除の手間がほぼゼロになりますよ！」",
          "「さらに『ナノイーX』でソファやカーテンのニオイまで取ってくれるので、空気清浄機もいらないかもしれません。」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN226AFNS-W / AN286AFNS-W", series:"Fシリーズ（ノジマモデル）",
        point:"壊れにくくてお手入れ楽なノジマモデル", summary:"壊れにくくてお手入れ楽なノジマモデル",
        talks:[
          "「ダイキンはもともと業務用エアコンのメーカーなので、耐久性が業界トップクラスなんですよ。」",
          "「フィルター自動掃除付きで、ノジマ専用モデルなのでコスパも良いです！」",
        ]
      },
      { rank:3, maker:"日立", model:"RAS-WN2225S / RAS-WN2825S", series:"白くまくん WN（ノジマモデル）",
        point:"臭いが気になる人への最強モデル", summary:"臭いが気になる人への最強モデル",
        talks:[
          "「『凍結洗浄』でフィルターを凍らせて一気に汚れを落とすので、エアコンの嫌な臭いが出にくいんです！」",
          "「自動でフィルター掃除もしてくれるので、手間もかかりません。ノジマ専用モデルです。」",
        ]
      },
    ],
    eco: [
      { rank:1, maker:"Panasonic", model:"CS-X226D-W / CS-X286D-W", series:"エオリア X",
        point:"省エネ最強＋空気清浄の全部入り", summary:"省エネ最強＋空気清浄の全部入り",
        talks:[
          "「省エネ性能がトップクラスなので、電気代をかなり抑えられますよ。」",
          "「『ナノイーX』でお部屋の空気もきれいにしてくれるので、まさに全部入りですね！」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN226ARP-W / AN286ARP-W", series:"うるさらX",
        point:"省エネ＋乾燥対策が同時にできる", summary:"省エネ＋乾燥対策が同時にできる",
        talks:[
          "「省エネ性能が高いのに、外の空気から水分を集めて加湿もしてくれるんです！」",
          "「加湿器を別に買う必要がなくなるかもしれませんよ。乾燥が気になる方に特におすすめです。」",
        ]
      },
      { rank:3, maker:"富士通", model:"AS-Z226N / AS-Z286N", series:"ノクリア Z",
        point:"省エネ＋暖房が強い冬も安心モデル", summary:"省エネ＋暖房が強い冬も安心モデル",
        talks:[
          "「省エネ性能が高くて、さらに暖房がとても強いので冬場も安心です！」",
          "「『エアコンの暖房は物足りない』とよく言われますが、富士通はその心配がほとんどないですよ。」",
        ]
      },
    ],
  },
  "large": {
    noFilter: [
      { rank:1, maker:"Panasonic", model:"CS-GX404D-W", series:"エオリア GX",
        point:"広い部屋でも省エネ・シンプルで使いやすい", summary:"広い部屋でも省エネ・シンプルで使いやすい",
        talks:[
          "「省エネ性能が高いので、広いLDKでも電気代を抑えられますよ。」",
          "「余計な機能がないシンプルな設計なので、操作も簡単です！」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN404AES-W", series:"Eシリーズ",
        point:"広い部屋でも壊れにくく安定して使える", summary:"広い部屋でも壊れにくく安定して使える",
        talks:[
          "「ダイキンは耐久性が業界トップクラスなので、広い部屋で長く使いたい方にぴったりです！」",
          "「室外機が頑丈なので、真夏の猛暑でも冷房の効きが落ちません。」",
        ]
      },
      { rank:3, maker:"東芝", model:"RAS-E404DRH", series:"大清快 E",
        point:"コスパ重視でシンプルに使いたい人向け", summary:"コスパ重視でシンプルに使いたい人向け",
        talks:[
          "「必要な機能に絞ったシンプルなモデルなので、価格が抑えめですよ。」",
          "「とにかくコスパ重視で選びたいというお客様にはこちらがおすすめです！」",
        ]
      },
    ],
    hasFilter: [
      { rank:1, maker:"Panasonic", model:"CS-EX404D-W", series:"エオリア EX",
        point:"広いLDKでお手入れ楽＋ニオイ対策", summary:"広いLDKでお手入れ楽＋ニオイ対策",
        talks:[
          "「フィルターを自動で掃除してくれるので、広いLDKでも手間がかかりませんよ！」",
          "「『ナノイーX』でリビングのソファやカーテンのニオイも取ってくれます。」",
        ]
      },
      { rank:2, maker:"日立", model:"RAS-W404M", series:"白くまくん W",
        point:"広い空間も清潔に保つ臭い対策モデル", summary:"広い空間も清潔に保つ臭い対策モデル",
        talks:[
          "「『凍結洗浄』で大きな熱交換器も凍らせて一気に洗浄するので、広いLDKでもカビや臭いが出にくいですよ！」",
          "「自動フィルター掃除もついているので、お手入れもラクです。」",
        ]
      },
      { rank:3, maker:"東芝", model:"RAS-G404DRH", series:"大清快 G",
        point:"換気しながら冷暖房できる唯一のモデル", summary:"換気しながら冷暖房できる唯一のモデル",
        talks:[
          "「窓を開けなくても換気ができるエアコンは、実は東芝だけなんですよ！」",
          "「冷房をつけたまま花粉を入れずに換気できるので、花粉症の方にもすごく人気です。」",
        ]
      },
    ],
    eco: [
      { rank:1, maker:"Panasonic", model:"CS-X404D-W", series:"エオリア X",
        point:"大空間でも省エネ最強の全部入り", summary:"大空間でも省エネ最強の全部入り",
        talks:[
          "「広いLDKでも省エネ性能がトップクラスなので、電気代をかなり抑えられますよ！」",
          "「ナノイーXで空気清浄もしてくれるので、大空間でも空気がきれいに保てます。」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN404ARP-W", series:"うるさらX",
        point:"広いLDKの乾燥対策と省エネを両立", summary:"広いLDKの乾燥対策と省エネを両立",
        talks:[
          "「広いリビングでも加湿しながら冷暖房できるのはダイキンだけです！」",
          "「省エネ性能も高いので、大きな部屋でも電気代の心配が少ないですよ。」",
        ]
      },
      { rank:3, maker:"三菱電機", model:"MSZ-ZW404S", series:"霧ヶ峰Z",
        point:"広い空間でも省エネ＋快眠サポート", summary:"広い空間でも省エネ＋快眠サポート",
        talks:[
          "「省エネ性能が高くて、センサーが人の位置を感知して直接風が当たらないように調整してくれます！」",
          "「寝室が広い方や、リビングで寝転がることが多い方にも特におすすめです。」",
        ]
      },
    ],
  },
};
