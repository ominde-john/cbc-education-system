import { useState } from "react";
import {
  School, BookOpen, Shirt, GraduationCap, Calculator,
  Edit2, Save, X, Plus, Download, FileText,
  TrendingUp, Users, Wallet, ChevronDown, ChevronUp,
  Music, Dumbbell, Bus, Home, Heart,
  Library, AlertCircle, CheckCircle, Layers, ArrowLeft
} from "lucide-react";

const FEE_FIELDS = [
  { key:"tuitionFee",       label:"Tuition Fee",        icon:School,        color:"#dc2626", desc:"Core learning fees per term" },
  { key:"admissionFee",     label:"Admission Fee",       icon:GraduationCap, color:"#d97706", desc:"One-time registration" },
  { key:"uniformFee",       label:"Uniform Fee",         icon:Shirt,         color:"#7c3aed", desc:"School uniform & PE kit" },
  { key:"booksNStationery", label:"Books & Stationery",  icon:BookOpen,      color:"#b45309", desc:"CBC textbooks & materials" },
  { key:"examFee",          label:"Exam / CATS Fee",     icon:FileText,      color:"#0d9488", desc:"Continuous assessment tests" },
  { key:"ictFee",           label:"ICT Fee",             icon:Calculator,    color:"#4f46e5", desc:"Computer lab & digital tools" },
  { key:"activityFee",      label:"Activity Fee",        icon:Layers,        color:"#ea580c", desc:"Clubs, trips & CBC projects" },
  { key:"sportsFee",        label:"Sports Fee",          icon:Dumbbell,      color:"#059669", desc:"Physical education & sports" },
  { key:"artsFee",          label:"Arts & Music",        icon:Music,         color:"#be185d", desc:"Performing & creative arts" },
  { key:"libraryFee",       label:"Library Fee",         icon:Library,       color:"#92400e", desc:"Reading & resource access" },
  { key:"medicalFee",       label:"Medical Fee",         icon:Heart,         color:"#dc2626", desc:"Health & first aid" },
  { key:"transportFee",     label:"Transport Fee",       icon:Bus,           color:"#0369a1", desc:"School bus (optional)" },
  { key:"boardingFee",      label:"Boarding Fee",        icon:Home,          color:"#7c3aed", desc:"Accommodation & meals" },
];

interface FeeData {
  id: string; className: string; level: string; totalStudents: number; isBoarding: boolean;
  [key: string]: any;
}

const CBC_META: Record<string, { grades: string[] }> = {
  "Lower Primary":    { grades: ["PP1","PP2","Grade 1","Grade 2","Grade 3"] },
  "Upper Primary":    { grades: ["Grade 4","Grade 5","Grade 6"] },
  "Junior Secondary": { grades: ["Grade 7","Grade 8","Grade 9"] },
  "Senior Secondary": { grades: ["Grade 10","Grade 11","Grade 12"] },
};

const LEVEL_STYLES: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
  "Lower Primary":    { bg: "#fff7ed", border: "#fed7aa", badge: "#ea580c", badgeText: "#9a3412" },
  "Upper Primary":    { bg: "#f0fdf4", border: "#bbf7d0", badge: "#16a34a", badgeText: "#166534" },
  "Junior Secondary": { bg: "#eff6ff", border: "#bfdbfe", badge: "#2563eb", badgeText: "#1e40af" },
  "Senior Secondary": { bg: "#fdf4ff", border: "#e9d5ff", badge: "#9333ea", badgeText: "#6b21a8" },
};

