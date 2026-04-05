/**
 * Utility functions for Classes Management module
 */

import { ClassItem } from "./types";

/**
 * Filter classes based on search and filter criteria
 */
export const filterClasses = (
  classes: ClassItem[],
  search: string,
  filterGrade: string,
  filterStatus: string,
  filterBranch: string
): ClassItem[] => {
  return classes.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.grade_level.toLowerCase().includes(q) ||
      (c.stream_name?.toLowerCase().includes(q) ?? false) ||
      (c.class_teacher?.name.toLowerCase().includes(q) ?? false);
    const matchGrade = filterGrade === "all" || c.grade_level === filterGrade;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && c.is_active) ||
      (filterStatus === "inactive" && !c.is_active);
    const matchBranch = filterBranch === "all" || c.branch?.name === filterBranch;
    return matchSearch && matchGrade && matchStatus && matchBranch;
  });
};

/**
 * Get list of unique branches from classes
 */
export const getBranches = (classes: ClassItem[]): string[] => {
  return [...new Set(classes.map((c) => c.branch?.name).filter(Boolean))] as string[];
};

/**
 * Calculate total learners across all classes
 */
export const getTotalLearners = (classes: ClassItem[]): number => {
  return classes.reduce((sum, c) => sum + c.learner_count, 0);
};

/**
 * Calculate total capacity across all classes
 */
export const getTotalCapacity = (classes: ClassItem[]): number => {
  return classes.reduce((sum, c) => sum + (c.capacity || 0), 0);
};

/**
 * Count active classes
 */
export const getActiveClassesCount = (classes: ClassItem[]): number => {
  return classes.filter((c) => c.is_active).length;
};

/**
 * Count full classes
 */
export const getFullClassesCount = (classes: ClassItem[]): number => {
  return classes.filter((c) => c.capacity && c.learner_count >= c.capacity).length;
};

/**
 * Calculate utilization rate
 */
export const getUtilizationRate = (totalLearners: number, totalCapacity: number): number => {
  return totalCapacity ? Math.round((totalLearners / totalCapacity) * 100) : 0;
};
