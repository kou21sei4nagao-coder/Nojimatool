import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; overflow: hidden; background: #F5F7FA; font-size: 16px; }
  html { margin: 0; padding: 0; }
  #root { width: 100% !important; max-width: 100% !important; margin: 0 !important; border: none !important; text-align: left !important; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #F0F2F5; }
  ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 3px; }
  /* 全体フォントサイズ底上げ */
  button, div, span, a, p { -webkit-font-smoothing: antialiased; }
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

// ── 6・10畳 全機種ランキング ──────────────────────────────
const FULL_RANKING = {
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

// ── Top3データ（仮）────────────────────────────────────────
const TOP3 = {
  "small": { // 6・10畳
    noFilter: [
      { rank:1, maker:"ダイキン",   model:"AN226AES-W / AN286AES-W",   series:"Eシリーズ",
        point:"頑丈で、中を強力除菌するエアコン",
        summary:"頑丈で、中を強力除菌するエアコン",
        talks:[
          "「『ストリーマ』という独自の強力な電気で、中のカビ菌を芯から焼き切ってくれるので清潔です！」",
          "「外に置く室外機がすごく頑丈なので、真夏の猛暑でも冷房の効きが落ちずにしっかり冷やしてくれますよ。」",
        ]
      },
      { rank:2, maker:"Panasonic", model:"CS-226DJR-W / CS-286DJR-W", series:"エオリア DJR",
        point:"お部屋のニオイも取れるエアコン",
        summary:"お部屋のニオイも取れるエアコン",
        talks:[
          "「冷房しながら『ナノイー』を出してくれるので、ソファに染み付いた料理やペットのニオイまで脱臭してくれます！」",
          "「冷房のときに出る水滴で中の汚れを浮かせて流すので、エアコンの中もキレイに保てますよ。」",
        ]
      },
      { rank:3, maker:"日立",      model:"RAS-DR2226S / RAS-DR2826S", series:"白くまくん DR",
        point:"中が一番汚れないエアコン",
        summary:"中が一番汚れないエアコン",
        talks:[
          "「独自の『凍結洗浄』で、中の部品を凍らせて一気に汚れを洗い流すので、カビや菌が発生しづらいんです！」",
          "「風が出るフラップ部分がキッチンのようなステンレスなので、カビやホコリが付きにくいんですよ。」",
        ]
      },
    ],
    hasFilter: [
      { rank:1, maker:"Panasonic", model:"CS-EX226D-W / CS-EX286D-W", series:"エオリア EX",
        point:"手入れ楽でニオイも取れる全部入り",
        summary:"手入れ楽でニオイも取れる全部入り",
        talks:[
          "「フィルターを自動で掃除してくれるので、掃除の手間がほぼゼロになりますよ！」",
          "「さらに『ナノイーX』でソファやカーテンのニオイまで取ってくれるので、空気清浄機もいらないかもしれません。」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN226AFNS-W / AN286AFNS-W", series:"Fシリーズ（ノジマモデル）",
        point:"壊れにくくてお手入れ楽なノジマモデル",
        summary:"壊れにくくてお手入れ楽なノジマモデル",
        talks:[
          "「ダイキンはもともと業務用エアコンのメーカーなので、耐久性が業界トップクラスなんですよ。」",
          "「フィルター自動掃除付きで、ノジマ専用モデルなのでコスパも良いです！」",
        ]
      },
      { rank:3, maker:"日立", model:"RAS-WN2225S / RAS-WN2825S", series:"白くまくん WN（ノジマモデル）",
        point:"臭いが気になる人への最強モデル",
        summary:"臭いが気になる人への最強モデル",
        talks:[
          "「『凍結洗浄』でフィルターを凍らせて一気に汚れを落とすので、エアコンの嫌な臭いが出にくいんです！」",
          "「自動でフィルター掃除もしてくれるので、手間もかかりません。ノジマ専用モデルです。」",
        ]
      },
    ],
    eco: [
      { rank:1, maker:"Panasonic", model:"CS-X226D-W / CS-X286D-W", series:"エオリア X",
        point:"省エネ最強＋空気清浄の全部入り",
        summary:"省エネ最強＋空気清浄の全部入り",
        talks:[
          "「省エネ性能がトップクラスなので、電気代をかなり抑えられますよ。」",
          "「『ナノイーX』でお部屋の空気もきれいにしてくれるので、まさに全部入りですね！」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN226ARP-W / AN286ARP-W", series:"うるさらX",
        point:"省エネ＋乾燥対策が同時にできる",
        summary:"省エネ＋乾燥対策が同時にできる",
        talks:[
          "「省エネ性能が高いのに、外の空気から水分を集めて加湿もしてくれるんです！」",
          "「加湿器を別に買う必要がなくなるかもしれませんよ。乾燥が気になる方に特におすすめです。」",
        ]
      },
      { rank:3, maker:"富士通", model:"AS-Z226N / AS-Z286N", series:"ノクリア Z",
        point:"省エネ＋暖房が強い冬も安心モデル",
        summary:"省エネ＋暖房が強い冬も安心モデル",
        talks:[
          "「省エネ性能が高くて、さらに暖房がとても強いので冬場も安心です！」",
          "「『エアコンの暖房は物足りない』とよく言われますが、富士通はその心配がほとんどないですよ。」",
        ]
      },
    ],
  },
  "large": { // 14・18畳
    noFilter: [
      { rank:1, maker:"Panasonic", model:"CS-GX404D-W", series:"エオリア GX",
        point:"広い部屋でも省エネ・シンプルで使いやすい",
        summary:"広い部屋でも省エネ・シンプルで使いやすい",
        talks:[
          "「省エネ性能が高いので、広いLDKでも電気代を抑えられますよ。」",
          "「余計な機能がないシンプルな設計なので、操作も簡単です！」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN404AES-W", series:"Eシリーズ",
        point:"広い部屋でも壊れにくく安定して使える",
        summary:"広い部屋でも壊れにくく安定して使える",
        talks:[
          "「ダイキンは耐久性が業界トップクラスなので、広い部屋で長く使いたい方にぴったりです！」",
          "「室外機が頑丈なので、真夏の猛暑でも冷房の効きが落ちません。」",
        ]
      },
      { rank:3, maker:"東芝", model:"RAS-E404DRH", series:"大清快 E",
        point:"コスパ重視でシンプルに使いたい人向け",
        summary:"コスパ重視でシンプルに使いたい人向け",
        talks:[
          "「必要な機能に絞ったシンプルなモデルなので、価格が抑えめですよ。」",
          "「とにかくコスパ重視で選びたいというお客様にはこちらがおすすめです！」",
        ]
      },
    ],
    hasFilter: [
      { rank:1, maker:"Panasonic", model:"CS-EX404D-W", series:"エオリア EX",
        point:"広いLDKでお手入れ楽＋ニオイ対策",
        summary:"広いLDKでお手入れ楽＋ニオイ対策",
        talks:[
          "「フィルターを自動で掃除してくれるので、広いLDKでも手間がかかりませんよ！」",
          "「『ナノイーX』でリビングのソファやカーテンのニオイも取ってくれます。」",
        ]
      },
      { rank:2, maker:"日立", model:"RAS-W404M", series:"白くまくん W",
        point:"広い空間も清潔に保つ臭い対策モデル",
        summary:"広い空間も清潔に保つ臭い対策モデル",
        talks:[
          "「『凍結洗浄』で大きな熱交換器も凍らせて一気に洗浄するので、広いLDKでもカビや臭いが出にくいですよ！」",
          "「自動フィルター掃除もついているので、お手入れもラクです。」",
        ]
      },
      { rank:3, maker:"東芝", model:"RAS-G404DRH", series:"大清快 G",
        point:"換気しながら冷暖房できる唯一のモデル",
        summary:"換気しながら冷暖房できる唯一のモデル",
        talks:[
          "「窓を開けなくても換気ができるエアコンは、実は東芝だけなんですよ！」",
          "「冷房をつけたまま花粉を入れずに換気できるので、花粉症の方にもすごく人気です。」",
        ]
      },
    ],
    eco: [
      { rank:1, maker:"Panasonic", model:"CS-X404D-W", series:"エオリア X",
        point:"大空間でも省エネ最強の全部入り",
        summary:"大空間でも省エネ最強の全部入り",
        talks:[
          "「広いLDKでも省エネ性能がトップクラスなので、電気代をかなり抑えられますよ！」",
          "「ナノイーXで空気清浄もしてくれるので、大空間でも空気がきれいに保てます。」",
        ]
      },
      { rank:2, maker:"ダイキン", model:"AN404ARP-W", series:"うるさらX",
        point:"広いLDKの乾燥対策と省エネを両立",
        summary:"広いLDKの乾燥対策と省エネを両立",
        talks:[
          "「広いリビングでも加湿しながら冷暖房できるのはダイキンだけです！」",
          "「省エネ性能も高いので、大きな部屋でも電気代の心配が少ないですよ。」",
        ]
      },
      { rank:3, maker:"三菱電機", model:"MSZ-ZW404S", series:"霧ヶ峰Z",
        point:"広い空間でも省エネ＋快眠サポート",
        summary:"広い空間でも省エネ＋快眠サポート",
        talks:[
          "「省エネ性能が高くて、センサーが人の位置を感知して直接風が当たらないように調整してくれます！」",
          "「寝室が広い方や、リビングで寝転がることが多い方にも特におすすめです。」",
        ]
      },
    ],
  },
};

// ── 空気浄化技術比較コンポーネント ──────────────────────────
function AirPurifyCompare() {
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
            {/* ランクバッジ */}
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
// ── Top3展開コンポーネント ──────────────────────────────────
function Top3Card({ item, color }) {
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

function Chip({ active, color="#1E90FF", onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? `${color}15` : "#F7FAFC",
      border: `2px solid ${active ? color : "#E2E8F0"}`,
      borderRadius: 12, padding: "11px 16px", cursor: "pointer",
      color: active ? "#1A202C" : "#718096", fontWeight: active ? 700 : 400,
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

// ── メイン ───────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("filter"); // filter | guide | makers | kouji | map

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
  const [top3View, setTop3View] = useState(null); // { group, key } or null

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
    <div style={{ height:"100vh", background:"#F5F7FA", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", color:"#1A202C", display:"flex", flexDirection:"column", overflow:"hidden", width:"100vw" }}>
      <style>{globalStyle}</style>

      {/* ヘッダー */}
      <div style={{
        background:"#FFFFFF",
        borderBottom:"1px solid #E2E8F0",
        padding:"10px 22px", display:"flex", alignItems:"center", justifyContent:"space-between",
        flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            background:"#F7FAFC", border:"1px solid #E2E8F0",
            borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#4A5568", fontSize:16,
          }}>{sidebarOpen ? "◀" : "▶"}</button>
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#1E90FF,#00D4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>❄️</div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>エアコン コンサルツール</div>
              <span style={{ fontSize:14, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"linear-gradient(135deg, #667eea, #764ba2)", color:"#fff", letterSpacing:1 }}>α ver.</span>
            </div>
            <div style={{ fontSize:9, color:"#718096", letterSpacing:1 }}>nagao · AC GUIDE</div>
          </div>
        </div>
      </div>

      {/* メインレイアウト：左サイドバー ＋ 右コンテンツ */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* 左サイドバー：タブ＋絞り込み */}
        {sidebarOpen && (
        <div style={{
          width:260, flexShrink:0, background:"#FFFFFF",
          borderRight:"1px solid #E2E8F0",
          display:"flex", flexDirection:"column", overflow:"hidden",
        }}>
          {/* タブ */}
          <div style={{ display:"flex", flexDirection:"column", borderBottom:"1px solid #E2E8F0" }}>
            {[["filter","🔍 絞り込む"],["makers","🏷️ メーカー特徴"],["guide","📚 機能ガイド"],["kouji","🔧 工事内容"],["map","🗺️ 全体マップ"]].map(([key,label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding:"12px 18px", background: tab===key ? "#EBF8FF" : "none", textAlign:"left",
                border:"none", borderLeft:`3px solid ${tab===key ? accentColor : "transparent"}`,
                color: tab===key ? "#1A202C" : "#718096", fontSize:15, fontWeight: tab===key ? 700 : 400,
                cursor:"pointer", transition:"all 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {/* 絞り込みパネル（filterタブ時のみ） */}
          {tab === "filter" && !selectedModel && (
            <div style={{ flex:1, overflowY:"auto", padding:"16px 14px" }}>

              {/* メーカー */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:14, color:"#4A5568", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 1 ｜ メーカー</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {MAKERS.map(m => (
                    <Chip key={m} active={maker===m} color={MAKER_COLORS[m]} onClick={() => { setMaker(maker===m ? null : m); setTatami(null); setFilterOpt(null); setEcoOpt(null); }}>
                      <div style={{ fontSize:15, fontWeight:700 }}>{m}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {/* 畳数 */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:14, color:"#2D3748", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 2 ｜ 畳数 / kW</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {TATAMI_LIST.map(t => {
                    const isDisplay = TATAMI_DISPLAY.includes(t);
                    return (
                      <Chip key={t} active={tatami===t} color={accentColor} onClick={() => setTatami(tatami===t ? null : t)}>
                        <div style={{ fontSize:14, fontWeight:700 }}>{TATAMI_LABELS[t]}</div>
                        <div style={{ fontSize:15, color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[t]}kW</div>
                        <div style={{ fontSize:9, marginTop:1, color: isDisplay ? "#4CAF50" : "#4A6080" }}>{isDisplay ? "🟢 展示あり" : "販売のみ"}</div>
                      </Chip>
                    );
                  })}
                </div>
              </div>

              {/* フィルター */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:14, color:"#2D3748", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 3 ｜ 自動フィルター掃除</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[[null,"指定なし","—"],[true,"あり ✨","手入れ不要"],[false,"なし","シンプル"]].map(([val,label,sub]) => (
                    <Chip key={String(val)} active={filterOpt===val} color={accentColor} onClick={() => setFilterOpt(val)}>
                      <div style={{ fontSize:14, fontWeight:700 }}>{label}</div>
                      <div style={{ fontSize:14, color:"#2D3748" }}>{sub}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {/* 省エネ */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:14, color:"#2D3748", fontWeight:700, letterSpacing:2, marginBottom:8 }}>STEP 4 ｜ 超省エネモデル</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[[null,"指定なし","—"],[true,"省エネ ⚡","電気代重視"],[false,"スタンダード","コスパ重視"]].map(([val,label,sub]) => (
                    <Chip key={String(val)} active={ecoOpt===val} color={accentColor} onClick={() => setEcoOpt(val)}>
                      <div style={{ fontSize:14, fontWeight:700 }}>{label}</div>
                      <div style={{ fontSize:14, color:"#2D3748" }}>{sub}</div>
                    </Chip>
                  ))}
                </div>
              </div>

              {(maker || tatami || filterOpt !== null || ecoOpt !== null) && (
                <button onClick={resetFilter} style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:"8px", color:"#5070A0", fontSize:15, cursor:"pointer", width:"100%",
                }}>✕ リセット</button>
              )}
            </div>
          )}
        </div>
        )} {/* sidebarOpen終わり */}

        {/* 右コンテンツエリア */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", background:"#F5F7FA" }}>


        {/* ══ 絞り込み結果 ══ */}
        {tab === "filter" && !selectedModel && !top3View && (
          <div>
            {/* Top3セクション */}
            {[
              { label:"6・10畳 おすすめ", group:"small" },
              { label:"14・18畳 おすすめ", group:"large" },
            ].map(({ label, group }) => (
              <div key={group} style={{ marginBottom:24 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#4A5568", marginBottom:10 }}>⭐ {label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  {[
                    { key:"noFilter", label:"自動掃除なし", color:"#4A5568", icon:"🔲" },
                    { key:"hasFilter", label:"自動掃除あり ✨", color:"#38A169", icon:"✨" },
                    { key:"eco", label:"超省エネモデル ⚡", color:"#3182CE", icon:"⚡" },
                  ].map(({ key, label: catLabel, color }) => (
                    <div key={key} onClick={() => setTop3View({ group, key })} style={{
                      background:"#FFFFFF", border:`2px solid ${color}30`,
                      borderRadius:14, padding:"14px 16px", cursor:"pointer", textAlign:"left",
                      boxShadow:"0 2px 6px rgba(0,0,0,0.06)", transition:"all 0.18s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = color+"30"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"; }}
                    >
                      <div style={{ fontSize:14, fontWeight:700, color, marginBottom:10 }}>{catLabel}</div>
                      {TOP3[group][key].map(item => (
                        <div key={item.rank} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                          <div style={{
                            width:20, height:20, borderRadius:6, flexShrink:0,
                            background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : "#CD7F32",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:15, fontWeight:700, color:"#fff",
                          }}>{item.rank}</div>
                          <div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker} {item.series}</div>
                            <div style={{ fontSize:14, color:"#4A5568" }}>{item.model}</div>
                          </div>
                        </div>
                      ))}
                      {/* 4位以降ボタン */}
                      {group === "small" && FULL_RANKING[key].length > 3 && (
                        <div onClick={(e) => { e.stopPropagation(); setTop3View({ group, key }); }} style={{
                          display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                          width:"100%", marginTop:6, padding:"6px",
                          background:"none", border:`1px dashed ${color}60`,
                          borderRadius:8, cursor:"pointer", color, fontSize:15, fontWeight:600,
                        }}>
                          ・・・ {FULL_RANKING[key].length - 3}機種以上 全ランキングを見る →
                        </div>
                      )}
                      <div style={{ fontSize:15, color, marginTop:8, fontWeight:600, textAlign:"right" }}>詳細を比較する →</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 絞り込み結果 */}
            <div style={{ fontSize:15, color:"#4A5568", marginBottom:14 }}>
              絞り込み結果　<span style={{ fontSize:22, fontWeight:700, color:"#1A202C" }}>{results.length}</span> 件
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign:"center", padding:"48px 0", color:"#3A5070" }}>条件に合う機種が見つかりませんでした</div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {results.map(m => (
                  <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                    background:"#FFFFFF", border:`1px solid ${m.color}40`,
                    borderRadius:16, padding:"14px 18px", cursor:"pointer", color:"#1A202C",
                    textAlign:"left", transition:"all 0.18s",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.boxShadow = `0 4px 12px ${m.color}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = m.color+"40"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:15, padding:"2px 8px", borderRadius:5, background:GRADE_COLORS[m.grade]+"22", color:GRADE_COLORS[m.grade], border:`1px solid ${GRADE_COLORS[m.grade]}40` }}>{m.grade}</span>
                      <span style={{ fontSize:15, color:"#5070A0" }}>{m.maker}</span>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#1A202C" }}>{m.series}</div>
                    <div style={{ fontSize:14, color:"#4A5568", marginBottom:8 }}>
                      {m.model}　{m.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[m.tatami]}kW</span>
                    </div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {m.hasFilter && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター</span>}
                      {m.isEco    && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 省エネ</span>}
                      {m.features.filter(k => k !== "filter").map(k => {
                        const f = FEATURES_DB[k];
                        return f ? <span key={k} style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}35` }}>{f.icon} {f.name}</span> : null;
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ Top3比較ページ ══ */}
        {tab === "filter" && !selectedModel && top3View && (() => {
          const catLabels = { noFilter:"自動掃除なし", hasFilter:"自動掃除あり ✨", eco:"超省エネモデル ⚡" };
          const catColors = { noFilter:"#718096", hasFilter:"#38A169", eco:"#3182CE" };
          const groupLabels = { small:"6・10畳", large:"14・18畳" };
          const items = TOP3[top3View.group][top3View.key];
          const color = catColors[top3View.key];
          return (
            <div>
              <button onClick={() => setTop3View(null)} style={{ background:"none", border:"none", color:"#4A5568", cursor:"pointer", fontSize:15, marginBottom:16 }}>← 戻る</button>
              <div style={{ fontSize:16, fontWeight:700, color:"#1A202C", marginBottom:4 }}>
                {groupLabels[top3View.group]}　{catLabels[top3View.key]}
              </div>
              <div style={{ fontSize:14, color:"#4A5568", marginBottom:20 }}>おすすめTop3の比較</div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {items.map(item => {
                  const model = AC_MODELS.find(m => m.model === item.model);
                  return (
                    <div key={item.rank} style={{ background:"#FFFFFF", borderRadius:16, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", border:`2px solid ${color}30`, overflow:"hidden" }}>
                      {/* ランク */}
                      <div style={{ background:`${color}15`, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{
                          width:28, height:28, borderRadius:8,
                          background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : "#CD7F32",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:14, fontWeight:700, color:"#fff",
                        }}>{item.rank}</div>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker}</div>
                          <div style={{ fontSize:14, color:"#4A5568" }}>{item.series}</div>
                        </div>
                      </div>

                      <div style={{ padding:"14px 16px" }}>
                        {/* 型番 */}
                        <div style={{ fontSize:15, color:"#4A5568", marginBottom:10 }}>
                          {item.model}　{model ? `${model.tatami}畳 / ${TATAMI_KW[model.tatami]}kW` : ""}
                        </div>

                        {/* 一言でいうと */}
                        <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:14, padding:"10px 12px", background:"#F0FFF4", borderRadius:10, border:"1px solid #C6F6D5" }}>
                          <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
                          <div>
                            <div style={{ fontSize:14, fontWeight:700, color:"#276749", marginBottom:2 }}>一言でいうと</div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.summary || item.point}</div>
                          </div>
                        </div>

                        {/* そのまま使えるトーク */}
                        {item.talks && (
                          <div style={{ marginBottom:12 }}>
                            <div style={{ fontSize:14, fontWeight:700, color:"#2B6CB0", marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>
                              <span>🗣️</span> そのまま使えるトーク
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              {item.talks.map((talk, i) => (
                                <div key={i} style={{ fontSize:14, color:"#1A202C", lineHeight:1.7, padding:"10px 12px", background:"#EBF8FF", borderRadius:10, border:"1px solid #BEE3F8", borderLeft:`3px solid ${color}` }}>
                                  {talk}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 機能タグ */}
                        {model && (
                          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                            {model.hasFilter && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"#F0FFF4", color:"#38A169", border:"1px solid #C6F6D5" }}>✨ 自動フィルター</span>}
                            {model.isEco    && <span style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:"#EBF8FF", color:"#3182CE", border:"1px solid #BEE3F8" }}>⚡ 省エネ</span>}
                            {model.features.filter(k => k !== "filter").map(k => {
                              const f = FEATURES_DB[k];
                              return f ? <span key={k} style={{ fontSize:14, padding:"2px 8px", borderRadius:8, background:`${f.color}10`, color:f.color, border:`1px solid ${f.color}30` }}>{f.icon} {f.name}</span> : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 全機種ランキング（6・10畳のみ） */}
              {top3View.group === "small" && (
                <div style={{ marginTop:28 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:4 }}>
                    📋 6・10畳 全機種ランキング
                  </div>
                  <div style={{ fontSize:14, color:"#4A5568", marginBottom:14 }}>展示している機種をすべておすすめ順で表示</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {FULL_RANKING[top3View.key].map((item, i) => (
                      <div key={i} style={{
                        background: item.warning ? "#FFF5F5" : "#FFFFFF",
                        border:`1px solid ${item.warning ? "#FEB2B2" : "#E2E8F0"}`,
                        borderRadius:14, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
                      }}>
                        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${item.warning ? "#FEB2B2" : "#F0F4F8"}`, background: item.warning ? "#FFF5F5" : "#F7FAFC" }}>
                          <div style={{
                            width:28, height:28, borderRadius:8, flexShrink:0,
                            background: item.rank===1 ? "#FFD700" : item.rank===2 ? "#C0C0C0" : item.rank===3 ? "#CD7F32" : item.warning ? "#FC8181" : "#E2E8F0",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:15, fontWeight:700, color: item.rank<=3 ? "#fff" : item.warning ? "#fff" : "#718096",
                          }}>{item.rank}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C" }}>{item.maker}　{item.series}</div>
                            <div style={{ fontSize:15, color:"#4A5568" }}>{item.model}</div>
                          </div>
                        </div>
                        <div style={{ padding:"12px 16px" }}>
                          {item.warning && (
                            <div style={{ background:"#FED7D7", borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:14, color:"#C53030", fontWeight:600 }}>
                              ⚠️ {item.warning}
                            </div>
                          )}
                          <div style={{ display:"flex", gap:8, marginBottom:10, padding:"8px 10px", background: item.warning ? "#FFF5F5" : "#F0FFF4", borderRadius:8 }}>
                            <span>💡</span>
                            <div style={{ fontSize:14, fontWeight:700, color:"#1A202C" }}>{item.summary}</div>
                          </div>
                          <div style={{ fontSize:14, fontWeight:700, color:"#2B6CB0", marginBottom:6 }}>🗣️ そのまま使えるトーク</div>
                          {item.talks.map((talk, j) => (
                            <div key={j} style={{ fontSize:14, color:"#1A202C", lineHeight:1.7, padding:"8px 12px", background:"#EBF8FF", borderRadius:8, marginBottom:6, borderLeft:`3px solid ${color}` }}>
                              {talk}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ══ 機種詳細 ══ */}
        {tab === "filter" && selectedModel && (
          <div>
            <button onClick={() => setSelectedModel(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:20 }}>← 一覧に戻る</button>
            <div style={{ background:`${selectedModel.color}15`, border:`1px solid ${selectedModel.color}45`, borderRadius:20, padding:"22px 24px", marginBottom:24 }}>
              <div style={{ fontSize:14, color:"#5070A0", marginBottom:2 }}>{selectedModel.maker}</div>
              <div style={{ fontSize:24, fontWeight:700 }}>{selectedModel.series}</div>
              <div style={{ fontSize:14, color:"#5070A0", marginBottom:10 }}>
                {selectedModel.model}　{selectedModel.tatami}畳　<span style={{ color:"#1E90FF", fontWeight:700 }}>{TATAMI_KW[selectedModel.tatami]}kW</span>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:GRADE_COLORS[selectedModel.grade]+"22", color:GRADE_COLORS[selectedModel.grade], border:`1px solid ${GRADE_COLORS[selectedModel.grade]}40` }}>{selectedModel.grade}</span>
                {selectedModel.hasFilter && <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター掃除</span>}
                {selectedModel.isEco    && <span style={{ fontSize:14, padding:"4px 12px", borderRadius:6, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 超省エネ</span>}
              </div>
            </div>
            {selectedModel.features.length > 0 ? (
              <>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>搭載機能</div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {selectedModel.features.map(k => <FeatureCard key={k} featureKey={k} isStaffMode={false} highlight />)}
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
            <div style={{ fontSize:14, fontWeight:700, color:"#7090A8", letterSpacing:2, marginBottom:16 }}>◼ メーカー別コンサルポイント</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {MAKERS.map(m => {
                const g = MAKER_GUIDE[m];
                return (
                  <div key={m} style={{ background:`${g.color}10`, border:`1px solid ${g.color}40`, borderRadius:18, padding:"18px 20px" }}>
                    {/* ヘッダー */}
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

                    {/* コンサルポイント */}
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

                    {/* 刺さるお客様 */}
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

            {/* こんなお客様には */}
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
        )}

        {tab === "makers" && selectedMaker && (() => {
          const g = MAKER_GUIDE[selectedMaker];
          return (
            <div>
              <button onClick={() => setSelectedMaker(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:16 }}>← 一覧に戻る</button>

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
                      <div style={{ fontSize:15, color:"#5070A0", margin:"4px 0" }}>{item}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:markColor(f.mark), marginBottom:4 }}>{f.mark}</div>
                      {f.mark !== "—" && <div style={{ fontSize:15, color:"#5070A0", lineHeight:1.5 }}>{f.text}</div>}
                    </div>
                  );
                })}
              </div>

              {/* 3カラム */}
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

              {/* 耐久性・独自技術・空気清浄 */}
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

              {/* シリーズ早見表 */}
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

              {/* 接客Tips */}
              <div style={{ background:"#FFFBEB", border:"1px solid #F6E05E", borderRadius:16, padding:"16px 20px" }}>
                <div style={{ fontSize:14, color:"#B7791F", fontWeight:700, letterSpacing:1, marginBottom:8 }}>📋 接客Tips</div>
                <div style={{ fontSize:15, color:"#744210", lineHeight:1.8 }}>{g.tip}</div>
              </div>
            </div>
          );
        })()}


        {/* ══ 全体マップ ══ */}
        {tab === "map" && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#1A202C", marginBottom:4 }}>6畳 全体マップ</div>
            <div style={{ fontSize:13, color:"#4A5568", marginBottom:16 }}>お客様のニーズに合わせて案内するゾーンを選ぼう</div>

            {/* 3列ヘッダー */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
              {[
                { label:"スタンダード", icon:"🔲", color:"#718096", bg:"#F7FAFC" },
                { label:"自動フィルター掃除", icon:"✨", color:"#38A169", bg:"#F0FFF4" },
                { label:"超省エネ", icon:"⚡", color:"#3182CE", bg:"#EBF8FF" },
              ].map(g => (
                <div key={g.label} style={{ background:g.bg, border:`2px solid ${g.color}`, borderRadius:"12px 12px 0 0", padding:"10px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:18 }}>{g.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:g.color }}>{g.label}</div>
                </div>
              ))}
            </div>

            {/* 3列コンテンツ */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>

              {/* スタンダード列 */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { series:"ダイキン E",      note:"隠蔽推奨。空気清浄＆水洗浄◎", color:"#00A0E9" },
                  { series:"ゼネラル L",      note:"2027年省エネ基準達成。ゼロエミ入口", color:"#E87B00" },
                  { series:"パナ J",          note:"ナノイー搭載。指名買いが多い人気モデル", color:"#0047AA" },
                  { series:"日立 D",          note:"凍結洗浄で内部を凍らせて清潔に", color:"#CE0F0F" },
                  { series:"三菱 R",          note:"お掃除は自分でしたい方向け。日本製", color:"#E60012" },
                  { series:"ダイキン C",      note:"隠蔽推奨。高さ25cm。FNの方がお得", color:"#00A0E9" },
                  { series:"東芝 M",          note:"上下ルーバー。高さ25cm。他社国内最安", color:"#E60020" },
                  { series:"シャープ DG",     note:"上下ルーバー＋プラズマクラスター", color:"#444" },
                  { series:"アイリス",        note:"最安。⚠️外気温50℃未対応（唯一）", color:"#E53E3E", warn:true },
                ].map((m, i) => (
                  <div key={i} style={{
                    background: m.warn ? "#FFF5F5" : "#FFFFFF",
                    border:`1px solid ${m.warn ? "#FC8181" : m.color+"40"}`,
                    borderLeft:`3px solid ${m.warn ? "#FC8181" : m.color}`,
                    borderRadius:8, padding:"8px 12px",
                  }}>
                    <div style={{ fontSize:13, fontWeight:700, color: m.warn ? "#C53030" : "#1A202C" }}>{m.warn ? "⚠️ " : ""}{m.series}</div>
                    <div style={{ fontSize:12, color:"#4A5568", lineHeight:1.5, marginTop:2 }}>{m.note}</div>
                  </div>
                ))}
              </div>

              {/* 自動フィルター掃除列 */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { series:"ダイキン FN",   note:"良湿モデル。内部ファンカビ対策加工。日本製", color:"#00A0E9" },
                  { series:"パナ EX",       note:"自動排出かBOX式。換気ヘッド必要なケース多い", color:"#0047AA" },
                  { series:"日立 WN",       note:"良湿モデル。高さ最小。ファンロボ搭載", color:"#CE0F0F" },
                  { series:"日立 G",        note:"お掃除機能入口。凍結洗浄。ジャパ対抗多し", color:"#CE0F0F" },
                  { series:"三菱 ZW",       note:"エモコでお客様の体温で判断。人にフォーカス", color:"#E60012" },
                  { series:"パナ X",        note:"条件付きで標準工事費込。複数台割なし", color:"#0047AA" },
                  { series:"東芝 DX",       note:"お掃除機能最安。無風感で冷房苦手な方に", color:"#E60020" },
                  { series:"シャープ V",    note:"高さ25cm・コスパ◎。プラズマクラスター", color:"#444" },
                ].map((m, i) => (
                  <div key={i} style={{
                    background:"#FFFFFF",
                    border:`1px solid ${m.color}40`,
                    borderLeft:`3px solid ${m.color}`,
                    borderRadius:8, padding:"8px 12px",
                  }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1A202C" }}>{m.series}</div>
                    <div style={{ fontSize:12, color:"#4A5568", lineHeight:1.5, marginTop:2 }}>{m.note}</div>
                  </div>
                ))}
              </div>

              {/* 超省エネ列 */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { series:"ダイキン R",   note:"換気・暖房時加湿。穴問題あり", color:"#00A0E9" },
                  { series:"日立 X",       note:"内部銅合金で水の通り道も凍結。空気清浄機で脱臭", color:"#CE0F0F" },
                  { series:"ダイキン A",   note:"Rシリーズの加湿換気なしモデル", color:"#00A0E9" },
                  { series:"シャープ R",   note:"感動最安。電気代コンサルならVの省エネモデル", color:"#444" },
                ].map((m, i) => (
                  <div key={i} style={{
                    background:"#FFFFFF",
                    border:`1px solid ${m.color}40`,
                    borderLeft:`3px solid ${m.color}`,
                    borderRadius:8, padding:"8px 12px",
                  }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1A202C" }}>{m.series}</div>
                    <div style={{ fontSize:12, color:"#4A5568", lineHeight:1.5, marginTop:2 }}>{m.note}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {tab === "kouji" && (
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
                  { name:"ドレンホース断熱処理", icon:"💧", color:"#3182CE", img:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80", desc:"ドレンホース（排水ホース）に断熱材を巻く工事です。", why:"夏場にドレンホースが結露して水滴が垂れるのを防ぎます。特に室内を通る部分に必要です。", when:"配管が室内を通る場合・結露が気になる場合", price:"別途 ¥3,000〜5,000程度" },
                  { name:"配管穴あけ工事", icon:"🔩", color:"#D69E2E", img:"https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80", desc:"エアコン用の配管を通す穴を壁に開ける工事です。", why:"新規設置や穴の位置が合わない場合に必要です。コンクリート・タイルは追加費用がかかります。", when:"配管穴がない場合・既存穴の位置が合わない場合", price:"別途 ¥5,000〜15,000程度（素材による）" },
                  { name:"配管延長工事", icon:"📏", color:"#4A5568", img:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", desc:"室内機と室外機をつなぐ配管を延長する工事です。", why:"標準の配管長（約3〜4m）より距離が長い場合に必要です。", when:"室外機を離れた場所に設置する場合", price:"別途 ¥1,000〜2,000/m程度" },
                  { name:"隠蔽配管工事", icon:"🏠", color:"#805AD5", img:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", desc:"配管を壁の中や天井裏に隠して通す工事です。", why:"見た目をスッキリさせたい場合に行います。工事が複雑になるため費用が高くなります。", when:"配管を見せたくない場合・新築・リフォーム時", price:"別途 ¥30,000〜100,000程度" },
                  { name:"既設エアコン取り外し・処分", icon:"🗑️", color:"#E53E3E", img:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", desc:"古いエアコンを取り外してリサイクル処分する工事です。", why:"家電リサイクル法により、エアコンは適正に処分する必要があります。", when:"今のエアコンを取り外す場合", price:"取り外し ¥3,000〜5,000 ＋ リサイクル料金" },
                  { name:"室外機架台設置", icon:"🔧", color:"#2D3748", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", desc:"室外機を地面・壁・屋根などに設置するための架台を取り付ける工事です。", why:"室外機を安定して設置するために必要です。設置場所によって種類が異なります。", when:"ベランダ以外に設置する場合・壁掛け・屋根置きの場合", price:"別途 ¥5,000〜20,000程度（種類による）" },
                  { name:"200V電源工事", icon:"⚡", color:"#D69E2E", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", desc:"100Vのコンセントを200Vに変更する電気工事です。", why:"大型エアコン（14畳以上）は200V電源が必要な場合があります。", when:"200V対応エアコンを設置するが100Vコンセントしかない場合", price:"別途 ¥15,000〜30,000程度" },
                ].map((item, i) => (
                  <div key={i} style={{ background:"#FFFFFF", borderRadius:14, border:`1px solid ${item.color}30`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"120px 1fr" }}>
                      {/* 写真エリア */}
                      <div style={{ background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"120px", fontSize:40 }}>
                        {item.icon}
                      </div>
                      {/* 内容 */}
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
        )}

        {tab === "guide" && !selectedFeature && (
          <div>
            {/* 空気浄化技術比較 */}
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
        )}

        {tab === "guide" && selectedFeature && (
          <div>
            <button onClick={() => setSelectedFeature(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:15, marginBottom:20 }}>← 機能一覧に戻る</button>
            <FeatureCard featureKey={selectedFeature} isStaffMode={false} highlight={false} />
          </div>
        )}
        </div> {/* 右コンテンツエリア終わり */}
      </div> {/* メインレイアウト終わり */}
      <Analytics />
    </div>
  );
}
