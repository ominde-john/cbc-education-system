import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  Users,
  Target,
  Activity,
  Trash2,
  X,
  CheckCircle,
  Clock,
  Calendar,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GRADIENTS, DAYS, MOCK_TIMETABLE, MOCK_LEARNERS } from "../constants";
import { ClassItem } from "../types";

interface DetailViewProps {
  selected: ClassItem;
  onToggleActive: (cls: ClassItem) => void;
  onDeleteClick: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  selected,
  onToggleActive,
  onDeleteClick,
}) => {
  const pct = selected.capacity ? Math.round((selected.learner_count / selected.capacity) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="rounded-3xl border border-gray-200 shadow-sm bg-white overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex items-start gap-4 flex-1">
              <div className={cn("p-3 rounded-2xl bg-gradient-to-br text-white shadow-md", GRADIENTS.primary)}>
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {selected.grade_level}
                  {selected.stream_name && ` — ${selected.stream_name}`}
                </h2>
                <p className="text-sm text-gray-600 mt-2">{selected.branch?.name}</p>
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-indigo-50 px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4 text-indigo-600" />
                    {selected.learner_count} learners
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Target className="h-4 w-4 text-amber-600" />
                    {pct}% capacity
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                onClick={() => onToggleActive(selected)}
              >
                {selected.is_active ? <X className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                {selected.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl gap-1.5 font-semibold"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {[
          { label: "Students", value: selected.learner_count, icon: Users, gradient: GRADIENTS.primary },
          { label: "Capacity", value: selected.capacity || "—", icon: GraduationCap, gradient: GRADIENTS.success },
          { label: "Utilization", value: `${pct}%`, icon: Target, gradient: pct > 80 ? GRADIENTS.danger : GRADIENTS.primary },
          { label: "Status", value: selected.is_active ? "Active" : "Inactive", icon: Activity, gradient: selected.is_active ? GRADIENTS.success : "from-gray-600 to-gray-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-5 flex items-center gap-3">
              <div className={cn("p-3 rounded-lg bg-gradient-to-br text-white", s.gradient)}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase text-gray-600">{s.label}</p>
                <p className="font-bold text-lg text-gray-900 truncate">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="learners" className="space-y-6">
        <TabsList className="bg-gray-100 rounded-xl border border-gray-200">
          <TabsTrigger value="learners" className="rounded-lg data-[state=active]:bg-white font-semibold">
            <Users className="h-4 w-4 mr-2" /> Learners
          </TabsTrigger>
          <TabsTrigger value="timetable" className="rounded-lg data-[state=active]:bg-white font-semibold">
            <Clock className="h-4 w-4 mr-2" /> Timetable
          </TabsTrigger>
          <TabsTrigger value="subjects" className="rounded-lg data-[state=active]:bg-white font-semibold">
            <BookOpen className="h-4 w-4 mr-2" /> Subjects
          </TabsTrigger>
        </TabsList>

        {/* Learners Tab */}
        <TabsContent value="learners">
          <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-200">
              <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", GRADIENTS.primary)}>
                  <Users className="h-5 w-5" />
                </div>
                Enrolled Learners
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50">
                      <TableHead className="font-bold text-gray-900">Name</TableHead>
                      <TableHead className="font-bold text-gray-900">Adm No.</TableHead>
                      <TableHead className="font-bold text-gray-900">Gender</TableHead>
                      <TableHead className="font-bold text-gray-900">Enrolled</TableHead>
                      <TableHead className="font-bold text-gray-900">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LEARNERS.map((l) => (
                      <TableRow key={l.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-semibold text-gray-900">{l.first_name} {l.last_name}</TableCell>
                        <TableCell className="text-gray-600">{l.admission_number}</TableCell>
                        <TableCell className="text-gray-600">{l.gender}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{new Date(l.enrollment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={cn(l.status === "enrolled" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
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
          <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-200">
              <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", GRADIENTS.primary)}>
                  <Clock className="h-5 w-5" />
                </div>
                Weekly Timetable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {DAYS.map((day) => {
                const slots = MOCK_TIMETABLE[day] || [];
                return (
                  <div key={day} className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      {day}
                    </h4>
                    {slots.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-semibold">No periods scheduled</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slots.map((slot) => (
                          <div key={slot.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs rounded-full border-gray-300">
                                Period {slot.period_number}
                              </Badge>
                              <span className="text-xs font-semibold text-gray-600">{slot.start_time}–{slot.end_time}</span>
                            </div>
                            <p className="font-bold text-sm text-gray-900">{slot.learning_area?.name || "—"}</p>
                            <p className="text-xs text-gray-600 mt-1 font-semibold">{slot.teacher?.name}</p>
                            {slot.room && <p className="text-xs text-gray-600 mt-1">{slot.room}</p>}
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
          <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-200">
              <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", GRADIENTS.primary)}>
                  <BookOpen className="h-5 w-5" />
                </div>
                Subject Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { subject: "Mathematics", teacher: "Jane Wanjiku", periods: 5 },
                  { subject: "English", teacher: "Peter Ochieng", periods: 5 },
                  { subject: "Kiswahili", teacher: "John Kamau", periods: 4 },
                  { subject: "Science & Technology", teacher: "Mary Akinyi", periods: 4 },
                  { subject: "Social Studies", teacher: "Samuel Mwangi", periods: 3 },
                  { subject: "Creative Arts", teacher: "Grace Njeri", periods: 3 },
                ].map((sa) => (
                  <div key={sa.subject} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", GRADIENTS.primary)}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{sa.subject}</p>
                        <p className="text-xs text-gray-600">{sa.teacher}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-gray-300">
                      {sa.periods} /week
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
