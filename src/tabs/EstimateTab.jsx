const KOUJI_OPTIONS = [
  { label:"6・10畳用",   price:20000 },
  { label:"14・18畳用",  price:25000 },
  { label:"20・23畳用",  price:30000 },
];
const OPTIONS = [
  { key:"drain",   label:"ドレン断熱",  price:3000 },
  { key:"hole",    label:"穴あけ",      price:8000 },
  { key:"extend",  label:"配管延長",    price:5000 },
  { key:"kakudai", label:"隠蔽配管",    price:50000 },
  { key:"remove",  label:"取り外し",    price:3000 },
  { key:"rack",    label:"室外機架台",  price:8000 },
  { key:"v200",    label:"200V工事",    price:20000 },
];

const calcTotal = (c) => {
  const honka = parseInt(c.honka.replace(/,/g,'')) || 0;
  const nebiki = parseInt(c.nebiki.replace(/,/g,'')) || 0;
  const koujiPrice = KOUJI_OPTIONS[c.koujiType || 0].price;
  const kouji = c.kouji ? koujiPrice : 0;
  const opts = OPTIONS.filter(o => c.options.includes(o.key)).reduce((s, o) => s + o.price, 0);
  const hosho = parseInt(c.hosho) || 0;
  return honka - nebiki + kouji + opts + hosho;
};

const fmt = (n) => n.toLocaleString('ja-JP');
const COLORS = ["#0047AA","#38A169","#D69E2E","#805AD5","#E53E3E","#DD6B20","#2C7A7B","#702459"];

const keypadTargets = { honka:"本体", nebiki:"値引", hosho:"保証", hyoji:"表示価格", sokone:"底値" };

