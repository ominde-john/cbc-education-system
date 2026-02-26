import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import type { StaffMember } from "./types";

/* ─── TOKENS ─────────────────────────────────────────────────────────── */
export const T = {
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  border: "#E4E7EE",
  text: { primary: "#0F1624", secondary: "#4B5568", muted: "#8A94A6" },
  accent: "#1A56DB",
  accentSoft: "#EBF0FF",
};

export const STATUS_CFG: Record<string, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  "Active":     { icon: CheckCircle, bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  "Inactive":   { icon: XCircle,     bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
  "On Leave":   { icon: Clock,       bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  "Terminated": { icon: AlertCircle, bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
};

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
// Teaching staff designations
export const TEACHING_DESIGNATIONS = [
  "Head Teacher",
  "Deputy Head Teacher", 
  "Senior Teacher",
  "Teacher",
  "Assistant Teacher",
  "Physical Education Teacher",
  "Subject Teacher"
];

// Non-teaching staff designations
export const NON_TEACHING_DESIGNATIONS = [
  "School Administrator",
  "Accountant",
  "Bursar",
  "Clerk",
  "Security Officer",
  "Driver",
  "Librarian",
  "Lab Technician",
  "Cook/Caterer",
  "Cleaner",
  "Gardener",
  "Electrician",
  "Plumber",
  "Support Staff"
];

// Combined designations
export const DESIGNATIONS = [...TEACHING_DESIGNATIONS, ...NON_TEACHING_DESIGNATIONS];

export const BRANCHES     = ["Nairobi - Mathare","Kakamega - Butere"];
export const COUNTIES     = ["Nairobi","Mombasa","Kisumu","Nakuru","Kakamega","Eldoret","Nyeri","Machakos"];
export const ALL_SUBJECTS = ["Mathematics","English","Kiswahili","Science","Social Studies","Physics","Chemistry","Biology","History","Geography","CRE","Physical Education","Health Sciences","Literature","Business Studies","Computer Studies","Art & Design","Music","Home Science","Agriculture"];
export const AVATAR_COLORS = ["#1A56DB","#7C3AED","#059669","#B45309","#0891B2","#DC2626","#9333EA"];

// Staff type filter options
export const STAFF_TYPE_OPTIONS = [
  { value: "all", label: "All Staff" },
  { value: "teaching", label: "Teaching Staff" },
  { value: "non-teaching", label: "Non-Teaching Staff" }
];

export const SEED_STAFF: StaffMember[] = [
  // Teaching Staff
  { id:"1", firstName:"Jeremy",  lastName:"Bravoge",   idNumber:"ID001234567", designation:"Senior Teacher",            dateOfBirth:"1985-06-15", contractStart:"2020-01-15", contractEnd:"2025-01-15", jobStatus:"Active",   sex:"Male",   branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare North",  email:"jeremy.bravoge@school.ac.ke",  mobilePhone:"+254712345678", tscNumber:"TSC123456", teachingSubjects:["Mathematics","Physics"],              qualifications:["B.Ed Mathematics","Diploma in Education"],  salary:45000, hireDate:"2020-01-15", staffType:"teaching", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
  { id:"2", firstName:"Mary",    lastName:"Wanjiku",   idNumber:"ID002345678", designation:"Head Teacher",               dateOfBirth:"1980-03-22", contractStart:"2018-09-01", contractEnd:"2026-09-01", jobStatus:"Active",   sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare South",  email:"mary.wanjiku@school.ac.ke",    mobilePhone:"+254723456789", tscNumber:"TSC234567", teachingSubjects:["English","Literature"],                qualifications:["M.Ed Educational Management","B.Ed English"], salary:65000, hireDate:"2018-09-01", staffType:"teaching", photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" },
  { id:"3", firstName:"David",   lastName:"Kiprotich", idNumber:"ID003456789", designation:"Physical Education Teacher", dateOfBirth:"1990-11-08", contractStart:"2021-03-01", contractEnd:"2024-03-01", jobStatus:"On Leave", sex:"Male",   branch:"Kakamega - Butere", county:"Kakamega", location:"Butere Township", email:"david.kiprotich@school.ac.ke",  mobilePhone:"+254734567890", tscNumber:"TSC345678", teachingSubjects:["Physical Education"],                 qualifications:["Diploma in Physical Education"],             salary:35000, hireDate:"2021-03-01", staffType:"teaching", photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces" },
  { id:"4", firstName:"Grace",   lastName:"Achieng",   idNumber:"ID004567890", designation:"Teacher",                    dateOfBirth:"1992-07-14", contractStart:"2022-01-10", contractEnd:"2027-01-10", jobStatus:"Active",   sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare East",   email:"grace.achieng@school.ac.ke",    mobilePhone:"+254745678901", tscNumber:"TSC456789", teachingSubjects:["Kiswahili","Social Studies"],          qualifications:["B.Ed Arts","Certificate in Education"],      salary:38000, hireDate:"2022-01-10", staffType:"teaching", photo:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces" },
  { id:"5", firstName:"Samuel",  lastName:"Otieno",    idNumber:"ID005678901", designation:"Deputy Head Teacher",        dateOfBirth:"1978-02-28", contractStart:"2016-06-01", contractEnd:"2026-06-01", jobStatus:"Active",   sex:"Male",   branch:"Kakamega - Butere", county:"Kakamega", location:"Butere North",    email:"samuel.otieno@school.ac.ke",    mobilePhone:"+254756789012", tscNumber:"TSC567890", teachingSubjects:["Biology","Chemistry"],                 qualifications:["M.Sc Biology","B.Ed Science"],               salary:58000, hireDate:"2016-06-01", staffType:"teaching", photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces" },
  
  // Non-Teaching Staff
  { id:"6", firstName:"Faith",   lastName:"Njeri",     idNumber:"ID006789012", designation:"Clerk",                     dateOfBirth:"1995-09-03", contractStart:"2023-02-01", contractEnd:"2025-02-01", jobStatus:"Inactive", sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare West",   email:"faith.njeri@school.ac.ke",      mobilePhone:"+254767890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Certificate in Office Administration"],       salary:22000, hireDate:"2023-02-01", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces" },
  { id:"7", firstName:"John",    lastName:"Kamau",     idNumber:"ID007890123", designation:"Accountant",                dateOfBirth:"1988-04-12", contractStart:"2019-06-15", contractEnd:"2024-06-15", jobStatus:"Active",   sex:"Male",   branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare Central", email:"john.kamau@school.ac.ke",       mobilePhone:"+254777890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["B.Com Finance","CPA Part II"],             salary:48000, hireDate:"2019-06-15", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces" },
  { id:"8", firstName:"Sarah",   lastName:"Wambui",    idNumber:"ID008901234", designation:"Security Officer",          dateOfBirth:"1982-11-25", contractStart:"2020-01-10", contractEnd:"2025-01-10", jobStatus:"Active",   sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare Gate",   email:"sarah.wambui@school.ac.ke",    mobilePhone:"+254787890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Security Training Certificate"],              salary:18000, hireDate:"2020-01-10", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=faces" },
  { id:"9", firstName:"Michael",  lastName:"Ochieng",  idNumber:"ID009012345", designation:"Driver",                   dateOfBirth:"1990-07-18", contractStart:"2021-08-01", contractEnd:"2024-08-01", jobStatus:"Active",   sex:"Male",   branch:"Kakamega - Butere", county:"Kakamega", location:"Butere Station",  email:"michael.ochieng@school.ac.ke", mobilePhone:"+254797890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Valid DL","Defensive Driving"],             salary:25000, hireDate:"2021-08-01", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces" },
  { id:"10", firstName:"Grace",  lastName:"Njoroge",  idNumber:"ID010123456", designation:"Librarian",                dateOfBirth:"1987-03-30", contractStart:"2018-02-15", contractEnd:"2026-02-15", jobStatus:"Active",   sex:"Female", branch:"Kakamega - Butere", county:"Kakamega", location:"Butere Library",  email:"grace.njoroge@school.ac.ke",   mobilePhone:"+254707890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["B.A Literature","Diploma in Library Science"], salary:32000, hireDate:"2018-02-15", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces" },
  { id:"11", firstName:"Peter",  lastName:"Otieno",   idNumber:"ID011234567", designation:"Lab Technician",           dateOfBirth:"1993-08-14", contractStart:"2022-05-01", contractEnd:"2025-05-01", jobStatus:"Active",   sex:"Male",   branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare Science", email:"peter.otieno@school.ac.ke",    mobilePhone:"+254717890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Diploma in Lab Technology","Science Lab Safety"], salary:28000, hireDate:"2022-05-01", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=faces" },
  { id:"12", firstName:"Nancy",  lastName:"Atieno",   idNumber:"ID012345678", designation:"Cook/Caterer",             dateOfBirth:"1985-12-05", contractStart:"2020-03-01", contractEnd:"2024-03-01", jobStatus:"On Leave", sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare Kitchen", email:"nancy.atieno@school.ac.ke",    mobilePhone:"+254727890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Food Handling Certificate","Catering NVQ"],      salary:20000, hireDate:"2020-03-01", staffType:"non-teaching", photo:"https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=faces" },
];
