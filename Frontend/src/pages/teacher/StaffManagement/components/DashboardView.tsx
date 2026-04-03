import React, { useState } from "react";
import { Users, UserPlus, Download, Award, UserCheck, Clock, MapPin, Briefcase, Search, ChevronRight, TrendingUp } from "lucide-react";
import { StaffMember } from "../types";
import { TopNav, NavBtn, StatCard, Avatar, StatusBadge, Toast } from "./index";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  staff: StaffMember[];
  onBack?: () => void;
  onViewList: () => void;
  onCreate: () => void;
  onViewPerformance?: () => void;
  toast: string | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  staff, onBack, onViewList, onCreate, onViewPerformance, toast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const activeStaff = staff.filter(s => s.jobStatus === "Active").length;
  const onLeaveStaff = staff.filter(s => s.jobStatus === "On Leave").length;
  const branches = [...new Set(staff.map(s => s.branch))].length;
  const teachingStaff = staff.filter(s => s.staffType === "teaching").length;
  const nonTeachingStaff = staff.filter(s => s.staffType === "non-teaching").length;

  const handleImageError = (staffId: string) => {
    setImageErrors(prev => ({ ...prev, [staffId]: true }));
  };

  const quickActions = [
    { icon: UserPlus, label: "Register New Staff", sub: "Add teacher or support staff", action: onCreate, color: "#1A56DB", bg: "#EBF0FF" },
    { icon: Users, label: "View All Staff", sub: "Browse & manage records", action: onViewList, color: "#15803D", bg: "#F0FDF4" },
    { icon: Download, label: "Export Records", sub: "CSV, PDF, or Excel format", action: () => {}, color: "#7C3AED", bg: "#F5F3FF" },
    { icon: Award, label: "Performance", sub: "Attendance & reports", action: onViewPerformance || (() => {}), color: "#B45309", bg: "#FEF3C7" },
  ];

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      <TopNav crumb="Dashboard" onBack={onBack} actions={<NavBtn icon={UserPlus} label="Register Staff" onClick={onCreate} primary />} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-primary/10" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--primary) / 0.12) 50%, hsl(var(--primary) / 0.06) 100%)" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(hsl(var(--primary) / 0.13) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative max-w-[1400px] mx-auto px-6 py-7">
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">Staff Management</h1>
            <p className="text-sm text-muted-foreground">Manage teaching and non-teaching staff records, allocations, and performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Users, label: "Total Staff", value: staff.length, color: "#16a34a", bg: "#F0FDF4", trend: "+2 this month" },
              { icon: UserCheck, label: "Active", value: activeStaff, color: "#15803D", bg: "#F0FDF4", trend: `${Math.round((activeStaff / Math.max(staff.length, 1)) * 100)}% of total` },
              { icon: Clock, label: "On Leave", value: onLeaveStaff, color: "#B45309", bg: "#FFFBEB", trend: "Currently away" },
              { icon: MapPin, label: "Branches", value: branches, color: "#7C3AED", bg: "#F5F3FF", trend: "Locations" },
              { icon: Briefcase, label: "Non-Teaching", value: nonTeachingStaff, color: "#B45309", bg: "#FEF3C7", trend: "Support staff" },
              { icon: Award, label: "Teaching", value: teachingStaff, color: "#4F46E5", bg: "#EEF2FF", trend: "Educators" },
            ].map((stat, idx) => (
              <StatCard key={idx} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} bg={stat.bg} trend={stat.trend} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-7">
        {/* Quick Actions */}
        <div className="mb-7">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ icon: Icon, label, sub, action, color, bg }) => (
              <button
                key={label}
                onClick={action}
                className="group relative bg-card border border-border rounded-2xl p-4 cursor-pointer flex gap-3.5 items-start text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 -translate-y-1/3 translate-x-1/3" style={{ background: bg }} />
                <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground mb-0.5">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground relative z-10 mt-1 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Staff with Photo Support */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center flex-wrap gap-3">
            <div>
              <p className="text-[13px] font-extrabold text-foreground mb-0.5">Recent Staff</p>
              <p className="text-xs text-muted-foreground">Latest additions to your directory</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-1.5">
                <Search size={14} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent text-xs text-foreground outline-none w-full placeholder:text-muted-foreground"
                />
              </div>
              <button onClick={onViewList} className="text-xs font-semibold text-primary flex items-center gap-1 px-2 py-1.5 hover:bg-primary/5 rounded-md transition-colors">
                View all <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div>
            {staff.filter(s => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q);
            }).slice(0, 5).map((s, i, arr) => (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/60",
                  i < arr.length - 1 && "border-b border-border"
                )}
                onClick={() => onViewList?.()}
              >
                {/* Avatar with Photo Support */}
                <div className="relative">
                  {s.photo && !imageErrors[s.id] ? (
                    <img
                      src={s.photo}
                      alt={`${s.firstName} ${s.lastName}`}
                      className="w-[38px] h-[38px] rounded-full object-cover"
                      onError={() => handleImageError(s.id)}
                    />
                  ) : (
                    <Avatar staff={s} size={38} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground mb-0.5">{s.firstName} {s.lastName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {s.designation || 'Teacher'} · {s.branch || 'No Branch'}
                  </p>
                </div>
                <StatusBadge status={s.jobStatus} />
              </div>
            ))}
            
            {staff.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No staff members found</p>
                <button onClick={onCreate} className="text-primary text-sm mt-2 hover:underline">
                  Add your first staff member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
};