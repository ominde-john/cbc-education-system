/* ─── TYPES ──────────────────────────────────────────────────────────── */
export type StaffType = "teaching" | "non-teaching";

export interface StaffMember {
  id: string;
  schoolId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  tscNumber: string | null;
  designation: string;
  branch: string | null;
  county: string | null;
  location: string | null;
  dateOfBirth: string | null;
  sex: string;
  gender?: string;
  hireDate: string | null;
  dateJoined?: string | null;
  contractStart: string | null;
  contractEnd: string | null;
  jobStatus: string;
  salary: number;
  teachingSubjects: string[];
  subjectsTaught?: string[];
  qualifications: string[];
  staffType: StaffType;
  mobilePhone?: string;
  photo?: string | null;
  status: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface StaffManagementProps {
  onBack?: () => void;
}
