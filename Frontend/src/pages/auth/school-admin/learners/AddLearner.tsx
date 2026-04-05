import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, ChevronUp, ChevronDown, BookOpen, User, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GradeLevel, Gender } from '@/types';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

type TabValue = 'student' | 'academic' | 'guardian' | 'documents' | 'notes';

export default function AddLearnerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('student');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    student: true,
    academic: false,
    guardian: false,
  });

  const [learnerData, setLearnerData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    gradeLevel: '',
    streamName: '',
    specialNeeds: '',
    previousSchool: '',
    academicYear: new Date().getFullYear().toString(),
  });

  const [parentData, setParentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    occupation: '',
    relationship: '',
  });

  const [documentsData, setDocumentsData] = useState({
    notes: '',
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (
        !learnerData.admissionNumber ||
        !learnerData.firstName ||
        !learnerData.lastName ||
        !learnerData.dateOfBirth ||
        !learnerData.gender ||
        !learnerData.gradeLevel ||
        !parentData.firstName ||
        !parentData.lastName ||
        !parentData.email ||
        !parentData.phoneNumber ||
        !parentData.relationship
      ) {
        throw new Error('Please fill in all required fields.');
      }

      // Check if admission number already exists
      const { data: existingLearner } = await supabase
        .from('learners')
        .select('id')
        .eq('admission_number', learnerData.admissionNumber)
        .single();

      if (existingLearner) {
        throw new Error(
          'A learner with this admission number already exists.'
        );
      }

      // Check if parent email already exists
      const { data: existingParent } = await supabase
        .from('parents')
        .select('id')
        .eq('email', parentData.email)
        .single();

      if (existingParent) {
        throw new Error(
          'A parent account with this email already exists.'
        );
      }

      // Create parent account first
      const { data: parentDataResult, error: parentError } = await supabase
        .from('parents')
        .insert({
          first_name: parentData.firstName,
          last_name: parentData.lastName,
          email: parentData.email,
          phone_number: parentData.phoneNumber,
          national_id: parentData.nationalId,
          occupation: parentData.occupation,
          relationship: parentData.relationship,
          is_active: true,
        })
        .select()
        .single();

      if (parentError) {
        throw parentError;
      }

      // Create learner record
      const { data: learnerDataResult, error: learnerError } = await supabase
        .from('learners')
        .insert({
          admission_number: learnerData.admissionNumber,
          first_name: learnerData.firstName,
          middle_name: learnerData.middleName,
          last_name: learnerData.lastName,
          date_of_birth: learnerData.dateOfBirth,
          gender: learnerData.gender,
          grade_level: learnerData.gradeLevel,
          stream_name: learnerData.streamName,
          special_needs: learnerData.specialNeeds,
          parent_id: parentDataResult.id,
          is_active: true,
        })
        .select()
        .single();

      if (learnerError) {
        // Rollback parent creation if learner creation fails
        await supabase.from('parents').delete().eq('id', parentDataResult.id);
        throw learnerError;
      }

      toast({
        title: 'Learner Enrolled Successfully',
        description: `${learnerData.firstName} ${learnerData.lastName} has been enrolled. Parent account created for ${parentData.firstName} ${parentData.lastName}.`,
      });

      navigate('/school-admin/learners');
    } catch (error: unknown) {
      console.error('Error enrolling learner:', error);
      toast({
        title: 'Enrollment Failed',
        description: getErrorMessage(
          error,
          'Failed to enroll learner. Please try again.'
        ),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLearnerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleParentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-0.5">
          <Link to="/school-admin/learners">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            New Admission Application
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete the form to submit a new student application.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto gap-0">
              <TabsTrigger
                value="student"
                className={cn(
                  'rounded-none border-b-2 px-6 py-4 text-sm font-medium transition-colors',
                  activeTab === 'student'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="w-4 h-4 mr-2" />
                Student Info
              </TabsTrigger>

              <TabsTrigger
                value="academic"
                className={cn(
                  'rounded-none border-b-2 px-6 py-4 text-sm font-medium transition-colors',
                  activeTab === 'academic'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Academic
              </TabsTrigger>

              <TabsTrigger
                value="guardian"
                className={cn(
                  'rounded-none border-b-2 px-6 py-4 text-sm font-medium transition-colors',
                  activeTab === 'guardian'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="w-4 h-4 mr-2" />
                Guardian
              </TabsTrigger>

              <TabsTrigger
                value="documents"
                className={cn(
                  'rounded-none border-b-2 px-6 py-4 text-sm font-medium transition-colors',
                  activeTab === 'documents'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>

              <TabsTrigger
                value="notes"
                className={cn(
                  'rounded-none border-b-2 px-6 py-4 text-sm font-medium transition-colors',
                  activeTab === 'notes'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} noValidate className="w-full">
              {/* Student Tab */}
              <TabsContent value="student" className="p-6 space-y-4 m-0">
                <div className="space-y-4">
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleSection('student')}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-foreground">
                        Student Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Student's personal details.
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:text-foreground">
                      {expandedSections['student'] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {expandedSections['student'] && (
                    <div className="space-y-4 pl-8">
                      <div className="space-y-2">
                        <Label htmlFor="admissionNumber">
                          Admission Number *
                        </Label>
                        <Input
                          id="admissionNumber"
                          name="admissionNumber"
                          placeholder="ADM2024001"
                          value={learnerData.admissionNumber}
                          onChange={handleLearnerChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={learnerData.firstName}
                            onChange={handleLearnerChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input
                            id="middleName"
                            name="middleName"
                            placeholder="Michael"
                            value={learnerData.middleName}
                            onChange={handleLearnerChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            value={learnerData.lastName}
                            onChange={handleLearnerChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">
                            Date of Birth *
                          </Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={learnerData.dateOfBirth}
                            onChange={handleLearnerChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <Select
                            value={learnerData.gender}
                            onValueChange={(value) =>
                              setLearnerData((prev) => ({
                                ...prev,
                                gender: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Gender.MALE}>
                                Male
                              </SelectItem>
                              <SelectItem value={Gender.FEMALE}>
                                Female
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialNeeds">
                          Special Needs (if any)
                        </Label>
                        <Input
                          id="specialNeeds"
                          name="specialNeeds"
                          placeholder="Describe any special requirements"
                          value={learnerData.specialNeeds}
                          onChange={handleLearnerChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Academic Tab */}
              <TabsContent value="academic" className="p-6 space-y-4 m-0">
                <div className="space-y-4">
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleSection('academic')}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-foreground">
                        Academic
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Academic placement details.
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:text-foreground">
                      {expandedSections['academic'] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {expandedSections['academic'] && (
                    <div className="space-y-4 pl-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Grade/Class Applying For *</Label>
                          <Select
                            value={learnerData.gradeLevel}
                            onValueChange={(value) =>
                              setLearnerData((prev) => ({
                                ...prev,
                                gradeLevel: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(GradeLevel).map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="academicYear">
                            Academic Year *
                          </Label>
                          <Input
                            id="academicYear"
                            name="academicYear"
                            placeholder="2025-26"
                            value={learnerData.academicYear}
                            onChange={handleLearnerChange}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            The academic year the applicant is applying for.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="previousSchool">
                          Previous School
                        </Label>
                        <Input
                          id="previousSchool"
                          name="previousSchool"
                          placeholder="Name of previous school attended"
                          value={learnerData.previousSchool}
                          onChange={handleLearnerChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streamName">Stream/Section</Label>
                        <Input
                          id="streamName"
                          name="streamName"
                          placeholder="East, West, etc."
                          value={learnerData.streamName}
                          onChange={handleLearnerChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Guardian Tab */}
              <TabsContent value="guardian" className="p-6 space-y-4 m-0">
                <div className="space-y-4">
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleSection('guardian')}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-foreground">
                        Parent/Guardian
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Parent or guardian information.
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:text-foreground">
                      {expandedSections['guardian'] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {expandedSections['guardian'] && (
                    <div className="space-y-4 pl-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentFirstName">
                            First Name *
                          </Label>
                          <Input
                            id="parentFirstName"
                            name="firstName"
                            placeholder="Jane"
                            value={parentData.firstName}
                            onChange={handleParentChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentLastName">
                            Last Name *
                          </Label>
                          <Input
                            id="parentLastName"
                            name="lastName"
                            placeholder="Doe"
                            value={parentData.lastName}
                            onChange={handleParentChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentEmail">
                          Email Address *
                        </Label>
                        <Input
                          id="parentEmail"
                          name="email"
                          type="email"
                          placeholder="parent@email.com"
                          value={parentData.email}
                          onChange={handleParentChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Login credentials will be sent to this email
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentPhone">
                            Phone Number *
                          </Label>
                          <Input
                            id="parentPhone"
                            name="phoneNumber"
                            type="tel"
                            placeholder="+254 7XX XXX XXX"
                            value={parentData.phoneNumber}
                            onChange={handleParentChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationalId">
                            National ID
                          </Label>
                          <Input
                            id="nationalId"
                            name="nationalId"
                            placeholder="12345678"
                            value={parentData.nationalId}
                            onChange={handleParentChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Select
                            value={parentData.relationship}
                            onValueChange={(value) =>
                              setParentData((prev) => ({
                                ...prev,
                                relationship: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">
                                Father
                              </SelectItem>
                              <SelectItem value="mother">
                                Mother
                              </SelectItem>
                              <SelectItem value="guardian">
                                Guardian
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name="occupation"
                            placeholder="Teacher, Engineer, etc."
                            value={parentData.occupation}
                            onChange={handleParentChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="p-6 space-y-4 m-0">
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">
                    Documents can be uploaded later
                  </p>
                  <p className="text-sm mt-1">
                    Birth certificate, transfer letter, etc.
                  </p>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="p-6 space-y-4 m-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                      id="notes"
                      placeholder="Add any additional notes about the student..."
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm font-sans outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      rows={6}
                      value={documentsData.notes}
                      onChange={(e) =>
                        setDocumentsData({
                          ...documentsData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                <Button type="button" variant="outline" asChild>
                  <Link to="/school-admin/learners">Previous Step</Link>
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}