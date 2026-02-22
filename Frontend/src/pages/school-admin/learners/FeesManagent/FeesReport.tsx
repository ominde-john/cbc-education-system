import { useState, useMemo } from "react";
import {
  ChevronLeft, Download, FileText, TrendingUp, TrendingDown,
  Users, Wallet, AlertCircle, CheckCircle, Calendar, ChevronDown,
  Printer, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  School, Eye, Star, Layers
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  Legend, AreaChart, Area
} from "recharts";

/* ─── TOKENS ─────────────────────────────────────────────────────────── */
const T = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  border: "#E4E7EE",
  text: { primary: "#0F1624", secondary: "#4B5568", muted: "#8A94A6" },
  accent: "#1A56DB",
  accentSoft: "#EBF0FF",
  green: "#16a34a",
  levels: {
    "Lower Primary":    { badge:"#EA580C", bg:"#FFF7ED", border:"#FB923C" },
    "Upper Primary":    { badge:"#16A34A", bg:"#F0FDF4", border:"#4ADE80" },
    "Junior Secondary": { badge:"#1D4ED8", bg:"#EFF6FF", border:"#60A5FA" },
    "Senior Secondary": { badge:"#7E22CE", bg:"#FDF4FF", border:"#C084FC" },
  } as Record<string, { badge: string; bg: string; border: string }>,
};

/* ─── TYPES ──────────────────────────────────────────────────────────── */
interface LevelStats {
  enrolled: number; fullyPaid: number; partial: number;
  unpaid: number;   collected: number; expected: number;
}
interface GradeRow {
  grade: string;  level: string;  enrolled: number; fullyPaid: number;
  partial: number; unpaid: number; collected: number; expected: number; boarding: number;
}

/* ─── DATA ───────────────────────────────────────────────────────────── */
const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];
const YEAR_OPTIONS = ["2025", "2024", "2023"];

const GRADE_DATA: GradeRow[] = [
  { grade:"PP1",      level:"Lower Primary",    enrolled:45,  fullyPaid:38, partial:5,  unpaid:2, collected:912000,  expected:1152000, boarding:0  },
  { grade:"PP2",      level:"Lower Primary",    enrolled:48,  fullyPaid:40, partial:6,  unpaid:2, collected:979200,  expected:1228800, boarding:0  },
  { grade:"Grade 1",  level:"Lower Primary",    enrolled:52,  fullyPaid:44, partial:6,  unpaid:2, collected:1085040, expected:1330560, boarding:0  },
  { grade:"Grade 2",  level:"Lower Primary",    enrolled:50,  fullyPaid:42, partial:6,  unpaid:2, collected:1020000, expected:1248000, boarding:0  },
  { grade:"Grade 3",  level:"Lower Primary",    enrolled:49,  fullyPaid:41, partial:6,  unpaid:2, collected:1029600, expected:1254400, boarding:0  },
  { grade:"Grade 4",  level:"Upper Primary",    enrolled:55,  fullyPaid:47, partial:6,  unpaid:2, collected:1540000, expected:1815000, boarding:0  },
  { grade:"Grade 5",  level:"Upper Primary",    enrolled:54,  fullyPaid:46, partial:6,  unpaid:2, collected:1512000, expected:1782000, boarding:0  },
  { grade:"Grade 6",  level:"Upper Primary",    enrolled:51,  fullyPaid:44, partial:5,  unpaid:2, collected:1479000, expected:1683000, boarding:0  },
  { grade:"Grade 7",  level:"Junior Secondary", enrolled:120, fullyPaid:98, partial:15, unpaid:7, collected:3720000, expected:4680000, boarding:0  },
  { grade:"Grade 8",  level:"Junior Secondary", enrolled:115, fullyPaid:95, partial:13, unpaid:7, collected:3565000, expected:4485000, boarding:0  },
  { grade:"Grade 9",  level:"Junior Secondary", enrolled:108, fullyPaid:88, partial:12, unpaid:8, collected:3456000, expected:4320000, boarding:0  },
  { grade:"Grade 10", level:"Senior Secondary", enrolled:95,  fullyPaid:72, partial:14, unpaid:9, collected:3562500, expected:4275000, boarding:35 },
  { grade:"Grade 11", level:"Senior Secondary", enrolled:82,  fullyPaid:61, partial:13, unpaid:8, collected:3362000, expected:3854000, boarding:40 },
  { grade:"Grade 12", level:"Senior Secondary", enrolled:78,  fullyPaid:57, partial:12, unpaid:9, collected:3315000, expected:3666000, boarding:45 },
];

