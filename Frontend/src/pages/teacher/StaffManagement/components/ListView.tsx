import React, { useState, useRef } from "react";
import { Search, Download, UserPlus, Eye, Edit, Trash2, Mail, Phone, MapPin, IdCard, Users, UserCheck, Clock, XCircle, AlertCircle, GraduationCap, Briefcase, FileDown, FileUp, RefreshCw, MoreVertical, ChevronDown } from "lucide-react";
import { StaffMember, StaffType } from "../types";
import { T, STATUS_CFG, BRANCHES, STAFF_TYPE_OPTIONS } from "../constants";
import { fmt, initials, avatarBg } from "../helpers";
import { TopNav, NavBtn, Toast } from "./index";

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

// Badge component for staff type
function StaffTypeBadge({ staffType }: { staffType: StaffType }) {
  const isTeaching = staffType === "teaching";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 8px",
      borderRadius: 6,
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.02em",
      background: isTeaching ? "#DBEAFE" : "#FED7AA",
      color: isTeaching ? "#1D4ED8" : "#C2410C",
    }}>
      {isTeaching ? <GraduationCap size={10} /> : <Briefcase size={10} />}
      {isTeaching ? "Teacher" : "Non-Teacher"}
    </span>
  );
}

// Status badge component
function StatusBadgeNew({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    "Active": { bg: "#DCFCE7", text: "#166534", label: "Active" },
    "On Leave": { bg: "#FEF3C7", text: "#B45309", label: "On Leave" },
    "Inactive": { bg: "#F3F4F6", text: "#6B7280", label: "Inactive" },
    "Terminated": { bg: "#FEE2E2", text: "#B91C1C", label: "Terminated" },
  };
  const config = statusConfig[status] || statusConfig["Inactive"];
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: config.bg,
      color: config.text,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: config.text }} />
      {config.label}
    </span>
  );
}

