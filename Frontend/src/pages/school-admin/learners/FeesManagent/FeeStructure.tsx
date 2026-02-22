import { useState } from "react";
import {
  School, BookOpen, Shirt, GraduationCap, Calculator,
  Edit2, Save, X, Plus, Download, FileText,
  TrendingUp, Users, Wallet, ChevronDown, ChevronUp,
  Music, Dumbbell, Bus, Home, Heart,
  Library, AlertCircle, CheckCircle, Layers
} from "lucide-react";

const TOKENS = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  border: "#E4E7EE",
  text: { primary: "#0F1624", secondary: "#4B5568", muted: "#8A94A6" },
  accent: "#1A56DB",
  accentSoft: "#EBF0FF",
  levels: {
    "Lower Primary":    { bg: "#FFF7ED", border: "#FB923C", badge: "#EA580C" },
    "Upper Primary":    { bg: "#F0FDF4", border: "#4ADE80", badge: "#16A34A" },
    "Junior Secondary": { bg: "#EFF6FF", border: "#60A5FA", badge: "#1D4ED8" },
    "Senior Secondary": { bg: "#FDF4FF", border: "#C084FC", badge: "#7E22CE" },
  },
};

const CBC_META = {
  "Lower Primary":    { grades: ["PP1","PP2","Grade 1","Grade 2","Grade 3"] },
  "Upper Primary":    { grades: ["Grade 4","Grade 5","Grade 6"] },
  "Junior Secondary": { grades: ["Grade 7","Grade 8","Grade 9"] },
  "Senior Secondary": { grades: ["Grade 10","Grade 11","Grade 12"] },
};

const FEE_FIELDS = [
  { key:"tuitionFee",       label:"Tuition Fee",        icon:School,        color:"#1A56DB", desc:"Core learning fees per term" },
  { key:"admissionFee",     label:"Admission Fee",       icon:GraduationCap, color:"#0891B2", desc:"One-time registration" },
  { key:"uniformFee",       label:"Uniform Fee",         icon:Shirt,         color:"#7C3AED", desc:"School uniform & PE kit" },
  { key:"booksNStationery", label:"Books & Stationery",  icon:BookOpen,      color:"#B45309", desc:"CBC textbooks & materials" },
  { key:"examFee",          label:"Exam / CATS Fee",     icon:FileText,      color:"#0F766E", desc:"Continuous assessment tests" },
  { key:"ictFee",           label:"ICT Fee",             icon:Calculator,    color:"#4338CA", desc:"Computer lab & digital tools" },
  { key:"activityFee",      label:"Activity Fee",        icon:Layers,        color:"#D97706", desc:"Clubs, trips & CBC projects" },
  { key:"sportsFee",        label:"Sports Fee",          icon:Dumbbell,      color:"#059669", desc:"Physical education & sports" },
  { key:"artsFee",          label:"Arts & Music",        icon:Music,         color:"#BE185D", desc:"Performing & creative arts" },
  { key:"libraryFee",       label:"Library Fee",         icon:Library,       color:"#92400E", desc:"Reading & resource access" },
  { key:"medicalFee",       label:"Medical Fee",         icon:Heart,         color:"#DC2626", desc:"Health & first aid" },
  { key:"transportFee",     label:"Transport Fee",       icon:Bus,           color:"#0369A1", desc:"School bus (optional)" },
  { key:"boardingFee",      label:"Boarding Fee",        icon:Home,          color:"#6D28D9", desc:"Accommodation & meals" },
];

