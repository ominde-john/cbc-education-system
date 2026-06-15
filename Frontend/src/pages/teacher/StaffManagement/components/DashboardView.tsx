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
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
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

  const branchTeachingData = useMemo(() => {
    const map: Record<string, { teaching: number; nonTeaching: number }> = {};
    staff.forEach((s) => {
      const branch = s.branch?.trim() || "Unassigned";
      if (!map[branch]) map[branch] = { teaching: 0, nonTeaching: 0 };
      if (s.staffType === "teaching") map[branch].teaching++;
      else map[branch].nonTeaching++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({
        name: name.length > 12 ? name.slice(0, 12) + "…" : name,
        Teaching: d.teaching,
        "Non-Teaching": d.nonTeaching,
      }))
      .sort((a, b) => (b.Teaching + b["Non-Teaching"]) - (a.Teaching + a["Non-Teaching"]))
      .slice(0, 6);
  }, [staff]);

  const activeRateRadial = useMemo(() => {
    return [{ name: "Active Rate", value: stats.activePercent, fill: "#10b981" }];
  }, [stats]);

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
    { icon: UserPlus, label: "Register New Staff", sub: "Add teacher or support staff", action: onCreate, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { icon: Users, label: "View All Staff", sub: "Browse & manage records", action: onViewList, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { icon: Download, label: "Export Records", sub: "CSV, PDF, or Excel format", action: () => {}, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { icon: Award, label: "Performance", sub: "Attendance & reports", action: onViewPerformance || (() => {}), color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
  ];

  const statCards = [
    { icon: Users, label: "Total Staff", value: stats.total, color: "text-blue-600", accent: "bg-blue-500", iconBg: "bg-blue-50 dark:bg-blue-950/40", sub: `${stats.total} member${stats.total !== 1 ? "s" : ""}` },
    { icon: UserCheck, label: "Active", value: stats.active, color: "text-emerald-600", accent: "bg-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-950/40", sub: `${stats.activePercent}% of total` },
    { icon: Clock, label: "On Leave", value: stats.onLeave, color: "text-amber-600", accent: "bg-amber-500", iconBg: "bg-amber-50 dark:bg-amber-950/40", sub: "Currently away" },
    { icon: MapPin, label: "Branches", value: stats.branches, color: "text-violet-600", accent: "bg-violet-500", iconBg: "bg-violet-50 dark:bg-violet-950/40", sub: "Locations" },
    { icon: Briefcase, label: "Non-Teaching", value: stats.nonTeaching, color: "text-rose-600", accent: "bg-rose-500", iconBg: "bg-rose-50 dark:bg-rose-950/40", sub: "Support staff" },
    { icon: GraduationCap, label: "Teaching", value: stats.teaching, color: "text-cyan-600", accent: "bg-cyan-500", iconBg: "bg-cyan-50 dark:bg-cyan-950/40", sub: "Educators" },
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
            <div
              key={stat.label}
              className="relative rounded-xl border border-border/60 bg-card p-4 hover:shadow-md transition-shadow overflow-hidden dark:bg-card"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${stat.accent}`} />
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-3", stat.iconBg)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, sub, action, color, bg }) => (
            <button
              key={label}
              onClick={action}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 dark:bg-card"
            >
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", bg)}>
                <Icon className={cn("h-[18px] w-[18px]", color)} />
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

      {/* ── Charts Section ── */}
      {staff.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Staff Analytics</h2>

          {/* Row 1: Three charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Staff Type Distribution - Donut */}
            <Card className="border-border/60 shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
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
            <Card className="border-border/60 shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
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

            {/* Active Rate Gauge */}
            <Card className="border-border/60 shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  Active Rate
                </CardTitle>
                <CardDescription className="text-xs">Percentage of currently active staff</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-col items-center">
                  <div className="w-[140px] h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        barSize={12}
                        data={activeRateRadial}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={6}
                          background={{ fill: "hsl(var(--muted))" }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center -mt-10">
                    <p className="text-3xl font-extrabold text-foreground">{stats.activePercent}%</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stats.active} of {stats.total} active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Branch charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Staff by Branch - Bar Chart */}
            <Card className="border-border/60 shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                    <BarChart3 className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  Staff by Branch
                </CardTitle>
                <CardDescription className="text-xs">Distribution across locations</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                {branchData.length > 0 ? (
                  <div className="h-[180px]">
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

            {/* Teaching vs Non-Teaching by Branch - Grouped Bar */}
            <Card className="border-border/60 shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-cyan-600" />
                  </div>
                  Staff Type by Branch
                </CardTitle>
                <CardDescription className="text-xs">Teaching vs Non-Teaching per location</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                {branchTeachingData.length > 0 ? (
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={branchTeachingData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="Teaching" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="Non-Teaching" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-8">No branch data</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Designation Breakdown ── */}
      {designationData.length > 1 && (
        <Card className="border-border/60 shadow-sm dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center">
                <Briefcase className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              Staff by Designation
            </CardTitle>
            <CardDescription className="text-xs">Role distribution across your organization</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              {designationData.map((d) => {
                const pct = Math.round((d.value / stats.total) * 100);
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-36 truncate shrink-0">{d.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: d.color }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground w-8 text-right shrink-0">{d.value}</span>
                    <span className="text-[10px] text-muted-foreground w-10 text-right shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Staff Directory ── */}
      <Card className="border-border/60 shadow-sm dark:bg-card">
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

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.designation || "Staff"} · {s.branch || "No Branch"}</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "hidden sm:inline-flex shrink-0 text-[10px]",
                      s.staffType === "teaching"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
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
