import { useState } from "react";

const fmt   = (n) => Math.abs(n).toLocaleString('ja-JP');
const LCOLORS = ["#3B5BDB", "#2F9E44", "#E67700"];

// ── 初期リスト ────────────────────────────────────────────
const initList = (name) => ({ name, entries: [], memory: 0 });

export default function EstimateTab() {
  const [lists,   setLists]   = useState([initList("List1"), initList("List2"), initList("List3")]);
  const [active,  setActive]  = useState(0);
  const [input,   setInput]   = useState("");       // 現在入力中の数字
  const [history, setHistory] = useState([]);       // undoスタック
  const [calcOp,  setCalcOp]  = useState(null);     // × ÷ 保留中
  const [calcLhs, setCalcLhs] = useState(null);     // 左辺値

  const list  = lists[active];
  const total = list.entries.reduce((s, e) => s + e.value, 0);

  // ── リスト更新ヘルパー ─────────────────────────────────
  const updateList = (newList) =>
    setLists(prev => prev.map((l, i) => i === active ? newList : l));

  const saveHistory = () =>
    setHistory(prev => [...prev.slice(-29), { idx: active, entries: [...list.entries] }]);

  // ── テープへ追加 ────────────────────────────────────────
  const pushEntry = (value) => {
    if (value === 0 && input === "") return;
    saveHistory();
    updateList({ ...list, entries: [...list.entries, { value }] });
    setInput("");
    setCalcOp(null);
    setCalcLhs(null);
  };

  // ── ボタンハンドラ ─────────────────────────────────────
  const numPress = (k) => {
    if (k === ".") { setInput(s => s.includes(".") ? s : (s || "0") + "."); return; }
    if (k === "00") { setInput(s => s === "" ? "" : s + "00"); return; }
    setInput(s => s === "0" ? k : s + k);
  };
  const inputVal = () => parseFloat(input) || 0;

  const pressPlus  = () => pushEntry( inputVal());
  const pressMinus = () => pushEntry(-inputVal());
  const pressC     = () => setInput("");
  const pressBack  = () => setInput(s => s.slice(0, -1));
  const pressAC    = () => { saveHistory(); updateList({ ...list, entries: [] }); setInput(""); };
  const pressSign  = () => setInput(s => s.startsWith("-") ? s.slice(1) : s === "" ? "" : "-" + s);

  const pressMulDiv = (op) => {
    setCalcLhs(inputVal());
    setCalcOp(op);
    setInput("");
  };
  const pressEquals = () => {
    if (calcOp && calcLhs !== null) {
      const rhs = inputVal();
      const res = calcOp === "×" ? calcLhs * rhs : rhs !== 0 ? calcLhs / rhs : 0;
      setInput(String(Math.round(res * 10000) / 10000));
      setCalcOp(null); setCalcLhs(null);
    } else {
      pushEntry(inputVal());
    }
  };

  const pressUndo = () => {
    const prev = [...history].reverse().find(h => h.idx === active);
    if (!prev) return;
    updateList({ ...list, entries: prev.entries });
    setHistory(h => h.filter(x => x !== prev));
  };

  const pressMemory = (op) => {
    const v = inputVal();
    if (op === "MC") { updateList({ ...list, memory: 0 }); return; }
    const nm = op === "M+" ? list.memory + v : list.memory - v;
    updateList({ ...list, memory: nm });
    setInput(String(nm));
  };

  // ── スタイル ───────────────────────────────────────────
  const numBtn = (extra={}) => ({
    borderRadius:10, border:"none", cursor:"pointer", fontSize:26, fontWeight:700,
    background:"linear-gradient(180deg, #EAEAF4 0%, #C8C8DC 100%)",
    color:"#2D3A8C", boxShadow:"0 3px 0 #9090A8",
    display:"flex", alignItems:"center", justifyContent:"center",
    ...extra,
  });
  const opBtn  = (bg1, bg2, sh) => ({ ...numBtn(), background:`linear-gradient(180deg,${bg1} 0%,${bg2} 100%)`, color:"#fff", boxShadow:`0 3px 0 ${sh}` });
  const fnBtn  = () => ({ ...numBtn(), background:"linear-gradient(180deg,#8888A8 0%,#606078 100%)", color:"#fff", fontSize:18, boxShadow:"0 3px 0 #383850" });
  const memBtn = () => ({ ...numBtn(), background:"linear-gradient(180deg,#C8C8F0 0%,#9898C8 100%)", color:"#2D3A8C", fontSize:16, fontWeight:800, boxShadow:"0 3px 0 #5858A0" });

  const totalStr = (total < 0 ? "−" : "") + fmt(total);
  const totalSize = totalStr.length >= 10 ? 24 : totalStr.length >= 8 ? 30 : 38;
  const inputStr  = input !== "" ? parseInt(input).toLocaleString('ja-JP') || input : "";
  const inputSize = inputStr.length >= 10 ? 18 : inputStr.length >= 8 ? 22 : 26;

  return (
    <div style={{
      display:"flex", height:"calc(100vh - 64px)",
      background:"linear-gradient(160deg, #4A5CAE 0%, #1E2860 100%)",
      borderRadius:14, overflow:"hidden",
      fontFamily:"'Helvetica Neue','Noto Sans JP',sans-serif",
    }}>

      {/* ─── 左：テープ ─── */}
      <div style={{ width:"40%", display:"flex", flexDirection:"column", background:"rgba(255,255,255,0.06)", borderRight:"1px solid rgba(255,255,255,0.12)" }}>
        <div style={{ flex:1, overflowY:"auto", background:"#FFFFFF" }}>
          {list.entries.length === 0 && (
            <div style={{ height:"100%", background:"#FFFFFF" }} />
          )}
          {list.entries.map((e, i) => (
            <div key={i} style={{
              padding:"7px 16px 7px 10px",
              textAlign:"right", fontSize:22, fontWeight:600, lineHeight:1.3,
              color: e.value < 0 ? "#D63031" : "#2D3436",
              borderBottom:"1px solid #EEF0F4",
              background: i % 2 === 0 ? "#FFFFFF" : "#F8F8FC",
            }}>
              {e.value < 0 ? `−${fmt(e.value)}` : fmt(e.value)}
            </div>
          ))}
        </div>
        <button onClick={pressAC} style={{
          height:54, border:"none", cursor:"pointer", fontSize:22, fontWeight:800,
          background:"linear-gradient(180deg,#D0D0DC 0%,#A8A8B8 100%)",
          color:"#1A202C", letterSpacing:3, boxShadow:"inset 0 1px 0 rgba(255,255,255,0.5)",
        }}>AC</button>
      </div>

      {/* ─── 右：表示 ＋ キーパッド ─── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"8px 10px 10px", gap:5 }}>

        {/* 合計 */}
        <div style={{
          background:"rgba(255,255,255,0.14)", borderRadius:10, padding:"6px 14px",
          textAlign:"right", color:"#fff",
          fontSize: totalSize, fontWeight:800, lineHeight:1, minHeight:52,
          display:"flex", alignItems:"center", justifyContent:"flex-end",
        }}>
          {totalStr}
        </div>

        {/* Listタブ */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5 }}>
          {lists.map((l, i) => (
            <button key={i} onClick={() => { setActive(i); setInput(""); }} style={{
              height:40, border:`2px solid ${active===i ? "#fff" : "rgba(255,255,255,0.25)"}`,
              borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:800,
              background: active===i ? "#fff" : "rgba(255,255,255,0.1)",
              color: active===i ? LCOLORS[i] : "rgba(255,255,255,0.8)",
            }}>{l.name}</button>
          ))}
        </div>

        {/* 現在入力値 */}
        <div style={{
          background:"rgba(0,0,0,0.3)", borderRadius:8, padding:"3px 12px",
          textAlign:"right", color:"#FFE066", fontWeight:700,
          fontSize: inputSize, minHeight:38,
          display:"flex", alignItems:"center", justifyContent:"flex-end",
        }}>
          {inputStr}
          {calcOp && <span style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginLeft:8 }}>{calcOp}</span>}
        </div>

        {/* MC / M+ / M- / 📷 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:5 }}>
          {["MC","M+","M−","📷"].map(k => (
            <button key={k} onClick={() => k!=="📷" && pressMemory(k==="M−"?"M-":k)} style={{ ...memBtn(), height:40 }}>{k}</button>
          ))}
        </div>

        {/* キーパッド（5行×4列） */}
        <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gridTemplateRows:"repeat(5,1fr)", gap:5 }}>
          {/* 行1 */}
          <button onClick={() => numPress("7")}   style={numBtn()}>7</button>
          <button onClick={() => numPress("8")}   style={numBtn()}>8</button>
          <button onClick={() => numPress("9")}   style={numBtn()}>9</button>
          <button onClick={pressSign}             style={fnBtn()}>+/−</button>
          {/* 行2 */}
          <button onClick={() => numPress("4")}   style={numBtn()}>4</button>
          <button onClick={() => numPress("5")}   style={numBtn()}>5</button>
          <button onClick={() => numPress("6")}   style={numBtn()}>6</button>
          <button onClick={() => pressMulDiv("×")} style={fnBtn()}>×</button>
          {/* 行3 */}
          <button onClick={() => numPress("1")}   style={numBtn()}>1</button>
          <button onClick={() => numPress("2")}   style={numBtn()}>2</button>
          <button onClick={() => numPress("3")}   style={numBtn()}>3</button>
          <button onClick={pressPlus}             style={opBtn("#5588EE","#2244CC","#1122AA")}>＋</button>
          {/* 行4 */}
          <button onClick={() => numPress("0")}   style={numBtn()}>0</button>
          <button onClick={() => numPress("00")}  style={numBtn()}>00</button>
          <button onClick={() => numPress(".")}   style={numBtn()}>.</button>
          <button onClick={() => pressMulDiv("÷")} style={fnBtn()}>÷</button>
          {/* 行5 */}
          <button onClick={pressUndo}             style={fnBtn()}>↶</button>
          <button onClick={pressC}                style={fnBtn()}>C</button>
          <button onClick={pressEquals}           style={opBtn("#5090E0","#2060B0","#103880")}>=</button>
          <button onClick={pressMinus}            style={opBtn("#E07060","#B04030","#702020")}>−</button>
        </div>
      </div>
    </div>
  );
}
