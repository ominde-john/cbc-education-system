import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Download,
  Award,
  UserCheck,
  Clock,
  MapPin,
  Briefcase,
  Search,
  ChevronRight,
  Filter,
  MoreVertical,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { StaffMember } from "../types";
import { StatusBadge, Toast } from "./index";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardViewProps {
  staff: StaffMember[];
  onBack?: () => void;
  onViewList: () => void;
  onCreate: () => void;
  onViewPerformance?: () => void;
  toast: string | null;
}

const CHART_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899"];

export const DashboardView: React.FC<DashboardViewProps> = ({
  staff,
  onBack,
  onViewList,
  onCreate,
  onViewPerformance,
  toast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "onleave">("all");
  const [filterType, setFilterType] = useState<"all" | "teaching" | "non-teaching">("all");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const stats = useMemo(() => {
    const active = staff.filter((s) => {
      const status = s.jobStatus?.toLowerCase().trim();
      return status === "active" || status === "currently working" || (!status && s.isActive !== false);
    }).length;
    const onLeave = staff.filter((s) => {
      const status = s.jobStatus?.toLowerCase().trim();
      return status === "on leave" || status === "away";
    }).length;
    const teaching = staff.filter((s) => s.staffType === "teaching").length;
    const nonTeaching = staff.filter((s) => s.staffType === "non-teaching").length;
    const branches = new Set(
      staff
        .map((s) => s.branch?.trim())
        .filter((name): name is string => Boolean(name))
    ).size;

    return {
      total: staff.length,
      active,
      onLeave,
      teaching,
      nonTeaching,
      branches,
      activePercent: Math.round((active / Math.max(staff.length, 1)) * 100),
    };
  }, [staff]);

  /* ── Chart Data (derived from real staff data) ── */
  const staffTypeData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = [];
    if (stats.teaching > 0) data.push({ name: "Teaching", value: stats.teaching, color: "#3b82f6" });
    if (stats.nonTeaching > 0) data.push({ name: "Non-Teaching", value: stats.nonTeaching, color: "#f59e0b" });
    return data;
  }, [stats]);

  const statusData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = [];
    if (stats.active > 0) data.push({ name: "Active", value: stats.active, color: "#10b981" });
    if (stats.onLeave > 0) data.push({ name: "On Leave", value: stats.onLeave, color: "#f59e0b" });
    const other = stats.total - stats.active - stats.onLeave;
    if (other > 0) data.push({ name: "Other", value: other, color: "#94a3b8" });
    return data;
  }, [stats]);

  const branchData = useMemo(() => {
    const counts: Record<string, number> = {};
    staff.forEach((s) => {
      const branch = s.branch?.trim() || "Unassigned";
      counts[branch] = (counts[branch] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [staff]);

  const designationData = useMemo(() => {
    const counts: Record<string, number> = {};
    staff.forEach((s) => {
      const d = s.designation?.trim() || "Unspecified";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value], i) => ({
        name: name.length > 20 ? name.slice(0, 20) + "…" : name,
        value,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.designation?.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (filterStatus !== "all") {
        if (filterStatus === "active" && s.jobStatus?.toLowerCase() !== "active") return false;
        if (filterStatus === "onleave" && s.jobStatus?.toLowerCase() !== "on leave") return false;
      }
      if (filterType !== "all" && s.staffType !== filterType) return false;
      return true;
    });
  }, [staff, searchQuery, filterStatus, filterType]);

  const handleImageError = (staffId: string) => {
    setImageErrors((prev) => ({ ...prev, [staffId]: true }));
  };

  const quickActions = [
    { icon: UserPlus, label: "Register New Staff", sub: "Add teacher or support staff", action: onCreate, color: "#3b82f6", bg: "#eff6ff" },
    { icon: Users, label: "View All Staff", sub: "Browse & manage records", action: onViewList, color: "#10b981", bg: "#ecfdf5" },
    { icon: Download, label: "Export Records", sub: "CSV, PDF, or Excel format", action: () => {}, color: "#8b5cf6", bg: "#f5f3ff" },
    { icon: Award, label: "Performance", sub: "Attendance & reports", action: onViewPerformance || (() => {}), color: "#f59e0b", bg: "#fffbeb" },
  ];

  const statCards = [
    { icon: Users, label: "Total Staff", value: stats.total, color: "#3b82f6", bg: "bg-blue-50", iconBg: "bg-blue-100", sub: `${stats.total} member${stats.total !== 1 ? "s" : ""}` },
    { icon: UserCheck, label: "Active", value: stats.active, color: "#10b981", bg: "bg-emerald-50", iconBg: "bg-emerald-100", sub: `${stats.activePercent}% of total` },
    { icon: Clock, label: "On Leave", value: stats.onLeave, color: "#f59e0b", bg: "bg-amber-50", iconBg: "bg-amber-100", sub: "Currently away" },
    { icon: MapPin, label: "Branches", value: stats.branches, color: "#8b5cf6", bg: "bg-purple-50", iconBg: "bg-purple-100", sub: "Locations" },
    { icon: Briefcase, label: "Non-Teaching", value: stats.nonTeaching, color: "#ef4444", bg: "bg-red-50", iconBg: "bg-red-100", sub: "Support staff" },
    { icon: GraduationCap, label: "Teaching", value: stats.teaching, color: "#06b6d4", bg: "bg-cyan-50", iconBg: "bg-cyan-100", sub: "Educators" },
  ];

  return (
    <div className="w-full space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <Button variant="outline" size="icon" onClick={onBack} className="shrink-0 h-9 w-9 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">Staff Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage teaching and non-teaching staff records, allocations, and performance</p>
          </div>
        </div>
        <Button onClick={onCreate} className="shrink-0 gap-2 shadow-sm w-full sm:w-auto">
          <UserPlus className="h-4 w-4" />
          Register Staff
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-3", stat.iconBg)}>
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-extrabold text-foreground mt-0.5">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: stat.color }} />
            </Card>
          );
        })}
      </div>

      {/* ── Charts Section ── */}
      {staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Staff Type Distribution - Donut */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-blue-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                </div>
                Staff Type Distribution
              </CardTitle>
              <CardDescription className="text-xs">Teaching vs Non-Teaching</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {staffTypeData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-[130px] h-[130px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={staffTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={58}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {staffTypeData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [val, "Staff"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {staffTypeData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                          <span className="text-xs text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{entry.value}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Total</span>
                        <span className="text-sm font-bold text-foreground">{stats.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">No staff data available</p>
              )}
            </CardContent>
          </Card>

          {/* Status Overview - Donut */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                Status Overview
              </CardTitle>
              <CardDescription className="text-xs">Current staff availability</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {statusData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-[130px] h-[130px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={58}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {statusData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [val, "Staff"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {statusData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                          <span className="text-xs text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{entry.value}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Active Rate</span>
                        <span className="text-sm font-bold text-emerald-600">{stats.activePercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">No staff data available</p>
              )}
            </CardContent>
          </Card>

          {/* Staff by Branch - Bar Chart */}
          <Card className="border-border/60 shadow-sm md:col-span-2 xl:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-3.5 w-3.5 text-purple-600" />
                </div>
                Staff by Branch
              </CardTitle>
              <CardDescription className="text-xs">Distribution across locations</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {branchData.length > 0 ? (
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                        formatter={(val: number) => [val, "Staff"]}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">No branch data</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Designation Breakdown (only if data exists) ── */}
      {designationData.length > 1 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-cyan-100 flex items-center justify-center">
                <Briefcase className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              Staff by Designation
            </CardTitle>
            <CardDescription className="text-xs">Role distribution across your organization</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {designationData.map((d) => (
                <div key={d.name} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xl font-bold text-foreground">{d.value}</span>
                  <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{d.name}</span>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-0.5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.round((d.value / stats.total) * 100)}%`, background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Quick Actions ── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, sub, action, color, bg }) => (
            <button
              key={label}
              onClick={action}
              className="group relative flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon className="h-[18px] w-[18px]" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground truncate">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Staff Directory ── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Staff Directory</CardTitle>
              <CardDescription>{filteredStaff.length} of {staff.length} staff members</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px] sm:min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Status</span>
                    {filterStatus !== "all" && <Badge variant="secondary" className="h-4 px-1 text-[10px]">1</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")} className={filterStatus === "all" ? "bg-primary/10" : ""}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")} className={filterStatus === "active" ? "bg-primary/10" : ""}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("onleave")} className={filterStatus === "onleave" ? "bg-primary/10" : ""}>On Leave</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Type</span>
                    {filterType !== "all" && <Badge variant="secondary" className="h-4 px-1 text-[10px]">1</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("all")} className={filterType === "all" ? "bg-primary/10" : ""}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("teaching")} className={filterType === "teaching" ? "bg-primary/10" : ""}>Teaching</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("non-teaching")} className={filterType === "non-teaching" ? "bg-primary/10" : ""}>Non-Teaching</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={onViewList} className="gap-1.5 h-9">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredStaff.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredStaff.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-muted/40 transition-colors cursor-pointer group"
                  onClick={onViewList}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {s.photo && !imageErrors[s.id] ? (
                      <img
                        src={s.photo}
                        alt={`${s.firstName} ${s.lastName}`}
                        className="h-9 w-9 rounded-full object-cover border border-border"
                        onError={() => handleImageError(s.id)}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                        <span className="text-xs font-semibold text-primary">
                          {s.firstName?.[0]}{s.lastName?.[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.designation || "Staff"} · {s.branch || "No Branch"}</p>
                  </div>

                  {/* Badges */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "hidden sm:inline-flex shrink-0 text-[10px]",
                      s.staffType === "teaching"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {s.staffType === "teaching" ? "Teaching" : "Support"}
                  </Badge>

                  <StatusBadge status={s.jobStatus} />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onViewList}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {filteredStaff.length > 8 && (
                <div className="text-center py-4">
                  <Button variant="outline" size="sm" onClick={onViewList} className="gap-2">
                    View all {filteredStaff.length} staff members
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium mb-1">No staff members found</p>
              <p className="text-xs mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={onCreate} size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add your first staff member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {toast && <Toast msg={toast} />}
    </div>
  );
};
