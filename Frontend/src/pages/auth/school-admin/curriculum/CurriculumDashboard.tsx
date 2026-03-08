import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Plus, Download, MoreHorizontal, Eye, Edit, Trash2,
  BookOpen, Layers, AlignLeft, CheckSquare, GraduationCap,
  TrendingUp, TrendingDown, X, Archive, Settings2,
  Sparkles, Target, Award, SlidersHorizontal,
} from "lucide-react";

import CurriculumHeader from "./CurriculumHeader";
import CurriculumStats from "./CurriculumStats";
import CurriculumFilters from "./CurriculumFilters";
import LearningAreasTable from "./LearningAreasTable";

import {
  CURRICULUM_DATA,
  LEVEL_CONFIG,
  getAllLearningAreas,
  getCurriculumStats,
  filterLearningAreas,
  getLevelCards,
  LearningArea,
  CurriculumStats as CurriculumStatsType,
} from "@/services/curriculumService";

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CurriculumDashboard() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevel] = useState("all");
  const [typeFilter, setType] = useState("all");
  const [minStrands, setMinStrands] = useState("");
  const [minComp, setMinComp] = useState("");
  const [sortKey, setSortKey] = useState<"code" | "name" | "level" | "strands" | "subStrands" | "competencies" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpanded] = useState(new Set<string>());
  const [selectedRows, setSelected] = useState(new Set<string>());
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [page, setPage] = useState(1);
  const [viewRow, setViewRow] = useState<LearningArea & { levelId: string; level: string; grades: string } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [kpiFilter, setKpiFilter] = useState<"pp" | "lp" | "up" | "js" | null>(null);
  const [showAdvFilter, setShowAdv] = useState(false);

  const allRows = useMemo(() => getAllLearningAreas(), []);
  const stats = useMemo(() => getCurriculumStats(), [allRows]);
  const levelCards = useMemo(() => getLevelCards(stats), [stats]);

  const filters = { search, level: levelFilter, type: typeFilter, minStrands, minComp };
  
  const filtered = useMemo(() => {
    let rows = filterLearningAreas(allRows, filters, kpiFilter);
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [allRows, levelFilter, typeFilter, minStrands, minComp, search, sortKey, sortDir, kpiFilter]);

  const rpp = rowsPerPage === "all" ? filtered.length : parseInt(rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rpp));
  const pageRows = filtered.slice((page - 1) * rpp, page * rpp);

  const hasActiveFilters = search || levelFilter !== "all" || typeFilter !== "all" || minStrands || minComp || kpiFilter;

  const resetFilters = () => {
    setSearch(""); setLevel("all"); setType("all");
    setMinStrands(""); setMinComp(""); setKpiFilter(null); setPage(1);
  };

  const toggleSort = (key: typeof sortKey) => {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleExpand = (code: string) => setExpanded(prev => {
    const s = new Set(prev);
    s.has(code) ? s.delete(code) : s.add(code);
    return s;
  });

  const toggleSelect = (code: string) => setSelected(prev => {
    const s = new Set(prev);
    s.has(code) ? s.delete(code) : s.add(code);
    return s;
  });

  const toggleAll = () => {
    if (selectedRows.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map(r => r.code)));
  };

  const allSelected = pageRows.length > 0 && selectedRows.size === pageRows.length;
  const someSelected = selectedRows.size > 0 && !allSelected;

  const handleFilterChange = (key: string, value: string) => {
    switch (key) {
      case 'search': setSearch(value); break;
      case 'level': setLevel(value); setKpiFilter(null); break;
      case 'type': setType(value); break;
      case 'minStrands': setMinStrands(value); break;
      case 'minComp': setMinComp(value); break;
    }
    setPage(1);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 space-y-6">
        
        {/* ── Modern SaaS Header ── */}
    

        {/* ── Statistics Grid ── */}
        <CurriculumStats stats={stats} />

        {/* ── Level Filter Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {levelCards.map(card => (
            <button
              key={card.id}
              onClick={() => {
                const newFilter = card.id === "all" ? null : card.id as "pp" | "lp" | "up" | "js";
                setKpiFilter(newFilter);
                setLevel("all");
                setPage(1);
              }}
              className={`
                relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200
                hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                ${(kpiFilter === card.id || (card.id === "all" && !kpiFilter))
                  ? "ring-2 ring-offset-2 shadow-xl scale-[1.02]" 
                  : "shadow-md border border-gray-200 dark:border-gray-700"
                }
              `}
              style={{ background: `linear-gradient(135deg, ${card.gradient.includes('slate') ? '#475569,#64748b' : card.gradient.includes('blue') ? '#2563eb,#60a5fa' : card.gradient.includes('emerald') ? '#059669,#34d399' : card.gradient.includes('violet') ? '#7c3aed,#a78bfa' : '#f97316,#fb923c'})` }}
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="h-5 w-5 text-white/90" />
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-sm font-medium text-white/90">{card.title}</p>
                <p className="text-xs text-white/70">{card.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Filters Bar ── */}
        <CurriculumFilters
          filters={filters}
          showAdvFilter={showAdvFilter}
          filteredCount={filtered.length}
          totalCount={allRows.length}
          onFilterChange={handleFilterChange}
          onToggleAdvFilter={() => setShowAdv(v => !v)}
          onResetFilters={resetFilters}
        />

        {/* ── Bulk Action Toolbar ── */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-lg">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckSquare className="h-4 w-4" />
              {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""} selected
            </div>
            <Separator orientation="vertical" className="h-5 bg-primary-foreground/30" />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export Selected
              </Button>
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive
              </Button>
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                <Settings2 className="h-3.5 w-3.5 mr-1.5" /> Change Level
              </Button>
              <Button size="sm" variant="secondary" className="h-8 text-xs bg-red-100 text-red-700 hover:bg-red-200">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
              </Button>
            </div>
            <Button size="sm" variant="ghost" className="ml-auto h-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setSelected(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── Table ── */}
        <LearningAreasTable
          rows={pageRows}
          expandedRows={expandedRows}
          selectedRows={selectedRows}
          sortKey={sortKey}
          sortDir={sortDir}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSort={toggleSort}
          onToggleExpand={toggleExpand}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          onViewDetails={setViewRow}
        />

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <Select value={rowsPerPage} onValueChange={v => { setRowsPerPage(v); setPage(1); }}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <span>
              Showing <span className="font-semibold text-foreground">{Math.min((page - 1) * rpp + 1, filtered.length)}</span>–<span className="font-semibold text-foreground">{Math.min(page * rpp, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> records
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>«</Button>
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Button key={p} variant={page === p ? "default" : "outline"} size="sm" className="w-9" onClick={() => setPage(p)}>
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next ›</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</Button>
          </div>
        </div>

        {/* ── View Dialog ── */}
        <Dialog open={!!viewRow} onOpenChange={() => setViewRow(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Learning Area Details</DialogTitle>
              <DialogDescription>Full curriculum hierarchy for this learning area.</DialogDescription>
            </DialogHeader>
            {viewRow && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${LEVEL_CONFIG[viewRow.levelId].icon}`}>
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base leading-tight">{viewRow.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`font-mono text-xs ${LEVEL_CONFIG[viewRow.levelId].badge}`}>{viewRow.code}</Badge>
                      <Badge variant="outline" className="text-xs">{viewRow.level}</Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">{viewRow.desc}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Strands", val: viewRow.strands, color: "bg-blue-50 text-blue-700 border-blue-200" },
                    { label: "Sub-Strands", val: viewRow.subStrands, color: "bg-violet-50 text-violet-700 border-violet-200" },
                    { label: "Competencies", val: viewRow.competencies, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl border p-3 text-center ${item.color}`}>
                      <p className="text-2xl font-bold">{item.val}</p>
                      <p className="text-xs font-medium mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Strands & Sub-Strands</p>
                  <div className="space-y-2">
                    {viewRow.strandList.map((s, i) => (
                      <div key={i} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                        <p className="text-sm font-semibold mb-1">{s.name}</p>
                        <div className="flex flex-wrap gap-1">
                          {s.subStrands.map((ss, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{ss}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
              <Button><Edit className="h-4 w-4 mr-2" /> Edit Area</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Add Dialog ── */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Learning Area</DialogTitle>
              <DialogDescription>Create a new learning area in the CBC curriculum.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="la-code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code *</Label>
                  <Input id="la-code" placeholder="e.g. UPMATH" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pp">Pre-Primary</SelectItem>
                      <SelectItem value="lp">Lower Primary</SelectItem>
                      <SelectItem value="up">Upper Primary</SelectItem>
                      <SelectItem value="js">Junior Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</Label>
                <Input placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                <Input placeholder="Brief description of this learning area" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</Label>
                <Select defaultValue="core">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddOpen(false)}><Plus className="h-4 w-4 mr-2" /> Add Learning Area</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </TooltipProvider>
  );
}

