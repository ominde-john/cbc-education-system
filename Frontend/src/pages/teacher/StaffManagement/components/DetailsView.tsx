import React, { useState } from "react";
import { Edit, IdCard, Phone, Briefcase, BookOpen, Mail, MapPin, Calendar, Badge as BadgeIcon, Copy, Check, ArrowRight, GraduationCap, Briefcase as BriefcaseIcon } from "lucide-react";
import { StaffMember } from "../types";
import { fmt, getStaffTypeLabel, getStaffTypeColor } from "../helpers";
import { TopNav, NavBtn, Avatar, StatusBadge, Toast } from "./index";
import { cn } from "@/lib/utils";

interface DetailsViewProps {
  selected: StaffMember;
  onBack: () => void;
  onEdit: () => void;
  toast: string | null;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ selected, onBack, onEdit, toast }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const typeColor = getStaffTypeColor(selected.staffType);

  const sections = [
    {
      id: "personal", icon: IdCard, title: "Personal Information", color: "#1A56DB", bg: "bg-blue-50",
      fields: [
        { label: "Full Name", value: `${selected.firstName} ${selected.lastName}`, copyable: true },
        { label: "National ID", value: selected.idNumber, copyable: true },
        { label: "Date of Birth", value: selected.dateOfBirth },
        { label: "Gender", value: selected.sex },
        { label: "TSC Number", value: selected.tscNumber, copyable: true },
      ]
    },
    {
      id: "contact", icon: Phone, title: "Contact Information", color: "#15803D", bg: "bg-green-50",
      fields: [
        { label: "Email", value: selected.email, copyable: true, icon: Mail },
        { label: "Mobile", value: selected.mobilePhone, copyable: true },
        { label: "County", value: selected.county },
        { label: "Location", value: selected.location, icon: MapPin },
      ]
    },
    {
      id: "employment", icon: Briefcase, title: "Employment Information", color: "#B45309", bg: "bg-amber-50",
      fields: [
        { label: "Designation", value: selected.designation },
        { label: "Branch", value: selected.branch },
        { label: "Status", value: selected.jobStatus, badge: true },
        { label: "Hire Date", value: selected.hireDate, icon: Calendar },
        { label: "Contract Start", value: selected.contractStart },
        { label: "Contract End", value: selected.contractEnd },
      ]
    },
    {
      id: "teaching", icon: BookOpen, title: "Teaching Details", color: "#1D4ED8", bg: "bg-blue-50",
      fields: [], showTags: true
    }
  ];

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      <TopNav crumb="Profile" onBack={onBack} actions={<NavBtn icon={Edit} label="Edit Profile" onClick={onEdit} primary />} />

      {/* Header */}
      <div className="border-b border-border py-8 px-6" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.04) 0%, hsl(var(--primary) / 0.08) 100%)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              <Avatar staff={selected} size={80} />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-[3px] border-background flex items-center justify-center">
                <BadgeIcon size={14} className="text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.1em] mb-1.5">{selected.branch}</p>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{selected.firstName} {selected.lastName}</h1>
              <p className="text-[15px] text-muted-foreground mb-3">{selected.designation}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10.5px] font-bold uppercase tracking-wide" style={{ background: typeColor.bg, color: typeColor.text }}>
                  {selected.staffType === "teaching" ? <GraduationCap size={12} /> : <BriefcaseIcon size={12} />}
                  {getStaffTypeLabel(selected.staffType)}
                </span>
                <StatusBadge status={selected.jobStatus} />
                {selected.tscNumber && selected.tscNumber !== "N/A" && selected.staffType === "teaching" && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary/5 text-primary border border-primary/15">TSC: {selected.tscNumber}</span>
                )}
              </div>
            </div>
            {selected.salary > 0 && (
              <div className="bg-card border border-border rounded-2xl px-5 py-4 text-center min-w-[160px] shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Monthly Salary</p>
                <p className="text-2xl font-extrabold text-primary mb-1">{fmt(selected.salary)}</p>
                <p className="text-[11px] text-muted-foreground font-medium">Current compensation</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isTeaching = section.id === "teaching";
            return (
              <div key={section.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
                <div
                  className={cn("px-5 py-4 border-b border-border flex items-center gap-3 cursor-pointer", section.bg)}
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", section.bg)} style={{ border: `1px solid ${section.color}20` }}>
                    <SectionIcon size={16} color={section.color} strokeWidth={2.2} />
                  </div>
                  <p className="flex-1 text-[13px] font-extrabold text-foreground">{section.title}</p>
                  {!isTeaching && (
                    <ArrowRight size={16} className={cn("text-muted-foreground transition-transform duration-300", expandedSection === section.id && "rotate-90")} />
                  )}
                </div>

                <div className="px-5 py-4">
                  {isTeaching ? (
                    <>
                      {selected.teachingSubjects.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">📚 Subjects Taught</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.teachingSubjects.map(s => (
                              <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/15">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.qualifications.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">🎓 Qualifications</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.qualifications.map(q => (
                              <span key={q} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">{q}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {!selected.teachingSubjects.length && !selected.qualifications.length && (
                        <div className="text-[13px] text-muted-foreground p-3 text-center bg-muted/50 rounded-lg">No teaching details recorded.</div>
                      )}
                    </>
                  ) : (
                    <div>
                      {section.fields.map((field, idx) => {
                        const FieldIcon = (field as any).icon;
                        return (
                          <div key={idx} className={cn("flex justify-between items-start gap-3 py-2.5", idx < section.fields.length - 1 && "border-b border-border")}>
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">{field.label}</p>
                              <div className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                                {FieldIcon && <FieldIcon size={14} className="text-muted-foreground" />}
                                {(field as any).badge ? <StatusBadge status={field.value} /> : (field.value || "—")}
                              </div>
                            </div>
                            {field.copyable && (
                              <button onClick={() => handleCopy(field.value, field.label)} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                                {copiedField === field.label ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
};
