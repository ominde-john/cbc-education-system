import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, ChevronRight, MoreHorizontal, Eye, Edit, Trash2, 
  ListTree, Archive 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { LearningArea, LEVEL_CONFIG } from '@/services/curriculumService';

interface LearningAreaCardProps {
  row: LearningArea & { levelId: string; level: string; grades: string };
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  onViewDetails: () => void;
}

const LearningAreaCard: React.FC<LearningAreaCardProps> = ({
  row,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onViewDetails,
}) => {
  const lc = LEVEL_CONFIG[row.levelId];

  return (
    <>
      <tr
        className={`
          group transition-colors duration-100 cursor-pointer
          ${isSelected ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/40"}
          ${isExpanded ? "bg-muted/20" : ""}
        `}
      >
        {/* Checkbox */}
        <td className="px-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-gray-300"
          />
        </td>

        {/* Expand toggle */}
        <td className="px-2" onClick={onToggleExpand}>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            {isExpanded
              ? <ChevronRight className="h-4 w-4 transition-transform rotate-90" />
              : <ChevronRight className="h-4 w-4 transition-transform" />
            }
          </Button>
        </td>

        {/* Code */}
        <td onClick={onToggleExpand}>
          <Badge variant="outline" className={`font-mono text-xs font-semibold tracking-wide ${lc.badge}`}>
            {row.code}
          </Badge>
        </td>

        {/* Name */}
        <td onClick={onToggleExpand}>
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${lc.icon}`}>
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">{row.name}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5 max-w-xs truncate">{row.desc}</p>
            </div>
          </div>
        </td>

        {/* Level */}
        <td onClick={onToggleExpand}>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${lc.dot}`} />
            <div>
              <p className="text-sm font-medium leading-tight">{row.level}</p>
              <p className="text-xs text-muted-foreground">{row.grades}</p>
            </div>
          </div>
        </td>

        {/* Strands */}
        <td className="text-center" onClick={onToggleExpand}>
          <span className="inline-flex items-center justify-center h-6 min-w-[1.75rem] rounded-md px-2 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            {row.strands}
          </span>
        </td>

        {/* Sub-Strands */}
        <td className="text-center" onClick={onToggleExpand}>
          <span className="inline-flex items-center justify-center h-6 min-w-[1.75rem] rounded-md px-2 text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
            {row.subStrands}
          </span>
        </td>

        {/* Competencies */}
        <td className="text-center" onClick={onToggleExpand}>
          <span className="inline-flex items-center justify-center h-6 min-w-[1.75rem] rounded-md px-2 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {row.competencies}
          </span>
        </td>

        {/* Type */}
        <td onClick={onToggleExpand}>
          {row.optional
            ? <Badge variant="outline" className="text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200">Optional</Badge>
            : <Badge variant="outline" className="text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">Core</Badge>
          }
        </td>

        {/* Actions dropdown */}
        <td className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" /> Edit Area
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onToggleExpand}>
                <ListTree className="h-4 w-4 mr-2" /> Manage Strands
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-amber-600 focus:text-amber-700">
                <Archive className="h-4 w-4 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    </>
  );
};

export default LearningAreaCard;

