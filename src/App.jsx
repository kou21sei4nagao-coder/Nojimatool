import { useState } from "react";

const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; overflow: hidden; }
  html { margin: 0; padding: 0; }
  #root { width: 100% !important; max-width: 100% !important; margin: 0 !important; border: none !important; text-align: left !important; }
`;

// ── 機能データベース ─────────────────────────────────────
const FEATURES_DB = {
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
    youtubeId: "jTRFSHxrH9I", color: "#4CAF50",
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
// hasFilter: 自動フィルター掃除, isEco: 省エネモデル
const AC_MODELS = [
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

const MAKERS = ["Panasonic","ダイキン","三菱電機","日立","富士通","ゼネラル","シャープ","東芝"];
const MAKER_COLORS = { Panasonic:"#0047AA", "ダイキン":"#00A0E9", "三菱電機":"#E60012", "日立":"#CE0F0F", "富士通":"#FF6B00", "ゼネラル":"#E87B00", "シャープ":"#444", "東芝":"#E60020" };
const TATAMI_LIST = [6, 8, 10, 12, 14, 18, 20, 23];
const TATAMI_LABELS = { 6:"6畳", 8:"8畳", 10:"10畳", 12:"12畳", 14:"14畳", 18:"18畳", 20:"20畳", 23:"23畳" };
const TATAMI_KW = { 6:2.2, 8:2.5, 10:2.8, 12:3.6, 14:4.0, 18:5.6, 20:6.3, 23:7.1 };
const TATAMI_DISPLAY = [6, 10, 14, 18, 20, 23];
const GRADE_COLORS = { "ハイグレード":"#FFB800", "スタンダード+":"#64B5F6", "スタンダード":"#81C784" };

// ── メーカー特徴データ ────────────────────────────────────
const MAKER_GUIDE = {
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
const MAKER_FEATURES = {
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
const FEATURE_ITEMS = ["空気清浄","内部洗浄","加湿","換気","センサー","耐久性"];
const FEATURE_ICONS = { 空気清浄:"🌬️", 内部洗浄:"🧊", 加湿:"💧", 換気:"🌀", センサー:"👁️", 耐久性:"🛡️" };
const markColor = (m) => m === "◎" ? "#4CAF50" : m === "○" ? "#64B5F6" : m === "△" ? "#888" : "#444";

// ── サブコンポーネント ────────────────────────────────────
function Chip({ active, color="#1E90FF", onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? `${color}28` : "rgba(255,255,255,0.05)",
      border: `2px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
      borderRadius: 12, padding: "11px 16px", cursor: "pointer",
      color: active ? "#E8EDF5" : "#6080A0", fontWeight: active ? 700 : 400,
      fontSize: 14, transition: "all 0.18s", textAlign:"left",
    }}>{children}</button>
  );
}