const SEED: FeeData[] = [
  { id:"pp1", className:"PP1",      level:"Lower Primary",    tuitionFee:8000,  admissionFee:3000, uniformFee:4500, booksNStationery:3500, activityFee:1000, transportFee:3000, boardingFee:0,     libraryFee:500,  medicalFee:800,  examFee:0,    ictFee:500,  sportsFee:500, artsFee:300, totalStudents:45,  isBoarding:false },
  { id:"pp2", className:"PP2",      level:"Lower Primary",    tuitionFee:8000,  admissionFee:3000, uniformFee:4500, booksNStationery:3500, activityFee:1000, transportFee:3000, boardingFee:0,     libraryFee:500,  medicalFee:800,  examFee:0,    ictFee:500,  sportsFee:500, artsFee:300, totalStudents:48,  isBoarding:false },
  { id:"g1",  className:"Grade 1",  level:"Lower Primary",    tuitionFee:9000,  admissionFee:3000, uniformFee:4500, booksNStationery:4000, activityFee:1200, transportFee:3000, boardingFee:0,     libraryFee:600,  medicalFee:900,  examFee:500,  ictFee:600,  sportsFee:500, artsFee:400, totalStudents:52,  isBoarding:false },
  { id:"g2",  className:"Grade 2",  level:"Lower Primary",    tuitionFee:9000,  admissionFee:3000, uniformFee:4500, booksNStationery:4000, activityFee:1200, transportFee:3000, boardingFee:0,     libraryFee:600,  medicalFee:900,  examFee:500,  ictFee:600,  sportsFee:500, artsFee:400, totalStudents:50,  isBoarding:false },
  { id:"g3",  className:"Grade 3",  level:"Lower Primary",    tuitionFee:9000,  admissionFee:3000, uniformFee:4500, booksNStationery:4000, activityFee:1200, transportFee:3000, boardingFee:0,     libraryFee:600,  medicalFee:900,  examFee:500,  ictFee:600,  sportsFee:500, artsFee:400, totalStudents:49,  isBoarding:false },
  { id:"g4",  className:"Grade 4",  level:"Upper Primary",    tuitionFee:11000, admissionFee:4000, uniformFee:5500, booksNStationery:5000, activityFee:1500, transportFee:3500, boardingFee:0,     libraryFee:800,  medicalFee:1000, examFee:800,  ictFee:800,  sportsFee:700, artsFee:500, totalStudents:55,  isBoarding:false },
  { id:"g5",  className:"Grade 5",  level:"Upper Primary",    tuitionFee:11000, admissionFee:4000, uniformFee:5500, booksNStationery:5000, activityFee:1500, transportFee:3500, boardingFee:0,     libraryFee:800,  medicalFee:1000, examFee:800,  ictFee:800,  sportsFee:700, artsFee:500, totalStudents:54,  isBoarding:false },
  { id:"g6",  className:"Grade 6",  level:"Upper Primary",    tuitionFee:12000, admissionFee:4000, uniformFee:5500, booksNStationery:5500, activityFee:1800, transportFee:3500, boardingFee:0,     libraryFee:900,  medicalFee:1100, examFee:1000, ictFee:900,  sportsFee:700, artsFee:500, totalStudents:51,  isBoarding:false },
  { id:"g7",  className:"Grade 7",  level:"Junior Secondary", tuitionFee:15000, admissionFee:5000, uniformFee:7000, booksNStationery:6500, activityFee:2000, transportFee:5000, boardingFee:0,     libraryFee:1000, medicalFee:1500, examFee:1500, ictFee:1200, sportsFee:1000,artsFee:800, totalStudents:120, isBoarding:false },
  { id:"g8",  className:"Grade 8",  level:"Junior Secondary", tuitionFee:15000, admissionFee:5000, uniformFee:7000, booksNStationery:6500, activityFee:2000, transportFee:5000, boardingFee:0,     libraryFee:1000, medicalFee:1500, examFee:1500, ictFee:1200, sportsFee:1000,artsFee:800, totalStudents:115, isBoarding:false },
  { id:"g9",  className:"Grade 9",  level:"Junior Secondary", tuitionFee:16000, admissionFee:5000, uniformFee:7000, booksNStationery:7000, activityFee:2500, transportFee:5500, boardingFee:0,     libraryFee:1200, medicalFee:1700, examFee:2000, ictFee:1400, sportsFee:1000,artsFee:800, totalStudents:108, isBoarding:false },
  { id:"g10", className:"Grade 10", level:"Senior Secondary", tuitionFee:18000, admissionFee:6000, uniformFee:8500, booksNStationery:8000, activityFee:2500, transportFee:5500, boardingFee:35000, libraryFee:1200, medicalFee:1700, examFee:2500, ictFee:1500, sportsFee:1200,artsFee:1000,totalStudents:95,  isBoarding:true  },
  { id:"g11", className:"Grade 11", level:"Senior Secondary", tuitionFee:20000, admissionFee:6000, uniformFee:8500, booksNStationery:9000, activityFee:3000, transportFee:6000, boardingFee:40000, libraryFee:1500, medicalFee:2000, examFee:3000, ictFee:1800, sportsFee:1200,artsFee:1000,totalStudents:82,  isBoarding:true  },
  { id:"g12", className:"Grade 12", level:"Senior Secondary", tuitionFee:22000, admissionFee:6000, uniformFee:8500, booksNStationery:10000,activityFee:3000, transportFee:6000, boardingFee:45000, libraryFee:1500, medicalFee:2000, examFee:4000, ictFee:2000, sportsFee:1200,artsFee:1000,totalStudents:78,  isBoarding:true  },
];

