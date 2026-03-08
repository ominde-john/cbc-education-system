import React from 'react';
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Layers, Download, Plus, ChevronRight } from "lucide-react";

interface CurriculumHeaderProps {
  onExport?: () => void;
  onAddLearningArea?: () => void;
}

const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({
  onExport,
  onAddLearningArea,
}) => {
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-[16px] shadow-lg overflow-hidden">
      {/* Gradient Border at Top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
      
      {/* Decorative background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
      />

      <div className="relative p-6">
        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Side - Breadcrumb, Title, Subtitle */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <GraduationCap className="h-4 w-4" />
              <span className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors">Dashboard</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <BookOpen className="h-4 w-4" />
              <span className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors">Curriculum</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Layers className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Learning Areas</span>
            </nav>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
              CBC Curriculum Explorer
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
              Kenya Competency-Based Curriculum – Manage learning areas, strands, and competencies
            </p>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3 lg:mt-1">
            <Button 
              variant="outline" 
              className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={onExport}
            >
              <Download className="h-4 w-4" /> 
              Export
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200" 
              onClick={onAddLearningArea}
            >
              <Plus className="h-4 w-4" /> 
              Add Learning Area
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumHeader;

