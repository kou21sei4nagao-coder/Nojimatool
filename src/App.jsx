import { useState } from "react";

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
    series: [
      { name:"霧ヶ峰Zシリーズ", point:"最上位。ムーブアイmirAI搭載。快眠サポートも充実。" },
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
    series: [
      { name:"ノクリア Zシリーズ", point:"最上位。ハイパワー暖房＋自動掃除。" },
      { name:"ノクリア Cシリーズ", point:"ベーシック。コスパ重視向け。" },
    ],
    tip: "「暖房はガスファンヒーターじゃないと温まらない」というお客様への切り返しに使える。電気代・環境面でのメリットも合わせて提案しやすい。",
  },
  "ゼネラル": {
    color: "#E87B00", icon: "🔥",
    catch: "富士通と同じ性能・別ブランド展開",
    strength: "富士通ゼネラル製造の別ブランド。暖房性能・省エネ性能は富士通と同等。",
    target: "富士通と同じ。暖房重視・コスパ重視向け。",
    weak: "認知度が富士通より低め。",
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
    weak: "加湿・換気など独自機能は他社に劣る部分も。",
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
    series: [
      { name:"大清快 Gシリーズ", point:"換気機能搭載。省エネ・自動掃除あり。" },
      { name:"大清快 Eシリーズ", point:"ベーシック。換気機能なし。" },
    ],
    tip: "「窓を開けると花粉や虫が入る」「開けると冷気が逃げる」という悩みを解決できる唯一のエアコン。特にリビング・LDKへの設置検討者に刺さる。",
  },
};

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

  const accentColor = maker ? MAKER_COLORS[maker] : "#1E90FF";

  return (
    <div style={{ minHeight:"100vh", background:"#080E1C", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", color:"#E8EDF5" }}>

      {/* ヘッダー */}
      <div style={{
        background:"linear-gradient(135deg,#0C1830,#162040)",
        borderBottom:"1px solid rgba(100,160,255,0.12)",
        padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#1E90FF,#00D4FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>❄️</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>エアコン コンサルツール</div>
            <div style={{ fontSize:10, color:"#4A6080", letterSpacing:1 }}>NOJIMA · AC GUIDE</div>
          </div>
        </div>
        <button onClick={() => setIsStaff(v => !v)} style={{
          background: isStaff ? "rgba(255,184,0,0.18)" : "rgba(255,255,255,0.06)",
          border:`1px solid ${isStaff ? "rgba(255,184,0,0.45)" : "rgba(255,255,255,0.1)"}`,
          borderRadius:10, padding:"7px 14px", cursor:"pointer",
          color: isStaff ? "#FFB800" : "#6080A0", fontSize:12, fontWeight:700,
        }}>{isStaff ? "🔓 スタッフモード" : "🔒 スタッフモード"}</button>
      </div>

      {/* タブ */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0A1020" }}>
        {[["filter","🔍 絞り込む"],["makers","🏷️ メーカー特徴"],["guide","📚 機能ガイド"]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex:1, padding:"13px 0", background:"none",
            border:"none", borderBottom:`2px solid ${tab===key ? accentColor : "transparent"}`,
            color: tab===key ? "#E8EDF5" : "#4A6080", fontSize:13, fontWeight: tab===key ? 700 : 400,
            cursor:"pointer", transition:"all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"26px 18px" }}>

        {/* ══ 機種を絞り込む ══ */}
        {tab === "filter" && !selectedModel && (
          <div>
            {/* STEP 1: メーカー */}
            <FilterStep label="Step 1 ｜ メーカー">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {MAKERS.map(m => (
                  <Chip key={m} active={maker===m} color={MAKER_COLORS[m]} onClick={() => { setMaker(maker===m ? null : m); setTatami(null); setFilterOpt(null); setEcoOpt(null); }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{m}</div>
                  </Chip>
                ))}
              </div>
            </FilterStep>

            {/* STEP 2: 畳数 */}
            <FilterStep label="Step 2 ｜ 畳数 / kW">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {TATAMI_LIST.map(t => {
                  const isDisplay = TATAMI_DISPLAY.includes(t);
                  return (
                    <Chip key={t} active={tatami===t} color={accentColor} onClick={() => setTatami(tatami===t ? null : t)}>
                      <div style={{ fontSize:14, fontWeight:700 }}>{TATAMI_LABELS[t]}</div>
                      <div style={{ fontSize:12, color:"#1E90FF", marginTop:2, fontWeight:600 }}>{TATAMI_KW[t]}kW</div>
                      <div style={{ fontSize:10, marginTop:2, color: isDisplay ? "#4CAF50" : "#4A6080" }}>
                        {isDisplay ? "🟢 展示あり" : "販売のみ"}
                      </div>
                    </Chip>
                  );
                })}
              </div>
            </FilterStep>

            {/* STEP 3: 自動フィルター */}
            <FilterStep label="Step 3 ｜ 自動フィルター掃除">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[[null,"指定なし","—"],[true,"あり ✨","手入れ不要"],[false,"なし","シンプル"]].map(([val,label,sub]) => (
                  <Chip key={String(val)} active={filterOpt===val} color={accentColor} onClick={() => setFilterOpt(val)}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{label}</div>
                    <div style={{ fontSize:11, color:"#4A6080", marginTop:2 }}>{sub}</div>
                  </Chip>
                ))}
              </div>
            </FilterStep>

            {/* STEP 4: 省エネ */}
            <FilterStep label="Step 4 ｜ 省エネモデル">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[[null,"指定なし","—"],[true,"省エネ ⚡","電気代重視"],[false,"スタンダード","コスパ重視"]].map(([val,label,sub]) => (
                  <Chip key={String(val)} active={ecoOpt===val} color={accentColor} onClick={() => setEcoOpt(val)}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{label}</div>
                    <div style={{ fontSize:11, color:"#4A6080", marginTop:2 }}>{sub}</div>
                  </Chip>
                ))}
              </div>
            </FilterStep>

            {/* リセット */}
            {(maker || tatami || filterOpt !== null || ecoOpt !== null) && (
              <button onClick={resetFilter} style={{
                background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, padding:"8px 18px", color:"#5070A0", fontSize:12, cursor:"pointer", marginBottom:20,
              }}>✕ 絞り込みをリセット</button>
            )}

            {/* 結果 */}
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:22 }}>
              <div style={{ fontSize:14, color:"#4A6080", marginBottom:14 }}>
                絞り込み結果　<span style={{ fontSize:20, fontWeight:700, color:"#E8EDF5" }}>{results.length}</span> 件
              </div>
              {results.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#3A5070" }}>条件に合う機種が見つかりませんでした</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {results.map(m => (
                    <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                      background:`${m.color}10`, border:`1px solid ${m.color}35`,
                      borderRadius:16, padding:"16px 20px", cursor:"pointer", color:"#E8EDF5",
                      textAlign:"left", display:"grid", gridTemplateColumns:"1fr auto",
                      gap:12, alignItems:"center", transition:"all 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = m.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = m.color+"35"}
                    >
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:5, background:GRADE_COLORS[m.grade]+"22", color:GRADE_COLORS[m.grade], border:`1px solid ${GRADE_COLORS[m.grade]}40` }}>{m.grade}</span>
                          <span style={{ fontSize:12, color:"#5070A0" }}>{m.maker}</span>
                        </div>
                        <div style={{ fontSize:17, fontWeight:700 }}>{m.series}</div>
                        <div style={{ fontSize:12, color:"#5070A0", marginBottom:8 }}>
                          {m.model}　<span style={{ color:"#4A6080" }}>{m.tatami}畳</span>　<span style={{ color:"#1E90FF", fontWeight:600 }}>{TATAMI_KW[m.tatami]}kW</span>
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {m.hasFilter && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:8, background:"rgba(76,175,80,0.15)", color:"#81C784", border:"1px solid rgba(76,175,80,0.3)" }}>✨ 自動フィルター</span>}
                          {m.isEco    && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:8, background:"rgba(30,144,255,0.12)", color:"#64B5F6", border:"1px solid rgba(30,144,255,0.3)" }}>⚡ 省エネ</span>}
                          {m.features.filter(k => k !== "filter").map(k => {
                            const f = FEATURES_DB[k];
                            return f ? <span key={k} style={{ fontSize:11, padding:"3px 9px", borderRadius:8, background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}35` }}>{f.icon} {f.name}</span> : null;
                          })}
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:m.color, whiteSpace:"nowrap" }}>詳細 →</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <div style={{ fontSize:13, color:"#4A6080", marginBottom:20 }}>各メーカーの強み・特徴をまとめました。他部門からのコンサル時にも活用してください。</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {MAKERS.map(m => {
                const g = MAKER_GUIDE[m];
                return (
                  <button key={m} onClick={() => setSelectedMaker(m)} style={{
                    background:`${g.color}12`, border:`1px solid ${g.color}35`,
                    borderRadius:16, padding:"16px 20px", cursor:"pointer", color:"#E8EDF5",
                    textAlign:"left", display:"flex", alignItems:"center", gap:14, transition:"all 0.18s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = g.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = g.color+"35"}
                  >
                    <span style={{ fontSize:26 }}>{g.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{m}</div>
                      <div style={{ fontSize:13, color: g.color, fontWeight:600 }}>{g.catch}</div>
                    </div>
                    <span style={{ color:"#3A5070" }}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "makers" && selectedMaker && (() => {
          const g = MAKER_GUIDE[selectedMaker];
          return (
            <div>
              <button onClick={() => setSelectedMaker(null)} style={{ background:"none", border:"none", color:"#5070A0", cursor:"pointer", fontSize:13, marginBottom:20 }}>← メーカー一覧に戻る</button>
              {/* ヘッダー */}
              <div style={{ background:`${g.color}18`, border:`1px solid ${g.color}45`, borderRadius:20, padding:"20px 24px", marginBottom:20 }}>
                <div style={{ fontSize:26, marginBottom:6 }}>{g.icon} {selectedMaker}</div>
                <div style={{ fontSize:18, fontWeight:700, color: g.color }}>{g.catch}</div>
              </div>

              {/* 強み */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#4A6080", fontWeight:700, letterSpacing:1, marginBottom:8 }}>💪 強み</div>
                <div style={{ fontSize:14, color:"#A0C0D8", lineHeight:1.75 }}>{g.strength}</div>
              </div>

              {/* ターゲット */}
              <div style={{ background:"rgba(30,144,255,0.07)", border:"1px solid rgba(30,144,255,0.2)", borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#4A80A0", fontWeight:700, letterSpacing:1, marginBottom:8 }}>🎯 刺さるお客様</div>
                <div style={{ fontSize:14, color:"#7AAAC8", lineHeight:1.75 }}>{g.target}</div>
              </div>

              {/* 注意点 */}
              <div style={{ background:"rgba(255,100,100,0.06)", border:"1px solid rgba(255,100,100,0.18)", borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#804040", fontWeight:700, letterSpacing:1, marginBottom:8 }}>⚠️ 弱み・注意点</div>
                <div style={{ fontSize:14, color:"#A07070", lineHeight:1.75 }}>{g.weak}</div>
              </div>

              {/* シリーズ一覧 */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#4A6080", marginBottom:10, letterSpacing:1 }}>📋 シリーズ早見表</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {g.series.map(s => (
                    <div key={s.name} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ fontSize:13, fontWeight:700, color: g.color, minWidth:140 }}>{s.name}</div>
                      <div style={{ fontSize:13, color:"#7090A8", lineHeight:1.6 }}>{s.point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* スタッフTips */}
              {isStaff && (
                <div style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.25)", borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ fontSize:11, color:"#FFB800", fontWeight:700, marginBottom:8 }}>📋 接客Tips（スタッフメモ）</div>
                  <div style={{ fontSize:13, color:"#C09840", lineHeight:1.75 }}>{g.tip}</div>
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
      </div>
    </div>
  );
}
