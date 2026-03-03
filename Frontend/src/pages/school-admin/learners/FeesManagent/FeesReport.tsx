import { useState, useMemo } from "react";
import {
  Download, TrendingUp, TrendingDown,
  Users, Wallet, AlertCircle, CheckCircle, Calendar, ChevronDown,
  Printer, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  School, Eye, Star, Layers, ArrowLeft
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  Legend, AreaChart, Area
} from "recharts";

interface GradeRow {
  grade: string; level: string; enrolled: number; fullyPaid: number;
  partial: number; unpaid: number; collected: number; expected: number; boarding: number;
}
interface LevelStats {
  enrolled: number; fullyPaid: number; partial: number;
  unpaid: number; collected: number; expected: number;
}

const LEVEL_STYLES: Record<string, { badge: string; bg: string; border: string; badgeText: string }> = {
  "Lower Primary":    { badge:"#ea580c", bg:"#fff7ed", border:"#fed7aa", badgeText:"#9a3412" },
  "Upper Primary":    { badge:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", badgeText:"#166534" },
  "Junior Secondary": { badge:"#2563eb", bg:"#eff6ff", border:"#bfdbfe", badgeText:"#1e40af" },
  "Senior Secondary": { badge:"#9333ea", bg:"#fdf4ff", border:"#e9d5ff", badgeText:"#6b21a8" },
};

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
  { name:"M-Pesa", value:52, color:"#7c3aed" },
  { name:"Bank",   value:28, color:"#2563eb" },
  { name:"Cash",   value:12, color:"#b45309" },
  { name:"Card",   value:8,  color:"#059669" },
];

const DEFAULTERS_DATA = [
  { grade:"Grade 12", name:"Brian Otieno",   id:"STU003", balance:25000, days:45, status:"critical" },
  { grade:"Grade 11", name:"Lucy Waweru",    id:"STU010", balance:22000, days:38, status:"critical" },
  { grade:"Grade 10", name:"James Kariuki",  id:"STU021", balance:18000, days:32, status:"high" },
  { grade:"Grade 9",  name:"Purity Njeri",   id:"STU006", balance:15000, days:28, status:"high" },
  { grade:"Grade 7",  name:"Kevin Ochieng",  id:"STU033", balance:12000, days:21, status:"medium" },
  { grade:"Grade 8",  name:"Aisha Mohamed",  id:"STU041", balance:10000, days:18, status:"medium" },
  { grade:"Grade 6",  name:"Peter Kimani",   id:"STU052", balance:7500,  days:14, status:"low" },
  { grade:"Grade 5",  name:"Grace Adhiambo", id:"STU061", balance:5000,  days:10, status:"low" },
];

const fmt  = (n: number) => `KSh ${Number(n).toLocaleString("en-KE")}`;
const fmtM = (n: number) => n >= 1000000 ? `KSh ${(n / 1000000).toFixed(1)}M` : fmt(n);
const pct  = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function getLevelSummary(data: GradeRow[]): Record<string, LevelStats> {
  const levels: Record<string, LevelStats> = {};
  data.forEach(g => {
    if (!levels[g.level]) levels[g.level] = { enrolled:0, fullyPaid:0, partial:0, unpaid:0, collected:0, expected:0 };
    const l = levels[g.level];
    l.enrolled += g.enrolled; l.fullyPaid += g.fullyPaid;
    l.partial += g.partial; l.unpaid += g.unpaid;
    l.collected += g.collected; l.expected += g.expected;
  });
  return levels;
}