// Action dropdown component
function ActionMenu({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          background: "#ffffff",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 500,
          color: "#6B7280",
        }}
      >
        Actions <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: 4,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 50,
          minWidth: 140,
          overflow: "hidden",
        }}>
          <button onClick={() => { onView(); setIsOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#374151" }}><Eye size={14} /> View Details</button>
          <button onClick={() => { onEdit(); setIsOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#374151" }}><Edit size={14} /> Edit</button>
          <button onClick={() => { onDelete(); setIsOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#DC2626" }}><Trash2 size={14} /> Delete</button>
        </div>
      )}
    </div>
  );
}

// Staff card component for desktop table view
function StaffCard({ staff, onView, onEdit, onDelete, index }: { staff: StaffMember; onView: () => void; onEdit: () => void; onDelete: () => void; index: number }) {
  const branchParts = staff.branch.split(" - ");
  const branch = branchParts[1] || branchParts[0] || staff.branch;
  
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1.8fr 1.5fr 1fr 1.2fr",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: "1px solid #F3F4F6",
      background: index % 2 === 0 ? "#ffffff" : "#FAFAFA",
      transition: "all 0.15s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#F0FDF4";
      e.currentTarget.style.boxShadow = "inset 0 0 0 1px #22C55E";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = index % 2 === 0 ? "#ffffff" : "#FAFAFA";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      {/* Staff Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {staff.photo ? (
          <img src={staff.photo} alt={staff.firstName} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${avatarBg(staff.id)}, ${avatarBg(staff.id)}dd)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {initials(staff.firstName, staff.lastName)}
          </div>
        )}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{staff.firstName} {staff.lastName}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{staff.designation}</div>
          <StaffTypeBadge staffType={staff.staffType} />
        </div>
      </div>
      
      {/* Contact Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={13} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{staff.email}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={13} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: "#374151" }}>{staff.mobilePhone}</span>
        </div>
      </div>
      
      {/* Location & TSC */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={13} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: "#374151" }}>{branch}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IdCard size={13} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>TSC: {staff.tscNumber}</span>
        </div>
      </div>
      
      {/* Salary */}
      <div style={{ textAlign: "right", paddingRight: 12 }}>
        {staff.salary > 0 ? (
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>KSh {fmt(staff.salary)}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>per month</div>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Not set</span>
        )}
      </div>
      
      {/* Status & Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <StatusBadgeNew status={staff.jobStatus} />
        <ActionMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

// Mobile card view
function StaffCardMobile({ staff, onView, onEdit, onDelete }: { staff: StaffMember; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const branchParts = staff.branch.split(" - ");
  const branch = branchParts[1] || branchParts[0] || staff.branch;
  
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #E5E7EB",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        {staff.photo ? (
          <img src={staff.photo} alt={staff.firstName} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${avatarBg(staff.id)}, ${avatarBg(staff.id)}dd)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white" }}>
            {initials(staff.firstName, staff.lastName)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{staff.firstName} {staff.lastName}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{staff.designation}</div>
          <StaffTypeBadge staffType={staff.staffType} />
        </div>
        <StatusBadgeNew status={staff.jobStatus} />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
        <div>
          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Contact</div>
          <div style={{ fontSize: 12, color: "#374151" }}>{staff.email}</div>
          <div style={{ fontSize: 12, color: "#374151" }}>{staff.mobilePhone}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Location</div>
          <div style={{ fontSize: 12, color: "#374151" }}>{branch}</div>
          <div style={{ fontSize: 12, color: "#374151" }}>TSC: {staff.tscNumber}</div>
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
          {staff.salary > 0 ? `KSh ${fmt(staff.salary)}/mo` : <span style={{ fontSize: 12, color: "#9CA3AF" }}>Salary not set</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onView} style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, background: "#ffffff", cursor: "pointer", fontSize: 12, color: "#374151" }}><Eye size={14} /></button>
          <button onClick={onEdit} style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, background: "#ffffff", cursor: "pointer", fontSize: 12, color: "#374151" }}><Edit size={14} /></button>
          <button onClick={onDelete} style={{ padding: "8px 12px", border: "1px solid #FECACA", borderRadius: 8, background: "#FEF2F2", cursor: "pointer", fontSize: 12, color: "#DC2626" }}><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// Status summary cards - Modern UI matching Staff Management style
function StatusCard({ label, count, config }: { label: string; count: number; config: { color: string; bg: string; iconBg: string; label: string } }) {
  const Icon = STATUS_ICONS[label as keyof typeof STATUS_ICONS] || Users;
  return (
    <div 
      style={{ 
        background: "#ffffff", 
        border: "1px solid #f3f4f6", 
        borderRadius: 16, 
        padding: 24,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Icon in rounded box */}
      <div style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 12, 
        background: config.iconBg, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        marginBottom: 16,
      }}>
        <Icon size={22} color={config.color} strokeWidth={2} />
      </div>
      
      {/* Small uppercase label */}
      <div style={{ 
        fontSize: 12, 
        fontWeight: 600, 
        color: "#6b7280", 
        textTransform: "uppercase", 
        letterSpacing: "0.05em", 
        marginBottom: 4,
      }}>
        {config.label}
      </div>
      
      {/* Main number */}
      <div style={{ 
        fontSize: 32, 
        fontWeight: 700, 
        color: "#111827", 
        lineHeight: 1.2,
      }}>
        {count}
      </div>
    </div>
  );
}

const STATUS_ICONS = {
  All: Users,
  Active: UserCheck,
  "On Leave": Clock,
  Inactive: XCircle,
  Terminated: AlertCircle,
} as const;

const STATUS_COLORS: Record<string, { color: string; bg: string; iconBg: string; label: string }> = {
  All: { color: "#3B82F6", bg: "#F3F4F6", iconBg: "#DBEAFE", label: "All Staff" },
  Active: { color: "#16A34A", bg: "#DCFCE7", iconBg: "#DCFCE7", label: "Active" },
  "On Leave": { color: "#D97706", bg: "#FEF3C7", iconBg: "#FEF3C7", label: "On Leave" },
  Inactive: { color: "#6B7280", bg: "#F3F4F6", iconBg: "#F3F4F6", label: "Inactive" },
  Terminated: { color: "#DC2626", bg: "#FEE2E2", iconBg: "#FEE2E2", label: "Terminated" },
};

