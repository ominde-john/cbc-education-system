import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  List,
  Plus,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  School,
  UserCheck,
  Calendar,
  ChevronRight,
  Filter,
  MoreVertical,
  UserPlus,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  Building2,
  MapPin,
  User,
  Timer,
  Download,
  RefreshCw,
  BarChart3,
  Target,
  Zap,
  Award,
  Settings,
  FileText,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
interface ClassItem {
  id: string;
  grade_level: string;
  stream_name: string | null;
  capacity: number | null;
  is_active: boolean;
  learner_count: number;
  class_teacher: { id: string; name: string } | null;
  branch: { id: string; name: string } | null;
  created_at: string;
}

interface TimetableSlot {
  id: string;
  day: string;
  period_number: number;
  start_time: string;
  end_time: string;
  room: string | null;
  learning_area: { name: string; code: string } | null;
  teacher: { name: string } | null;
}

interface Learner {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  gender: string;
  enrollment_date: string;
  status: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const GRADE_LEVELS = [
  "PP1", "PP2",
  "Grade 1", "Grade 2", "Grade 3",
  "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9",
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const MOCK_CLASSES: ClassItem[] = [
  { id: "1", grade_level: "PP1", stream_name: "East", capacity: 35, is_active: true, learner_count: 28, class_teacher: { id: "t1", name: "Jane Wanjiku" }, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "2", grade_level: "PP2", stream_name: "West", capacity: 30, is_active: true, learner_count: 30, class_teacher: { id: "t2", name: "Peter Ochieng" }, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "3", grade_level: "Grade 1", stream_name: "North", capacity: 40, is_active: true, learner_count: 36, class_teacher: { id: "t3", name: "Mary Akinyi" }, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "4", grade_level: "Grade 2", stream_name: null, capacity: 35, is_active: true, learner_count: 32, class_teacher: { id: "t4", name: "John Kamau" }, branch: { id: "b2", name: "Westlands Branch" }, created_at: "2025-01-15" },
  { id: "5", grade_level: "Grade 3", stream_name: "A", capacity: 40, is_active: true, learner_count: 38, class_teacher: null, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "6", grade_level: "Grade 4", stream_name: "B", capacity: 40, is_active: false, learner_count: 0, class_teacher: null, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "7", grade_level: "Grade 5", stream_name: "East", capacity: 45, is_active: true, learner_count: 42, class_teacher: { id: "t5", name: "Samuel Mwangi" }, branch: { id: "b1", name: "Main Campus" }, created_at: "2025-01-15" },
  { id: "8", grade_level: "Grade 6", stream_name: null, capacity: 40, is_active: true, learner_count: 37, class_teacher: { id: "t6", name: "Grace Njeri" }, branch: { id: "b2", name: "Westlands Branch" }, created_at: "2025-01-15" },
];

const MOCK_TIMETABLE: Record<string, TimetableSlot[]> = {
  monday: [
    { id: "s1", day: "monday", period_number: 1, start_time: "08:00", end_time: "08:40", room: "Room 1A", learning_area: { name: "Mathematics", code: "MATH" }, teacher: { name: "Jane Wanjiku" } },
    { id: "s2", day: "monday", period_number: 2, start_time: "08:40", end_time: "09:20", room: "Room 1A", learning_area: { name: "English", code: "ENG" }, teacher: { name: "Peter Ochieng" } },
    { id: "s3", day: "monday", period_number: 3, start_time: "09:40", end_time: "10:20", room: "Lab 1", learning_area: { name: "Science & Technology", code: "SCI" }, teacher: { name: "Mary Akinyi" } },
    { id: "s4", day: "monday", period_number: 4, start_time: "10:20", end_time: "11:00", room: "Room 1A", learning_area: { name: "Kiswahili", code: "KSW" }, teacher: { name: "John Kamau" } },
  ],
  tuesday: [
    { id: "s5", day: "tuesday", period_number: 1, start_time: "08:00", end_time: "08:40", room: "Room 1A", learning_area: { name: "Social Studies", code: "SS" }, teacher: { name: "Samuel Mwangi" } },
    { id: "s6", day: "tuesday", period_number: 2, start_time: "08:40", end_time: "09:20", room: "Room 1A", learning_area: { name: "Mathematics", code: "MATH" }, teacher: { name: "Jane Wanjiku" } },
  ],
  wednesday: [
    { id: "s7", day: "wednesday", period_number: 1, start_time: "08:00", end_time: "08:40", room: "Art Room", learning_area: { name: "Creative Arts", code: "ART" }, teacher: { name: "Grace Njeri" } },
  ],
  thursday: [],
  friday: [],
};

const MOCK_LEARNERS: Learner[] = [
  { id: "l1", first_name: "Alice", last_name: "Muthoni", admission_number: "ADM001", gender: "Female", enrollment_date: "2025-01-10", status: "enrolled" },
  { id: "l2", first_name: "Brian", last_name: "Kipchoge", admission_number: "ADM002", gender: "Male", enrollment_date: "2025-01-10", status: "enrolled" },
  { id: "l3", first_name: "Christine", last_name: "Wambui", admission_number: "ADM003", gender: "Female", enrollment_date: "2025-01-12", status: "enrolled" },
  { id: "l4", first_name: "David", last_name: "Otieno", admission_number: "ADM004", gender: "Male", enrollment_date: "2025-02-01", status: "enrolled" },
  { id: "l5", first_name: "Esther", last_name: "Nyambura", admission_number: "ADM005", gender: "Female", enrollment_date: "2025-01-10", status: "withdrawn" },
];

// ─── Views ──────────────────────────────────────────────────────────────────
type View = "dashboard" | "list" | "detail";

const Classes = () => {
  const [view, setView] = useState<View>("dashboard");
  const [classes, setClasses] = useState<ClassItem[]>(MOCK_CLASSES);
  const [selected, setSelected] = useState<ClassItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create form state
  const [formGrade, setFormGrade] = useState("");
  const [formStream, setFormStream] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formTeacher, setFormTeacher] = useState("");

  const branches = [...new Set(classes.map(c => c.branch?.name).filter(Boolean))];

  const filtered = classes.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.grade_level.toLowerCase().includes(q) ||
      (c.stream_name?.toLowerCase().includes(q) ?? false) ||
      (c.class_teacher?.name.toLowerCase().includes(q) ?? false);
    const matchGrade = filterGrade === "all" || c.grade_level === filterGrade;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && c.is_active) ||
      (filterStatus === "inactive" && !c.is_active);
    const matchBranch = filterBranch === "all" || c.branch?.name === filterBranch;
    return matchSearch && matchGrade && matchStatus && matchBranch;
  });

  const totalLearners = classes.reduce((sum, c) => sum + c.learner_count, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const activeClasses = classes.filter((c) => c.is_active).length;
  const fullClasses = classes.filter(
    (c) => c.capacity && c.learner_count >= c.capacity
  ).length;
  const utilizationRate = totalCapacity ? Math.round((totalLearners / totalCapacity) * 100) : 0;

  const resetForm = () => {
    setFormGrade("");
    setFormStream("");
    setFormCapacity("");
    setFormTeacher("");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data refreshed");
    }, 1000);
  };

  const handleCreate = () => {
    if (!formGrade) {
      toast.error("Please select a grade level");
      return;
    }
    const newClass: ClassItem = {
      id: Date.now().toString(),
      grade_level: formGrade,
      stream_name: formStream || null,
      capacity: formCapacity ? parseInt(formCapacity) : null,
      is_active: true,
      learner_count: 0,
      class_teacher: null,
      branch: { id: "b1", name: "Main Campus" },
      created_at: new Date().toISOString(),
    };
    setClasses([...classes, newClass]);
    setShowCreateDialog(false);
    resetForm();
    toast.success(`Class ${formGrade}${formStream ? ` ${formStream}` : ""} created`);
  };

  const handleDelete = () => {
    if (!selected) return;
    if (selected.learner_count > 0) {
      toast.error(`Cannot delete — ${selected.learner_count} learners enrolled`);
      setShowDeleteDialog(false);
      return;
    }
    setClasses(classes.filter((c) => c.id !== selected.id));
    setShowDeleteDialog(false);
    setSelected(null);
    setView("dashboard");
    toast.success("Class deleted successfully");
  };

  const handleToggleActive = (cls: ClassItem) => {
    setClasses(
      classes.map((c) =>
        c.id === cls.id ? { ...c, is_active: !c.is_active } : c
      )
    );
    toast.success(`Class ${cls.is_active ? "deactivated" : "activated"}`);
  };

  // ─── Dashboard View ─────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                <School className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">Classes Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage classes, streams, timetables and learner enrollment across all branches
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{activeClasses} active classes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>{totalLearners} enrolled learners</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Target className="h-3.5 w-3.5 text-amber-500" />
                    <span>{utilizationRate}% utilization</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 hover:shadow-md transition-all duration-200"
                onClick={handleRefresh}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              <Button
                size="sm"
                className="rounded-xl gap-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4" /> New Class
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Classes",
            value: classes.length,
            icon: School,
            trend: `+${activeClasses} active`,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            gradient: "from-blue-500 to-blue-600"
          },
          {
            label: "Active Classes",
            value: activeClasses,
            icon: CheckCircle,
            trend: `${Math.round((activeClasses / Math.max(classes.length, 1)) * 100)}% of total`,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            gradient: "from-emerald-500 to-emerald-600"
          },
          {
            label: "Total Learners",
            value: totalLearners,
            icon: Users,
            trend: `Capacity: ${totalCapacity}`,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
            gradient: "from-purple-500 to-purple-600"
          },
          {
            label: "Full Classes",
            value: fullClasses,
            icon: AlertCircle,
            trend: `${fullClasses} at capacity`,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
            gradient: "from-amber-500 to-amber-600"
          },
        ].map((stat) => (
          <Card key={stat.label} className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1", stat.border)}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
                <div className={cn("p-3 rounded-xl bg-gradient-to-br", stat.bg, stat.gradient, "text-white shadow-sm")}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Capacity & Branch Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Capacity Overview */}
        <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Capacity Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Enrollment</span>
              <span className="font-semibold text-foreground">{totalLearners} / {totalCapacity} students</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  utilizationRate > 90 ? "bg-gradient-to-r from-amber-500 to-red-500" :
                  utilizationRate > 75 ? "bg-gradient-to-r from-primary to-primary/80" :
                  "bg-gradient-to-r from-emerald-500 to-emerald-600"
                )}
                style={{ width: `${utilizationRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{utilizationRate}% utilized</span>
              <span>{totalCapacity - totalLearners} seats available</span>
            </div>
          </CardContent>
        </Card>

        {/* Branch Distribution */}
        <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Branch Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branches.map(branch => {
                const branchClasses = classes.filter(c => c.branch?.name === branch);
                const branchEnrollment = branchClasses.reduce((sum, c) => sum + c.learner_count, 0);
                const branchCapacity = branchClasses.reduce((sum, c) => sum + (c.capacity || 0), 0);
                const branchUtilization = branchCapacity ? Math.round((branchEnrollment / branchCapacity) * 100) : 0;

                return (
                  <div key={branch} className="group flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all cursor-pointer border border-transparent hover:border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{branch}</p>
                        <p className="text-xs text-muted-foreground">
                          {branchClasses.length} classes • {branchEnrollment} learners
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{branchUtilization}%</p>
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            branchUtilization > 90 ? "bg-red-500" :
                            branchUtilization > 75 ? "bg-amber-500" : "bg-primary"
                          )}
                          style={{ width: `${Math.min(branchUtilization, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes by Grade - Enhanced */}
      <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Classes by Grade Level
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl text-primary hover:bg-primary/5 transition-colors"
            onClick={() => setView("list")}
          >
            View all <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GRADE_LEVELS.slice(0, 9).map((grade) => {
              const gradeClasses = classes.filter((c) => c.grade_level === grade && c.is_active);
              const enrolled = gradeClasses.reduce((s, c) => s + c.learner_count, 0);
              const cap = gradeClasses.reduce((s, c) => s + (c.capacity || 0), 0);
              const gradePct = cap ? Math.round((enrolled / cap) * 100) : 0;

              return gradeClasses.length > 0 ? (
                <div
                  key={grade}
                  className="group flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all cursor-pointer border border-transparent hover:border-primary/20 hover:shadow-sm"
                  onClick={() => {
                    setFilterGrade(grade);
                    setView("list");
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{grade}</p>
                      <p className="text-xs text-muted-foreground">
                        {gradeClasses.length} stream{gradeClasses.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{enrolled}</p>
                    <p className="text-xs text-muted-foreground">
                      {gradePct}% of {cap}
                    </p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "View All Classes",
            icon: List,
            action: () => setView("list"),
            desc: "Browse and manage all classes",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50"
          },
          {
            label: "Add New Class",
            icon: Plus,
            action: () => setShowCreateDialog(true),
            desc: "Create a new class or stream",
            color: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50"
          },
          {
            label: "Export Data",
            icon: Download,
            action: () => toast.success("Export started"),
            desc: "Download class records",
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-50"
          },
          {
            label: "Enroll Learners",
            icon: UserPlus,
            action: () => setView("list"),
            desc: "Assign students to classes",
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50"
          },
        ].map((action) => (
          <Card
            key={action.label}
            className="rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden hover:-translate-y-1"
            onClick={action.action}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("bg-gradient-to-br p-2.5 rounded-xl text-white shadow-sm", action.color)}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ─── List View ──────────────────────────────────────────────────────────
  const renderList = () => (
    <div className="space-y-5">
      {/* Filters Bar - Enhanced */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by grade, stream, teacher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl h-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl h-10">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {GRADE_LEVELS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl h-10">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-36 rounded-xl h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl gap-1.5 h-10 px-4">
                <Plus className="h-4 w-4" /> Add Class
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(filterGrade !== "all" || filterBranch !== "all" || filterStatus !== "all" || search) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active filters:</span>
              {filterGrade !== "all" && (
                <Badge variant="secondary" className="rounded-full gap-1 px-3 py-1">
                  Grade: {filterGrade}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterGrade("all")} />
                </Badge>
              )}
              {filterBranch !== "all" && (
                <Badge variant="secondary" className="rounded-full gap-1 px-3 py-1">
                  Branch: {filterBranch}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterBranch("all")} />
                </Badge>
              )}
              {filterStatus !== "all" && (
                <Badge variant="secondary" className="rounded-full gap-1 px-3 py-1">
                  Status: {filterStatus}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterStatus("all")} />
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="rounded-full gap-1 px-3 py-1">
                  Search: "{search}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-6 px-2 text-xs"
                onClick={() => {
                  setFilterGrade("all");
                  setFilterBranch("all");
                  setFilterStatus("all");
                  setSearch("");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {classes.length} classes
        </p>
        <Button variant="ghost" size="sm" className="rounded-xl gap-1.5" onClick={handleRefresh}>
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Classes Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((cls) => {
          const pct = cls.capacity ? Math.round((cls.learner_count / cls.capacity) * 100) : 0;
          const isFull = cls.capacity ? cls.learner_count >= cls.capacity : false;
          const getStatusColor = () => {
            if (!cls.is_active) return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
            if (isFull) return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
            if (pct > 80) return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
          };

          const statusColors = getStatusColor();

          return (
            <Card
              key={cls.id}
              className="rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden hover:-translate-y-1"
              onClick={() => {
                setSelected(cls);
                setView("detail");
              }}
            >
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl shadow-sm", statusColors.bg, statusColors.text)}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">
                        {cls.grade_level}
                        {cls.stream_name && (
                          <span className="text-muted-foreground font-normal ml-1">
                            — {cls.stream_name}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground truncate">
                          {cls.branch?.name || "No branch"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={cls.is_active ? "default" : "secondary"}
                    className="rounded-full text-xs shrink-0"
                  >
                    {cls.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Enrollment</span>
                    <span className="font-medium">
                      {cls.learner_count}{cls.capacity ? ` / ${cls.capacity}` : ""}
                    </span>
                  </div>
                  {cls.capacity && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isFull ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  )}
                  {cls.capacity && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{pct}% utilized</span>
                      <span>{cls.capacity - cls.learner_count} seats left</span>
                    </div>
                  )}
                </div>

                {/* Teacher & Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm min-w-0 flex-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      {cls.class_teacher?.name || "No teacher assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">
                      {new Date(cls.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Quick Actions - Hover */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg h-8 px-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(cls);
                      setView("detail");
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg h-8 px-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(cls);
                    }}
                  >
                    {cls.is_active ? <X className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                    {cls.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-12 text-center">
            <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No classes found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl gap-1.5">
                <Plus className="h-4 w-4" /> Create New Class
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterGrade("all");
                  setFilterBranch("all");
                  setFilterStatus("all");
                  setSearch("");
                }}
                className="rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ─── Detail View ────────────────────────────────────────────────────────
  const renderDetail = () => {
    if (!selected) return null;
    const pct = selected.capacity
      ? Math.round((selected.learner_count / selected.capacity) * 100)
      : 0;

    return (
      <div className="space-y-6">
        {/* Hero Header */}
        <Card className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {selected.grade_level}
                    {selected.stream_name && ` — ${selected.stream_name}`}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {selected.branch?.name || "No branch"}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(selected.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                      <span>{selected.learner_count} learners</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Target className="h-3.5 w-3.5 text-amber-500" />
                      <span>{pct}% capacity</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{selected.class_teacher?.name || "No teacher"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 hover:shadow-md transition-all duration-200"
                  onClick={() => handleToggleActive(selected)}
                >
                  {selected.is_active ? <X className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                  {selected.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl gap-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Row - Enhanced */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Enrolled Students",
              value: selected.learner_count,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
              gradient: "from-blue-500 to-blue-600"
            },
            {
              label: "Class Capacity",
              value: selected.capacity || "—",
              icon: School,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              gradient: "from-emerald-500 to-emerald-600"
            },
            {
              label: "Utilization",
              value: `${pct}%`,
              icon: Target,
              color: pct > 80 ? "text-amber-600" : "text-primary",
              bg: pct > 80 ? "bg-amber-50" : "bg-primary/10",
              border: pct > 80 ? "border-amber-100" : "border-primary/20",
              gradient: pct > 80 ? "from-amber-500 to-amber-600" : "from-primary to-primary/80"
            },
            {
              label: "Status",
              value: selected.is_active ? "Active" : "Inactive",
              icon: Activity,
              color: selected.is_active ? "text-emerald-600" : "text-gray-500",
              bg: selected.is_active ? "bg-emerald-50" : "bg-gray-100",
              border: selected.is_active ? "border-emerald-100" : "border-gray-200",
              gradient: selected.is_active ? "from-emerald-500 to-emerald-600" : "from-gray-500 to-gray-600"
            },
          ].map((s) => (
            <Card key={s.label} className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200", s.border)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-sm", s.gradient)}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">{s.label}</p>
                  <p className="font-bold text-lg truncate">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs - Enhanced */}
        <Tabs defaultValue="learners" className="space-y-5">
          <TabsList className="bg-muted/50 rounded-xl p-1 h-12">
            <TabsTrigger value="learners" className="rounded-lg gap-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Users className="h-4 w-4" /> Learners
            </TabsTrigger>
            <TabsTrigger value="timetable" className="rounded-lg gap-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Clock className="h-4 w-4" /> Timetable
            </TabsTrigger>
            <TabsTrigger value="subjects" className="rounded-lg gap-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <BookOpen className="h-4 w-4" /> Subjects
            </TabsTrigger>
          </TabsList>

          {/* Learners Tab */}
          <TabsContent value="learners">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Enrolled Learners
                </CardTitle>
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5 hover:shadow-sm transition-all duration-200">
                  <UserPlus className="h-3.5 w-3.5" /> Enroll Learner
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Adm No.</TableHead>
                        <TableHead className="font-semibold">Gender</TableHead>
                        <TableHead className="font-semibold">Enrolled</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_LEARNERS.map((l) => (
                        <TableRow key={l.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            {l.first_name} {l.last_name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{l.admission_number}</TableCell>
                          <TableCell className="text-muted-foreground">{l.gender}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(l.enrollment_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={l.status === "enrolled" ? "default" : "secondary"}
                              className="rounded-full text-xs"
                            >
                              {l.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timetable Tab */}
          <TabsContent value="timetable">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Weekly Timetable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {DAYS.map((day) => {
                  const slots = MOCK_TIMETABLE[day] || [];
                  return (
                    <div key={day} className="space-y-3">
                      <h4 className="text-sm font-semibold capitalize text-primary flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {day}
                      </h4>
                      {slots.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No periods scheduled</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {slots.map((slot) => (
                            <div
                              key={slot.id}
                              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20 hover:shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                                  Period {slot.period_number}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-medium">
                                  {slot.start_time}–{slot.end_time}
                                </span>
                              </div>
                              <p className="font-semibold text-sm mb-1">
                                {slot.learning_area?.name || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                {slot.teacher?.name || "No teacher"}
                              </p>
                              {slot.room && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{slot.room}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Subject Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { subject: "Mathematics", teacher: "Jane Wanjiku", periods: 5, icon: BookOpen, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
                    { subject: "English", teacher: "Peter Ochieng", periods: 5, icon: BookOpen, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
                    { subject: "Kiswahili", teacher: "John Kamau", periods: 4, icon: BookOpen, color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
                    { subject: "Science & Technology", teacher: "Mary Akinyi", periods: 4, icon: BookOpen, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
                    { subject: "Social Studies", teacher: "Samuel Mwangi", periods: 3, icon: BookOpen, color: "from-red-500 to-red-600", bg: "bg-red-50" },
                    { subject: "Creative Arts", teacher: "Grace Njeri", periods: 3, icon: BookOpen, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50" },
                  ].map((sa) => (
                    <div
                      key={sa.subject}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("bg-gradient-to-br p-2 rounded-lg text-white shadow-sm", sa.color)}>
                          <sa.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{sa.subject}</p>
                          <p className="text-xs text-muted-foreground">{sa.teacher}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full text-xs px-2 py-0.5">
                        {sa.periods} periods/week
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // ─── Top Navigation ─────────────────────────────────────────────────────
  const renderNav = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {view !== "dashboard" && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-muted transition-colors"
            onClick={() => {
              if (view === "detail") setView("list");
              else {
                setView("dashboard");
                setFilterGrade("all");
                setFilterStatus("all");
                setFilterBranch("all");
                setSearch("");
              }
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {view === "dashboard"
              ? "Classes Management"
              : view === "list"
              ? "All Classes"
              : selected
              ? `${selected.grade_level}${selected.stream_name ? ` — ${selected.stream_name}` : ""}`
              : "Class Detail"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {view === "dashboard"
              ? "Manage classes, streams, timetables and learner enrollment"
              : view === "list"
              ? `${filtered.length} classes found`
              : "Class details, learners and timetable"}
          </p>
        </div>
      </div>
      {view === "dashboard" && (
        <div className="hidden sm:flex gap-3">
          <Button variant="outline" className="rounded-xl gap-1.5 hover:shadow-sm transition-all duration-200" onClick={() => setView("list")}>
            <List className="h-4 w-4" /> View All
          </Button>
          <Button className="rounded-xl gap-1.5 shadow-sm hover:shadow-md transition-all duration-200" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" /> New Class
          </Button>
        </div>
      )}
    </div>
  );

  // ─── Dialogs ────────────────────────────────────────────────────────────
  const renderCreateDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Create New Class
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Grade Level *</label>
            <Select value={formGrade} onValueChange={setFormGrade}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_LEVELS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Stream Name</label>
            <Input
              placeholder="e.g. East, West, A, B"
              value={formStream}
              onChange={(e) => setFormStream(e.target.value)}
              className="rounded-xl h-10"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Capacity</label>
            <Input
              type="number"
              placeholder="e.g. 40"
              value={formCapacity}
              onChange={(e) => setFormCapacity(e.target.value)}
              className="rounded-xl h-10"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button className="rounded-xl" onClick={handleCreate}>
            Create Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Delete Class
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {selected?.grade_level}
            {selected?.stream_name ? ` ${selected.stream_name}` : ""}
          </span>
          ? This action cannot be undone.
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="rounded-xl" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 sm:p-6 max-w-7xl mx-auto">
      {renderNav()}
      {view === "dashboard" && renderDashboard()}
      {view === "list" && renderList()}
      {view === "detail" && renderDetail()}
      {renderCreateDialog()}
      {renderDeleteDialog()}
    </div>
  );
};

export default Classes;