import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Loader2,
  AlertCircle,
  Users,
  UserCheck,
  User,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ParentInfo {
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface LearnerParent {
  parents: {
    users: ParentInfo;
  } | null;
}

interface Learner {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  date_of_birth: string | null;
  grade_level: string;
  stream_name: string | null;
  gender: string;
  special_needs: boolean | null;
  is_active: boolean;
  created_at: string;
  learner_parents: LearnerParent[] | null;
}

const GRADES = [
  'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
  'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const getPrimaryParent = (learnerParents: Learner['learner_parents']): ParentInfo | null => {
  if (!learnerParents || learnerParents.length === 0) return null;
  return learnerParents[0]?.parents?.users ?? null;
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const formatDateOfBirth = (dob: string): string =>
  new Date(dob).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getPaginationPages = (currentPage: number, totalPages: number): (number | '…')[] => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );
  return pages.reduce<(number | '…')[]>((acc, p, idx, arr) => {
    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
    acc.push(p);
    return acc;
  }, []);
};

const exportToCsv = (students: Learner[]) => {
  const headers = [
    'Adm. No',
    'First Name',
    'Last Name',
    'Grade',
    'Stream',
    'Gender',
    'Date of Birth',
    'Status',
    'Guardian Name',
    'Guardian Phone',
  ];

  const rows = students.map((s) => {
    const parent = getPrimaryParent(s.learner_parents);
    return [
      s.admission_number,
      s.first_name,
      s.last_name,
      s.grade_level,
      s.stream_name ?? '',
      s.gender,
      s.date_of_birth ?? '',
      s.is_active ? 'Active' : 'Inactive',
      parent ? `${parent.first_name} ${parent.last_name}` : '',
      parent?.phone_number ?? '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  const today = new Date().toISOString().split('T')[0];
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `learners_${today}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const StudentManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Learner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.schoolId) {
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('learners')
        .select(`
          *,
          learner_parents (
            parents (
              users (
                first_name,
                last_name,
                phone_number
              )
            )
          )
        `)
        .eq('school_id', user.schoolId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId]);

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGrade, selectedStatus, selectedGender, pageSize]);

  const filteredStudents = useMemo(() =>
    students.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchTerm.toLowerCase()) ||
        student.admission_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || student.grade_level === selectedGrade;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && student.is_active) ||
        (selectedStatus === 'inactive' && !student.is_active);
      const matchesGender =
        selectedGender === 'all' || student.gender.toLowerCase() === selectedGender;
      return matchesSearch && matchesGrade && matchesStatus && matchesGender;
    }),
    [students, searchTerm, selectedGrade, selectedStatus, selectedGender]
  );

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pagedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.is_active).length;
  const inactiveStudents = totalStudents - activeStudents;
  const maleStudents = students.filter((s) => s.gender.toLowerCase() === 'male').length;
  const femaleStudents = students.filter((s) => s.gender.toLowerCase() === 'female').length;

  const hasActiveFilters =
    searchTerm || selectedGrade !== 'all' || selectedStatus !== 'all' || selectedGender !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('all');
    setSelectedStatus('all');
    setSelectedGender('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-destructive" />
          <p className="mt-4 text-destructive">{error}</p>
          <Button onClick={() => void fetchStudents()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Students</h1>
          <p className="text-muted-foreground mt-1">
            View and manage every enrolled learner across all grades and classes.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => exportToCsv(filteredStudents)}
            disabled={filteredStudents.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/school-admin/learners/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Boys</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{maleStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <User className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Girls</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{femaleStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Grade filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gender filter */}
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0 text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {hasActiveFilters ? 'Filtered Results' : 'All Learners'}
              </CardTitle>
              <CardDescription>
                {filteredStudents.length} learner{filteredStudents.length !== 1 ? 's' : ''} found
                {hasActiveFilters && ` (filtered from ${totalStudents})`}
              </CardDescription>
            </div>
            {/* Page-size selector */}
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pagedStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Adm. No</TableHead>
                    <TableHead>Grade / Class</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedStudents.map((student, idx) => {
                    const parent = getPrimaryParent(student.learner_parents);
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <TableRow key={student.id} className="hover:bg-muted/40">
                        <TableCell className="text-muted-foreground text-sm">{rowNumber}</TableCell>

                        {/* Name + avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                {getInitials(student.first_name, student.last_name)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {student.first_name}{student.middle_name ? ` ${student.middle_name}` : ''} {student.last_name}
                              </p>
                              {student.date_of_birth && (
                                <p className="text-xs text-muted-foreground">
                                  DOB: {formatDateOfBirth(student.date_of_birth)}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-sm">{student.admission_number}</TableCell>

                        {/* Grade / stream */}
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.grade_level}</p>
                            {student.stream_name && (
                              <p className="text-xs text-muted-foreground">{student.stream_name}</p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="capitalize">{student.gender}</TableCell>

                        <TableCell>
                          {parent ? (
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-sm truncate max-w-[140px]">
                                {parent.first_name} {parent.last_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Not assigned</span>
                          )}
                        </TableCell>

                        <TableCell className="text-sm">{parent?.phone_number || '—'}</TableCell>

                        <TableCell>
                          <Badge
                            variant={student.is_active ? 'default' : 'secondary'}
                            className={student.is_active
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                              : ''}
                          >
                            {student.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/school-admin/learners/profile?id=${student.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/school-admin/learners/add?edit=${student.id}`)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/school-admin/learners/classes?student=${student.id}`)
                                }
                              >
                                <GraduationCap className="h-4 w-4 mr-2" />
                                View Classes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">
                {hasActiveFilters ? 'No learners match your filters.' : 'No learners enrolled yet.'}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/school-admin/learners/add')}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll First Student
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Showing{' '}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">{filteredStudents.length}</span>{' '}
            learner{filteredStudents.length !== 1 ? 's' : ''}
            {inactiveStudents > 0 && (
              <span className="ml-2 text-muted-foreground">
                ({inactiveStudents} inactive)
              </span>
            )}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {/* Page numbers */}
            {getPaginationPages(currentPage, totalPages).map((item, idx) =>
              item === '…' ? (
                <span key={`ellipsis-${idx}`} className="px-2">…</span>
              ) : (
                <Button
                  key={item}
                  variant={currentPage === item ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 p-0"
                  onClick={() => setCurrentPage(item as number)}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