// Action button component
function ActionButton({ icon: Icon, label, color, bg, borderColor, accept, onFileSelect, onClick, isSpinning }: { 
  icon: React.ElementType; 
  label: string; 
  color: string; 
  bg: string; 
  borderColor: string; 
  accept?: string; 
  onFileSelect?: (file: File) => void; 
  onClick?: () => void; 
  isSpinning?: boolean 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = () => { if (accept) fileInputRef.current?.click(); else onClick?.(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const file = e.target.files?.[0]; 
    if (file && onFileSelect) onFileSelect(file); 
    e.target.value = ""; 
  };
  return (
    <>
      {accept && <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} style={{ display: "none" }} />}
      <button 
        onClick={handleClick} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 6, 
          padding: "8px 14px", 
          borderRadius: 8, 
          fontSize: 12, 
          fontWeight: 600, 
          cursor: "pointer", 
          transition: "all 0.2s ease", 
          background: bg, 
          color: color, 
          border: `1px solid ${borderColor}`,
          filter: isHovered ? "brightness(0.95)" : "none",
          transform: isHovered ? "translateY(-1px)" : "translateY(0)",
          boxShadow: isHovered ? `0 4px 12px ${color}20` : "none",
        }}
      >
        <Icon size={14} strokeWidth={2} color={color} style={isSpinning ? { animation: "spin 0.5s ease" } : undefined} />
        {label}
      </button>
    </>
  );
}

// Primary button
function PrimaryButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: isHovered ? "#15803D" : "#16A34A",
        color: "#ffffff",
        border: "none",
        boxShadow: isHovered ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
      }}
    >
      <Icon size={16} strokeWidth={2.5} />
      {label}
    </button>
  );
}

