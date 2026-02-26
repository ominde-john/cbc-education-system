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
export const DESIGNATIONS = ["Head Teacher","Deputy Head Teacher","Senior Teacher","Teacher","Assistant Teacher","Physical Education Teacher","Support Staff"];
export const BRANCHES     = ["Nairobi - Mathare","Kakamega - Butere"];
export const COUNTIES     = ["Nairobi","Mombasa","Kisumu","Nakuru","Kakamega","Eldoret","Nyeri","Machakos"];
export const ALL_SUBJECTS = ["Mathematics","English","Kiswahili","Science","Social Studies","Physics","Chemistry","Biology","History","Geography","CRE","Physical Education","Health Sciences","Literature","Business Studies","Computer Studies","Art & Design","Music","Home Science","Agriculture"];
export const AVATAR_COLORS = ["#1A56DB","#7C3AED","#059669","#B45309","#0891B2","#DC2626","#9333EA"];

export const SEED_STAFF: StaffMember[] = [
  { id:"1", firstName:"Jeremy",  lastName:"Bravoge",   idNumber:"ID001234567", designation:"Senior Teacher",            dateOfBirth:"1985-06-15", contractStart:"2020-01-15", contractEnd:"2025-01-15", jobStatus:"Active",   sex:"Male",   branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare North",  email:"jeremy.bravoge@school.ac.ke",  mobilePhone:"+254712345678", tscNumber:"TSC123456", teachingSubjects:["Mathematics","Physics"],              qualifications:["B.Ed Mathematics","Diploma in Education"],  salary:45000, hireDate:"2020-01-15" },
  { id:"2", firstName:"Mary",    lastName:"Wanjiku",   idNumber:"ID002345678", designation:"Head Teacher",               dateOfBirth:"1980-03-22", contractStart:"2018-09-01", contractEnd:"2026-09-01", jobStatus:"Active",   sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare South",  email:"mary.wanjiku@school.ac.ke",    mobilePhone:"+254723456789", tscNumber:"TSC234567", teachingSubjects:["English","Literature"],                qualifications:["M.Ed Educational Management","B.Ed English"], salary:65000, hireDate:"2018-09-01" },
  { id:"3", firstName:"David",   lastName:"Kiprotich", idNumber:"ID003456789", designation:"Physical Education Teacher", dateOfBirth:"1990-11-08", contractStart:"2021-03-01", contractEnd:"2024-03-01", jobStatus:"On Leave", sex:"Male",   branch:"Kakamega - Butere", county:"Kakamega", location:"Butere Township", email:"david.kiprotich@school.ac.ke",  mobilePhone:"+254734567890", tscNumber:"TSC345678", teachingSubjects:["Physical Education"],                 qualifications:["Diploma in Physical Education"],             salary:35000, hireDate:"2021-03-01" },
  { id:"4", firstName:"Grace",   lastName:"Achieng",   idNumber:"ID004567890", designation:"Teacher",                    dateOfBirth:"1992-07-14", contractStart:"2022-01-10", contractEnd:"2027-01-10", jobStatus:"Active",   sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare East",   email:"grace.achieng@school.ac.ke",    mobilePhone:"+254745678901", tscNumber:"TSC456789", teachingSubjects:["Kiswahili","Social Studies"],          qualifications:["B.Ed Arts","Certificate in Education"],      salary:38000, hireDate:"2022-01-10" },
  { id:"5", firstName:"Samuel",  lastName:"Otieno",    idNumber:"ID005678901", designation:"Deputy Head Teacher",        dateOfBirth:"1978-02-28", contractStart:"2016-06-01", contractEnd:"2026-06-01", jobStatus:"Active",   sex:"Male",   branch:"Kakamega - Butere", county:"Kakamega", location:"Butere North",    email:"samuel.otieno@school.ac.ke",    mobilePhone:"+254756789012", tscNumber:"TSC567890", teachingSubjects:["Biology","Chemistry"],                 qualifications:["M.Sc Biology","B.Ed Science"],               salary:58000, hireDate:"2016-06-01" },
  { id:"6", firstName:"Faith",   lastName:"Njeri",     idNumber:"ID006789012", designation:"Support Staff",              dateOfBirth:"1995-09-03", contractStart:"2023-02-01", contractEnd:"2025-02-01", jobStatus:"Inactive", sex:"Female", branch:"Nairobi - Mathare", county:"Nairobi",  location:"Mathare West",   email:"faith.njeri@school.ac.ke",      mobilePhone:"+254767890123", tscNumber:"N/A",       teachingSubjects:[],                                      qualifications:["Certificate in Office Administration"],       salary:22000, hireDate:"2023-02-01" },
];