function FilterStep({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, color: "#4A6080", fontWeight: 700, letterSpacing: 2, textTransform:"uppercase", marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}

function FeatureCard({ featureKey, isStaffMode, highlight }) {
  const f = FEATURES_DB[featureKey];
  const [open, setOpen] = useState(false);
  if (!f) return null;
  return (
    <div style={{
      background: highlight ? `${f.color}18` : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? f.color+"55" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 16, padding: "18px 20px",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <span style={{ fontSize:26 }}>{f.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700 }}>{f.name}
            <span style={{ fontSize:11, color:"#5070A0", fontWeight:400, marginLeft:8 }}>{f.maker}</span>
          </div>
          <div style={{ fontSize:12, color:"#5A7A9A" }}>{f.tagline}</div>
        </div>
        {highlight && <span style={{ fontSize:11, color:f.color, background:f.color+"20", padding:"2px 8px", borderRadius:6, border:`1px solid ${f.color}40` }}>搭載機能</span>}
      </div>

      <div style={{ fontSize:13, color:"#9AB8D0", lineHeight:1.75, marginBottom:10 }}>{f.customer}</div>

      {isStaffMode && (
        <div style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
          <div style={{ fontSize:11, color:"#FFB800", fontWeight:700, marginBottom:4 }}>📋 スタッフメモ</div>
          <div style={{ fontSize:12, color:"#C09840", lineHeight:1.75 }}>{f.staff}</div>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)} style={{
        background: open ? "rgba(255,60,60,0.15)" : "rgba(255,60,60,0.08)",
        border:"1px solid rgba(255,80,80,0.3)", borderRadius:10,
        padding:"7px 14px", color:"#FF7070", fontSize:12, cursor:"pointer",
        display:"flex", alignItems:"center", gap:6,
      }}>▶ {open ? "動画を閉じる" : "公式動画を見る（YouTube）"}</button>

      {open && (
        <div style={{ marginTop:12, borderRadius:12, overflow:"hidden", aspectRatio:"16/9" }}>
          <iframe width="100%" height="100%"
            src={`https://www.youtube.com/embed/${f.youtubeId}?rel=0`}
            title={f.name} frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen style={{ display:"block" }} />
        </div>
      )}
    </div>
  );
}

// ── メイン ───────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("filter"); // filter | guide | makers
  const [isStaff, setIsStaff] = useState(false);

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

  const resetFilter = () => { setMaker(null); setTatami(null); setFilterOpt(null); setEcoOpt(null); setSelectedModel(null); };

  // 絞り込み結果
  const results = AC_MODELS.filter(m => {
    if (maker !== null && m.maker !== maker) return false;
    if (tatami !== null && m.tatami !== tatami) return false;
    if (filterOpt !== null && m.hasFilter !== filterOpt) return false;
    if (ecoOpt !== null && m.isEco !== ecoOpt) return false;
    return true;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const accentColor = maker ? MAKER_COLORS[maker] : "#1E90FF";

  return (
    <div style={{ height:"100vh", background:"#080E1C", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", color:"#E8EDF5", display:"flex", flexDirection:"column", overflow:"hidden", width:"100vw" }}>
      <style>{globalStyle}</style>

      {/* ヘッダー */}
      <div style={{
        background:"linear-gradient(135deg,#0C1830,#162040)",
        borderBottom:"1px solid rgba(100,160,255,0.12)",
        padding:"10px 22px", display:"flex", alignItems:"center", justifyContent:"space-between",
        flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#7090A8", fontSize:16,
          }}>{sidebarOpen ? "◀" : "▶"}</button>
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#1E90FF,#00D4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>❄️</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>エアコン コンサルツール</div>
            <div style={{ fontSize:9, color:"#4A6080", letterSpacing:1 }}>NOJIMA · AC GUIDE</div>
          </div>
        </div>
        <button onClick={() => setIsStaff(v => !v)} style={{
          background: isStaff ? "rgba(255,184,0,0.18)" : "rgba(255,255,255,0.06)",
          border:`1px solid ${isStaff ? "rgba(255,184,0,0.45)" : "rgba(255,255,255,0.1)"}`,
          borderRadius:10, padding:"6px 14px", cursor:"pointer",
          color: isStaff ? "#FFB800" : "#6080A0", fontSize:12, fontWeight:700,
        }}>{isStaff ? "🔓 スタッフモード" : "🔒 スタッフモード"}</button>
      </div>

      {/* メインレイアウト：左サイドバー ＋ 右コンテンツ */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* 左サイドバー：タブ＋絞り込み */}
        {sidebarOpen && (
        <div style={{
          width:260, flexShrink:0, background:"#0A1020",
          borderRight:"1px solid rgba(255,255,255,0.07)",
          display:"flex", flexDirection:"column", overflow:"hidden",
        }}>
          {/* タブ */}
          <div style={{ display:"flex", flexDirection:"column", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            {[["filter","🔍 絞り込む"],["makers","🏷️ メーカー特徴"],["guide","📚 機能ガイド"]].map(([key,label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding:"12px 18px", background:"none", textAlign:"left",
                border:"none", borderLeft:`3px solid ${tab===key ? accentColor : "transparent"}`,
                color: tab===key ? "#E8EDF5" : "#4A6080", fontSize:13, fontWeight: tab===key ? 700 : 400,
                cursor:"pointer", transition:"all 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {/* 絞り込みパネル（filterタブ時のみ） */}
          {tab === "filter" && !selectedModel && (
            <div style={{ flex:1, overflowY:"auto", padding:"16px 14px" }}>

              {/* メーカー */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, color:"#4A6080", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 1 ｜ メーカー</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {MAKERS.map(m => (
                    <Chip key={m} active={maker===m} color={MAKER_COLORS[m]} onClick={() => { setMaker(maker===m ? null : m); setTatami(null); setFilterOpt(null); setEcoOpt(null); }}>
                      <div style={{ fontSize:11, fontWeight:700 }}>{m}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {/* 畳数 */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, color:"#4A6080", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 2 ｜ 畳数 / kW</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {TATAMI_LIST.map(t => {
                    const isDisplay = TATAMI_DISPLAY.includes(t);
                    return (
                      <Chip key={t} active={tatami===t} color={accentColor} onClick={() => setTatami(tatami===t ? null : t)}>
                        <div style={{ fontSize:12, fontWeight:700 }}>{TATAMI_LABELS[t]}</div>
                        <div style={{ fontSize:11, color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[t]}kW</div>
                        <div style={{ fontSize:9, marginTop:1, color: isDisplay ? "#4CAF50" : "#4A6080" }}>{isDisplay ? "🟢 展示あり" : "販売のみ"}</div>
                      </Chip>
                    );
                  })}
                </div>
              </div>

              {/* フィルター */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, color:"#4A6080", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 3 ｜ 自動フィルター掃除</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[[null,"指定なし","—"],[true,"あり ✨","手入れ不要"],[false,"なし","シンプル"]].map(([val,label,sub]) => (
                    <Chip key={String(val)} active={filterOpt===val} color={accentColor} onClick={() => setFilterOpt(val)}>
                      <div style={{ fontSize:12, fontWeight:700 }}>{label}</div>
                      <div style={{ fontSize:10, color:"#4A6080" }}>{sub}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {/* 省エネ */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, color:"#4A6080", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 4 ｜ 省エネモデル</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[[null,"指定なし","—"],[true,"省エネ ⚡","電気代重視"],[false,"スタンダード","コスパ重視"]].map(([val,label,sub]) => (
                    <Chip key={String(val)} active={ecoOpt===val} color={accentColor} onClick={() => setEcoOpt(val)}>
                      <div style={{ fontSize:12, fontWeight:700 }}>{label}</div>
                      <div style={{ fontSize:10, color:"#4A6080" }}>{sub}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {(maker || tatami || filterOpt !== null || ecoOpt !== null) && (
                <button onClick={resetFilter} style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:"8px", color:"#5070A0", fontSize:11, cursor:"pointer", width:"100%",
                }}>✕ リセット</button>
              )}
            </div>
          )}
        </div>
        )} {/* sidebarOpen終わり */}

        {/* 右コンテンツエリア */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>


        {/* ══ 絞り込み結果 ══ */}
        {tab === "filter" && !selectedModel && (
          <div>
            <div style={{ fontSize:13, color:"#4A6080", marginBottom:14 }}>
              絞り込み結果　<span style={{ fontSize:22, fontWeight:700, color:"#E8EDF5" }}>{results.length}</span> 件
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign:"center", padding:"48px 0", color:"#3A5070" }}>条件に合う機種が見つかりませんでした</div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {results.map(m => (
                  <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                    background:`${m.color}10`, border:`1px solid ${m.color}35`,
                    borderRadius:16, padding:"14px 18px", cursor:"pointer", color:"#E8EDF5",
                    textAlign:"left", transition:"all 0.18s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = m.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = m.color+"35"}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:5, background:GRADE_COLORS[m.grade]+"22", color:GRADE_COLORS[m.grade], border:`1px solid ${GRADE_COLORS[m.grade]}40` }}>{m.grade}</span>
                      <span style={{ fontSize:11, color:"#5070A0" }}>{m.maker}</span>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700 }}>{m.series}</div>
                    <div style={{ fontSize:12, color:"#5070A0", marginBottom:8 }}>
                      {m.model}　{m.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[m.tatami]}kW</span>
                    </div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {m.hasFilter && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター</span>}
                      {m.isEco    && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 省エネ</span>}
                      {m.features.filter(k => k !== "filter").map(k => {
                        const f = FEATURES_DB[k];
                        return f ? <span key={k} style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}35` }}>{f.icon} {f.name}</span> : null;
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ 機種詳細 ══ */}
        {tab === "filter" && selectedModel && (
          <div>
            <button onClick={() => setSelectedModel(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:13, marginBottom:20 }}>← 一覧に戻る</button>
            <div style={{ background:`${selectedModel.color}15`, border:`1px solid ${selectedModel.color}45`, borderRadius:20, padding:"22px 24px", marginBottom:24 }}>
              <div style={{ fontSize:12, color:"#5070A0", marginBottom:2 }}>{selectedModel.maker}</div>
              <div style={{ fontSize:24, fontWeight:700 }}>{selectedModel.series}</div>
              <div style={{ fontSize:14, color:"#5070A0", marginBottom:10 }}>
                {selectedModel.model}　{selectedModel.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:700 }}>{TATAMI_KW[selectedModel.tatami]}kW</span>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, padding:"4px 12px", borderRadius:6, background:GRADE_COLORS[selectedModel.grade]+"22", color:GRADE_COLORS[selectedModel.grade], border:`1px solid ${GRADE_COLORS[selectedModel.grade]}40` }}>{selectedModel.grade}</span>
                {selectedModel.hasFilter && <span style={{ fontSize:12, padding:"4px 12px", borderRadius:6, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター掃除</span>}
                {selectedModel.isEco    && <span style={{ fontSize:12, padding:"4px 12px", borderRadius:6, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 省エネモデル</span>}
              </div>
            </div>
            {selectedModel.features.length > 0 ? (
              <>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>搭載機能</div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {selectedModel.features.map(k => <FeatureCard key={k} featureKey={k} isStaffMode={isStaff} highlight />)}
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
            <div style={{ fontSize:12, fontWeight:700, color:"#7090A8", letterSpacing:2, marginBottom:16 }}>◼ メーカー別コンサルポイント</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {MAKERS.map(m => {
                const g = MAKER_GUIDE[m];
                return (
                  <div key={m} style={{ background:`${g.color}10`, border:`1px solid ${g.color}40`, borderRadius:18, padding:"18px 20px" }}>
                    {/* ヘッダー */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:g.color }}>{m}</div>
                        <div style={{ fontSize:11, color:"#5070A0", marginTop:2 }}>「{g.catch}」</div>
                      </div>
                      <button onClick={() => setSelectedMaker(m)} style={{
                        background:`${g.color}20`, border:`1px solid ${g.color}50`,
                        borderRadius:8, padding:"4px 12px", cursor:"pointer", color:g.color, fontSize:11, fontWeight:700,
                      }}>詳細</button>
                    </div>

                    {/* コンサルポイント */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {g.consulPoints.map((point, i) => (
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                          <span style={{ color:g.color, fontSize:14, marginTop:1, flexShrink:0 }}>▶</span>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:"#E8EDF5" }}>{point.title}</div>
                            <div style={{ fontSize:12, color:"#6080A0", lineHeight:1.6, marginTop:2 }}>{point.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 刺さるお客様 */}
                    <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${g.color}25` }}>
                      <div style={{ fontSize:10, color:"#4A6080", fontWeight:700, letterSpacing:1, marginBottom:6 }}>🎯 こんなお客様に</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {g.target.split(" / ").map((t, i) => (
                          <span key={i} style={{ fontSize:11, padding:"3px 10px", borderRadius:10, background:`${g.color}18`, color:g.color, border:`1px solid ${g.color}35` }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* こんなお客様には */}
            <div style={{ fontSize:12, fontWeight:700, color:"#7090A8", letterSpacing:2, margin:"24px 0 12px" }}>◼ お悩み別おすすめメーカー</div>
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
                    <div style={{ fontSize:12, color:"#A0B8D0" }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color }}>{maker}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

            {/* ② こんなお客様には */}
            <div style={{ fontSize:12, fontWeight:700, color:"#7090A8", letterSpacing:2, marginBottom:12 }}>◼ こんなお客様には…</div>
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
                    <div style={{ fontSize:12, color:"#A0B8D0" }}>{label}</div>
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
              <button onClick={() => setSelectedMaker(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:13, marginBottom:16 }}>← 一覧に戻る</button>

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
                      <div style={{ fontSize:11, color:"#5070A0", margin:"4px 0" }}>{item}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:markColor(f.mark), marginBottom:4 }}>{f.mark}</div>
                      {f.mark !== "—" && <div style={{ fontSize:11, color:"#5070A0", lineHeight:1.5 }}>{f.text}</div>}
                    </div>
                  );
                })}
              </div>

              {/* 3カラム */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
                <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${g.color}40`, borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:g.color, fontWeight:700, letterSpacing:1, marginBottom:10 }}>💪 強み</div>
                  <div style={{ fontSize:13, color:"#A0C0D8", lineHeight:1.8 }}>{g.strength}</div>
                </div>
                <div style={{ background:"rgba(30,144,255,0.06)", border:"1px solid rgba(30,144,255,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:"#64B5F6", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🎯 刺さるお客様</div>
                  {g.target.split(" / ").map((t, i) => (
                    <div key={i} style={{ fontSize:13, color:"#7AAAC8", lineHeight:1.8, display:"flex", gap:6 }}>
                      <span style={{ color:"#1E90FF" }}>▶</span>{t}
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,80,80,0.05)", border:"1px solid rgba(255,80,80,0.2)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:"#FF8080", fontWeight:700, letterSpacing:1, marginBottom:10 }}>⚠️ 弱み・注意点</div>
                  <div style={{ fontSize:13, color:"#A07070", lineHeight:1.8 }}>{g.weak}</div>
                </div>
              </div>

              {/* 耐久性・独自技術・空気清浄 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
                <div style={{ background:"rgba(255,184,0,0.06)", border:"1px solid rgba(255,184,0,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:"#FFB800", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🛡️ 壊れにくさ・耐久性</div>
                  <div style={{ fontSize:13, color:"#C0A060", lineHeight:1.8 }}>{g.durability}</div>
                </div>
                <div style={{ background:"rgba(0,200,100,0.06)", border:"1px solid rgba(0,200,100,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:"#4CAF90", fontWeight:700, letterSpacing:1, marginBottom:10 }}>🌬️ 空気清浄機能</div>
                  <div style={{ fontSize:13, color:"#70A890", lineHeight:1.8 }}>{g.airClean}</div>
                </div>
                <div style={{ background:"rgba(150,100,255,0.06)", border:"1px solid rgba(150,100,255,0.25)", borderRadius:16, padding:"16px" }}>
                  <div style={{ fontSize:12, color:"#A080FF", fontWeight:700, letterSpacing:1, marginBottom:10 }}>⚙️ 独自技術</div>
                  <div style={{ fontSize:13, color:"#9080C0", lineHeight:1.8 }}>{g.tech}</div>
                </div>
              </div>

              {/* シリーズ早見表 */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:"#4A6080", fontWeight:700, letterSpacing:2, marginBottom:10 }}>📋 シリーズ早見表</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {g.series.map(s => (
                    <div key={s.name} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${g.color}30`, borderRadius:12, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:g.color, minWidth:120 }}>{s.name}</div>
                      <div style={{ fontSize:12, color:"#7090A8", lineHeight:1.6 }}>{s.point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 接客Tips */}
              {isStaff && (
                <div style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.3)", borderRadius:16, padding:"16px 20px" }}>
                  <div style={{ fontSize:12, color:"#FFB800", fontWeight:700, letterSpacing:1, marginBottom:8 }}>📋 接客Tips</div>
                  <div style={{ fontSize:13, color:"#C09840", lineHeight:1.8 }}>{g.tip}</div>
                </div>
              )}
            </div>
          );
        })()}


        {tab === "guide" && !selectedFeature && (
          <div>
            <div style={{ fontSize:13, color:"#4A6080", marginBottom:20 }}>各メーカーの独自機能を確認できます。動画で説明してお客様にわかりやすく伝えましょう。</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {Object.entries(FEATURES_DB).map(([key, f]) => (
                <button key={key} onClick={() => setSelectedFeature(key)} style={{
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:16, padding:"14px 18px", cursor:"pointer", color:"#E8EDF5",
                  textAlign:"left", display:"flex", alignItems:"center", gap:14, transition:"all 0.18s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                >
                  <span style={{ fontSize:26 }}>{f.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700 }}>{f.name}</div>
                    <div style={{ fontSize:12, color:"#4A6080" }}>{f.maker}　·　{f.tagline}</div>
                  </div>
                  <span style={{ color:"#3A5070", fontSize:14 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "guide" && selectedFeature && (
          <div>
            <button onClick={() => setSelectedFeature(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:13, marginBottom:20 }}>← 機能一覧に戻る</button>
            <FeatureCard featureKey={selectedFeature} isStaffMode={isStaff} highlight={false} />
          </div>
        )}
        </div> {/* 右コンテンツエリア終わり */}
      </div> {/* メインレイアウト終わり */}
    </div>
  );
}
