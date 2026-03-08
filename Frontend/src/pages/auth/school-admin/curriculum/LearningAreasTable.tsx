import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { 
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from "@/components/ui/tooltip";
import { 
  Layers, AlignLeft, Award, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown 
} from "lucide-react";
import LearningAreaCard from './LearningAreaCard';
import { LearningArea, LEVEL_CONFIG } from '@/services/curriculumService';

interface SortConfig {
  key: "code" | "name" | "level" | "strands" | "subStrands" | "competencies" | null;
  dir: "asc" | "desc";
}

interface ExpandedRowProps {
  row: LearningArea & { levelId: string; level: string; grades: string };
}

interface LearningAreasTableProps {
  rows: (LearningArea & { levelId: string; level: string; grades: string })[];
  expandedRows: Set<string>;
  selectedRows: Set<string>;
  sortKey: SortConfig['key'];
  sortDir: SortConfig['dir'];
  allSelected: boolean;
  someSelected: boolean;
  onToggleSort: (key: SortConfig['key']) => void;
  onToggleExpand: (code: string) => void;
  onToggleSelect: (code: string) => void;
  onToggleAll: () => void;
  onViewDetails: (row: LearningArea & { levelId: string; level: string; grades: string }) => void;
}

// ── Expanded Row Component ──────────────────────────────────────────────────────
const ExpandedRow: React.FC<ExpandedRowProps> = ({ row }) => {
  return (
    <TableRow className="bg-muted/20 border-0">
      <TableCell colSpan={10} className="px-0 py-0">
        <div className="mx-4 my-3 rounded-xl border border-border/60 bg-background overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/30 border-b border-border/40">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Curriculum Hierarchy — {row.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
            {/* Strands */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-md bg-blue-100 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strands</span>
                <Badge variant="outline" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">{row.strandList.length}</Badge>
              </div>
              <div className="space-y-2">
                {row.strandList.map((strand, si) => (
                  <div key={si} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{strand.name}</span>
                    </div>
                    <div className="space-y-1 pl-4">
                      {strand.subStrands.map((ss, ssi) => (
                        <div key={ssi} className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{ss}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Strands flat list */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-md bg-violet-100 flex items-center justify-center">
                  <AlignLeft className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sub-Strands</span>
                <Badge variant="outline" className="ml-auto text-xs bg-violet-50 text-violet-700 border-violet-200">{row.subStrands}</Badge>
              </div>
              <div className="space-y-1.5">
                {row.strandList.flatMap(s => s.subStrands).map((ss, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg bg-violet-50/50 border border-violet-100 px-3 py-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-violet-800">{ss}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competencies */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Competencies</span>
                <Badge variant="outline" className="ml-auto text-xs bg-emerald-50 text-emerald-700 border-emerald-200">{row.competencies}</Badge>
              </div>
              <div className="space-y-1.5">
                {row.competencyList.map((comp, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 px-3 py-2">
                    <Award className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-medium text-emerald-800 leading-relaxed">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ── Sort Icon Component ───────────────────────────────────────────────────────
const SortIcon: React.FC<{ col: string; sortKey: SortConfig['key']; sortDir: SortConfig['dir'] }> = ({ col, sortKey, sortDir }) => {
  if (sortKey !== col) return <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-30" />;
  return sortDir === "asc"
    ? <ChevronUp className="inline h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="inline h-3 w-3 ml-1 text-primary" />;
};

// ── Empty State Component ───────────────────────────────────────────────────────
interface EmptyStateProps {
  onReset: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <TableRow>
      <TableCell colSpan={10}>
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
            <Award className="h-9 w-9 text-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No learning areas found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Your current filters don't match any learning areas. Try adjusting or clearing your filters.
          </p>
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear All Filters
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ── Main Table Component ─────────────────────────────────────────────────────────
const LearningAreasTable: React.FC<LearningAreasTableProps> = ({
  rows,
  expandedRows,
  selectedRows,
  sortKey,
  sortDir,
  allSelected,
  someSelected,
  onToggleSort,
  onToggleExpand,
  onToggleSelect,
  onToggleAll,
  onViewDetails,
}) => {
  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[calc(100vh-24rem)]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-border/60">
                {/* Select all */}
                <TableHead className="w-10 px-4">
                  <Checkbox
                    checked={allSelected}
                    ref={(el: any) => el && (el.indeterminate = someSelected)}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                {/* Expand */}
                <TableHead className="w-10" />
                {/* Code */}
                <TableHead className="w-28 cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("code")}>
                  Code <SortIcon col="code" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                {/* Name */}
                <TableHead className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("name")}>
                  Learning Area <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                {/* Level */}
                <TableHead className="w-40 cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("level")}>
                  Level <SortIcon col="level" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                {/* Strands */}
                <TableHead className="w-24 text-center cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("strands")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center justify-center gap-1">
                        <Layers className="h-3.5 w-3.5" /> Strands <SortIcon col="strands" sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Number of strands</TooltipContent>
                  </Tooltip>
                </TableHead>
                {/* Sub-Strands */}
                <TableHead className="w-28 text-center cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("subStrands")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center justify-center gap-1">
                        <AlignLeft className="h-3.5 w-3.5" /> Sub-Str. <SortIcon col="subStrands" sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Number of sub-strands</TooltipContent>
                  </Tooltip>
                </TableHead>
                {/* Competencies */}
                <TableHead className="w-32 text-center cursor-pointer select-none text-xs font-semibold uppercase tracking-wider hover:text-foreground" onClick={() => onToggleSort("competencies")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5" /> Competencies <SortIcon col="competencies" sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Number of competencies</TooltipContent>
                  </Tooltip>
                </TableHead>
                {/* Type */}
                <TableHead className="w-24 text-xs font-semibold uppercase tracking-wider">Type</TableHead>
                {/* Actions */}
                <TableHead className="w-12 text-right" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <EmptyState onReset={() => {}} />
              ) : (
                rows.flatMap((row) => {
                  const isExpanded = expandedRows.has(row.code);
                  const isSelected = selectedRows.has(row.code);

                  return [
                    <LearningAreaCard
                      key={row.code}
                      row={row}
                      isExpanded={isExpanded}
                      isSelected={isSelected}
                      onToggleExpand={() => onToggleExpand(row.code)}
                      onToggleSelect={() => onToggleSelect(row.code)}
                      onViewDetails={() => onViewDetails(row)}
                    />,
                    isExpanded && <ExpandedRow key={`${row.code}-exp`} row={row} />,
                  ];
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningAreasTable;

