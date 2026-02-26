/* ─── TYPES ──────────────────────────────────────────────────────────── */
export type StaffType = "teaching" | "non-teaching";

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  designation: string;
  dateOfBirth: string;
  contractStart: string;
  contractEnd: string;
  jobStatus: string;
  sex: string;
  branch: string;
  county: string;
  location: string;
  email: string;
  mobilePhone: string;
  tscNumber: string;
  teachingSubjects: string[];
  qualifications: string[];
  salary: number;
  hireDate: string;
  staffType: StaffType; // "teaching" for teachers, "non-teaching" for support staff
  photo?: string; // URL to staff photo
}

export interface StaffManagementProps {
  onBack?: () => void;
}
