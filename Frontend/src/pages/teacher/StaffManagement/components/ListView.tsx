import React, { useState, useRef } from "react";
import { Search, Download, UserPlus, Eye, Edit, Trash2, Mail, Phone, MapPin, IdCard, Users, UserCheck, Clock, XCircle, AlertCircle, GraduationCap, Briefcase, FileDown, FileUp, RefreshCw, ChevronDown } from "lucide-react";
import { StaffMember, StaffType } from "../types";
import { STATUS_CFG, BRANCHES, STAFF_TYPE_OPTIONS } from "../constants";
import { fmt, initials, avatarBg } from "../helpers";
import { TopNav, Toast } from "./index";
import { cn } from "@/lib/utils";

interface ListViewProps {
  staff: StaffMember[];
  filtered: StaffMember[];
  query: string;
  fStatus: string;
  fBranch: string;
  fStaffType: string;
  onBack: () => void;
  onCreate: () => void;
  onViewDetails: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: string) => void;
  onBranchChange: (b: string) => void;
  onStaffTypeChange: (t: string) => void;
  onRefresh: () => void;
  toast: string | null;
}

function StaffTypeBadge({ staffType }: { staffType: StaffType }) {
  const isTeaching = staffType === "teaching";
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide",
      isTeaching ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
    )}>
      {isTeaching ? <GraduationCap size={10} /> : <Briefcase size={10} />}
      {isTeaching ? "Teacher" : "Non-Teacher"}
    </span>
  );
}

