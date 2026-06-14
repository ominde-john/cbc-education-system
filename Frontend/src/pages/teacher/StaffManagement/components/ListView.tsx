import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Users,
  GraduationCap,
  Briefcase,
  RefreshCw,
  MoreVertical,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { StaffMember, StaffType } from "../types";
import { STATUS_CFG, BRANCHES, STAFF_TYPE_OPTIONS } from "../constants";
import { fmt, initials, avatarBg } from "../helpers";
import { TopNav, Toast } from "./index";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Branch } from "@/lib/api/schoolsApi";

interface ListViewProps {
  staff: StaffMember[];
  filtered: StaffMember[];
  branches: Branch[];
  query: string;
  fStatus: string;
  fBranch: string;
  fStaffType: string;
  onBack: () => void;
  onCreate: () => void;
  onViewDetails: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: string) => void;
  onBranchChange: (b: string) => void;
  onStaffTypeChange: (t: string) => void;
  onRefresh: () => void;
  toast: string | null;
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  trend?: string;
}) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StaffTypeTag({ staffType }: { staffType: StaffType }) {
  const isTeaching = staffType === "teaching";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs gap-1",
        isTeaching
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      )}
    >
      {isTeaching ? (
        <GraduationCap className="w-3 h-3" />
      ) : (
        <Briefcase className="w-3 h-3" />
      )}
      {isTeaching ? "Teacher" : "Support"}
    </Badge>
  );
}

function StatusDot({ status }: { status: string }) {
  const statusLower = status?.toLowerCase();
  const statusColor: Record<string, string> = {
    active: "bg-green-500",
    "on leave": "bg-amber-500",
    inactive: "bg-gray-400",
    terminated: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("w-2 h-2 rounded-full", statusColor[statusLower] || "bg-gray-400")}
      />
      <span className="text-sm text-muted-foreground">{status}</span>
    </div>
  );
}

