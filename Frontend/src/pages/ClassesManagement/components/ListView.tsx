// components/ListView.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Search,
  Plus,
  Eye,
  X,
  CheckCircle,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GRADIENTS, GRADE_LEVELS } from "../constants";
import { ClassItem } from "../types";

interface ListViewProps {
  classes: ClassItem[];
  filtered: ClassItem[];
  search: string;
  filterGrade: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onFilterGradeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onCreateClick: () => void;
  onViewClick: (cls: ClassItem) => void;
  onToggleActive: (cls: ClassItem) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  classes,
  filtered,
  search,
  filterGrade,
  filterStatus,
  onSearchChange,
  onFilterGradeChange,
  onFilterStatusChange,
  onCreateClick,
  onViewClick,
  onToggleActive,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 rounded-xl h-11 border-gray-300 focus:border-indigo-500"
              />
            </div>
            <Select value={filterGrade} onValueChange={onFilterGradeChange}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl h-11 border-gray-300">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {GRADE_LEVELS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={onFilterStatusChange}>
              <SelectTrigger className="w-full sm:w-36 rounded-xl h-11 border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={onCreateClick}
              className={cn(
                "rounded-xl gap-1.5 h-11 bg-gradient-to-r text-white font-semibold",
                GRADIENTS.primary
              )}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          Showing <span className="text-indigo-600">{filtered.length}</span> of{" "}
          <span className="text-gray-900">{classes.length}</span> classes
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((cls) => {
          const pct = cls.capacity
            ? Math.round((cls.learner_count / cls.capacity) * 100)
            : 0;
          const isFull = cls.capacity
            ? cls.learner_count >= cls.capacity
            : false;

          return (
            <Card
              key={cls.id}
              className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer bg-white transition-all group"
              onClick={() => onViewClick(cls)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-lg bg-gradient-to-br text-white", GRADIENTS.primary)}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 truncate">
                        {cls.grade_level}
                        {cls.stream_name && (
                          <span className="text-gray-600 font-semibold ml-1">
                            — {cls.stream_name}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {cls.branch?.name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      cls.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {cls.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-semibold">Enrollment</span>
                    <span className="font-bold text-gray-900">
                      {cls.learner_count} / {cls.capacity || "—"}
                    </span>
                  </div>
                  {cls.capacity && (
                    <>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            isFull
                              ? GRADIENTS.danger
                              : pct > 80
                              ? GRADIENTS.warning
                              : GRADIENTS.success
                          )}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 font-semibold">
                        <span>{pct}%</span>
                        <span>{cls.capacity - cls.learner_count} available</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-semibold">
                    {cls.class_teacher?.name || "No teacher"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(cls.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg h-8 px-3 text-xs text-indigo-600 hover:bg-indigo-50 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewClick(cls);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg h-8 px-3 text-xs text-gray-600 hover:bg-gray-100 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleActive(cls);
                    }}
                  >
                    {cls.is_active ? (
                      <X className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    {cls.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <School className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              className={cn(
                "rounded-xl gap-1.5 bg-gradient-to-r text-white font-semibold",
                GRADIENTS.primary
              )}
              onClick={onCreateClick}
            >
              <Plus className="h-4 w-4" /> Create Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};