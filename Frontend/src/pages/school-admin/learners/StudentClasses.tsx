import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Users,
  GraduationCap,
  UserCheck,
  ArrowLeft,
  TrendingUp,
  BookOpen,
  User,
  Loader2,
} from 'lucide-react';
import { getClasses } from '@/lib/api/classApi';

interface TermPerformance {
  term: string;
  exceeding: number;
  meeting: number;
  approaching: number;
  below: number;
}

interface ClassData {
  id: string;
  grade_level: string;
  stream_name: string | null;
  totalStudents: number;
  classTeacher: string | null;
  branch: string | null;
  is_active: boolean;
  capacity: number | null;
  performance: TermPerformance[]; // Keep for now, could be fetched separately later
}

interface ApiClassItem {
  id: string;
  grade_level: string;
  stream_name: string | null;
  capacity: number | null;
  is_active: boolean;
  learner_count?: number | null;
  teachers?: {
    id: string;
    user_id?: string;
    users?: {
      first_name?: string;
      last_name?: string;
    };
  } | null;
  branches?: {
    id: string;
    name: string;
  } | null;
  branch?: {
    id: string;
    name: string;
  } | null;
  created_at: string;
}

const gradeColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: 'bg-blue-100 text-blue-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'bg-emerald-100 text-emerald-600' },
  { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'bg-purple-100 text-purple-600' },
  { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'bg-orange-100 text-orange-600' },
  { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', icon: 'bg-pink-100 text-pink-600' },
  { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', icon: 'bg-teal-100 text-teal-600' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', icon: 'bg-indigo-100 text-indigo-600' },
  { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'bg-red-100 text-red-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'bg-amber-100 text-amber-600' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-700', icon: 'bg-cyan-100 text-cyan-600' },
];

const StudentClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getClasses();
      const apiClasses = response.data?.classes || [];

      // Transform API data to component format
      const transformedClasses: ClassData[] = apiClasses.map((item: ApiClassItem) => ({
        id: item.id,
        grade_level: item.grade_level,
        stream_name: item.stream_name,
        totalStudents: item.learner_count || 0,
        classTeacher: item.teachers
          ? `${item.teachers.users?.first_name || ''} ${item.teachers.users?.last_name || ''}`.trim() || 'Unassigned'
          : 'Unassigned',
        branch: item.branches?.name || item.branch?.name || null,
        is_active: item.is_active,
        capacity: item.capacity,
        performance: [
          { term: 'Term 1', exceeding: 0, meeting: 0, approaching: 0, below: 0 },
          { term: 'Term 2', exceeding: 0, meeting: 0, approaching: 0, below: 0 },
          { term: 'Term 3', exceeding: 0, meeting: 0, approaching: 0, below: 0 },
        ], // Placeholder - could be fetched from separate API later
      }));

      setClasses(transformedClasses);
    } catch (error) {
      console.error('Failed to load classes:', error);
      toast.error('Failed to load classes from backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  if (selectedClass) {
    const idx = classes.findIndex((c) => c.id === selectedClass.id);
    const colors = gradeColors[idx % gradeColors.length];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedClass(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedClass.grade_level}
            {selectedClass.stream_name ? ` ${selectedClass.stream_name}` : ''} – Class Details
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={`border ${colors.border} ${colors.bg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{selectedClass.totalStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${colors.border} ${colors.bg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Teacher</p>
                <p className="text-base font-semibold">{selectedClass.classTeacher}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${colors.border} ${colors.bg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-base font-semibold">
                  {selectedClass.capacity ? `${selectedClass.totalStudents}/${selectedClass.capacity}` : 'Unlimited'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Per Term */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Performance Per Term</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedClass.performance[0].term}>
              <TabsList className="mb-4">
                {selectedClass.performance.map((p) => (
                  <TabsTrigger key={p.term} value={p.term}>
                    {p.term}
                  </TabsTrigger>
                ))}
              </TabsList>

              {selectedClass.performance.map((p) => {
                const total = selectedClass.totalStudents;
                const pct = (n: number) =>
                  total > 0 ? Math.round((n / total) * 100) : 0;

                return (
                  <TabsContent key={p.term} value={p.term}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Exceeding</p>
                        <p className="text-2xl font-bold text-green-700">{p.exceeding}</p>
                        <p className="text-xs text-green-600 mt-1">{pct(p.exceeding)}%</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Meeting</p>
                        <p className="text-2xl font-bold text-blue-700">{p.meeting}</p>
                        <p className="text-xs text-blue-600 mt-1">{pct(p.meeting)}%</p>
                      </div>
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Approaching</p>
                        <p className="text-2xl font-bold text-amber-700">{p.approaching}</p>
                        <p className="text-xs text-amber-600 mt-1">{pct(p.approaching)}%</p>
                      </div>
                      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Below</p>
                        <p className="text-2xl font-bold text-red-700">{p.below}</p>
                        <p className="text-xs text-red-600 mt-1">{pct(p.below)}%</p>
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="mt-6 space-y-3">
                      {[
                        { label: 'Exceeding', value: p.exceeding, total, color: 'bg-green-500' },
                        { label: 'Meeting', value: p.meeting, total, color: 'bg-blue-500' },
                        { label: 'Approaching', value: p.approaching, total, color: 'bg-amber-500' },
                        { label: 'Below', value: p.below, total, color: 'bg-red-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="w-24 text-sm text-muted-foreground shrink-0">
                            {item.label}
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-right shrink-0">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Student Classes</h1>
          <p className="text-sm text-muted-foreground">
            Select a class to view details
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading classes...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No classes found</h3>
          <p className="text-muted-foreground">No classes are available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls, idx) => {
            const colors = gradeColors[idx % gradeColors.length];
            const displayName = cls.stream_name
              ? `${cls.grade_level} ${cls.stream_name}`
              : cls.grade_level;

            return (
              <Card
                key={cls.id}
                className={`cursor-pointer border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200 hover:scale-[1.02] ${
                  !cls.is_active ? 'opacity-60' : ''
                }`}
                onClick={() => setSelectedClass(cls)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon}`}
                    >
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={`text-xs ${colors.badge} border-0`}>
                        {cls.totalStudents} students
                      </Badge>
                      {!cls.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{displayName}</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">Teacher:</span> {cls.classTeacher}
                  </p>
                  {cls.branch && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Branch:</span> {cls.branch}
                    </p>
                  )}
                  {cls.capacity && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Capacity:</span> {cls.capacity}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
