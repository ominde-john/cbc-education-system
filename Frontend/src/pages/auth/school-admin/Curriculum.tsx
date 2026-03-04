import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Layers,
  Target,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import {
  curriculumData,
  getTotalCompetencies,
  getTotalStrands,
  type CurriculumLearningArea,
  type CurriculumStrand,
  type CurriculumSubStrand,
  type CurriculumCompetency,
} from '@/data/curriculum-data';

export default function CurriculumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedStrands, setExpandedStrands] = useState<string[]>([]);
  const [expandedSubStrands, setExpandedSubStrands] = useState<string[]>([]);
  const [selectedCompetency, setSelectedCompetency] = useState<CurriculumCompetency | null>(null);

  const toggleArea = (id: string) => {
    setExpandedAreas(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleStrand = (id: string) => {
    setExpandedStrands(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSubStrand = (id: string) => {
    setExpandedSubStrands(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Filter curriculum based on search
  const filterCurriculum = (data: CurriculumLearningArea[]) => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(la => {
      // Check learning area name
      if (la.name.toLowerCase().includes(query)) return true;
      if (la.code.toLowerCase().includes(query)) return true;

      // Check strands
      return la.strands.some(strand => {
        if (strand.name.toLowerCase().includes(query)) return true;
        return strand.subStrands.some(subStrand => {
          if (subStrand.name.toLowerCase().includes(query)) return true;
          return subStrand.competencies.some(
            comp =>
              comp.name.toLowerCase().includes(query) ||
              comp.code.toLowerCase().includes(query)
          );
        });
      });
    });
  };

  const filteredData = filterCurriculum(curriculumData);
  const totalCompetencies = getTotalCompetencies();
  const totalStrands = getTotalStrands();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Curriculum</h1>
        <p className="text-muted-foreground mt-1">
          Manage CBE learning areas, strands, and competencies aligned to KICD standards
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{curriculumData.length}</p>
                <p className="text-xs text-muted-foreground">Learning Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Layers className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStrands}</p>
                <p className="text-xs text-muted-foreground">Strands</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Target className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCompetencies}</p>
                <p className="text-xs text-muted-foreground">Competencies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Grade 4-6</p>
                <p className="text-xs text-muted-foreground">Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Curriculum Explorer */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Curriculum Explorer
                  </CardTitle>
                  <CardDescription>
                    Browse KICD-aligned learning areas, strands, and competencies
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search curriculum..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredData.map((learningArea) => (
                    <LearningAreaItem
                      key={learningArea.id}
                      learningArea={learningArea}
                      isExpanded={expandedAreas.includes(learningArea.id)}
                      onToggle={() => toggleArea(learningArea.id)}
                      expandedStrands={expandedStrands}
                      onToggleStrand={toggleStrand}
                      expandedSubStrands={expandedSubStrands}
                      onToggleSubStrand={toggleSubStrand}
                      onSelectCompetency={setSelectedCompetency}
                      selectedCompetencyId={selectedCompetency?.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Competency Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Competency Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCompetency ? (
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {selectedCompetency.code}
                    </Badge>
                    <h3 className="font-semibold text-foreground">
                      {selectedCompetency.name}
                    </h3>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Performance Indicators
                    </h4>
                    <ul className="space-y-2">
                      {selectedCompetency.indicators.map((indicator, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Assessment Rubric
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Select a competency to view its details and performance indicators
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Learning Area Collapsible Item
interface LearningAreaItemProps {
  learningArea: CurriculumLearningArea;
  isExpanded: boolean;
  onToggle: () => void;
  expandedStrands: string[];
  onToggleStrand: (id: string) => void;
  expandedSubStrands: string[];
  onToggleSubStrand: (id: string) => void;
  onSelectCompetency: (comp: CurriculumCompetency) => void;
  selectedCompetencyId?: string;
}

function LearningAreaItem({
  learningArea,
  isExpanded,
  onToggle,
  expandedStrands,
  onToggleStrand,
  expandedSubStrands,
  onToggleSubStrand,
  onSelectCompetency,
  selectedCompetencyId,
}: LearningAreaItemProps) {
  const competencyCount = learningArea.strands.reduce(
    (acc, strand) =>
      acc +
      strand.subStrands.reduce(
        (sAcc, subStrand) => sAcc + subStrand.competencies.length,
        0
      ),
    0
  );

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {learningArea.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {learningArea.code}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {learningArea.strands.length} strands • {competencyCount} competencies
              </p>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-muted pl-4">
          {learningArea.strands.map((strand) => (
            <StrandItem
              key={strand.id}
              strand={strand}
              isExpanded={expandedStrands.includes(strand.id)}
              onToggle={() => onToggleStrand(strand.id)}
              expandedSubStrands={expandedSubStrands}
              onToggleSubStrand={onToggleSubStrand}
              onSelectCompetency={onSelectCompetency}
              selectedCompetencyId={selectedCompetencyId}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Strand Item
interface StrandItemProps {
  strand: CurriculumStrand;
  isExpanded: boolean;
  onToggle: () => void;
  expandedSubStrands: string[];
  onToggleSubStrand: (id: string) => void;
  onSelectCompetency: (comp: CurriculumCompetency) => void;
  selectedCompetencyId?: string;
}

function StrandItem({
  strand,
  isExpanded,
  onToggle,
  expandedSubStrands,
  onToggleSubStrand,
  onSelectCompetency,
  selectedCompetencyId,
}: StrandItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Layers className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-sm">{strand.name}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {strand.subStrands.length} sub-strands
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6 mt-1 space-y-1 border-l border-muted pl-4">
          {strand.subStrands.map((subStrand) => (
            <SubStrandItem
              key={subStrand.id}
              subStrand={subStrand}
              isExpanded={expandedSubStrands.includes(subStrand.id)}
              onToggle={() => onToggleSubStrand(subStrand.id)}
              onSelectCompetency={onSelectCompetency}
              selectedCompetencyId={selectedCompetencyId}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// SubStrand Item
interface SubStrandItemProps {
  subStrand: CurriculumSubStrand;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectCompetency: (comp: CurriculumCompetency) => void;
  selectedCompetencyId?: string;
}

function SubStrandItem({
  subStrand,
  isExpanded,
  onToggle,
  onSelectCompetency,
  selectedCompetencyId,
}: SubStrandItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">{subStrand.name}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {subStrand.competencies.length} competencies
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-5 mt-1 space-y-1">
          {subStrand.competencies.map((competency) => (
            <div
              key={competency.id}
              onClick={() => onSelectCompetency(competency)}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                selectedCompetencyId === competency.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted/30'
              }`}
            >
              <Target className="w-3 h-3 text-amber-500" />
              <span className="text-xs">{competency.name}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
