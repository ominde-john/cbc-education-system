// CBC/CBE Platform Enums

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

// School levels that match the database constraint
export enum SchoolLevel {
  ECDE = 'ecde',
  PRIMARY = 'primary',
  JUNIOR_SECONDARY = 'junior_secondary',
  SENIOR_SECONDARY = 'senior_secondary',
}

// Display-friendly labels for school levels
export const SchoolLevelLabels: Record<SchoolLevel, string> = {
  [SchoolLevel.ECDE]: 'ECDE',
  [SchoolLevel.PRIMARY]: 'Primary',
  [SchoolLevel.JUNIOR_SECONDARY]: 'Junior Secondary',
  [SchoolLevel.SENIOR_SECONDARY]: 'Senior Secondary',
};

export enum GradeLevel {
  PP1 = 'PP1',
  PP2 = 'PP2',
  GRADE_1 = 'Grade 1',
  GRADE_2 = 'Grade 2',
  GRADE_3 = 'Grade 3',
  GRADE_4 = 'Grade 4',
  GRADE_5 = 'Grade 5',
  GRADE_6 = 'Grade 6',
  GRADE_7 = 'Grade 7',
  GRADE_8 = 'Grade 8',
  GRADE_9 = 'Grade 9',
}

export enum AssessmentType {
  FORMATIVE = 'formative',
  SUMMATIVE = 'summative',
}

export enum PerformanceLevel {
  EXCEEDING_EXPECTATION = 'exceeding_expectation',
  MEETING_EXPECTATION = 'meeting_expectation',
  APPROACHING_EXPECTATION = 'approaching_expectation',
  BELOW_EXPECTATION = 'below_expectation',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Term {
  TERM_1 = 'term_1',
  TERM_2 = 'term_2',
  TERM_3 = 'term_3',
}
