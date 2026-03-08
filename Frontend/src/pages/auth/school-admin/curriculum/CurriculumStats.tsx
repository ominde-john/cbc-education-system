import React from 'react';
import { BookOpen, Layers, AlignLeft, Award, TrendingUp } from "lucide-react";
import { CurriculumStats as CurriculumStatsType } from '@/services/curriculumService';

interface CurriculumStatsProps {
  stats: CurriculumStatsType;
}

const CurriculumStats: React.FC<CurriculumStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Learning Areas Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Learning Areas</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Across all levels</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">+4% from last term</span>
          </div>
        </div>
      </div>

      {/* Total Strands Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-200/60 dark:border-violet-800/40 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Total Strands</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.strands}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Content areas</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
              <Layers className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">+2% from last term</span>
          </div>
        </div>
      </div>

      {/* Sub-Strands Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Sub-Strands</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.subStrands}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Topics covered</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <AlignLeft className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">+3% from last term</span>
          </div>
        </div>
      </div>

      {/* Competencies Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Competencies</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.competencies}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Learning outcomes</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">+5% from last term</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumStats;

