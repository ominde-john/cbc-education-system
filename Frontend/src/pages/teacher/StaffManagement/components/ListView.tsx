import React from "react";
import { Search, Download, UserPlus, Eye, Edit, Trash2, Mail, Phone, MapPin, IdCard, Users, UserCheck, Clock, XCircle, AlertCircle } from "lucide-react";
import { StaffMember } from "../types";
import { T, STATUS_CFG, BRANCHES } from "../constants";
import { fmt } from "../helpers";
import { inp, sel } from "../styles";
import { TopNav, NavBtn, Avatar, StatusBadge, Toast } from "./index";

interface ListViewProps {
  staff: StaffMember[];
  filtered: StaffMember[];
  query: string;
  fStatus: string;
  fBranch: string;
  onBack: () => void;
  onCreate: () => void;
  onViewDetails: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: string) => void;
  onBranchChange: (b: string) => void;
  toast: string | null;
}

const STATUS_ICONS = {
  All: Users,
  Active: UserCheck,
  "On Leave": Clock,
  Inactive: XCircle,
  Terminated: AlertCircle,
} as const;

const STATUS_COLORS = {
  All: { color: T.accent, bg: T.accentSoft },
  Active: { color: "#15803D", bg: "#F0FDF4" },
  "On Leave": { color: "#B45309", bg: "#FFFBEB" },
  Inactive: { color: "#475569", bg: "#F8FAFC" },
  Terminated: { color: "#B91C1C", bg: "#FEF2F2" },
} as const;

function StatusCard({ label, count, config }: { label: string; count: number; config: { color: string; bg: string } }) {
  const Icon = STATUS_ICONS[label as keyof typeof STATUS_ICONS] || Users;
  return (
    <div style={{ 
      background: "#ffffff", 
      border: "1px solid rgba(0,0,0,0.07)", 
      borderRadius: 16, 
      minHeight: 130,
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "all 0.25s ease",
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${config.color}, ${config.color}44, transparent)` }} />
      <div style={{ position: "absolute", bottom: -8, right: -8, opacity: 0.05 }}>
        <Icon size={76} color={config.color} strokeWidth={1} />
      </div>
      <div style={{ padding: "16px 16px 14px", position: "relative", zIndex: 1 }}>
        <div style={{ 
          width: 38, 
          height: 38, 
          borderRadius: 10, 
          background: config.bg, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: `1px solid ${config.color}22`,
          marginBottom: 12
        }}>
          <Icon size={17} color={config.color} strokeWidth={2.2} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1, marginBottom: 6 }}>
          {count}
        </div>
      </div>
    </div>
  );
}

function StaffCard({ staff, onView, onEdit, onDelete }: { 
  staff: StaffMember; 
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
    }}>
      <div style={{ height: 3, background: STATUS_CFG[staff.jobStatus]?.text ?? T.accent }} />
      <div style={{ padding: "13px 15px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar staff={staff} size={37} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text.primary, lineHeight: 1.2 }}>{staff.firstName} {staff.lastName}</div>
              <div style={{ fontSize: 11, color: T.text.muted, marginTop: 1 }}>{staff.designation}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onView} style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderRadius: 7, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Eye size={13} color={T.text.secondary} />
            </button>
            <button onClick={onEdit} style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderRadius: 7, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Edit size={13} color={T.text.secondary} />
            </button>
            <button onClick={onDelete} style={{ width: 28, height: 28, border: `1px solid #FCA5A5`, borderRadius: 7, background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={13} color="#DC2626" />
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Mail size={11} color={T.text.muted} />
            <span style={{ fontSize: 12, color: T.text.secondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{staff.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Phone size={11} color={T.text.muted} />
            <span style={{ fontSize: 12, color: T.text.secondary }}>{staff.mobilePhone}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <MapPin size={11} color={T.text.muted} />
            <span style={{ fontSize: 12, color: T.text.secondary }}>{staff.branch}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <IdCard size={11} color={T.text.muted} />
            <span style={{ fontSize: 12, color: T.text.secondary }}>TSC: {staff.tscNumber}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
          <StatusBadge status={staff.jobStatus} />
          {staff.salary > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: T.text.muted }}>{fmt(staff.salary)}/mo</span>}
        </div>
      </div>
    </div>
  );
}

export const ListView: React.FC<ListViewProps> = ({
  staff,
  filtered,
  query,
  fStatus,
  fBranch,
  onBack,
  onCreate,
  onViewDetails,
  onEdit,
  onDelete,
  onQueryChange,
  onStatusChange,
  onBranchChange,
  toast,
}) => {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <TopNav
        crumb="All Staff"
        onBack={onBack}
        actions={
          <>
            <NavBtn icon={Download} label="Export" onClick={() => {}} />
            <NavBtn icon={UserPlus} label="Add Staff" onClick={onCreate} primary />
          </>
        }
      />
      
      <div style={{ 
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)",
        borderBottom: "1px solid rgba(22,163,74,0.12)",
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundImage: "radial-gradient(rgba(22,163,74,0.13) 1px, transparent 1px)", 
          backgroundSize: "22px 22px",
          pointerEvents: "none"
        }} />
        <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, marginBottom: 4 }}>
              All Staff
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
              {filtered.length} of {staff.length} staff members
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 }}>
            {(["All", "Active", "On Leave", "Inactive", "Terminated"] as const).map(label => {
              const config = STATUS_COLORS[label];
              const count = label === "All" ? staff.length : staff.filter(s => s.jobStatus === label).length;
              return <StatusCard key={label} label={label} count={count} config={config} />;
            })}
          </div>
        </div>
      </div>

      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "11px 32px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 270 }}>
            <Search size={14} color={T.text.muted} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Search name, ID, email, TSC…" style={{ ...inp, paddingLeft: 32, background: T.bg }} />
          </div>
          <div style={{ position: "relative" }}>
            <select value={fStatus} onChange={e => onStatusChange(e.target.value)} style={{ ...sel, paddingRight: 28, background: T.bg, minWidth: 150 }}>
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_CFG).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <select value={fBranch} onChange={e => onBranchChange(e.target.value)} style={{ ...sel, paddingRight: 28, background: T.bg, minWidth: 190 }}>
              <option value="all">All Branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.text.muted, fontWeight: 500 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: 46, height: 46, background: T.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Search size={20} color={T.text.muted} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text.secondary }}>No staff found</div>
            <div style={{ fontSize: 12, color: T.text.muted, marginTop: 5 }}>Adjust your search or filters</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(275px,1fr))", gap: 14 }}>
            {filtered.map(s => (
              <StaffCard 
                key={s.id} 
                staff={s} 
                onView={() => onViewDetails(s)}
                onEdit={() => onEdit(s)}
                onDelete={() => onDelete(s.id)}
              />
            ))}
          </div>
        )}
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
};
