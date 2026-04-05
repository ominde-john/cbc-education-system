import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';
import { AuthService } from '@/lib/auth';
import {
  ArrowLeft,
  Save,
  X,
  User,
  Users,
  Camera,
  Info,
  GraduationCap,
  CheckCircle2,
  Upload,
  Sparkles,
  Clock,
  AlertTriangle,
  FileText,
  Pill,
} from 'lucide-react';

interface StudentDetailsProps {
  studentId?: number;
  onBack?: () => void;
}

interface StudentData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  admissionNumber: string;
  gradeLevel: string;
  specialNeeds: string;
  admissionDate?: string;
  previousSchool?: string;
}

interface ParentData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  nationalId: string;
  occupation: string;
  address: string;
}

interface FormError {
  [key: string]: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const GRADES = [
  'Play Group',
  'PP1',
  'PP2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
];

const RELATIONSHIPS = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Grandparent', label: 'Grandparent' },
  { value: 'Other', label: 'Other' },
];

const TABS: TabConfig[] = [
  {
    id: 'student',
    label: 'Student Info',
    icon: <GraduationCap className="w-4 h-4" />,
    description: 'Personal and academic details',
  },
  {
    id: 'parent',
    label: 'Guardian Details',
    icon: <Users className="w-4 h-4" />,
    description: 'Parent or guardian information',
  },
  {
    id: 'health',
    label: 'Health & Special Needs',
    icon: <Pill className="w-4 h-4" />,
    description: 'Medical and accommodation info',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText className="w-4 h-4" />,
    description: 'Birth cert, documents upload',
  },
];

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId, onBack }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('student');
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [student, setStudent] = useState<StudentData>({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    admissionNumber: '',
    gradeLevel: '',
    specialNeeds: '',
    admissionDate: '',
    previousSchool: '',
  });

  const [parent, setParent] = useState<ParentData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    relationship: '',
    nationalId: '',
    occupation: '',
    address: '',
  });

  useEffect(() => {
    if (studentId) {
      setStudent({
        firstName: 'PETER',
        middleName: '',
        lastName: 'VALERO',
        gender: 'male',
        dateOfBirth: '2019-09-16',
        admissionNumber: 'ADM001',
        gradeLevel: 'Grade 1',
        specialNeeds: '',
        admissionDate: '2024-01-15',
        previousSchool: 'St. Anne Primary',
      });
      setParent({
        firstName: 'John',
        lastName: 'Valero',
        email: 'parent@example.com',
        phoneNumber: '0795387869',
        relationship: 'Father',
        nationalId: '12345678',
        occupation: 'Engineer',
        address: '123 Main Street, Nairobi, Kenya',
      });
      setLastSaved(new Date());
    }
  }, [studentId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPG, PNG, and WebP images are supported');
        return;
      }
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const handleStudentChange = (field: keyof StudentData, value: string) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleParentChange = (field: keyof ParentData, value: string) => {
    setParent((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    if (!student.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!student.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!student.gender) newErrors.gender = 'Gender is required';
    if (!student.gradeLevel) newErrors.gradeLevel = 'Grade level is required';

    if (!parent.firstName.trim()) newErrors.parentFirstName = 'Parent first name is required';
    if (!parent.lastName.trim()) newErrors.parentLastName = 'Parent last name is required';
    if (!parent.email.trim()) newErrors.email = 'Email is required';
    if (parent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!parent.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!parent.relationship) newErrors.relationship = 'Relationship is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix all errors before saving');
      return;
    }

    setIsSaving(true);

    const payload = {
      admissionNumber: student.admissionNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      gradeLevel: student.gradeLevel,
      specialNeeds: student.specialNeeds,
      admissionDate: student.admissionDate,
      previousSchool: student.previousSchool,
      parentEmail: parent.email,
      parentFirstName: parent.firstName,
      parentLastName: parent.lastName,
      parentPhoneNumber: parent.phoneNumber,
      parentNationalId: parent.nationalId,
      parentOccupation: parent.occupation,
      parentRelationship: parent.relationship,
      parentAddress: parent.address,
    };

    try {
      await AuthService.registerLearner(payload);
      setLastSaved(new Date());
      setHasChanges(false);
      toast.success(studentId ? 'Student updated successfully' : 'Student registered successfully');
      setTimeout(() => navigate('/school-admin/learners'), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save student. Please try again.';
      console.error('Save error:', error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowUnsavedDialog(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/school-admin/learners');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {studentId ? 'Edit Student Record' : 'Register New Student'}
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                  {studentId
                    ? 'Update student and guardian information'
                    : 'Complete all sections to enroll a new learner'}
                </p>
              </div>
            </div>

            {lastSaved && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs text-emerald-700 font-medium">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2">
            <Badge variant={studentId ? 'secondary' : 'default'} className="rounded-full text-xs">
              {studentId ? 'Editing' : 'New Enrollment'}
            </Badge>
            {hasChanges && (
              <Badge variant="outline" className="rounded-full bg-orange-50 text-orange-700 border-orange-200 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Unsaved Changes
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to leave without saving?
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel className="rounded-lg">Keep Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={navigateBack}
              className="bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Main Content Area ── */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            {/* ── Tab Navigation ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-0 bg-transparent border-b border-slate-100">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-none border-0 py-4 px-2 sm:px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-all duration-200"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ── Student Information Tab ── */}
            <TabsContent value="student" className="space-y-6 animate-in fade-in duration-300 m-0">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow w-full">
                <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-blue-500" />
                
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Student Information</CardTitle>
                      <CardDescription>Personal and academic details for the learner</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8 space-y-8">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center gap-6 pb-6 border-b border-dashed border-slate-200">
                    <div
                      className="relative w-32 h-32 rounded-full cursor-pointer group"
                      onMouseEnter={() => setIsPhotoHovered(true)}
                      onMouseLeave={() => setIsPhotoHovered(false)}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div
                        className={`w-full h-full rounded-full overflow-hidden border-4 transition-all duration-300 shadow-lg ${
                          isPhotoHovered
                            ? 'border-primary shadow-primary/30 scale-105'
                            : 'border-slate-200'
                        }`}
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <User className="w-12 h-12 text-primary/40" />
                          </div>
                        )}
                      </div>

                      <div
                        className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isPhotoHovered ? 'bg-primary/60 opacity-100' : 'bg-primary/60 opacity-0'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="w-5 h-5 text-white" />
                          <span className="text-white text-xs font-medium">Change</span>
                        </div>
                      </div>

                      <div
                        className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-300 ${
                          isPhotoHovered ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Profile Photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Optional • JPG, PNG, WebP up to 5 MB</p>
                    </div>
                  </div>

                  {/* Student Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-medium">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="e.g. Jane"
                          value={student.firstName}
                          onChange={(e) => handleStudentChange('firstName', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.firstName ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="middleName" className="font-medium">
                          Middle Name <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="middleName"
                          placeholder="e.g. Wanjiru"
                          value={student.middleName}
                          onChange={(e) => handleStudentChange('middleName', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-medium">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="e.g. Doe"
                          value={student.lastName}
                          onChange={(e) => handleStudentChange('lastName', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.lastName ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="font-medium">
                          Gender <span className="text-destructive">*</span>
                        </Label>
                        <Select value={student.gender} onValueChange={(v) => handleStudentChange('gender', v)}>
                          <SelectTrigger
                            id="gender"
                            className={`h-10 rounded-lg ${errors.gender ? 'border-destructive' : 'border-slate-200'}`}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.gender}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="font-medium">
                          Date of Birth <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={student.dateOfBirth}
                          onChange={(e) => handleStudentChange('dateOfBirth', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admissionNumber" className="font-medium">
                          Admission Number <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="admissionNumber"
                          placeholder="e.g. ADM-2024-001"
                          value={student.admissionNumber}
                          onChange={(e) => handleStudentChange('admissionNumber', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admissionDate" className="font-medium">
                          Admission Date <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="admissionDate"
                          type="date"
                          value={student.admissionDate}
                          onChange={(e) => handleStudentChange('admissionDate', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradeLevel" className="font-medium">
                          Grade / Class <span className="text-destructive">*</span>
                        </Label>
                        <Select value={student.gradeLevel} onValueChange={(v) => handleStudentChange('gradeLevel', v)}>
                          <SelectTrigger
                            id="gradeLevel"
                            className={`h-10 rounded-lg ${errors.gradeLevel ? 'border-destructive' : 'border-slate-200'}`}
                          >
                            <SelectValue placeholder="Select grade or class" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg max-h-60">
                            {GRADES.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gradeLevel && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.gradeLevel}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="previousSchool" className="font-medium">
                          Previous School <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="previousSchool"
                          placeholder="e.g. St. Anne Primary"
                          value={student.previousSchool}
                          onChange={(e) => handleStudentChange('previousSchool', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialNeeds" className="font-medium">
                        Special Needs <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                      </Label>
                      <Textarea
                        id="specialNeeds"
                        placeholder="Describe any special needs or accommodations required…"
                        value={student.specialNeeds}
                        onChange={(e) => handleStudentChange('specialNeeds', e.target.value)}
                        className="min-h-24 resize-none rounded-lg border-slate-200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Guardian Information Tab ── */}
            <TabsContent value="parent" className="space-y-6 animate-in fade-in duration-300 m-0">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow w-full">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-primary" />

                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Parent / Guardian Information</CardTitle>
                      <CardDescription>Contact details for the student's parent or legal guardian</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8 space-y-6">
                  {/* Info alert */}
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 leading-relaxed">
                      A parent account will be created with these details for portal access. Login credentials will be sent to the provided email address.
                    </p>
                  </div>

                  {/* Parent Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="parentFirstName" className="font-medium">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentFirstName"
                          placeholder="e.g. John"
                          value={parent.firstName}
                          onChange={(e) => handleParentChange('firstName', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.parentFirstName ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.parentFirstName && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.parentFirstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentLastName" className="font-medium">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentLastName"
                          placeholder="e.g. Doe"
                          value={parent.lastName}
                          onChange={(e) => handleParentChange('lastName', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.parentLastName ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.parentLastName && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.parentLastName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentEmail" className="font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          placeholder="e.g. john.doe@email.com"
                          value={parent.email}
                          onChange={(e) => handleParentChange('email', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentPhone" className="font-medium">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentPhone"
                          type="tel"
                          placeholder="e.g. 0712 345 678"
                          value={parent.phoneNumber}
                          onChange={(e) => handleParentChange('phoneNumber', e.target.value)}
                          className={`h-10 rounded-lg transition-all ${
                            errors.phoneNumber ? 'border-destructive focus:ring-destructive/20' : 'border-slate-200'
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="relationship" className="font-medium">
                          Relationship to Student <span className="text-destructive">*</span>
                        </Label>
                        <Select value={parent.relationship} onValueChange={(v) => handleParentChange('relationship', v)}>
                          <SelectTrigger
                            id="relationship"
                            className={`h-10 rounded-lg ${errors.relationship ? 'border-destructive' : 'border-slate-200'}`}
                          >
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            {RELATIONSHIPS.map((rel) => (
                              <SelectItem key={rel.value} value={rel.value}>
                                {rel.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.relationship && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.relationship}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nationalId" className="font-medium">
                          National ID Number <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="nationalId"
                          placeholder="e.g. 12345678"
                          value={parent.nationalId}
                          onChange={(e) => handleParentChange('nationalId', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="occupation" className="font-medium">
                          Occupation <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="occupation"
                          placeholder="e.g. Teacher, Engineer, Business Owner"
                          value={parent.occupation}
                          onChange={(e) => handleParentChange('occupation', e.target.value)}
                          className="h-10 rounded-lg border-slate-200"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="font-medium">
                          Address <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Street address, city, county…"
                          value={parent.address}
                          onChange={(e) => handleParentChange('address', e.target.value)}
                          className="min-h-24 resize-none rounded-lg border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Health & Special Needs Tab ── */}
            <TabsContent value="health" className="space-y-6 animate-in fade-in duration-300 m-0">
              <Card className="overflow-hidden border-0 shadow-lg w-full">
                <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle>Health & Special Needs</CardTitle>
                      <CardDescription>Medical information and accommodations</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      This information helps us provide appropriate support and accommodations for your child.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <Label className="font-medium">Allergies</Label>
                      <Textarea placeholder="List any known allergies or dietary restrictions…" className="min-h-20 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Medical Conditions</Label>
                      <Textarea placeholder="Any chronic conditions, medications, or health concerns…" className="min-h-20 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Learning Disabilities</Label>
                      <Textarea placeholder="Note any learning disabilities or special educational needs…" className="min-h-20 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Required Accommodations</Label>
                      <Textarea placeholder="Describe any accommodations or support needed at school…" className="min-h-20 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Emergency Medical Contact</Label>
                      <Input placeholder="Name and phone number" className="h-10 rounded-lg border-slate-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Documents Tab ── */}
            <TabsContent value="documents" className="space-y-6 animate-in fade-in duration-300 m-0">
              <Card className="overflow-hidden border-0 shadow-lg w-full">
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Documents & Certificates</CardTitle>
                      <CardDescription>Upload required documents for enrollment</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      Upload copies of important documents. All files are stored securely.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {['Birth Certificate', 'Vaccination Records', 'Transfer Certificate', 'Previous Academic Records'].map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center justify-between p-4 rounded-lg border border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0">
                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm">{doc}</p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG • Max 10 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg flex-shrink-0 ml-2">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Sticky Footer Actions ── */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground order-last sm:order-first">
              <span className="text-destructive font-bold">*</span> Required fields
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 sm:flex-none h-10 rounded-lg border-slate-200 hover:border-slate-300"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {studentId ? 'Update Student' : 'Register Student'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;