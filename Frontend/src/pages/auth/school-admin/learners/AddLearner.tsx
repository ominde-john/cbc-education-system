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
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GradeLevel, Gender } from '@/types';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export default function AddLearnerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!learnerData.admissionNumber || !learnerData.firstName || !learnerData.lastName || 
          !learnerData.dateOfBirth || !learnerData.gender || !learnerData.gradeLevel ||
          !parentData.firstName || !parentData.lastName || !parentData.email || 
          !parentData.phoneNumber || !parentData.relationship) {
        throw new Error('Please fill in all required fields.');
      }

      const token = localStorage.getItem('cbc_access_token');
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.PROD ? 'https://cbc-education-system-1.onrender.com/api' : '/api');

      const response = await fetch(`${apiBaseUrl}/register/learner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          admissionNumber: learnerData.admissionNumber,
          firstName: learnerData.firstName,
          lastName: learnerData.lastName,
          middleName: learnerData.middleName,
          dateOfBirth: learnerData.dateOfBirth,
          gender: learnerData.gender,
          gradeLevel: learnerData.gradeLevel,
          streamName: learnerData.streamName,
          specialNeeds: learnerData.specialNeeds,
          parentEmail: parentData.email,
          parentFirstName: parentData.firstName,
          parentLastName: parentData.lastName,
          parentPhoneNumber: parentData.phoneNumber,
          parentNationalId: parentData.nationalId,
          parentOccupation: parentData.occupation,
          parentRelationship: parentData.relationship,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to enroll learner.');
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
        description: getErrorMessage(error, 'Failed to enroll learner. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLearnerData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/school-admin/learners">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enroll New Learner</h1>
          <p className="text-muted-foreground mt-1">
            Add a new student with parent/guardian information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-2xl">
          {/* Learner Information */}
          <Card>
            <CardHeader>
              <CardTitle>Learner Information</CardTitle>
              <CardDescription>Student's personal and academic details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionNumber">Admission Number *</Label>
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
                    value={learnerData.middleName}
                    onChange={handleLearnerChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={learnerData.lastName}
                    onChange={handleLearnerChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
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
                    onValueChange={(value) => setLearnerData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level *</Label>
                  <Select
                    value={learnerData.gradeLevel}
                    onValueChange={(value) => setLearnerData(prev => ({ ...prev, gradeLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GradeLevel).map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Needs (if any)</Label>
                <Input
                  id="specialNeeds"
                  name="specialNeeds"
                  placeholder="Describe any special requirements"
                  value={learnerData.specialNeeds}
                  onChange={handleLearnerChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>
                A parent account will be created with these details for portal access
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentFirstName">First Name *</Label>
                  <Input
                    id="parentFirstName"
                    name="firstName"
                    value={parentData.firstName}
                    onChange={handleParentChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentLastName">Last Name *</Label>
                  <Input
                    id="parentLastName"
                    name="lastName"
                    value={parentData.lastName}
                    onChange={handleParentChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email Address *</Label>
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
                  <Label htmlFor="parentPhone">Phone Number *</Label>
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
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
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
                    onValueChange={(value) => setParentData(prev => ({ ...prev, relationship: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={parentData.occupation}
                    onChange={handleParentChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Enroll Learner'
              )}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/school-admin/learners">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
