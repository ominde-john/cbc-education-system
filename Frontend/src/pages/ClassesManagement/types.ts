/**
 * Type definitions for Classes Management module
 */

export interface ClassItem {
  id: string;
  grade_level: string;
  stream_name: string | null;
  capacity: number | null;
  is_active: boolean;
  learner_count: number;
  class_teacher: { id: string; name: string } | null;
  branch: { id: string; name: string } | null;
  created_at: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  period_number: number;
  start_time: string;
  end_time: string;
  room: string | null;
  learning_area: { name: string; code: string } | null;
  teacher: { name: string } | null;
}

export interface Learner {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  gender: string;
  enrollment_date: string;
  status: string;
}

export type View = "dashboard" | "list" | "detail";