export default function EstimateTab({
  calcs, setCalcs, activeCalc, setActiveCalc, activeField, setActiveField,
  updateCalc, toggleOption, initCalc, addCalc, removeCalc,
}) {
  const setActive = (i, field) => { setActiveCalc(i); setActiveField(field); };
  const appendKey = (key) => {
    const editable = ["honka","nebiki","hosho","hyoji","sokone"];
    if (!editable.includes(activeField)) return;
    const current = String(calcs[activeCalc]?.[activeField] || "");
    if (key === "back")  { updateCalc(activeCalc, activeField, current.slice(0, -1)); return; }
    if (key === "clear") { updateCalc(activeCalc, activeField, ""); return; }
    if (key === "reset") { setCalcs(prev => prev.map((c, idx) => idx === activeCalc ? initCalc() : c)); return; }
    updateCalc(activeCalc, activeField, `${current}${key}`);
  };
  const applyAssist = (i) => {
    const c = calcs[i];
    const hyoji = parseInt(c.hyoji) || 0;
    const sokone = parseInt(c.sokone) || 0;
    const maxBiki = (hyoji + KOUJI_OPTIONS[c.koujiType || 0].price) - sokone;
    if (maxBiki <= 0) return;
    updateCalc(i, "honka", String(hyoji));
    updateCalc(i, "nebiki", String(maxBiki));
  };

  const numberStyle = {
    height:64, borderRadius:8, border:"1px solid #CBD5E0",
    background:"#FFFFFF", color:"#2B6CB0",
    fontSize:30, fontWeight:800, cursor:"pointer",
    boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
  };
  const opStyle = { ...numberStyle, background:"#4A5568", color:"#fff", fontSize:30 };
  const smallKeyStyle = {
    height:46, borderRadius:8, border:"1px solid #CBD5E0",
    background:"#FFFFFF", color:"#2B6CB0",
    fontSize:18, fontWeight:800, cursor:"pointer",
    boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
  };
  const inputLine = (c, i, field, label, value, negative=false) => {
    const isActive = activeCalc === i && activeField === field;
    return (
      <div onClick={() => setActive(i, field)} style={{
        minHeight:68, padding:"8px 10px 6px",
        background:isActive ? "#EBF8FF" : "#FFFFFF",
        borderBottom:"1px solid #E4E7EC", cursor:"pointer",
      }}>
        <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>{label}</div>
        <input
          type="text" value={value}
          onFocus={() => setActive(i, field)}
          onChange={e => updateCalc(i, field, e.target.value.replace(/[^\d]/g, ""))}
          style={{
            width:"100%", border:"none", outline:"none", background:"transparent",
            textAlign:"right", fontSize:28, lineHeight:1.1,
            color:negative ? "#E60020" : "#1A202C", fontWeight:600,
          }}
        />
      </div>
    );
  };

  return (
    <div className="estimate-shell">
      <div className="estimate-grid" style={{
        display:"grid", gridTemplateColumns:"minmax(620px, 1fr) 420px", gap:18,
        background:"#FFFFFF", padding:16, borderRadius:16,
        border:"1px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* ─── カード列 ─── */}
        <div className="estimate-lists" style={{ display:"grid", gridTemplateColumns:`repeat(${calcs.length}, minmax(190px, 1fr))`, gap:10 }}>
          {calcs.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            const selected = activeCalc === i;
            const koujiPrice = c.kouji ? KOUJI_OPTIONS[c.koujiType || 0].price : 0;
            const selectedOptions = OPTIONS.filter(o => c.options.includes(o.key));
            const totalText = fmt(calcTotal(c));
            const totalFontSize = totalText.length >= 9 ? 20 : totalText.length >= 7 ? 24 : 28;
            return (
              <div key={i} className={`estimate-card ${selected ? "estimate-card-active" : ""}`} style={{ display:"flex", flexDirection:"column", minHeight:650 }}>
                <div onClick={() => setActiveCalc(i)} style={{
                  height:58, background:selected ? "#EBF8FF" : "#F7FAFC",
                  border:`1px solid ${selected ? color : "#E2E8F0"}`,
                  borderBottom:"none", display:"flex", alignItems:"center", justifyContent:"space-between",
                  gap:8, padding:"0 12px", cursor:"pointer", borderRadius:"10px 10px 0 0", overflow:"hidden",
                }}>
                  <input
                    value={c.label}
                    onChange={e => updateCalc(i, "label", e.target.value)}
                    placeholder={`List${i + 1}`}
                    style={{ flex:"1 1 52px", minWidth:44, border:"none", background:"transparent", outline:"none", color:"#1A202C", fontSize:16, fontWeight:800 }}
                  />
                  <div style={{ color, fontSize:totalFontSize, fontWeight:800, lineHeight:1, whiteSpace:"nowrap", flexShrink:0, textAlign:"right" }}>{totalText}</div>
                  {calcs.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); removeCalc(i); if (activeCalc >= calcs.length - 1) setActiveCalc(Math.max(0, calcs.length - 2)); }} style={{
                      marginLeft:4, width:24, height:24, borderRadius:6, border:"none",
                      background:"rgba(0,0,0,0.12)", color:"#4A5568", fontSize:13,
                      cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    }}>✕</button>
                  )}
                </div>

                <div style={{
                  flex:1, background:"#fff", border:`1px solid ${selected ? color : "#E2E8F0"}`,
                  display:"grid", gridTemplateRows:"repeat(9, minmax(64px, auto))",
                  borderRadius:"0 0 10px 10px", overflow:"hidden",
                }}>
                  {inputLine(c, i, "honka", "本体", c.honka)}
                  {inputLine(c, i, "hosho", "保証", c.hosho)}
                  <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>標準工事</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                      {KOUJI_OPTIONS.map((opt, ki) => {
                        const sel = c.kouji && c.koujiType === ki;
                        return (
                          <button key={opt.label} onClick={() => { updateCalc(i, "koujiType", ki); updateCalc(i, "kouji", true); setActiveCalc(i); }} style={{
                            border:`1px solid ${sel ? color : "#D1D5DB"}`, borderRadius:6,
                            background:sel ? "#EFF6FF" : "#fff", color:sel ? color : "#374151",
                            padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                          }}>{opt.label}</button>
                        );
                      })}
                      <button onClick={() => { updateCalc(i, "kouji", false); setActiveCalc(i); }} style={{
                        border:`1px solid ${!c.kouji ? "#E60020" : "#D1D5DB"}`, borderRadius:6,
                        background:!c.kouji ? "#FFF1F2" : "#fff", color:!c.kouji ? "#E60020" : "#374151",
                        padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                      }}>なし</button>
                    </div>
                    <div style={{ marginTop:4, textAlign:"right", fontSize:22, color:"#1A202C", fontWeight:700 }}>{koujiPrice ? fmt(koujiPrice) : ""}</div>
                  </div>
                  <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#4A5568" }}>追加工事</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                      {OPTIONS.map(opt => {
                        const on = c.options.includes(opt.key);
                        return (
                          <button key={opt.key} onClick={() => { toggleOption(i, opt.key); setActiveCalc(i); }} style={{
                            border:`1px solid ${on ? color : "#D1D5DB"}`, borderRadius:6,
                            background:on ? "#EFF6FF" : "#fff", color:on ? color : "#374151",
                            padding:"4px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                          }}>{opt.label}</button>
                        );
                      })}
                    </div>
                    <div style={{ marginTop:4, textAlign:"right", fontSize:22, color:"#1A202C", fontWeight:700 }}>
                      {selectedOptions.length ? fmt(selectedOptions.reduce((s, o) => s + o.price, 0)) : ""}
                    </div>
                  </div>
                  {inputLine(c, i, "nebiki", "値引き", c.nebiki, true)}
                  {inputLine(c, i, "hyoji", "表示価格", c.hyoji)}
                  {inputLine(c, i, "sokone", "底値", c.sokone)}
                  <div style={{ minHeight:68, padding:"8px 10px", borderBottom:"1px solid #E4E7EC" }}>
                    <button onClick={() => applyAssist(i)} style={{
                      width:"100%", height:40, border:"none", borderRadius:8,
                      background:"#276749", color:"#fff", fontWeight:900, cursor:"pointer",
                    }}>底値から値引き適用</button>
                  </div>
                  <div style={{ minHeight:68, padding:"8px 10px", textAlign:"right" }}>
                    <div style={{ color:"#E60020", fontSize:26, fontWeight:700 }}>-{fmt(parseInt(c.nebiki) || 0)}</div>
                  </div>
                </div>

                <button onClick={() => setCalcs(prev => prev.map((calc, idx) => idx === i ? initCalc() : calc))} style={{
                  marginTop:8, height:46, borderRadius:8, border:"1px solid #CBD5E0",
                  background:"#F7FAFC", color:"#2B6CB0", fontSize:22, fontWeight:900, cursor:"pointer",
                }}>AC</button>
              </div>
            );
          })}
        </div>
        {/* ＋ 追加ボタン */}
        <button onClick={addCalc} style={{
          marginTop:10, height:46, borderRadius:8, border:"2px dashed #CBD5E0",
          background:"#F7FAFC", color:"#718096", fontSize:20, fontWeight:800,
          cursor:"pointer", width:"100%", letterSpacing:2,
        }}>＋ リストを追加</button>

        {/* ─── テンキー ─── */}
        <div className="estimate-keypad" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div className="estimate-keypad-list-tabs" style={{ display:"grid", gridTemplateColumns:`repeat(${calcs.length}, 1fr)`, gap:6 }}>
            {calcs.map((_, i) => (
              <button key={i} onClick={() => setActiveCalc(i)} style={{
                ...smallKeyStyle,
                background:activeCalc === i ? "#EBF8FF" : smallKeyStyle.background,
                borderColor:activeCalc === i ? COLORS[i % COLORS.length] : "#CBD5E0",
                color:activeCalc === i ? COLORS[i % COLORS.length] : "#2B6CB0", fontSize:15,
              }}>L{i + 1}</button>
            ))}
          </div>
          <div className="estimate-keypad-field-tabs" style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, alignItems:"center" }}>
            <div style={{ fontSize:28, textAlign:"center", color:"#718096" }}>⚙</div>
            {["honka","nebiki","hosho"].map(field => (
              <button key={field} onClick={() => setActiveField(field)} style={{
                ...smallKeyStyle,
                background:activeField === field ? "#F0FFF4" : smallKeyStyle.background,
                borderColor:activeField === field ? "#38A169" : "#CBD5E0",
                color:activeField === field ? "#276749" : "#2B6CB0", fontSize:15,
              }}>{keypadTargets[field]}</button>
            ))}
            <button type="button" className="estimate-camera-key" style={{ ...smallKeyStyle, fontSize:20, cursor:"default", color:"#718096" }}>📷</button>
          </div>
          <div className="estimate-numbers" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
            {["7","8","9","4","5","6","1","2","3","0","00","back"].map(key => (
              <button key={key} onClick={() => appendKey(key)} style={numberStyle}>{key === "back" ? "⌫" : key}</button>
            ))}
            <button onClick={() => appendKey("reset")} style={opStyle}>AC</button>
            <button onClick={() => appendKey("clear")} style={opStyle}>C</button>
            <button onClick={() => appendKey("clear")} style={opStyle}>−</button>
          </div>
          <div style={{ background:"#F7FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:12, color:"#1A202C" }}>
            <div style={{ fontSize:13, fontWeight:800, marginBottom:8 }}>
              入力先：List{activeCalc + 1} / {keypadTargets[activeField]}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {["hyoji","sokone"].map(field => (
                <button key={field} onClick={() => setActiveField(field)} style={{
                  border:`1px solid ${activeField === field ? "#38A169" : "#CBD5E0"}`, borderRadius:8,
                  background:activeField === field ? "#F0FFF4" : "#FFFFFF",
                  color:activeField === field ? "#276749" : "#4A5568",
                  padding:"9px 8px", fontSize:13, fontWeight:800, cursor:"pointer",
                }}>{keypadTargets[field]}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
