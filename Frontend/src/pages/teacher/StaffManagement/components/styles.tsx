import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  Button } from "@/components/ui/button";
import { 
  Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";

/* ─── CUSTOM COMPONENTS ──────────────────────────────── */

export function StatusBadge({ 
  status, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { status: string }) {
  const variantMap = {
    "Active": "default" as const,
    "On Leave": "secondary" as const,
    "Inactive": "secondary" as const,
    "Terminated": "destructive" as const,
  } as Record<string, "default" | "secondary" | "destructive">;
  
  return (
    <Badge 
      variant={variantMap[status] || "secondary"} 
      className={cn("gap-1.5 px-3 h-7 text-xs font-semibold uppercase tracking-wider shrink-0 border", className)}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

export function StaffTypeBadge({ staffType }: { staffType: "teaching" | "non-teaching" }) {
  return (
    <Badge variant="secondary" className={cn("gap-1 text-xs font-medium", {
      "bg-indigo-100 text-indigo-800 border-indigo-200": staffType === "teaching",
      "bg-orange-100 text-orange-800 border-orange-200": staffType === "non-teaching",
    })}>
      {staffType === "teaching" ? "👨‍🏫 Teacher" : "💼 Non-Teaching"}
    </Badge>
  );
}

export function StatCard({
  icon: Icon,
  label, 
  value, 
  trend,
  color = "default"
}: { 
  icon: React.ElementType;
  label: string; 
  value: string | number; 
  trend?: string;
  color?: string;
}) {
  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/2 via-transparent to-transparent -skew-x-12 -translate-x-8 group-hover:translate-x-0 transition-transform duration-700 opacity-30" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all", {
            "bg-emerald-100 border-emerald-200": color === "success",
          })}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
          </div>
        </div>
      </CardHeader>
      {trend && (
        <CardContent className="pt-0 pb-4">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {trend}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

/* ─── RE-EXPORTS ────────────────────────────────────────────────────── */

export { 
  Button, Badge, Card, CardHeader, CardTitle, CardContent, 
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Avatar, AvatarFallback, AvatarImage,
  cn 
};