function StaffRow({
  staff,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  staff: StaffMember;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: (staff: StaffMember) => void;
}) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_80px] gap-4 md:gap-0 md:items-center px-6 py-5 border-b border-border/50 hover:bg-muted/30 transition-colors group">
      {/* Staff Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          {staff.photo ? (
            <img
              src={staff.photo}
              alt={`${staff.firstName} ${staff.lastName}`}
              className="w-12 h-12 rounded-lg object-cover border border-border shadow-sm"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm border border-border"
              style={{
                background: `linear-gradient(135deg, ${avatarBg(staff.id)}, ${avatarBg(staff.id)}dd)`,
              }}
            >
              {initials(staff.firstName, staff.lastName)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {staff.firstName} {staff.lastName}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <StaffTypeTag staffType={staff.staffType} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2 md:pl-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-foreground truncate">{staff.email}</span>
        </div>
        {staff.mobilePhone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground">{staff.mobilePhone}</span>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2 md:pl-4">
        {staff.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground">{staff.branch}</span>
          </div>
        )}
        {staff.tscNumber && (
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground">TSC: {staff.tscNumber}</span>
          </div>
        )}
      </div>

      {/* Salary */}
      <div className="md:pl-4">
        {staff.salary > 0 ? (
          <>
            <p className="text-sm font-semibold text-foreground">
              KSh {fmt(staff.salary)}
            </p>
            <p className="text-xs text-muted-foreground">per month</p>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Not set</span>
        )}
      </div>

      {/* Status */}
      <div className="md:pl-4">
        <StatusDot status={staff.jobStatus} />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onViewDetails} className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2 text-destructive cursor-pointer focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export const ListView: React.FC<ListViewProps> = ({
  staff,
  filtered,
  branches,
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
  toast,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "ID Number",
      "Designation",
      "Email",
      "Phone",
      "Branch",
      "Status",
      "Salary",
      "TSC Number",
    ];
    const rows = filtered.map((s) => [
      s.firstName,
      s.lastName,
      s.idNumber,
      s.designation,
      s.email,
      s.mobilePhone,
      s.branch,
      s.jobStatus,
      s.salary,
      s.tscNumber,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `staff_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const stats = useMemo(() => {
    return {
      total: staff.length,
      teaching: staff.filter((s) => s.staffType === "teaching").length,
      nonTeaching: staff.filter((s) => s.staffType === "non-teaching").length,
      active: staff.filter((s) => {
        const status = s.jobStatus?.toLowerCase().trim();
        return status === "active" || status === "currently working" || (!status && s.isActive !== false);
      }).length,
      onLeave: staff.filter((s) => {
        const status = s.jobStatus?.toLowerCase().trim();
        return status === "on leave" || status === "away";
      }).length,
    };
  }, [staff]);

  const branchOptions = React.useMemo(() => {
    const loaded = branches
      .map((branch) => branch.name?.trim())
      .filter((name): name is string => Boolean(name));
    const staffBranches = staff
      .map((s) => s.branch?.trim())
      .filter((name): name is string => Boolean(name));
    const missing = Array.from(new Set(staffBranches.filter((name) => !loaded.includes(name))));
    return [...loaded, ...missing];
  }, [branches, staff]);

  return (
    <div className="w-full space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onBack} 
                className="flex items-center gap-2 px-4 py-2 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </Button>
              <h1 className="text-3xl font-bold text-foreground">
                Staff Directory
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your school staff members
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={onCreate} size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Staff
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatsCard
            icon={Users}
            label="Total Staff"
            value={stats.total}
            color="#3B82F6"
            trend={`${stats.total} members`}
          />
          <StatsCard
            icon={GraduationCap}
            label="Teachers"
            value={stats.teaching}
            color="#1D4ED8"
            trend="Teaching staff"
          />
          <StatsCard
            icon={Briefcase}
            label="Support Staff"
            value={stats.nonTeaching}
            color="#D97706"
            trend="Non-teaching"
          />
          <StatsCard
            icon={CheckCircle2}
            label="Active"
            value={stats.active}
            color="#16A34A"
            trend="Currently working"
          />
          <StatsCard
            icon={Clock}
            label="On Leave"
            value={stats.onLeave}
            color="#F59E0B"
            trend="Away"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-border p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-4">Filters</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, TSC..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Staff Type Filter */}
          <select
            value={fStaffType}
            onChange={(e) => onStaffTypeChange(e.target.value)}
            className="px-3 py-2 h-9 border border-border rounded-lg text-sm bg-white dark:bg-slate-900 cursor-pointer appearance-none pr-8 hover:border-primary/50 transition-colors"
          >
            <option value="all">All Types</option>
            {STAFF_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={fStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 h-9 border border-border rounded-lg text-sm bg-white dark:bg-slate-900 cursor-pointer appearance-none pr-8 hover:border-primary/50 transition-colors"
          >
            <option value="all">All Status</option>
            {Object.keys(STATUS_CFG).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          {/* Branch Filter */}
          <select
            value={fBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="px-3 py-2 h-9 border border-border rounded-lg text-sm bg-white dark:bg-slate-900 cursor-pointer appearance-none pr-8 hover:border-primary/50 transition-colors"
          >
            <option value="all">All Branches</option>
            {branchOptions.map((branchName) => (
              <option key={branchName} value={branchName}>
                {branchName}
              </option>
            ))}
            <option value="no_branch">No Branch</option>
          </select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground font-medium">
          {filtered.length} staff member{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-1">
                No staff found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_80px] gap-0 bg-muted/50 border-b border-border px-6 py-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Staff
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contact
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Salary
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </p>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/50">
              {filtered.map((s) => (
                <StaffRow
                  key={s.id}
                  staff={s}
                  onViewDetails={() => onViewDetails(s)}
                  onEdit={() => onEdit(s)}
                  onDelete={() => onDelete(s)}
                />
              ))}
            </div>
          </Card>
        )}
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
};