export const ListView: React.FC<ListViewProps> = ({ 
  staff, 
  filtered, 
  query, 
  fStatus, 
  fBranch, 
  fStaffType, 
  onBack, 
  onCreate, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onQueryChange, 
  onStatusChange, 
  onBranchChange, 
  onStaffTypeChange, 
  onRefresh, 
  toast 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => { 
    setIsRefreshing(true); 
    onRefresh(); 
    setTimeout(() => setIsRefreshing(false), 500); 
  };
  
  const handleExcelImport = (file: File) => { 
    console.log("Excel file selected:", file.name);
    alert(`Importing staff data from ${file.name}`);
  };
  
  const handleExport = () => {
    const headers = ['First Name', 'Last Name', 'ID Number', 'Designation', 'Email', 'Phone', 'Branch', 'Status', 'Salary', 'TSC Number'];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => [
        s.firstName, s.lastName, s.idNumber, s.designation, s.email, s.mobilePhone, s.branch, s.jobStatus, s.salary, s.tscNumber
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    alert('Staff data exported successfully!');
  };

  const teachingCount = staff.filter(s => s.staffType === "teaching").length;
  const nonTeachingCount = staff.filter(s => s.staffType === "non-teaching").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      
      {/* Top Navigation */}
      <TopNav 
        crumb="Staff Management" 
        onBack={onBack} 
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <ActionButton icon={FileDown} label="Export" color="#16A34A" bg="#DCFCE7" borderColor="rgba(22,163,74,0.2)" onClick={handleExport} />
            <PrimaryButton icon={UserPlus} label="Add Staff" onClick={onCreate} />
          </div>
        } 
      />

      {/* Hero Section with Stats */}
      <div style={{ 
        background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
        borderBottom: "1px solid rgba(34,197,94,0.15)",
        padding: "24px 24px 28px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0, marginBottom: 4 }}>Staff Directory</h1>
              <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Manage your school staff members</p>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#DBEAFE", borderRadius: 10, border: "1px solid #93C5FD" }}>
                <GraduationCap size={18} color="#2563EB" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>Teachers: {teachingCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#FED7AA", borderRadius: 10, border: "1px solid #FDBA74" }}>
                <Briefcase size={18} color="#C2410C" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#C2410C" }}>Non-Teachers: {nonTeachingCount}</span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
            {(["All", "Active", "On Leave", "Inactive"] as const).map(label => {
              const config = STATUS_COLORS[label];
              const count = label === "All" ? staff.length : staff.filter(s => s.jobStatus === label).length;
              return <StatusCard key={label} label={label} count={count} config={config} />;
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        background: "#ffffff", 
        borderBottom: "1px solid #E5E7EB", 
        padding: "14px 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 280 }}>
            <Search size={15} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              value={query} 
              onChange={e => onQueryChange(e.target.value)} 
              placeholder="Search name, email, TSC..." 
              style={{ 
                width: "100%", 
                padding: "10px 12px 10px 38px", 
                border: "1px solid #E5E7EB", 
                borderRadius: 8, 
                fontSize: 13, 
                color: "#111827", 
                background: "#ffffff", 
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#16A34A"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
            />
          </div>
          
          {/* Staff Type Filter */}
          <select 
            value={fStaffType} 
            onChange={e => onStaffTypeChange(e.target.value)} 
            style={{ 
              padding: "10px 32px 10px 12px", 
              border: "1px solid #E5E7EB", 
              borderRadius: 8, 
              fontSize: 13, 
              color: "#111827", 
              background: "#ffffff", 
              cursor: "pointer", 
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 150,
            }}
          >
            <option value="all">All Staff</option>
            {STAFF_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          
          {/* Status Filter */}
          <select 
            value={fStatus} 
            onChange={e => onStatusChange(e.target.value)} 
            style={{ 
              padding: "10px 32px 10px 12px", 
              border: "1px solid #E5E7EB", 
              borderRadius: 8, 
              fontSize: 13, 
              color: "#111827", 
              background: "#ffffff", 
              cursor: "pointer", 
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 140,
            }}
          >
            <option value="all">All Status</option>
            {Object.keys(STATUS_CFG).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          
          {/* Branch Filter */}
          <select 
            value={fBranch} 
            onChange={e => onBranchChange(e.target.value)} 
            style={{ 
              padding: "10px 32px 10px 12px", 
              border: "1px solid #E5E7EB", 
              borderRadius: 8, 
              fontSize: 13, 
              color: "#111827", 
              background: "#ffffff", 
              cursor: "pointer", 
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 160,
            }}
          >
            <option value="all">All Branches</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <ActionButton icon={FileUp} label="Import" color="#7C3AED" bg="#EDE9FE" borderColor="rgba(124,58,237,0.2)" accept=".xlsx,.xls,.csv" onFileSelect={handleExcelImport} />
            <ActionButton icon={RefreshCw} label="Refresh" color="#0891B2" bg="#CFFAFE" borderColor="rgba(8,145,178,0.2)" onClick={handleRefresh} isSpinning={isRefreshing} />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px 0" }}>
        <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{filtered.length} staff member{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Staff List - Desktop Table View */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: 12, border: "1px dashed #D1D5DB" }}>
            <div style={{ width: 56, height: 56, background: "#F3F4F6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Users size={24} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No staff found</div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Try adjusting your search or filter criteria</div>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "2fr 1.8fr 1.5fr 1fr 1.2fr", 
              alignItems: "center", 
              padding: "12px 20px", 
              background: "linear-gradient(135deg, #F9FAFB, #F3F4F6)", 
              borderRadius: "10px 10px 0 0",
              border: "1px solid #E5E7EB",
              borderBottom: "none",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Staff Info</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location & TSC</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", paddingRight: 12 }}>Salary</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
            </div>
            
            {/* Desktop Table Body */}
            <div style={{ 
              background: "#ffffff", 
              border: "1px solid #E5E7EB", 
              borderRadius: "0 0 10px 10px", 
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              {filtered.map((s, i) => (
                <StaffCard 
                  key={s.id} 
                  staff={s} 
                  index={i}
                  onView={() => onViewDetails(s)} 
                  onEdit={() => onEdit(s)} 
                  onDelete={() => onDelete(s.id)} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
};
