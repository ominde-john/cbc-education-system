/**
 * Constants for Classes Management module
 */

import { ClassItem, TimetableSlot, Learner } from "./types";

// ─── DESIGN SYSTEM TOKENS ───────────────────────────────────────────────────
// Primary: indigo-600 | Secondary: blue-500 | Success: emerald-500 
// Warning: amber-500 | Danger: red-500 | Background: gray-50

export const COLORS = {
  primary: "indigo",
  secondary: "blue",
  success: "emerald",
  warning: "amber",
  danger: "red",
  neutral: "gray",
} as const;

export const GRADIENTS = {
  primary: "from-indigo-600 to-blue-500",
  success: "from-emerald-600 to-emerald-500",
  warning: "from-amber-600 to-amber-500",
  danger: "from-red-600 to-red-500",
} as const;

export const GRADE_LEVELS = [
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
] as const;

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

export const MOCK_CLASSES: ClassItem[] = [
  {
    id: "1",
    grade_level: "PP1",
    stream_name: "East",
    capacity: 35,
    is_active: true,
    learner_count: 28,
    class_teacher: { id: "t1", name: "Jane Wanjiku" },
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "2",
    grade_level: "PP2",
    stream_name: "West",
    capacity: 30,
    is_active: true,
    learner_count: 30,
    class_teacher: { id: "t2", name: "Peter Ochieng" },
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "3",
    grade_level: "Grade 1",
    stream_name: "North",
    capacity: 40,
    is_active: true,
    learner_count: 36,
    class_teacher: { id: "t3", name: "Mary Akinyi" },
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "4",
    grade_level: "Grade 2",
    stream_name: null,
    capacity: 35,
    is_active: true,
    learner_count: 32,
    class_teacher: { id: "t4", name: "John Kamau" },
    branch: { id: "b2", name: "Westlands Branch" },
    created_at: "2025-01-15",
  },
  {
    id: "5",
    grade_level: "Grade 3",
    stream_name: "A",
    capacity: 40,
    is_active: true,
    learner_count: 38,
    class_teacher: null,
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "6",
    grade_level: "Grade 4",
    stream_name: "B",
    capacity: 40,
    is_active: false,
    learner_count: 0,
    class_teacher: null,
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "7",
    grade_level: "Grade 5",
    stream_name: "East",
    capacity: 45,
    is_active: true,
    learner_count: 42,
    class_teacher: { id: "t5", name: "Samuel Mwangi" },
    branch: { id: "b1", name: "Main Campus" },
    created_at: "2025-01-15",
  },
  {
    id: "8",
    grade_level: "Grade 6",
    stream_name: null,
    capacity: 40,
    is_active: true,
    learner_count: 37,
    class_teacher: { id: "t6", name: "Grace Njeri" },
    branch: { id: "b2", name: "Westlands Branch" },
    created_at: "2025-01-15",
  },
];

export const MOCK_TIMETABLE: Record<string, TimetableSlot[]> = {
  monday: [
    {
      id: "s1",
      day: "monday",
      period_number: 1,
      start_time: "08:00",
      end_time: "08:40",
      room: "Room 1A",
      learning_area: { name: "Mathematics", code: "MATH" },
      teacher: { name: "Jane Wanjiku" },
    },
    {
      id: "s2",
      day: "monday",
      period_number: 2,
      start_time: "08:40",
      end_time: "09:20",
      room: "Room 1A",
      learning_area: { name: "English", code: "ENG" },
      teacher: { name: "Peter Ochieng" },
    },
    {
      id: "s3",
      day: "monday",
      period_number: 3,
      start_time: "09:40",
      end_time: "10:20",
      room: "Lab 1",
      learning_area: { name: "Science & Technology", code: "SCI" },
      teacher: { name: "Mary Akinyi" },
    },
    {
      id: "s4",
      day: "monday",
      period_number: 4,
      start_time: "10:20",
      end_time: "11:00",
      room: "Room 1A",
      learning_area: { name: "Kiswahili", code: "KSW" },
      teacher: { name: "John Kamau" },
    },
  ],
  tuesday: [
    {
      id: "s5",
      day: "tuesday",
      period_number: 1,
      start_time: "08:00",
      end_time: "08:40",
      room: "Room 1A",
      learning_area: { name: "Social Studies", code: "SS" },
      teacher: { name: "Samuel Mwangi" },
    },
    {
      id: "s6",
      day: "tuesday",
      period_number: 2,
      start_time: "08:40",
      end_time: "09:20",
      room: "Room 1A",
      learning_area: { name: "Mathematics", code: "MATH" },
      teacher: { name: "Jane Wanjiku" },
    },
  ],
  wednesday: [
    {
      id: "s7",
      day: "wednesday",
      period_number: 1,
      start_time: "08:00",
      end_time: "08:40",
      room: "Art Room",
      learning_area: { name: "Creative Arts", code: "ART" },
      teacher: { name: "Grace Njeri" },
    },
  ],
  thursday: [],
  friday: [],
};

export const MOCK_LEARNERS: Learner[] = [
  {
    id: "l1",
    first_name: "Alice",
    last_name: "Muthoni",
    admission_number: "ADM001",
    gender: "Female",
    enrollment_date: "2025-01-10",
    status: "enrolled",
  },
  {
    id: "l2",
    first_name: "Brian",
    last_name: "Kipchoge",
    admission_number: "ADM002",
    gender: "Male",
    enrollment_date: "2025-01-10",
    status: "enrolled",
  },
  {
    id: "l3",
    first_name: "Christine",
    last_name: "Wambui",
    admission_number: "ADM003",
    gender: "Female",
    enrollment_date: "2025-01-12",
    status: "enrolled",
  },
  {
    id: "l4",
    first_name: "David",
    last_name: "Otieno",
    admission_number: "ADM004",
    gender: "Male",
    enrollment_date: "2025-02-01",
    status: "enrolled",
  },
  {
    id: "l5",
    first_name: "Esther",
    last_name: "Nyambura",
    admission_number: "ADM005",
    gender: "Female",
    enrollment_date: "2025-01-10",
    status: "withdrawn",
  },
];