function StatusBadgeNew({ status }: { status: string }) {
  const config: Record<string, { classes: string }> = {
    "Active": { classes: "bg-green-50 text-green-700" },
    "On Leave": { classes: "bg-amber-50 text-amber-700" },
    "Inactive": { classes: "bg-gray-100 text-gray-500" },
    "Terminated": { classes: "bg-red-50 text-red-700" },
  };
  const c = config[status] || config["Inactive"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", c.classes)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ActionMenu({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-border rounded-lg bg-card cursor-pointer text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
        Actions <ChevronDown size={12} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 min-w-[150px] overflow-hidden animate-fade-in">
            <button onClick={() => { onView(); setIsOpen(false); }} className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"><Eye size={14} /> View Details</button>
            <button onClick={() => { onEdit(); setIsOpen(false); }} className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"><Edit size={14} /> Edit</button>
            <button onClick={() => { onDelete(); setIsOpen(false); }} className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-destructive hover:bg-destructive/5 transition-colors"><Trash2 size={14} /> Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

function StaffCard({ staff, onView, onEdit, onDelete, index }: { staff: StaffMember; onView: () => void; onEdit: () => void; onDelete: () => void; index: number }) {
  const branchParts = staff.branch.split(" - ");
  const branch = branchParts[1] || branchParts[0] || staff.branch;
  return (
    <div
      className={cn(
        "grid grid-cols-[2fr_1.8fr_1.5fr_1fr_1.2fr] items-center px-5 py-4 border-b border-border transition-colors cursor-pointer hover:bg-primary/[0.03]",
        index % 2 === 0 ? "bg-card" : "bg-muted/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${avatarBg(staff.id)}, ${avatarBg(staff.id)}cc)` }}
        >
          {initials(staff.firstName, staff.lastName)}
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-0.5">{staff.firstName} {staff.lastName}</p>
          <p className="text-xs text-muted-foreground mb-1">{staff.designation}</p>
          <StaffTypeBadge staffType={staff.staffType} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2"><Mail size={13} className="text-muted-foreground/60" /><span className="text-xs text-foreground truncate">{staff.email}</span></div>
        <div className="flex items-center gap-2"><Phone size={13} className="text-muted-foreground/60" /><span className="text-xs text-foreground">{staff.mobilePhone}</span></div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2"><MapPin size={13} className="text-muted-foreground/60" /><span className="text-xs text-foreground">{branch}</span></div>
        <div className="flex items-center gap-2"><IdCard size={13} className="text-muted-foreground/60" /><span className="text-xs text-foreground font-medium">TSC: {staff.tscNumber}</span></div>
      </div>
      <div className="text-right pr-3">
        {staff.salary > 0 ? (
          <div>
            <p className="text-base font-extrabold text-foreground">KSh {fmt(staff.salary)}</p>
            <p className="text-[11px] text-muted-foreground">per month</p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not set</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <StatusBadgeNew status={staff.jobStatus} />
        <ActionMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

const STATUS_ICONS = { All: Users, Active: UserCheck, "On Leave": Clock, Inactive: XCircle, Terminated: AlertCircle } as const;
const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  All: { color: "#3B82F6", bg: "#DBEAFE", label: "All Staff" },
  Active: { color: "#16A34A", bg: "#DCFCE7", label: "Active" },
  "On Leave": { color: "#D97706", bg: "#FEF3C7", label: "On Leave" },
  Inactive: { color: "#6B7280", bg: "#F3F4F6", label: "Inactive" },
};

function StatusCard({ label, count, config }: { label: string; count: number; config: { color: string; bg: string; label: string } }) {
  const Icon = STATUS_ICONS[label as keyof typeof STATUS_ICONS] || Users;
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: config.bg }}>
        <Icon size={20} color={config.color} strokeWidth={2} />
      </div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{config.label}</p>
      <p className="text-3xl font-extrabold text-foreground leading-tight">{count}</p>
    </div>
  );
}

export const ListView: React.FC<ListViewProps> = ({ staff, filtered, query, fStatus, fBranch, fStaffType, onBack, onCreate, onViewDetails, onEdit, onDelete, onQueryChange, onStatusChange, onBranchChange, onStaffTypeChange, onRefresh, toast }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => { setIsRefreshing(true); onRefresh(); setTimeout(() => setIsRefreshing(false), 500); };

  const handleExport = () => {
    const headers = ['First Name', 'Last Name', 'ID Number', 'Designation', 'Email', 'Phone', 'Branch', 'Status', 'Salary', 'TSC Number'];
    const csvContent = [headers.join(','), ...staff.map(s => [s.firstName, s.lastName, s.idNumber, s.designation, s.email, s.mobilePhone, s.branch, s.jobStatus, s.salary, s.tscNumber].join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const teachingCount = staff.filter(s => s.staffType === "teaching").length;
  const nonTeachingCount = staff.filter(s => s.staffType === "non-teaching").length;

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      <TopNav crumb="Staff Management" onBack={onBack} actions={
        <div className="flex gap-2">
          <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors">
            <FileDown size={14} /> Export
          </button>
          <button onClick={onCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-all">
            <UserPlus size={14} strokeWidth={2.5} /> Add Staff
          </button>
        </div>
      } />

      {/* Hero */}
      <div className="border-b border-primary/10 py-6 px-6" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--primary) / 0.10) 100%)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">Staff Directory</h1>
              <p className="text-sm text-muted-foreground">Manage your school staff members</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <GraduationCap size={18} className="text-blue-600" />
                <span className="text-[13px] font-bold text-blue-700">Teachers: {teachingCount}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 bg-orange-50 rounded-xl border border-orange-200">
                <Briefcase size={18} className="text-orange-600" />
                <span className="text-[13px] font-bold text-orange-700">Non-Teachers: {nonTeachingCount}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["All", "Active", "On Leave", "Inactive"] as const).map(label => {
              const config = STATUS_COLORS[label];
              const count = label === "All" ? staff.length : staff.filter(s => s.jobStatus === label).length;
              return <StatusCard key={label} label={label} count={count} config={config} />;
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border-b border-border px-6 py-3.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-[280px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query} onChange={e => onQueryChange(e.target.value)}
              placeholder="Search name, email, TSC..."
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] text-foreground bg-card outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
          {[
            { value: fStaffType, onChange: onStaffTypeChange, options: [{ value: "all", label: "All Staff" }, ...STAFF_TYPE_OPTIONS], minW: "min-w-[150px]" },
            { value: fStatus, onChange: onStatusChange, options: [{ value: "all", label: "All Status" }, ...Object.keys(STATUS_CFG).map(k => ({ value: k, label: k }))], minW: "min-w-[140px]" },
            { value: fBranch, onChange: onBranchChange, options: [{ value: "all", label: "All Branches" }, ...BRANCHES.map(b => ({ value: b, label: b }))], minW: "min-w-[160px]" },
          ].map((filter, idx) => (
            <select key={idx} value={filter.value} onChange={e => filter.onChange(e.target.value)} className={cn("px-3 py-2.5 border border-border rounded-lg text-[13px] text-foreground bg-card cursor-pointer appearance-none pr-8", filter.minW)}>
              {filter.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ))}
          <div className="flex gap-2 ml-auto">
            <button onClick={handleRefresh} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-colors">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <span className="text-[13px] text-muted-foreground font-medium">{filtered.length} staff member{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-4 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4"><Users size={24} className="text-muted-foreground" /></div>
            <p className="text-[15px] font-semibold text-foreground mb-1">No staff found</p>
            <p className="text-[13px] text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1.8fr_1.5fr_1fr_1.2fr] items-center px-5 py-3 bg-muted/60 rounded-t-xl border border-border border-b-0">
              {["Staff Info", "Contact", "Location & TSC", "Salary", "Status"].map((h, i) => (
                <p key={h} className={cn("text-[11px] font-bold text-muted-foreground uppercase tracking-wide", i === 3 && "text-right pr-3")}>{h}</p>
              ))}
            </div>
            <div className="bg-card border border-border rounded-b-xl overflow-hidden shadow-sm">
              {filtered.map((s, i) => (
                <StaffCard key={s.id} staff={s} index={i} onView={() => onViewDetails(s)} onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} />
              ))}
            </div>
          </>
        )}
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
};