const SEED = [
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

const fmt = (n) => `KSh ${Number(n).toLocaleString("en-KE")}`;
const termTotal  = (f) => FEE_FIELDS.reduce((s, { key }) => s + (f[key] || 0), 0);
const annualTotal = (f) => {
  const perTerm = ["tuitionFee","booksNStationery","activityFee","examFee","ictFee","sportsFee","artsFee","libraryFee","medicalFee","transportFee","boardingFee"];
  const once    = ["admissionFee","uniformFee"];
  return perTerm.reduce((s,k) => s+(f[k]||0)*3,0) + once.reduce((s,k) => s+(f[k]||0),0);
};

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 12, padding: "18px 20px",
      display: "flex", gap: 14, alignItems: "center",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: "rgba(255,255,255,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={19} color="white" />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 21, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Single fee row in card ────────────────────────────────────────────────────
function FeeRow({ field, value }) {
  const { icon: Icon, label, color, desc } = field;
  if (!value) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: `1px solid ${TOKENS.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={14} color={color} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.text.primary }}>{label}</div>
          <div style={{ fontSize: 10, color: TOKENS.text.muted, marginTop: 1 }}>{desc}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TOKENS.text.primary, whiteSpace: "nowrap", paddingLeft: 12, flexShrink: 0 }}>
        {fmt(value)}
      </div>
    </div>
  );
}

// ── Fee Card ─────────────────────────────────────────────────────────────────
function FeeCard({ fee, onEdit, lvl }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const tt = termTotal(fee);
  const at = annualTotal(fee);
  const activeFields = FEE_FIELDS.filter(f => fee[f.key] > 0);
  const visible = expanded ? activeFields : activeFields.slice(0, 5);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered ? "0 8px 28px rgba(15,22,36,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Colour stripe */}
      <div style={{ height: 4, background: lvl.badge, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${TOKENS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 19, fontWeight: 800, color: TOKENS.text.primary }}>{fee.className}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: lvl.bg, color: lvl.badge, border: `1px solid ${lvl.border}`, whiteSpace: "nowrap",
              }}>
                {fee.level}
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: TOKENS.text.muted, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={11} /> {fee.totalStudents} students</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {fee.isBoarding ? <Home size={11} /> : <Bus size={11} />}
                {fee.isBoarding ? "Boarding" : "Day School"}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: TOKENS.text.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Per Term</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: lvl.badge, lineHeight: 1 }}>{fmt(tt)}</div>
          </div>
        </div>
      </div>

      {/* Fee rows */}
      <div style={{ padding: "2px 20px 0", flex: 1 }}>
        {visible.map(f => <FeeRow key={f.key} field={f} value={fee[f.key] || 0} />)}
      </div>

      {/* Expand toggle */}
      {activeFields.length > 5 && (
        <div style={{ padding: "10px 20px 4px" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "100%", padding: "9px", border: `1px solid ${TOKENS.border}`,
              borderRadius: 9, background: TOKENS.bg, cursor: "pointer",
              fontSize: 12, fontWeight: 600, color: TOKENS.text.secondary,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {expanded
              ? <><ChevronUp size={13} /> Show less</>
              : <><ChevronDown size={13} /> {activeFields.length - 5} more fee components</>}
          </button>
        </div>
      )}

      {/* Totals box */}
      <div style={{ margin: "12px 20px 16px", background: TOKENS.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${TOKENS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TOKENS.text.secondary }}>Per Term Total</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: TOKENS.text.primary }}>{fmt(tt)}</span>
        </div>
        <div style={{ height: 1, background: TOKENS.border, marginBottom: 10 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TOKENS.text.secondary }}>
            Annual Total <span style={{ fontSize: 11, fontWeight: 400, color: TOKENS.text.muted }}>(3 terms)</span>
          </span>
          <span style={{ fontSize: 15, fontWeight: 800, color: TOKENS.accent }}>{fmt(at)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 18px" }}>
        <button
          onClick={() => onEdit(fee)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px", border: `1px solid ${TOKENS.border}`, borderRadius: 9,
            background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: TOKENS.text.secondary,
          }}
        >
          <Edit2 size={13} /> Edit
        </button>
        <button
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px", border: "none", borderRadius: 9, background: TOKENS.accent,
            cursor: "pointer", fontSize: 13, fontWeight: 700, color: "white",
          }}
        >
          <Download size={13} /> Receipt
        </button>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ fee, onSave, onCancel }) {
  const [form, setForm] = useState({ ...fee });
  const set = (k, v) => setForm(p => ({ ...p, [k]: Number(v) || 0 }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,22,36,0.62)",
      zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "white", borderRadius: 16, width: "100%", maxWidth: 660,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", borderBottom: `1px solid ${TOKENS.border}`,
          position: "sticky", top: 0, background: "white", zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text.primary }}>Edit Fees — {fee.className}</div>
            <div style={{ fontSize: 12, color: TOKENS.text.muted, marginTop: 2 }}>All amounts in Kenya Shillings (KSh)</div>
          </div>
          <button onClick={onCancel} style={{ width: 34, height: 34, background: TOKENS.bg, border: "none", cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color={TOKENS.text.secondary} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            {FEE_FIELDS.map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <label style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, fontSize: 11, fontWeight: 700, color: TOKENS.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <Icon size={11} color={color} /> {label}
                </label>
                <input
                  type="number" value={form[key] || 0} onChange={e => set(key, e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${TOKENS.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: TOKENS.text.primary, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = TOKENS.accent}
                  onBlur={e => e.target.style.borderColor = TOKENS.border}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, fontSize: 11, fontWeight: 700, color: TOKENS.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Users size={11} color="#6B7280" /> Total Students
              </label>
              <input
                type="number" value={form.totalStudents || 0}
                onChange={e => setForm(p => ({ ...p, totalStudents: Number(e.target.value) }))}
                style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${TOKENS.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: TOKENS.text.primary, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: TOKENS.text.secondary }}>
                <input type="checkbox" checked={form.isBoarding} onChange={e => setForm(p => ({ ...p, isBoarding: e.target.checked }))} style={{ width: 16, height: 16, accentColor: TOKENS.accent }} />
                Boarding School
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: `1px solid ${TOKENS.border}`, position: "sticky", bottom: 0, background: "white" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1px solid ${TOKENS.border}`, borderRadius: 9, background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, color: TOKENS.text.secondary }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)} style={{ flex: 2, padding: "11px", border: "none", borderRadius: 9, background: TOKENS.accent, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
export default function CBCFeeStructure() {
  const [fees, setFees]          = useState(SEED);
  const [editTarget, setEdit]    = useState(null);
  const [activeLevel, setActive] = useState("All");
  const [toast, setToast]        = useState(null);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleSave = (updated) => {
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
    <div style={{ minHeight: "100vh", background: TOKENS.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button, input { font-family: inherit; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-card { animation: fadeUp 0.25s ease both; }
        @keyframes toastIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .toast { animation: toastIn 0.2s ease both; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:4px; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          position: "fixed", bottom: 26, right: 26, zIndex: 900,
          background: "#111827", color: "white", padding: "12px 18px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
        }}>
          <CheckCircle size={16} color="#4ADE80" /> {toast}
        </div>
      )}

      {editTarget && <EditModal fee={editTarget} onSave={handleSave} onCancel={() => setEdit(null)} />}

      {/* ══════════════════════════════════════════════════════════════════
          HEADER — same green as FeeManagement hero
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
        <div style={{
          position: "absolute", top: -60, right: -60, width: 300, height: 300,
          borderRadius: "50%", background: "rgba(255,255,255,0.12)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />

        {/* Breadcrumb bar */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          padding: "12px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap", position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <School size={15} color="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>CBC School Management</span>
            <span style={{ color: "rgba(255,255,255,0.35)", margin: "0 2px" }}>›</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Fee Structure</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              <FileText size={13} /> Report
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: "white", border: "none", borderRadius: 8,
              color: "#16a34a", cursor: "pointer", fontSize: 12, fontWeight: 700,
            }}>
              <Plus size={13} /> Add Grade
            </button>
          </div>
        </div>

        {/* Hero body */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "36px 32px 42px", position: "relative" }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              Republic of Kenya · Ministry of Education · 2025
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 6 }}>
              CBC Fee Structure
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>
              Competency Based Curriculum — PP1 through Grade 12 · Academic Year 2025
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: 14 }}>
            <StatCard icon={School}     label="CBC Grades"     value={fees.length}                    sub="PP1 – Grade 12" />
            <StatCard icon={Users}      label="Total Students" value={totalStudents.toLocaleString()} sub="Enrolled 2025" />
            <StatCard icon={Wallet}     label="Avg Term Fee"   value={fmt(Math.round(avgFee))}        sub="Per student / term" />
            <StatCard icon={TrendingUp} label="Term Revenue"   value={fmt(totalRevenue)}              sub="Projected" />
          </div>
        </div>
      </div>

      {/* ── LEVEL TABS ───────────────────────────────────────────────────── */}
      <div style={{
        background: "white", borderBottom: `1px solid ${TOKENS.border}`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", overflowX: "auto" }}>
          {levels.map(lvl => {
            const isActive = activeLevel === lvl;
            const color = lvl === "All" ? "#16a34a" : (TOKENS.levels[lvl]?.badge ?? "#16a34a");
            return (
              <button
                key={lvl}
                onClick={() => setActive(lvl)}
                style={{
                  padding: "15px 22px", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : TOKENS.text.muted,
                  borderBottom: `2.5px solid ${isActive ? color : "transparent"}`,
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "36px 28px 64px" }}>
        {shown.map((level) => {
          const lvlFees     = fees.filter(f => f.level === level);
          const lvl         = TOKENS.levels[level];
          const lvlStudents = lvlFees.reduce((s, f) => s + f.totalStudents, 0);
          if (!lvlFees.length) return null;

          return (
            <div key={level} className="fade-card" style={{ marginBottom: 52 }}>
              {/* Section heading */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ padding: "6px 18px", borderRadius: 8, background: lvl.bg, border: `1px solid ${lvl.border}`, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: lvl.badge }}>{level}</span>
                </div>
                <div style={{ height: 1, flex: 1, background: TOKENS.border }} />
                <div style={{ fontSize: 12, color: TOKENS.text.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {CBC_META[level].grades.join(" · ")} &nbsp;·&nbsp; {lvlStudents.toLocaleString()} students
                </div>
              </div>

              {/* Cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
                {lvlFees.map(fee => (
                  <FeeCard key={fee.id} fee={fee} onEdit={setEdit} lvl={lvl} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Notes */}
        <div style={{ background: "white", border: `1px solid ${TOKENS.border}`, borderRadius: 14, padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertCircle size={17} color="#16a34a" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: TOKENS.text.primary, marginBottom: 16 }}>Important Notes</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 28px" }}>
              {[
                ["Per-Term Fees", "Tuition, Books, Activity, Exams, ICT, Sports, Arts, Library, Medical & Transport are charged each term (3 terms/year)."],
                ["One-Off Fees", "Admission and Uniform fees are charged once on enrollment, not per term."],
                ["Junior Secondary", "Grade 7–9 is under Junior Secondary Schools (JSS) as per CBC transition from 8-4-4."],
                ["Bursaries", "NG-CDF bursaries apply to day schools. Boarding subsidies available for needy Senior Secondary students."],
              ].map(([title, body]) => (
                <div key={title}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TOKENS.text.primary, marginBottom: 5 }}>{title}</div>
                  <div style={{ fontSize: 12, color: TOKENS.text.muted, lineHeight: 1.7 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}