const MONTHLY_TREND = [
  { month:"Jan", collected:4200000, expected:5800000 },
  { month:"Feb", collected:6800000, expected:7200000 },
  { month:"Mar", collected:8900000, expected:9500000 },
  { month:"Apr", collected:5100000, expected:6800000 },
  { month:"May", collected:7300000, expected:8100000 },
  { month:"Jun", collected:9200000, expected:9800000 },
];

const METHOD_DATA = [
  { name:"M-Pesa", value:52, color:"#7C3AED" },
  { name:"Bank",   value:28, color:"#1D4ED8"  },
  { name:"Cash",   value:12, color:"#B45309"  },
  { name:"Card",   value:8,  color:"#059669"  },
];

const DEFAULTERS_DATA = [
  { grade:"Grade 12", name:"Brian Otieno",   id:"STU003", balance:25000, days:45, status:"critical" },
  { grade:"Grade 11", name:"Lucy Waweru",    id:"STU010", balance:22000, days:38, status:"critical" },
  { grade:"Grade 10", name:"James Kariuki",  id:"STU021", balance:18000, days:32, status:"high"     },
  { grade:"Grade 9",  name:"Purity Njeri",   id:"STU006", balance:15000, days:28, status:"high"     },
  { grade:"Grade 7",  name:"Kevin Ochieng",  id:"STU033", balance:12000, days:21, status:"medium"   },
  { grade:"Grade 8",  name:"Aisha Mohamed",  id:"STU041", balance:10000, days:18, status:"medium"   },
  { grade:"Grade 6",  name:"Peter Kimani",   id:"STU052", balance:7500,  days:14, status:"low"      },
  { grade:"Grade 5",  name:"Grace Adhiambo", id:"STU061", balance:5000,  days:10, status:"low"      },
];

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const fmt  = (n: number) => `KSh ${Number(n).toLocaleString("en-KE")}`;
const fmtM = (n: number) => n >= 1000000 ? `KSh ${(n / 1000000).toFixed(1)}M` : fmt(n);
const pct  = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function getLevelSummary(data: GradeRow[]): Record<string, LevelStats> {
  const levels: Record<string, LevelStats> = {};
  data.forEach(g => {
    if (!levels[g.level]) levels[g.level] = { enrolled:0, fullyPaid:0, partial:0, unpaid:0, collected:0, expected:0 };
    const l = levels[g.level];
    l.enrolled += g.enrolled; l.fullyPaid += g.fullyPaid;
    l.partial  += g.partial;  l.unpaid    += g.unpaid;
    l.collected+= g.collected;l.expected  += g.expected;
  });
  return levels;
}

/* ─── SUBCOMPONENTS ──────────────────────────────────────────────────── */
function KPICard({ icon: Icon, label, value, sub, delta = null as number | null, valueColor = null as string | null }) {
  const isPos = delta !== null && delta > 0;
  return (
    <div style={{
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 12, padding: "20px 22px",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:"rgba(255,255,255,0.20)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={19} color="white"/>
        </div>
        {delta !== null && (
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:700, color: isPos ? "#bbf7d0" : "#fca5a5" }}>
            {isPos ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:800, color:"white", lineHeight:1, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub, icon: Icon }: { title:string; sub?:string; icon:any }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:T.accentSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={18} color={T.accent}/>
      </div>
      <div>
        <div style={{ fontSize:16, fontWeight:800, color:T.text.primary }}>{title}</div>
        {sub && <div style={{ fontSize:12, color:T.text.muted }}>{sub}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = T.accent, height = 6 }: { value:number; max:number; color?:string; height?:number }) {
  const p = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background:T.bg, borderRadius:99, overflow:"hidden", height, flex:1 }}>
      <div style={{ height:"100%", width:`${p}%`, background:color, borderRadius:99 }}/>
    </div>
  );
}

function DefaulterBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg:string; color:string; label:string }> = {
    critical: { bg:"#FEF2F2", color:"#B91C1C", label:"Critical" },
    high:     { bg:"#FFF7ED", color:"#C2410C", label:"High"     },
    medium:   { bg:"#FFFBEB", color:"#B45309", label:"Medium"   },
    low:      { bg:"#F0FDF4", color:"#15803D", label:"Low"      },
  };
  const c = cfg[status] ?? cfg.low;
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:c.bg, color:c.color }}>{c.label}</span>;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 16px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", fontSize:12 }}>
      <div style={{ fontWeight:700, color:T.text.primary, marginBottom:6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, color:T.text.secondary, marginTop:4 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:p.color }}/>
          {p.name}: <b style={{ color:T.text.primary }}>{fmtM(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function FeesReport() {
  const [term, setTerm]       = useState("Term 1");
  const [year, setYear]       = useState("2025");
  const [activeLevel, setLvl] = useState("All");

  const levelSummary = useMemo<Record<string, LevelStats>>(() => getLevelSummary(GRADE_DATA), []);

  const totalEnrolled    = GRADE_DATA.reduce((s, g) => s + g.enrolled, 0);
  const totalCollected   = GRADE_DATA.reduce((s, g) => s + g.collected, 0);
  const totalExpected    = GRADE_DATA.reduce((s, g) => s + g.expected, 0);
  const totalOutstanding = totalExpected - totalCollected;
  const totalFullyPaid   = GRADE_DATA.reduce((s, g) => s + g.fullyPaid, 0);
  const collectionRate   = pct(totalCollected, totalExpected);

  const filteredGrades = activeLevel === "All" ? GRADE_DATA : GRADE_DATA.filter(g => g.level === activeLevel);
  const barData = filteredGrades.map(g => ({
    name: g.grade.replace("Grade ", "G"),
    Collected: g.collected,
    Outstanding: g.expected - g.collected,
  }));

  const levels = ["All", "Lower Primary", "Upper Primary", "Junior Secondary", "Senior Secondary"];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        button, select { font-family:inherit; cursor:pointer; }
        select { appearance:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.3s ease both; }
        .row-hover:hover td { background:#F8FAFC !important; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:4px; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          HERO HEADER — same green as FeeManagement & FeeStructure
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(to bottom right, #166534, #16a34a, #10b981)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid watermark */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
          backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
          backgroundSize: "34px 34px",
        }} />
        {/* Glow blob */}
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.12)", filter:"blur(70px)", pointerEvents:"none" }} />

        {/* Top nav bar */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          padding: "12px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, position: "relative",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button style={{
              display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
              background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
              borderRadius:8, color:"white", fontSize:12, fontWeight:600,
            }}>
              <ChevronLeft size={14}/> Dashboard
            </button>
            <span style={{ color:"rgba(255,255,255,0.35)" }}>›</span>
            <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Fees Report</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
              background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
              borderRadius:8, color:"white", fontSize:12, fontWeight:600,
            }}>
              <Printer size={13}/> Print
            </button>
            <button style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
              background:"white", border:"none", borderRadius:8,
              color:"#16a34a", fontSize:12, fontWeight:700,
            }}>
              <Download size={13}/> Export PDF
            </button>
          </div>
        </div>

        {/* Hero body */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"36px 32px 42px", position:"relative" }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>
              Republic of Kenya · CBC School Management · Finance
            </div>
            <h1 style={{ fontSize:30, fontWeight:900, color:"white", marginBottom:6 }}>Fee Collection Report</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.65)" }}>
              Comprehensive school-wide fee management analysis · {term} {year}
            </p>
          </div>

          {/* KPI cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(185px,1fr))", gap:14 }}>
            <KPICard icon={Wallet}      label="Total Collected"  value={fmtM(totalCollected)}   sub={`${collectionRate}% collection rate`} delta={8}  />
            <KPICard icon={AlertCircle} label="Outstanding"      value={fmtM(totalOutstanding)} sub="To be collected"                      delta={-3} valueColor="#fca5a5"/>
            <KPICard icon={Users}       label="Total Enrolled"   value={totalEnrolled}           sub="All CBC grades"                                   />
            <KPICard icon={CheckCircle} label="Fully Paid"       value={totalFullyPaid}          sub={`${pct(totalFullyPaid,totalEnrolled)}% of students`} delta={5} valueColor="#bbf7d0"/>
            <KPICard icon={TrendingUp}  label="Expected Revenue" value={fmtM(totalExpected)}     sub={`${term} ${year}`}                                />
          </div>
        </div>
      </div>

      {/* ── FILTERS BAR (sticky, white) ── */}
      <div style={{
        background: T.surface, borderBottom:`1px solid ${T.border}`,
        padding: "12px 32px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, fontWeight:700, color:T.text.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginRight:4 }}>Filter:</span>

          {/* Term */}
          <div style={{ position:"relative" }}>
            <Calendar size={13} color={T.text.muted} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
            <select value={term} onChange={e => setTerm(e.target.value)} style={{ padding:"8px 28px 8px 28px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, outline:"none" }}>
              {TERM_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} color={T.text.muted} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          {/* Year */}
          <div style={{ position:"relative" }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ padding:"8px 28px 8px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, outline:"none" }}>
              {YEAR_OPTIONS.map(y => <option key={y}>{y}</option>)}
            </select>
            <ChevronDown size={12} color={T.text.muted} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          {/* Level filter pills */}
          <div style={{ display:"flex", gap:6, marginLeft:8, flexWrap:"wrap" }}>
            {levels.map(lvl => {
              const isActive = activeLevel === lvl;
              const color = lvl === "All" ? T.green : (T.levels[lvl]?.badge ?? T.green);
              return (
                <button key={lvl} onClick={() => setLvl(lvl)} style={{
                  padding:"7px 14px",
                  border:`1.5px solid ${isActive ? color : T.border}`,
                  borderRadius:8,
                  background: isActive ? `${color}12` : "white",
                  fontSize:12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : T.text.muted,
                }}>
                  {lvl === "All" ? "All Levels" : lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 24px" }}>

        {/* ROW 1: Bar chart + Pie */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, marginBottom:24 }} className="fu">
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"24px" }}>
            <SectionHeader title="Fee Collection by Grade" sub="Collected vs Outstanding" icon={BarChart2}/>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={16} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize:11, fill:T.text.muted, fontWeight:600 }} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize:11, fill:T.text.muted }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{ fontSize:12, fontWeight:600, paddingTop:16 }}/>
                <Bar dataKey="Collected"   fill="#16a34a" radius={[4,4,0,0]}/>
                <Bar dataKey="Outstanding" fill="#FCA5A5" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"24px" }}>
            <SectionHeader title="Payment Methods" sub="This term breakdown" icon={PieChart}/>
            <ResponsiveContainer width="100%" height={180}>
              <RechartsPie>
                <Pie data={METHOD_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={76} paddingAngle={3} dataKey="value">
                  {METHOD_DATA.map((m, i) => <Cell key={i} fill={m.color}/>)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`}/>
              </RechartsPie>
            </ResponsiveContainer>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 12px", marginTop:8 }}>
              {METHOD_DATA.map(m => (
                <div key={m.name} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:m.color, flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.text.primary }}>{m.name}</div>
                    <div style={{ fontSize:11, color:T.text.muted }}>{m.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Monthly trend */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"24px", marginBottom:24 }} className="fu">
          <SectionHeader title="Monthly Collection Trend" sub="Expected vs Collected over the year" icon={TrendingUp}/>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E4E7EE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E4E7EE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.text.muted, fontWeight:600 }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize:11, fill:T.text.muted }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:12, fontWeight:600 }}/>
              <Area type="monotone" dataKey="expected"  name="Expected"  stroke="#CBD5E1" strokeWidth={2}   fill="url(#expGrad)" dot={false}/>
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#16a34a" strokeWidth={2.5} fill="url(#colGrad)" dot={{ fill:"#16a34a", r:4 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ROW 3: Level cards */}
        <div style={{ marginBottom:24 }} className="fu">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Layers size={18} color="#16a34a"/>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:T.text.primary }}>Collection by CBC Level</div>
              <div style={{ fontSize:12, color:T.text.muted }}>Breakdown across all 4 curriculum levels</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:16 }}>
            {(Object.entries(levelSummary) as [string, LevelStats][]).map(([level, data]) => {
              const lvl = T.levels[level];
              const rate = pct(data.collected, data.expected);
              if (!lvl) return null;
              return (
                <div key={level} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"20px", overflow:"hidden", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:lvl.badge }}/>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, marginTop:4 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:800, color:T.text.primary, marginBottom:3 }}>{level}</div>
                      <div style={{ fontSize:11, color:T.text.muted }}>{data.enrolled} students enrolled</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:lvl.bg, color:lvl.badge, border:`1px solid ${lvl.border}` }}>
                      {rate}% paid
                    </span>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:12, color:T.text.muted }}>Collected</span>
                      <span style={{ fontSize:13, fontWeight:700, color:T.text.primary }}>{fmtM(data.collected)}</span>
                    </div>
                    <ProgressBar value={data.collected} max={data.expected} color={lvl.badge} height={7}/>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                      <span style={{ fontSize:11, color:T.text.muted }}>of {fmtM(data.expected)} expected</span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#B91C1C" }}>-{fmtM(data.expected - data.collected)}</span>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
                    {[
                      { label:"Fully Paid", value:data.fullyPaid, color:"#15803D" },
                      { label:"Partial",    value:data.partial,   color:"#B45309" },
                      { label:"Unpaid",     value:data.unpaid,    color:"#B91C1C" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:10, color:T.text.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 4: Grade table */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:24 }} className="fu">
          <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
            <SectionHeader title="Grade-by-Grade Breakdown" sub={`${filteredGrades.length} grades shown`} icon={School}/>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
              <thead>
                <tr style={{ background:T.bg, borderBottom:`1px solid ${T.border}` }}>
                  {["Grade","CBC Level","Enrolled","Fully Paid","Partial","Unpaid","Collected","Expected","Outstanding","Rate"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text.muted, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((g, i) => {
                  const rate = pct(g.collected, g.expected);
                  const outstanding = g.expected - g.collected;
                  const lvl = T.levels[g.level];
                  return (
                    <tr key={g.grade} className="row-hover" style={{ borderBottom:`1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : "#FAFBFD" }}>
                      <td style={{ padding:"13px 16px", fontWeight:700, fontSize:14, color:T.text.primary }}>{g.grade}</td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:lvl?.bg, color:lvl?.badge, border:`1px solid ${lvl?.border}`, whiteSpace:"nowrap" }}>{g.level}</span>
                      </td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color:T.text.secondary }}>{g.enrolled}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:"#15803D" }}>{g.fullyPaid}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:"#B45309" }}>{g.partial}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:"#B91C1C" }}>{g.unpaid}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:T.text.primary }}>{fmtM(g.collected)}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, color:T.text.secondary }}>{fmtM(g.expected)}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color: outstanding > 0 ? "#B91C1C" : T.text.muted }}>
                        {outstanding > 0 ? fmtM(outstanding) : "—"}
                      </td>
                      <td style={{ padding:"13px 16px", minWidth:130 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <ProgressBar value={g.collected} max={g.expected} color={rate >= 90 ? "#15803D" : rate >= 70 ? "#D97706" : "#DC2626"} height={6}/>
                          <span style={{ fontSize:12, fontWeight:700, color: rate >= 90 ? "#15803D" : rate >= 70 ? "#D97706" : "#DC2626", minWidth:34 }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background:"#f0fdf4", borderTop:`2px solid #16a34a30` }}>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:"#16a34a" }} colSpan={2}>TOTAL — All Grades</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:T.text.primary }}>{totalEnrolled}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:"#15803D" }}>{totalFullyPaid}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:"#B45309" }}>{GRADE_DATA.reduce((s,g) => s+g.partial, 0)}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:"#B91C1C" }}>{GRADE_DATA.reduce((s,g) => s+g.unpaid, 0)}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:T.text.primary }}>{fmtM(totalCollected)}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:T.text.secondary }}>{fmtM(totalExpected)}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:"#B91C1C" }}>{fmtM(totalOutstanding)}</td>
                  <td style={{ padding:"14px 16px", minWidth:130 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <ProgressBar value={totalCollected} max={totalExpected} color="#16a34a" height={6}/>
                      <span style={{ fontSize:12, fontWeight:800, color:"#16a34a" }}>{collectionRate}%</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ROW 5: Defaulters + Insights */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, marginBottom:24 }} className="fu">
          {/* Defaulters */}
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <SectionHeader title="Top Defaulters" sub="Highest outstanding balances" icon={AlertCircle}/>
              <button style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", border:`1px solid ${T.border}`, borderRadius:8, background:"white", fontSize:12, fontWeight:600, color:T.text.secondary }}>
                <Eye size={13}/> View All
              </button>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:T.bg, borderBottom:`1px solid ${T.border}` }}>
                  {["Student","Grade","Outstanding","Days Overdue","Risk"].map(h => (
                    <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.text.muted, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEFAULTERS_DATA.map((d, i) => (
                  <tr key={i} className="row-hover" style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text.primary }}>{d.name}</div>
                      <div style={{ fontSize:11, color:T.text.muted }}>{d.id}</div>
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:13, color:T.text.secondary, fontWeight:500 }}>{d.grade}</td>
                    <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#B91C1C" }}>{fmt(d.balance)}</td>
                    <td style={{ padding:"12px 16px", fontSize:13, color:T.text.secondary }}>{d.days}d</td>
                    <td style={{ padding:"12px 16px" }}><DefaulterBadge status={d.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights + Quick stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"20px" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text.primary, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                <Star size={15} color="#D97706"/> Key Insights
              </div>
              {[
                { icon:TrendingUp,   color:"#15803D", bg:"#F0FDF4", text:`Collection rate is ${collectionRate}% — up 8% from last term.` },
                { icon:AlertCircle,  color:"#B91C1C", bg:"#FEF2F2", text:`${GRADE_DATA.reduce((s,g)=>s+g.unpaid,0)} students have not paid any fees this term.` },
                { icon:CheckCircle,  color:"#1D4ED8", bg:"#EFF6FF", text:"M-Pesa dominates at 52% of all payments." },
                { icon:TrendingDown, color:"#B45309", bg:"#FFF7ED", text:"Senior Secondary holds the highest outstanding balance." },
              ].map(({ icon: Icon, color, bg, text }, i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:10, background:bg, marginBottom:8 }}>
                  <Icon size={14} color={color} style={{ flexShrink:0, marginTop:1 }}/>
                  <span style={{ fontSize:12, color, fontWeight:600, lineHeight:1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"20px" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text.primary, marginBottom:14 }}>Quick Stats</div>
              {[
                { label:"Boarding Students",  value:"255",       sub:"Grades 10–12" },
                { label:"Day Scholars",        value:String(totalEnrolled - 255), sub:"PP1 – Grade 9" },
                { label:"Avg Fee / Student",   value:"KSh 32,400",sub:"Per term" },
                { label:"NG-CDF Applications", value:"38",        sub:"Pending review" },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text.primary }}>{label}</div>
                    <div style={{ fontSize:11, color:T.text.muted }}>{sub}</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#16a34a" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"20px 24px", display:"flex", gap:14 }} className="fu">
          <div style={{ width:36, height:36, borderRadius:9, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <FileText size={17} color="#16a34a"/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text.primary, marginBottom:6 }}>Report Notes</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:"4px 24px", fontSize:12, color:T.text.muted, lineHeight:1.7 }}>
              <span>• Data shown for {term} {year}. Collection rates are live as of today.</span>
              <span>• "Expected" figures are based on the published CBC fee structure per grade.</span>
              <span>• Boarding fees for Grade 10–12 are included in Senior Secondary totals.</span>
              <span>• Outstanding amounts include both partial payers and non-payers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}