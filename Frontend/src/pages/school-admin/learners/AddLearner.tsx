import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  User,
  Shield,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface StudentDetailsProps {
  studentId?: number;
  onBack: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId, onBack }) => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    currentLevel: '',
    room: '',
    dateOfBirth: '',
    admission: '',
    admissionDate: '',
    enrollmentStatus: '',
    sex: '',
    entryNumber: '',
    street: '',
    city: '',
    email: '',
    homePhone: '',
    notes: ''
  });

  // Example branches array; replace with API call if needed
const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
const [isDuplicate, setIsDuplicate] = useState(false);

//state for profile image upload
const [profileImage, setProfileImage] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file)); // For preview
  }
};


  useEffect(() => {
    if (studentId) {
      const mockStudent = {
        firstName: 'PETER',
        lastName: 'VALERO',
        studentId: '1',
        currentLevel: 'Play Group',
        room: 'Room A',
        dateOfBirth: '2019-09-16',
        admission: 'regular',
        admissionDate: '2019-09-01',
        enrollmentStatus: 'ongoing',
        sex: 'M',
        entryNumber: '',
        street: '123 Main Street',
        city: 'Nairobi',
        email: 'parent@example.com',
        homePhone: '0795387869',
        notes: 'Active student with good performance.'
      };
      setStudent(mockStudent);
      setIsDuplicate(Math.random() > 0.5);
    }
  }, [studentId]);
const [selectedBranch, setSelectedBranch] = useState<string | undefined>();

useEffect(() => {
  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/branches');
      const data = await response.json();
      setBranches(data);

      const savedBranch = localStorage.getItem('selectedBranch');
      const isValidBranch = data.some(branch => branch.id === savedBranch);

      if (savedBranch && isValidBranch) {
        setSelectedBranch(savedBranch);
      } else {
        setSelectedBranch(undefined); // or set first branch: data[0]?.id
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  fetchBranches();
}, []);

const handleSave = async () => {
  const branchId = localStorage.getItem('selectedBranch');

  if (!branchId) {
    alert('Please select a branch before saving.');
    return;
  }

  const payload = {
    full_name: `${student.firstName} ${student.lastName}`,
    gender: student.sex === 'M' ? 'male' : 'female',
    date_of_birth: student.dateOfBirth,
    admission_number: student.studentId,
    guardian_name: "", // Placeholder
    guardian_phone: student.homePhone,
    guardian_email: student.email,
    address: `${student.street}, ${student.city}`,
    branch_id: branchId,
  };

  try {
    console.log('Sending payload:', payload);
    const response = await fetch('http://localhost:5000/api/students/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      setLastSaved(new Date());
      console.log('Student registered:', data);
      alert('Student saved successfully');
    } else {
      console.error('Failed:', data);
      alert('Failed to save student: ' + (data?.error || JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Network or server error.');
  }
};


  const handleInputChange = (field: string, value: string) => {
    setStudent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {studentId ? 'Student Details' : 'New Student'}
              </h1>
              {isDuplicate && (
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-red-600 font-medium">Possible Duplicate</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <div className="flex items-center text-green-600 text-sm">
                <Activity className="w-4 h-4 mr-2" />
                <span>Saved at {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
              <Save className="w-4 h-4 mr-2" />
              Save and New
            </Button>
            <Button onClick={onBack} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                         <input
                            type="file"
                            accept="image/*"
                            id="upload-photo"
                            className="hidden"
                              onChange={handleImageChange}/>

                                          <label htmlFor="upload-photo" className="w-full">
                                                          <Button
                                 type="button"
                               className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                                        Edit Picture
                          </Button>
                            </label>

                {/* Quick Info */}
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Student ID:</span>
                    <Badge variant="secondary">{student.studentId || 'New'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="default" className="bg-green-500">
                      {student.enrollmentStatus || 'New'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="text-sm font-medium">{student.currentLevel || 'TBD'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms Section */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="general" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>General</span>
                    </TabsTrigger>
                    <TabsTrigger value="guardian" className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Guardian Information</span>
                    </TabsTrigger>
                    <TabsTrigger value="medical" className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Medical Information</span>
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Attendance</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First/Second Name</Label>
                        <Input
                          id="firstName"
                          value={student.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admission">Admission</Label>
                        <Select value={student.admission} onValueChange={(value) => handleInputChange('admission', value)}>
                          <SelectTrigger className="bg-blue-50">
                            <SelectValue placeholder="Select admission type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                            <SelectItem value="scholarship">Scholarship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={student.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admissionDate">Admission Date</Label>
                        <Input
                          id="admissionDate"
                          type="date"
                          value={student.admissionDate}
                          onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={student.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
                        <Select value={student.enrollmentStatus} onValueChange={(value) => handleInputChange('enrollmentStatus', value)}>
                          <SelectTrigger className="bg-blue-50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                            <SelectItem value="withdrawn">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentLevel">Current Level</Label>
                        <Select value={student.currentLevel} onValueChange={(value) => handleInputChange('currentLevel', value)}>
                          <SelectTrigger className="bg-blue-50">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Play Group">Play Group</SelectItem>
                            <SelectItem value="Pre-Primary 1">Pre-Primary 1</SelectItem>
                            <SelectItem value="Pre-Primary 2">Pre-Primary 2</SelectItem>
                            <SelectItem value="Grade 1">Grade 1</SelectItem>
                            <SelectItem value="Grade 2">Grade 2</SelectItem>
                            <SelectItem value="Grade 3">Grade 3</SelectItem>
                            <SelectItem value="Grade 4">Grade 4</SelectItem>
                            <SelectItem value="Grade 5">Grade 5</SelectItem>
                            <SelectItem value="Grade 6">Grade 6</SelectItem>
                            <SelectItem value="Grade 7">Grade 7</SelectItem>
                            <SelectItem value="Grade 8">Grade 8</SelectItem>
                            <SelectItem value="Grade 9">Grade 9</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <Select value={student.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                          <SelectTrigger className="bg-blue-50">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="room">Room</Label>
                        <Input
                          id="room"
                          value={student.room}
                          onChange={(e) => handleInputChange('room', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch">Select Branch</Label>                
<Select
  value={selectedBranch}
  onValueChange={(value) => {
    setSelectedBranch(value);
    localStorage.setItem('selectedBranch', value);
  }}
>
  <SelectTrigger className="bg-blue-50">
    <SelectValue placeholder="Choose branch" />
  </SelectTrigger>
  <SelectContent>
    {branches.map((branch) => (
      <SelectItem key={branch.id} value={branch.id}>
        {branch.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                        </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={student.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>
                    </div>

                    {/* Contact/Address Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact/Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="street" className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Street</span>
                          </Label>
                          <Input
                            id="street"
                            value={student.street}
                            onChange={(e) => handleInputChange('street', e.target.value)}
                            className="bg-blue-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={student.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="bg-blue-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>E-mail Address</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={student.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-blue-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="homePhone" className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Home Phone</span>
                          </Label>
                          <Input
                            id="homePhone"
                            value={student.homePhone}
                            onChange={(e) => handleInputChange('homePhone', e.target.value)}
                            className="bg-blue-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">Notes</h3>
                      <Textarea
                        value={student.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="min-h-32 bg-blue-50"
                        placeholder="Additional notes about the student..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="guardian">
                    <div className="text-center py-12">
                      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Guardian Information</h3>
                      <p className="text-gray-500">Guardian information management will be available here.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical">
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Medical Information</h3>
                      <p className="text-gray-500">Medical records and health information will be managed here.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="attendance">
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
                      <p className="text-gray-500">Student attendance tracking and reports will be available here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;