const fmt = (n: number) => `KSh ${Number(n).toLocaleString("en-KE")}`;
const termTotal  = (f: FeeData) => FEE_FIELDS.reduce((s, { key }) => s + (f[key] || 0), 0);
const annualTotal = (f: FeeData) => {
  const perTerm = ["tuitionFee","booksNStationery","activityFee","examFee","ictFee","sportsFee","artsFee","libraryFee","medicalFee","transportFee","boardingFee"];
  const once    = ["admissionFee","uniformFee"];
  return perTerm.reduce((s,k) => s+(f[k]||0)*3,0) + once.reduce((s,k) => s+(f[k]||0),0);
};

function FeeRow({ field, value }: { field: typeof FEE_FIELDS[number]; value: number }) {
  const { icon: Icon, label, color, desc } = field;
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
          <Icon size={14} color={color} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-gray-900">{label}</div>
          <div className="text-[10px] text-gray-500 mt-px">{desc}</div>
        </div>
      </div>
      <div className="text-[13px] font-bold text-gray-900 whitespace-nowrap pl-3 flex-shrink-0">{fmt(value)}</div>
    </div>
  );
}

function FeeCard({ fee, onEdit, lvl }: { fee: FeeData; onEdit: (f: FeeData) => void; lvl: { bg: string; border: string; badge: string; badgeText: string } }) {
  const [expanded, setExpanded] = useState(false);
  const tt = termTotal(fee);
  const at = annualTotal(fee);
  const activeFields = FEE_FIELDS.filter(f => fee[f.key] > 0);
  const visible = expanded ? activeFields : activeFields.slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-shadow">
      <div className="h-1 flex-shrink-0" style={{ background: lvl.badge }} />
      <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[19px] font-extrabold text-gray-900">{fee.className}</span>
              <span className="text-[10px] font-bold px-2.5 py-[3px] rounded-[20px] whitespace-nowrap" style={{ background: lvl.bg, color: lvl.badgeText, border: `1px solid ${lvl.border}` }}>{fee.level}</span>
            </div>
            <div className="flex gap-3.5 text-[11px] text-gray-600 flex-wrap">
              <span className="flex items-center gap-1"><Users size={11} /> {fee.totalStudents} students</span>
              <span className="flex items-center gap-1">{fee.isBoarding ? <Home size={11} /> : <Bus size={11} />} {fee.isBoarding ? "Boarding" : "Day School"}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Per Term</div>
            <div className="text-[22px] font-extrabold leading-none" style={{ color: lvl.badge }}>{fmt(tt)}</div>
          </div>
        </div>
      </div>
      <div className="px-5 pt-0.5 flex-1">
        {visible.map(f => <FeeRow key={f.key} field={f} value={fee[f.key] || 0} />)}
      </div>
      {activeFields.length > 5 && (
        <div className="px-5 pt-2.5 pb-1">
          <button onClick={() => setExpanded(!expanded)} className="w-full py-2 border border-gray-200 rounded-[9px] bg-gray-50 cursor-pointer text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors">
            {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> {activeFields.length - 5} more fee components</>}
          </button>
        </div>
      )}
      <div className="mx-5 my-3 bg-gray-50 rounded-[10px] p-3.5 border border-gray-200">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-semibold text-gray-600">Per Term Total</span>
          <span className="text-[15px] font-extrabold text-gray-900">{fmt(tt)}</span>
        </div>
        <div className="h-px bg-gray-200 mb-2.5" />
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-600">Annual Total <span className="text-[11px] font-normal text-gray-500">(3 terms)</span></span>
          <span className="text-[15px] font-extrabold text-red-600">{fmt(at)}</span>
        </div>
      </div>
      <div className="flex gap-2 px-5 pb-[18px]">
        <button onClick={() => onEdit(fee)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-[9px] bg-white cursor-pointer text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <Edit2 size={13} /> Edit
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-none rounded-[9px] bg-red-600 cursor-pointer text-[13px] font-bold text-white hover:bg-red-700 transition-colors">
          <Download size={13} /> Receipt
        </button>
      </div>
    </div>
  );
}

