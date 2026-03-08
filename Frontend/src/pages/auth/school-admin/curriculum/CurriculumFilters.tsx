import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterOptions {
  search: string;
  level: string;
  type: string;
  minStrands: string;
  minComp: string;
}

interface CurriculumFiltersProps {
  filters: FilterOptions;
  showAdvFilter: boolean;
  filteredCount: number;
  totalCount: number;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onToggleAdvFilter: () => void;
  onResetFilters: () => void;
}

const CurriculumFilters: React.FC<CurriculumFiltersProps> = ({
  filters,
  showAdvFilter,
  filteredCount,
  totalCount,
  onFilterChange,
  onToggleAdvFilter,
  onResetFilters,
}) => {
  const hasActiveFilters = filters.search || filters.level !== "all" || filters.type !== "all" || filters.minStrands || filters.minComp;

  return (
    <Card className="shadow-sm border-border/60">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search areas, codes..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Level */}
          <Select value={filters.level} onValueChange={(v) => onFilterChange('level', v)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="pp">Pre-Primary</SelectItem>
              <SelectItem value="lp">Lower Primary</SelectItem>
              <SelectItem value="up">Upper Primary</SelectItem>
              <SelectItem value="js">Junior Secondary</SelectItem>
            </SelectContent>
          </Select>

          {/* Type */}
          <Select value={filters.type} onValueChange={(v) => onFilterChange('type', v)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="optional">Optional</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced toggle */}
          <Button
            variant={showAdvFilter ? "secondary" : "outline"}
            size="sm"
            className="h-9"
            onClick={onToggleAdvFilter}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced
            {showAdvFilter && <X className="h-3 w-3 ml-1" />}
          </Button>

          {/* Clear */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={onResetFilters}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}

          <div className="ml-auto text-xs text-muted-foreground font-medium">
            {filteredCount} of {totalCount} areas
          </div>
        </div>

        {/* Advanced filter panel */}
        {showAdvFilter && (
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Strands</Label>
              <Input 
                type="number" 
                min={1} 
                placeholder="e.g. 2" 
                value={filters.minStrands} 
                onChange={(e) => onFilterChange('minStrands', e.target.value)} 
                className="h-9" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Competencies</Label>
              <Input 
                type="number" 
                min={1} 
                placeholder="e.g. 3" 
                value={filters.minComp} 
                onChange={(e) => onFilterChange('minComp', e.target.value)} 
                className="h-9" 
              />
            </div>
            <div className="col-span-2 flex items-end gap-2">
              {(filters.minStrands || filters.minComp) && (
                <Button variant="ghost" size="sm" onClick={() => {
                  onFilterChange('minStrands', '');
                  onFilterChange('minComp', '');
                }}>
                  <X className="h-3.5 w-3.5 mr-1" /> Clear advanced
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumFilters;

