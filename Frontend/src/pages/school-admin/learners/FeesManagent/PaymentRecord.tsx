import { useState, useMemo } from "react";
import {
  Search, Download, ChevronLeft, CheckCircle, XCircle,
  Clock, Eye, Printer, Mail, Calendar, DollarSign,
  CreditCard, Landmark, ArrowUpDown, Smartphone, RefreshCw,
  Filter, TrendingUp, Users, Wallet, AlertCircle,
  ChevronDown, MoreHorizontal
} from "lucide-react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────── */
const T = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  border: "#E4E7EE",
  text: { primary: "#0F1624", secondary: "#4B5568", muted: "#8A94A6" },
  accent: "#1A56DB",
  accentSoft: "#EBF0FF",
  green: "#16a34a",
  success: { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  warning: { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  danger:  { bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
  neutral: { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
};

/* ─── SAMPLE DATA ────────────────────────────────────────────────────── */
const ALL_PAYMENTS = [
  { id:"1",  studentName:"James Mwangi",   studentId:"STU001", grade:"Grade 10", stream:"A", amountPaid:25000, balance:0,     paymentDate:"2025-02-15", method:"mobile", status:"completed", transactionId:"TRX123456", term:"Term 1", year:2025 },
  { id:"2",  studentName:"Amina Hassan",   studentId:"STU002", grade:"Grade 11", stream:"B", amountPaid:15000, balance:10000, paymentDate:"2025-02-14", method:"bank",   status:"completed", transactionId:"TRX123457", term:"Term 1", year:2025 },
  { id:"3",  studentName:"Brian Otieno",   studentId:"STU003", grade:"Grade 12", stream:"C", amountPaid:0,     balance:25000, paymentDate:"2025-02-13", method:"cash",   status:"pending",   transactionId:"TRX123458", term:"Term 1", year:2025 },
  { id:"4",  studentName:"Grace Wanjiku",  studentId:"STU004", grade:"Grade 10", stream:"A", amountPaid:25000, balance:0,     paymentDate:"2025-02-12", method:"card",   status:"completed", transactionId:"TRX123459", term:"Term 1", year:2025 },
  { id:"5",  studentName:"Kevin Kamau",    studentId:"STU005", grade:"Grade 11", stream:"B", amountPaid:20000, balance:5000,  paymentDate:"2025-02-11", method:"mobile", status:"completed", transactionId:"TRX123460", term:"Term 1", year:2025 },
  { id:"6",  studentName:"Purity Njeri",   studentId:"STU006", grade:"Grade 12", stream:"C", amountPaid:25000, balance:0,     paymentDate:"2025-02-10", method:"bank",   status:"failed",    transactionId:"TRX123461", term:"Term 1", year:2025 },
  { id:"7",  studentName:"David Kipchoge", studentId:"STU007", grade:"Grade 9",  stream:"A", amountPaid:18000, balance:2000,  paymentDate:"2025-02-09", method:"mobile", status:"completed", transactionId:"TRX123462", term:"Term 1", year:2025 },
  { id:"8",  studentName:"Sarah Achieng",  studentId:"STU008", grade:"Grade 8",  stream:"B", amountPaid:12000, balance:0,     paymentDate:"2025-02-08", method:"cash",   status:"completed", transactionId:"TRX123463", term:"Term 1", year:2025 },
  { id:"9",  studentName:"Peter Maina",    studentId:"STU009", grade:"Grade 7",  stream:"A", amountPaid:14000, balance:1000,  paymentDate:"2025-02-07", method:"bank",   status:"refunded",  transactionId:"TRX123464", term:"Term 1", year:2025 },
  { id:"10", studentName:"Lucy Waweru",    studentId:"STU010", grade:"Grade 10", stream:"C", amountPaid:0,     balance:22000, paymentDate:"2025-02-06", method:"card",   status:"pending",   transactionId:"TRX123465", term:"Term 1", year:2025 },
];

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const fmt     = (n) => `KSh ${Number(n).toLocaleString("en-KE")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, label:"Completed", ...T.success },
  pending:   { icon: Clock,       label:"Pending",   ...T.warning },
  failed:    { icon: XCircle,     label:"Failed",    ...T.danger  },
  refunded:  { icon: RefreshCw,   label:"Refunded",  ...T.neutral },
};

const METHOD_CONFIG = {
  cash:   { icon: DollarSign, label:"Cash",   color:"#92400E", bg:"#FEF3C7" },
  card:   { icon: CreditCard, label:"Card",   color:"#1E40AF", bg:"#DBEAFE" },
  bank:   { icon: Landmark,   label:"Bank",   color:"#065F46", bg:"#D1FAE5" },
  mobile: { icon: Smartphone, label:"M-Pesa", color:"#6D28D9", bg:"#EDE9FE" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:cfg.bg, color:cfg.text, border:`1px solid ${cfg.border}` }}>
      <Icon size={12}/> {cfg.label}
    </span>
  );
}

function MethodBadge({ method }) {
  const cfg = METHOD_CONFIG[method] || METHOD_CONFIG.cash;
  const Icon = cfg.icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:cfg.bg, color:cfg.color }}>
      <Icon size={12}/> {cfg.label}
    </span>
  );
}

function SortTh({ label, field, sortField, sortOrder, onSort }) {
  const active = sortField === field;
  return (
    <th onClick={() => onSort(field)} style={{ padding:"13px 16px", textAlign:"left", cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color: active ? T.green : T.text.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>
        {label}
        <ArrowUpDown size={12} color={active ? T.green : T.text.muted}/>
      </div>
    </th>
  );
}

/* Stat card — frosted glass for green hero */
function StatCard({ icon: Icon, label, value, sub, valueColor = null }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 12, padding: "18px 20px",
      display: "flex", gap: 14, alignItems: "center",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{ width:42, height:42, borderRadius:10, background:"rgba(255,255,255,0.20)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={19} color="white"/>
      </div>
      <div>
        <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:20, fontWeight:800, color: valueColor || "white", lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );
}

const PAGE_SIZE = 7;

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function PaymentRecords() {
  const [term, setTerm]       = useState("Term 1");
  const [year, setYear]       = useState("2025");
  const [query, setQuery]     = useState("");
  const [status, setStatus]   = useState("all");
  const [method, setMethod]   = useState("all");
  const [sortField, setSort]  = useState("paymentDate");
  const [sortOrder, setOrder] = useState("desc");
  const [page, setPage]       = useState(1);
  const [expanded, setExp]    = useState(null);

  const handleSort = (f) => {
    if (sortField === f) setOrder(o => o === "asc" ? "desc" : "asc");
    else { setSort(f); setOrder("asc"); }
  };

  const filtered = useMemo(() => {
    return ALL_PAYMENTS.filter(p => {
      const q = query.toLowerCase();
      const matchQ = !q || p.studentName.toLowerCase().includes(q) || p.studentId.toLowerCase().includes(q) || p.transactionId.toLowerCase().includes(q);
      return matchQ && p.term === term && p.year.toString() === year
        && (status === "all" || p.status === status)
        && (method === "all" || p.method === method);
    }).sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === "paymentDate") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      return sortOrder === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [query, term, year, status, method, sortField, sortOrder]);

  const totalPages     = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated      = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalCollected = filtered.reduce((s,p) => s+p.amountPaid, 0);
  const totalOutstanding = filtered.reduce((s,p) => s+p.balance, 0);
  const completedCount = filtered.filter(p => p.status==="completed").length;
  const completionRate = filtered.length ? Math.round((completedCount/filtered.length)*100) : 0;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        button, input, select { font-family:inherit; }
        tr.data-row:hover td { background:#F8FAFC !important; }
        tr.data-row { cursor:pointer; transition:background 0.12s; }
        .icon-btn:hover { background:#F1F5F9 !important; border-color:#CBD5E1 !important; }
        select { appearance:none; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:4px; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — same green gradient as entire suite
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
          gap: 12, position: "relative",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, color:"white", cursor:"pointer", fontSize:12, fontWeight:600 }}>
              <ChevronLeft size={14}/> Dashboard
            </button>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:14, margin:"0 4px" }}>›</span>
            <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Payment Records</span>
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"white", border:"none", borderRadius:8, color:"#16a34a", cursor:"pointer", fontSize:13, fontWeight:700 }}>
            <Download size={14}/> Export CSV
          </button>
        </div>

        {/* Hero body */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"36px 32px 42px", position:"relative" }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>
              Finance · CBC School Management
            </div>
            <h1 style={{ fontSize:30, fontWeight:900, color:"white", marginBottom:6, lineHeight:1.2 }}>Payment Records</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.65)" }}>
              Track, filter and manage all student fee payments · {term} {year}
            </p>
          </div>

          {/* KPI stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px,1fr))", gap:14 }}>
            <StatCard icon={Wallet}      label="Total Collected" value={fmt(totalCollected)}   sub={`${completedCount} payments`} />
            <StatCard icon={AlertCircle} label="Outstanding"     value={fmt(totalOutstanding)} sub="To be cleared"    valueColor="#fca5a5"/>
            <StatCard icon={CheckCircle} label="Completed"       value={completedCount}         sub={`${completionRate}% completion rate`} valueColor="#bbf7d0"/>
            <StatCard icon={Users}       label="Total Records"   value={filtered.length}        sub="This period"/>
          </div>
        </div>
      </div>

      {/* ── FILTERS BAR (sticky white) ─────────────────────────────────── */}
      <div style={{
        background: T.surface, borderBottom:`1px solid ${T.border}`,
        padding: "14px 32px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>

          {/* Search */}
          <div style={{ position:"relative", flex:"1 1 220px", maxWidth:300 }}>
            <Search size={15} color={T.text.muted} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}/>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search name, ID, transaction…"
              style={{ width:"100%", padding:"9px 12px 9px 35px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, outline:"none" }}
              onFocus={e => e.target.style.borderColor = T.green}
              onBlur={e  => e.target.style.borderColor = T.border}
            />
          </div>

          {/* Term */}
          <div style={{ position:"relative" }}>
            <Calendar size={13} color={T.text.muted} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
            <select value={term} onChange={e => { setTerm(e.target.value); setPage(1); }} style={{ padding:"9px 32px 9px 30px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, cursor:"pointer", outline:"none" }}>
              <option>Term 1</option><option>Term 2</option><option>Term 3</option>
            </select>
            <ChevronDown size={13} color={T.text.muted} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          {/* Year */}
          <div style={{ position:"relative" }}>
            <select value={year} onChange={e => { setYear(e.target.value); setPage(1); }} style={{ padding:"9px 32px 9px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, cursor:"pointer", outline:"none" }}>
              <option>2025</option><option>2024</option><option>2023</option>
            </select>
            <ChevronDown size={13} color={T.text.muted} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          {/* Status */}
          <div style={{ position:"relative" }}>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ padding:"9px 32px 9px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, cursor:"pointer", outline:"none" }}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown size={13} color={T.text.muted} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          {/* Method */}
          <div style={{ position:"relative" }}>
            <select value={method} onChange={e => { setMethod(e.target.value); setPage(1); }} style={{ padding:"9px 32px 9px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.text.primary, background:T.bg, cursor:"pointer", outline:"none" }}>
              <option value="all">All Methods</option>
              <option value="mobile">M-Pesa</option>
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
            <ChevronDown size={13} color={T.text.muted} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>

          <div style={{ marginLeft:"auto", fontSize:12, color:T.text.muted, fontWeight:500 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ── TABLE ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
              <thead>
                <tr style={{ background:T.bg, borderBottom:`1px solid ${T.border}` }}>
                  <SortTh label="Student"     field="studentName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort}/>
                  <SortTh label="Grade"       field="grade"       sortField={sortField} sortOrder={sortOrder} onSort={handleSort}/>
                  <SortTh label="Amount Paid" field="amountPaid"  sortField={sortField} sortOrder={sortOrder} onSort={handleSort}/>
                  <SortTh label="Balance"     field="balance"     sortField={sortField} sortOrder={sortOrder} onSort={handleSort}/>
                  <SortTh label="Date"        field="paymentDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort}/>
                  <th style={{ padding:"13px 16px" }}><span style={{ fontSize:11, fontWeight:700, color:T.text.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>Method</span></th>
                  <th style={{ padding:"13px 16px" }}><span style={{ fontSize:11, fontWeight:700, color:T.text.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>Status</span></th>
                  <th style={{ padding:"13px 16px" }}><span style={{ fontSize:11, fontWeight:700, color:T.text.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding:"60px 20px", textAlign:"center" }}>
                      <div style={{ width:48, height:48, background:T.bg, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                        <Search size={22} color={T.text.muted}/>
                      </div>
                      <div style={{ fontSize:15, fontWeight:700, color:T.text.secondary }}>No payments found</div>
                      <div style={{ fontSize:13, color:T.text.muted, marginTop:6 }}>Try adjusting your search or filters</div>
                    </td>
                  </tr>
                ) : paginated.map((p) => (
                  <>
                    <tr
                      key={p.id}
                      className="data-row"
                      onClick={() => setExp(exp => exp === p.id ? null : p.id)}
                      style={{ borderBottom:`1px solid ${T.border}` }}
                    >
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ fontWeight:700, fontSize:14, color:T.text.primary }}>{p.studentName}</div>
                        <div style={{ fontSize:11, color:T.text.muted, marginTop:2 }}>{p.studentId}</div>
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ fontSize:13, fontWeight:600, color:T.text.secondary }}>{p.grade} {p.stream}</span>
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#15803D" }}>
                          {p.amountPaid > 0 ? fmt(p.amountPaid) : <span style={{ color:T.text.muted }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        {p.balance > 0
                          ? <div style={{ fontSize:14, fontWeight:700, color:"#B91C1C" }}>{fmt(p.balance)}</div>
                          : <span style={{ fontSize:13, color:T.text.muted, fontWeight:500 }}>Cleared</span>}
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:13, fontWeight:500, color:T.text.primary }}>{fmtDate(p.paymentDate)}</div>
                        <div style={{ fontSize:11, color:T.text.muted, marginTop:2, fontFamily:"monospace" }}>{p.transactionId}</div>
                      </td>
                      <td style={{ padding:"14px 16px" }}><MethodBadge method={p.method}/></td>
                      <td style={{ padding:"14px 16px" }}><StatusBadge status={p.status}/></td>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
                          {[Eye, Printer, Mail].map((Icon, i) => (
                            <button key={i} className="icon-btn" style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${T.border}`, borderRadius:7, background:"white", cursor:"pointer" }}>
                              <Icon size={13} color={T.text.secondary}/>
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded === p.id && (
                      <tr key={`${p.id}-exp`} style={{ background:"#f0fdf4" }}>
                        <td colSpan={8} style={{ padding:"0 16px 16px 16px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:12, paddingTop:14, borderTop:`1px dashed #86efac` }}>
                            {[
                              ["Student ID",     p.studentId],
                              ["Transaction ID", p.transactionId],
                              ["Term",           `${p.term} ${p.year}`],
                              ["Payment Method", METHOD_CONFIG[p.method]?.label || p.method],
                              ["Amount Paid",    p.amountPaid > 0 ? fmt(p.amountPaid) : "N/A"],
                              ["Outstanding",    p.balance > 0 ? fmt(p.balance) : "Fully Paid"],
                            ].map(([label, val]) => (
                              <div key={label}>
                                <div style={{ fontSize:10, fontWeight:700, color:"#16a34a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{label}</div>
                                <div style={{ fontSize:13, fontWeight:600, color:T.text.primary }}>{val}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>

              {/* Table footer totals */}
              {paginated.length > 0 && (
                <tfoot>
                  <tr style={{ background:"#f0fdf4", borderTop:`2px solid #16a34a30` }}>
                    <td style={{ padding:"13px 16px", fontSize:13, fontWeight:800, color:"#16a34a" }} colSpan={2}>
                      Page Total
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:13, fontWeight:800, color:"#15803D" }}>
                      {fmt(paginated.reduce((s,p) => s+p.amountPaid, 0))}
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:13, fontWeight:800, color:"#B91C1C" }}>
                      {fmt(paginated.reduce((s,p) => s+p.balance, 0))}
                    </td>
                    <td colSpan={4} style={{ padding:"13px 16px", fontSize:12, color:T.text.muted }}>
                      {paginated.filter(p => p.status==="completed").length} of {paginated.length} completed on this page
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div style={{ padding:"14px 20px", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, background:T.surface }}>
            <div style={{ fontSize:13, color:T.text.muted }}>
              Showing <b style={{ color:T.text.primary }}>{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)}</b> of <b style={{ color:T.text.primary }}>{filtered.length}</b> records
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button
                disabled={page===1}
                onClick={() => setPage(p => p-1)}
                style={{ padding:"7px 14px", border:`1px solid ${T.border}`, borderRadius:8, background:"white", color: page===1 ? T.text.muted : T.text.secondary, cursor: page===1 ? "not-allowed" : "pointer", fontSize:13, fontWeight:600, opacity: page===1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  style={{ width:36, height:36, border:`1px solid ${pg===page ? T.green : T.border}`, borderRadius:8, background: pg===page ? T.green : "white", color: pg===page ? "white" : T.text.secondary, cursor:"pointer", fontSize:13, fontWeight:700 }}
                >
                  {pg}
                </button>
              ))}
              <button
                disabled={page===totalPages}
                onClick={() => setPage(p => p+1)}
                style={{ padding:"7px 14px", border:`1px solid ${T.border}`, borderRadius:8, background:"white", color: page===totalPages ? T.text.muted : T.text.secondary, cursor: page===totalPages ? "not-allowed" : "pointer", fontSize:13, fontWeight:600, opacity: page===totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}