function EditModal({ fee, onSave, onCancel }: { fee: FeeData; onSave: (f: FeeData) => void; onCancel: () => void }) {
  const [form, setForm] = useState<FeeData>({ ...fee });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: Number(v) || 0 }));

  return (
    <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-[660px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-[1]">
          <div>
            <div className="text-base font-extrabold text-gray-900">Edit Fees — {fee.className}</div>
            <div className="text-xs text-gray-500 mt-0.5">All amounts in Kenya Shillings (KSh)</div>
          </div>
          <button onClick={onCancel} className="w-[34px] h-[34px] bg-gray-100 border-none cursor-pointer rounded-lg flex items-center justify-center hover:bg-gray-200">
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3.5">
            {FEE_FIELDS.map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <label className="flex items-center gap-[5px] mb-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <Icon size={11} color={color} /> {label}
                </label>
                <input type="number" value={form[key] || 0} onChange={e => set(key, e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-900 outline-none focus:border-red-500 bg-white" />
              </div>
            ))}
            <div>
              <label className="flex items-center gap-[5px] mb-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider"><Users size={11} /> Total Students</label>
              <input type="number" value={form.totalStudents || 0} onChange={e => setForm(p => ({ ...p, totalStudents: Number(e.target.value) }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-900 outline-none focus:border-red-500 bg-white" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-gray-700">
                <input type="checkbox" checked={form.isBoarding} onChange={e => setForm(p => ({ ...p, isBoarding: e.target.checked }))} className="w-4 h-4 accent-red-600" />
                Boarding School
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 p-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-[9px] bg-white cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-[2] py-2.5 border-none rounded-[9px] bg-red-600 cursor-pointer text-sm font-bold text-white flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeeStructureProps {
  onBack?: () => void;
}

export default function FeeStructure({ onBack }: FeeStructureProps) {
  const [fees, setFees]          = useState(SEED);
  const [editTarget, setEdit]    = useState<FeeData | null>(null);
  const [activeLevel, setActive] = useState("All");
  const [toast, setToast]        = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleSave = (updated: FeeData) => {
    setFees(f => f.map(x => x.id === updated.id ? updated : x));
    setEdit(null);
    notify("Fee structure updated successfully.");
  };

  const levels = ["All", ...Object.keys(CBC_META)];
  const shown  = activeLevel === "All" ? Object.keys(CBC_META) : [activeLevel];
  const totalStudents = fees.reduce((s, f) => s + f.totalStudents, 0);
  const totalRevenue  = fees.reduce((s, f) => s + termTotal(f) * f.totalStudents, 0);
  const avgFee        = fees.reduce((s, f) => s + termTotal(f), 0) / fees.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[900] bg-gray-900 text-white px-[18px] py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2.5 shadow-lg animate-fade-in">
          <CheckCircle size={16} className="text-green-400" /> {toast}
        </div>
      )}
      {editTarget && <EditModal fee={editTarget} onSave={handleSave} onCancel={() => setEdit(null)} />}

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 shadow-lg">
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
        <div className="border-b border-white/20 px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button onClick={onBack} className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-white hover:bg-white/30 transition-colors">
                <ArrowLeft size={14} />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center"><School size={15} color="white" /></div>
            <span className="text-[13px] font-bold text-white">CBC School Management</span>
            <span className="text-white/50 mx-0.5">›</span>
            <span className="text-[13px] text-white/80">Fee Structure</span>
          </div>
          <div className="flex gap-2.5">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white cursor-pointer text-xs font-semibold hover:bg-white/30 transition-colors"><FileText size={13} /> Report</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border-none rounded-lg text-red-600 cursor-pointer text-xs font-bold hover:bg-gray-100 transition-colors"><Plus size={13} /> Add Grade</button>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 pt-9 pb-[42px] relative">
          <div className="mb-[30px]">
            <div className="text-[10px] font-bold text-white/70 tracking-[0.14em] uppercase mb-2.5">Republic of Kenya · Ministry of Education · 2025</div>
            <h1 className="text-[30px] font-black text-white leading-tight mb-1.5">CBC Fee Structure</h1>
            <p className="text-sm text-white/80">Competency Based Curriculum — PP1 through Grade 12 · Academic Year 2025</p>
          </div>
          <div className="grid grid-cols-4 gap-3.5">
            {[
              { icon: School, label: "CBC Grades", value: fees.length, sub: "PP1 – Grade 12" },
              { icon: Users, label: "Total Students", value: totalStudents.toLocaleString(), sub: "Enrolled 2025" },
              { icon: Wallet, label: "Avg Term Fee", value: fmt(Math.round(avgFee)), sub: "Per student / term" },
              { icon: TrendingUp, label: "Term Revenue", value: fmt(totalRevenue), sub: "Projected" },
            ].map(s => (
              <div key={s.label} className="bg-white/20 border border-white/30 rounded-xl px-5 py-[18px] flex gap-3.5 items-center backdrop-blur-sm">
                <div className="w-11 h-11 rounded-[10px] bg-white/30 flex items-center justify-center flex-shrink-0"><s.icon size={19} color="white" /></div>
                <div>
                  <div className="text-[10px] font-bold text-white/70 tracking-widest uppercase mb-[3px]">{s.label}</div>
                  <div className="text-[21px] font-extrabold text-white leading-none">{s.value}</div>
                  {s.sub && <div className="text-[11px] text-white/70 mt-1">{s.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 flex overflow-x-auto">
          {levels.map(lvl => {
            const isActive = activeLevel === lvl;
            const color = lvl === "All" ? "#dc2626" : (LEVEL_STYLES[lvl]?.badge ?? "#dc2626");
            return (
              <button key={lvl} onClick={() => setActive(lvl)} className="px-[22px] py-[15px] border-none bg-transparent cursor-pointer text-[13px] whitespace-nowrap transition-all" style={{ fontWeight: isActive ? 700 : 500, color: isActive ? color : "#6b7280", borderBottom: `2.5px solid ${isActive ? color : "transparent"}` }}>
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-[1400px] mx-auto px-7 pt-9 pb-16">
        {shown.map(level => {
          const lvlFees = fees.filter(f => f.level === level);
          const lvl = LEVEL_STYLES[level];
          const lvlStudents = lvlFees.reduce((s, f) => s + f.totalStudents, 0);
          if (!lvlFees.length || !lvl) return null;

          return (
            <div key={level} className="mb-[52px] animate-fade-in">
              <div className="flex items-center gap-3.5 mb-[22px]">
                <div className="px-[18px] py-1.5 rounded-lg flex-shrink-0" style={{ background: lvl.bg, border: `1px solid ${lvl.border}` }}>
                  <span className="text-[13px] font-extrabold" style={{ color: lvl.badgeText }}>{level}</span>
                </div>
                <div className="h-px flex-1 bg-gray-200" />
                <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  {CBC_META[level].grades.join(" · ")} &nbsp;·&nbsp; {lvlStudents.toLocaleString()} students
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
                {lvlFees.map(fee => <FeeCard key={fee.id} fee={fee} onEdit={setEdit} lvl={lvl} />)}
              </div>
            </div>
          );
        })}

        {/* Notes */}
        <div className="bg-white border border-gray-200 rounded-[14px] p-6 flex gap-4 items-start shadow-sm">
          <div className="w-9 h-9 rounded-[9px] bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={17} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-gray-900 mb-4">Important Notes</div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
              {[
                ["Per-Term Fees", "Tuition, Books, Activity, Exams, ICT, Sports, Arts, Library, Medical & Transport are charged each term (3 terms/year)."],
                ["One-Off Fees", "Admission and Uniform fees are charged once on enrollment, not per term."],
                ["Junior Secondary", "Grade 7–9 is under Junior Secondary Schools (JSS) as per CBC transition from 8-4-4."],
                ["Bursaries", "NG-CDF bursaries apply to day schools. Boarding subsidies available for needy Senior Secondary students."],
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

