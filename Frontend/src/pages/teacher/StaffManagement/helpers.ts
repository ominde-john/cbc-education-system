import { AVATAR_COLORS, TEACHING_DESIGNATIONS } from "./constants";
import type { StaffType } from "./types";

/* ─── HELPERS ────────────────────────────────────────────────────────── */
export const fmt = (n: number) => `KSh ${Number(n).toLocaleString("en-KE")}`;
export const initials = (f: string, l: string) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
export const avatarBg = (id: string) => AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];

// Determine staff type based on designation
export const getStaffType = (designation: string): StaffType => {
  return TEACHING_DESIGNATIONS.includes(designation) ? "teaching" : "non-teaching";
};

// Get label for staff type
export const getStaffTypeLabel = (staffType: StaffType): string => {
  return staffType === "teaching" ? "Teacher" : "Non-Teacher";
};

// Get color for staff type badge
export const getStaffTypeColor = (staffType: StaffType): { bg: string; text: string } => {
  return staffType === "teaching" 
    ? { bg: "#EEF2FF", text: "#4F46E5" }  // Indigo for teachers
    : { bg: "#FEF3C7", text: "#B45309" };   // Amber for non-teaching
};