function ProgressBar({ value, max, color = "#dc2626", height = 6 }: { value: number; max: number; color?: string; height?: number }) {
  const p = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="bg-gray-200 rounded-full overflow-hidden flex-1" style={{ height }}>
      <div className="h-full rounded-full" style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

function DefaulterBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    critical: { cls: "bg-red-100 text-red-700", label: "Critical" },
    high:     { cls: "bg-orange-100 text-orange-700", label: "High" },
    medium:   { cls: "bg-amber-100 text-amber-700", label: "Medium" },
    low:      { cls: "bg-green-100 text-green-700", label: "Low" },
  };
  const c = cfg[status] ?? cfg.low;
  return <span className={`text-[11px] font-bold px-2 py-[3px] rounded-[20px] ${c.cls}`}>{c.label}</span>;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-[10px] p-3 shadow-lg text-xs">
      <div className="font-bold text-gray-900 mb-1.5">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-gray-700 mt-1">
          <div className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
          {p.name}: <b className="text-gray-900">{fmtM(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

interface FeesReportProps {
  onBack?: () => void;
}

export default function FeesReport({ onBack }: FeesReportProps) {
  const [term, setTerm]       = useState("Term 1");
  const [year, setYear]       = useState("2025");
  const [activeLevel, setLvl] = useState("All");

  const levelSummary = useMemo(() => getLevelSummary(GRADE_DATA), []);

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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 shadow-lg">
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
        <div className="border-b border-white/20 px-8 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button onClick={onBack} className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-white hover:bg-white/30 transition-colors">
                <ArrowLeft size={14} />
              </button>
            )}
            <span className="text-[13px] font-bold text-white">Fees Report</span>
          </div>
          <div className="flex gap-2.5">
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs font-semibold hover:bg-white/30 transition-colors cursor-pointer"><Printer size={13} /> Print</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border-none rounded-lg text-red-600 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"><Download size={13} /> Export PDF</button>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 pt-9 pb-[42px] relative">
          <div className="mb-7">
            <div className="text-[10px] font-bold text-white/70 tracking-[0.14em] uppercase mb-2">Republic of Kenya · CBC School Management · Finance</div>
            <h1 className="text-[30px] font-black text-white mb-1.5">Fee Collection Report</h1>
            <p className="text-sm text-white/80">Comprehensive school-wide fee management analysis · {term} {year}</p>
          </div>
          <div className="grid grid-cols-5 gap-3.5">
            {[
              { icon: Wallet, label: "Total Collected", value: fmtM(totalCollected), sub: `${collectionRate}% collection rate`, delta: 8 },
              { icon: AlertCircle, label: "Outstanding", value: fmtM(totalOutstanding), sub: "To be collected", delta: -3, valueColor: "#fca5a5" },
              { icon: Users, label: "Total Enrolled", value: totalEnrolled, sub: "All CBC grades" },
              { icon: CheckCircle, label: "Fully Paid", value: totalFullyPaid, sub: `${pct(totalFullyPaid, totalEnrolled)}% of students`, delta: 5, valueColor: "#bbf7d0" },
              { icon: TrendingUp, label: "Expected Revenue", value: fmtM(totalExpected), sub: `${term} ${year}` },
            ].map(s => (
              <div key={s.label} className="bg-white/20 border border-white/30 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3.5">
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-white/30 flex items-center justify-center"><s.icon size={19} color="white" /></div>
                  {s.delta !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${s.delta > 0 ? 'text-green-200' : 'text-red-200'}`}>
                      {s.delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(s.delta)}%
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-2xl font-extrabold leading-none mb-1" style={{ color: s.valueColor || "white" }}>{s.value}</div>
                {s.sub && <div className="text-[11px] text-white/70">{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Filter:</span>
          {[
            { value: term, setter: setTerm, options: ["Term 1","Term 2","Term 3"], icon: Calendar },
            { value: year, setter: setYear, options: ["2025","2024","2023"] },
          ].map((f, i) => (
            <div key={i} className="relative">
              {f.icon && <f.icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />}
              <select value={f.value} onChange={e => f.setter(e.target.value)} className={`py-2 pr-7 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white cursor-pointer outline-none appearance-none ${f.icon ? 'pl-7' : 'pl-3'}`}>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          ))}
          <div className="flex gap-1.5 ml-2 flex-wrap">
            {levels.map(lvl => {
              const isActive = activeLevel === lvl;
              const color = lvl === "All" ? "#dc2626" : (LEVEL_STYLES[lvl]?.badge ?? "#dc2626");
              return (
                <button key={lvl} onClick={() => setLvl(lvl)} className={`px-3.5 py-[7px] rounded-lg text-xs cursor-pointer transition-all ${isActive ? 'font-bold' : 'font-medium'}`} style={{ border: `1.5px solid ${isActive ? color : '#e5e7eb'}`, background: isActive ? `${color}15` : 'white', color: isActive ? color : '#6b7280' }}>
                  {lvl === "All" ? "All Levels" : lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-7">
        {/* Charts */}
        <div className="grid grid-cols-[1fr_320px] gap-5 mb-6 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-red-100 flex items-center justify-center"><BarChart2 size={18} className="text-red-600" /></div>
              <div><div className="text-base font-extrabold text-gray-900">Fee Collection by Grade</div><div className="text-xs text-gray-500">Collected vs Outstanding</div></div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={16} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 16 }} />
                <Bar dataKey="Collected" fill="#dc2626" radius={[4,4,0,0]} />
                <Bar dataKey="Outstanding" fill="#fca5a5" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-amber-100 flex items-center justify-center"><PieChart size={18} className="text-amber-600" /></div>
              <div><div className="text-base font-extrabold text-gray-900">Payment Methods</div><div className="text-xs text-gray-500">This term breakdown</div></div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RechartsPie>
                <Pie data={METHOD_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={76} paddingAngle={3} dataKey="value">
                  {METHOD_DATA.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {METHOD_DATA.map(m => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color }} />
                  <div><div className="text-xs font-bold text-gray-900">{m.name}</div><div className="text-[11px] text-gray-500">{m.value}%</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-6 mb-6 animate-fade-in shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-red-100 flex items-center justify-center"><TrendingUp size={18} className="text-red-600" /></div>
            <div><div className="text-base font-extrabold text-gray-900">Monthly Collection Trend</div><div className="text-xs text-gray-500">Expected vs Collected over the year</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              <Area type="monotone" dataKey="expected" name="Expected" stroke="#9ca3af" strokeWidth={2} fill="url(#expGrad)" dot={false} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#dc2626" strokeWidth={2.5} fill="url(#colGrad)" dot={{ fill: "#dc2626", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Level cards */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-[18px]">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-red-100 flex items-center justify-center"><Layers size={18} className="text-red-600" /></div>
            <div><div className="text-base font-extrabold text-gray-900">Collection by CBC Level</div><div className="text-xs text-gray-500">Breakdown across all 4 curriculum levels</div></div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {(Object.entries(levelSummary) as [string, LevelStats][]).map(([level, data]) => {
              const lvl = LEVEL_STYLES[level];
              const rate = pct(data.collected, data.expected);
              if (!lvl) return null;
              return (
                <div key={level} className="bg-white border border-gray-200 rounded-[14px] p-5 overflow-hidden relative shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: lvl.badge }} />
                  <div className="flex justify-between items-start mb-3.5 mt-1">
                    <div>
                      <div className="text-sm font-extrabold text-gray-900 mb-[3px]">{level}</div>
                      <div className="text-[11px] text-gray-500">{data.enrolled} students enrolled</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-[20px]" style={{ background: lvl.bg, color: lvl.badgeText, border: `1px solid ${lvl.border}` }}>{rate}% paid</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-gray-600">Collected</span>
                      <span className="text-[13px] font-bold text-gray-900">{fmtM(data.collected)}</span>
                    </div>
                    <ProgressBar value={data.collected} max={data.expected} color={lvl.badge} height={7} />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-gray-500">of {fmtM(data.expected)} expected</span>
                      <span className="text-[11px] font-semibold text-red-600">-{fmtM(data.expected - data.collected)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    {[
                      { label: "Fully Paid", value: data.fullyPaid, color: "#16a34a" },
                      { label: "Partial", value: data.partial, color: "#d97706" },
                      { label: "Unpaid", value: data.unpaid, color: "#dc2626" },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade table */}
        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden mb-6 animate-fade-in shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-amber-100 flex items-center justify-center"><School size={18} className="text-amber-600" /></div>
            <div><div className="text-base font-extrabold text-gray-900">Grade-by-Grade Breakdown</div><div className="text-xs text-gray-500">{filteredGrades.length} grades shown</div></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Grade","CBC Level","Enrolled","Fully Paid","Partial","Unpaid","Collected","Expected","Outstanding","Rate"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((g, i) => {
                  const rate = pct(g.collected, g.expected);
                  const outstanding = g.expected - g.collected;
                  const lvl = LEVEL_STYLES[g.level];
                  return (
                    <tr key={g.grade} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" style={{ background: i % 2 === 0 ? undefined : '#f9fafb' }}>
                      <td className="px-4 py-3 font-bold text-sm text-gray-900">{g.grade}</td>
                      <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-[3px] rounded-[20px] whitespace-nowrap" style={{ background: lvl?.bg, color: lvl?.badgeText, border: `1px solid ${lvl?.border}` }}>{g.level}</span></td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-gray-700">{g.enrolled}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-green-600">{g.fullyPaid}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-amber-600">{g.partial}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-red-600">{g.unpaid}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-gray-900">{fmtM(g.collected)}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{fmtM(g.expected)}</td>
                      <td className={`px-4 py-3 text-[13px] font-semibold ${outstanding > 0 ? 'text-red-600' : 'text-gray-500'}`}>{outstanding > 0 ? fmtM(outstanding) : "—"}</td>
                      <td className="px-4 py-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={g.collected} max={g.expected} color={rate >= 90 ? "#16a34a" : rate >= 70 ? "#d97706" : "#dc2626"} height={6} />
                          <span className="text-xs font-bold min-w-[34px]" style={{ color: rate >= 90 ? "#16a34a" : rate >= 70 ? "#d97706" : "#dc2626" }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-red-50 border-t-2 border-red-200">
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-red-700" colSpan={2}>TOTAL — All Grades</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-gray-900">{totalEnrolled}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-green-600">{totalFullyPaid}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-amber-600">{GRADE_DATA.reduce((s,g) => s+g.partial, 0)}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-red-600">{GRADE_DATA.reduce((s,g) => s+g.unpaid, 0)}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-gray-900">{fmtM(totalCollected)}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-gray-600">{fmtM(totalExpected)}</td>
                  <td className="px-4 py-3.5 text-[13px] font-extrabold text-red-600">{fmtM(totalOutstanding)}</td>
                  <td className="px-4 py-3.5 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={totalCollected} max={totalExpected} color="#dc2626" height={6} />
                      <span className="text-xs font-extrabold text-red-600">{collectionRate}%</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Defaulters + Insights */}
        <div className="grid grid-cols-[1fr_300px] gap-5 mb-6 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-red-100 flex items-center justify-center"><AlertCircle size={18} className="text-red-600" /></div>
                <div><div className="text-base font-extrabold text-gray-900">Top Defaulters</div><div className="text-xs text-gray-500">Highest outstanding balances</div></div>
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-[7px] border border-gray-200 rounded-lg bg-white text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"><Eye size={13} /> View All</button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Student","Grade","Outstanding","Days Overdue","Risk"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEFAULTERS_DATA.map((d, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><div className="text-[13px] font-bold text-gray-900">{d.name}</div><div className="text-[11px] text-gray-500">{d.id}</div></td>
                    <td className="px-4 py-3 text-[13px] text-gray-600 font-medium">{d.grade}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-red-600">{fmt(d.balance)}</td>
                    <td className="px-4 py-3 text-[13px] text-gray-600">{d.days}d</td>
                    <td className="px-4 py-3"><DefaulterBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="bg-white border border-gray-200 rounded-[14px] p-5 shadow-sm">
              <div className="text-sm font-extrabold text-gray-900 mb-3.5 flex items-center gap-2"><Star size={15} className="text-amber-500" /> Key Insights</div>
              {[
                { icon: TrendingUp, color: "#16a34a", bg: "bg-green-100", text: `Collection rate is ${collectionRate}% — up 8% from last term.` },
                { icon: AlertCircle, color: "#dc2626", bg: "bg-red-100", text: `${GRADE_DATA.reduce((s,g) => s+g.unpaid, 0)} students have not paid any fees this term.` },
                { icon: CheckCircle, color: "#2563eb", bg: "bg-blue-100", text: "M-Pesa dominates at 52% of all payments." },
                { icon: TrendingDown, color: "#d97706", bg: "bg-amber-100", text: "Senior Secondary holds the highest outstanding balance." },
              ].map(({ icon: Icon, color, bg, text }, i) => (
                <div key={i} className={`flex gap-2.5 p-2.5 rounded-[10px] ${bg} mb-2`}>
                  <Icon size={14} color={color} className="flex-shrink-0 mt-px" />
                  <span className="text-xs font-semibold leading-relaxed" style={{ color }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-[14px] p-5 shadow-sm">
              <div className="text-sm font-extrabold text-gray-900 mb-3.5">Quick Stats</div>
              {[
                { label: "Boarding Students", value: "255", sub: "Grades 10–12" },
                { label: "Day Scholars", value: String(totalEnrolled - 255), sub: "PP1 – Grade 9" },
                { label: "Avg Fee / Student", value: "KSh 32,400", sub: "Per term" },
                { label: "NG-CDF Applications", value: "38", sub: "Pending review" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div><div className="text-xs font-semibold text-gray-900">{label}</div><div className="text-[11px] text-gray-500">{sub}</div></div>
                  <div className="text-[15px] font-extrabold text-red-600">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-5 flex gap-3.5 animate-fade-in shadow-sm">
          <div className="w-9 h-9 rounded-[9px] bg-red-100 flex items-center justify-center flex-shrink-0"><AlertCircle size={17} className="text-red-600" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-gray-900 mb-4">Report Notes</div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
              {[
                ["Data Source", "Figures are based on recorded payments in the fee management system for the selected period."],
                ["Outstanding", "Outstanding amounts include both partial payments and completely unpaid students."],
                ["Boarding Fees", "Boarding fees apply only to Senior Secondary (Grades 10–12) and are included in totals."],
                ["Disclaimer", "This report is auto-generated. For official financial statements, contact the school bursar."],
              ].map(([title, body]) => (
                <div key={title}>
                  <div className="text-xs font-bold text-gray-900 mb-1">{title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

