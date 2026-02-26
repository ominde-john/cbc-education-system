import React, { useState } from "react";
import { Edit, IdCard, Phone, Briefcase, BookOpen, Mail, MapPin, Calendar, Badge as BadgeIcon, Code2, Copy, Check, ArrowRight, GraduationCap, Briefcase as BriefcaseIcon } from "lucide-react";
import { StaffMember } from "../types";
import { T } from "../constants";
import { fmt, getStaffTypeLabel, getStaffTypeColor } from "../helpers";
import { GLOBAL_CSS } from "../styles";
import { TopNav, NavBtn, Avatar, StatusBadge, DetailRow, Toast } from "./index";

/* ─── DETAILS VIEW - MODERN UI/UX ─────────────────────────────────────── */
interface DetailsViewProps {
  selected: StaffMember;
  onBack: () => void;
  onEdit: () => void;
  toast: string | null;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  selected,
  onBack,
  onEdit,
  toast,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sections = [
    {
      id: "personal",
      icon: IdCard,
      title: "Personal Information",
      color: "#1A56DB",
      bg: "#EBF0FF",
      fields: [
        { label: "Full Name", value: `${selected.firstName} ${selected.lastName}`, copyable: true },
        { label: "National ID", value: selected.idNumber, copyable: true },
        { label: "Date of Birth", value: selected.dateOfBirth },
        { label: "Gender", value: selected.sex },
        { label: "TSC Number", value: selected.tscNumber, copyable: true },
      ]
    },
    {
      id: "contact",
      icon: Phone,
      title: "Contact Information",
      color: "#15803D",
      bg: "#F0FDF4",
      fields: [
        { label: "Email", value: selected.email, copyable: true, icon: Mail },
        { label: "Mobile", value: selected.mobilePhone, copyable: true },
        { label: "County", value: selected.county },
        { label: "Location", value: selected.location, icon: MapPin },
      ]
    },
    {
      id: "employment",
      icon: Briefcase,
      title: "Employment Information",
      color: "#B45309",
      bg: "#FFFBEB",
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
      id: "teaching",
      icon: BookOpen,
      title: "Teaching Details",
      color: "#1D4ED8",
      bg: "#EFF6FF",
      fields: [],
      showTags: true
    }
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: T.bg, 
      fontFamily: "'DM Sans',system-ui,sans-serif" 
    }}>
      <style>{GLOBAL_CSS}</style>
      <TopNav
        crumb="Profile"
        onBack={onBack}
        actions={<NavBtn icon={Edit} label="Edit Profile" onClick={onEdit} primary />}
      />

      {/* MODERN HEADER SECTION */}
      <div style={{
        background: `linear-gradient(135deg, ${T.accent}08 0%, ${T.accent}12 100%)`,
        borderBottom: `1px solid ${T.border}`,
        padding: "32px 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              <Avatar staff={selected} size={80} />
              <div style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: T.accent,
                border: `3px solid ${T.bg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <BadgeIcon size={14} color="white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Main Info */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6
                }}>
                  {selected.branch}
                </div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: T.text.primary,
                  margin: 0,
                  marginBottom: 8,
                  lineHeight: 1.2
                }}>
                  {selected.firstName} {selected.lastName}
                </h1>
                <p style={{
                  fontSize: 15,
                  color: T.text.muted,
                  margin: 0,
                  marginBottom: 12
                }}>
                  {selected.designation}
                </p>

                {/* Quick Info Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {/* Staff Type Badge */}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 14,
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    background: getStaffTypeColor(selected.staffType).bg,
                    color: getStaffTypeColor(selected.staffType).text,
                  }}>
                    {selected.staffType === "teaching" ? (
                      <GraduationCap size={12} />
                    ) : (
                      <BriefcaseIcon size={12} />
                    )}
                    {getStaffTypeLabel(selected.staffType)}
                  </span>
                  <StatusBadge status={selected.jobStatus} />
                  {selected.tscNumber && selected.tscNumber !== "N/A" && selected.staffType === "teaching" && (
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${T.accent}08`,
                      color: T.accent,
                      border: `1px solid ${T.accent}20`
                    }}>
                      TSC: {selected.tscNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Card */}
            {selected.salary > 0 && (
              <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "16px 20px",
                textAlign: "center",
                minWidth: "160px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.accent;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${T.accent}12`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.border;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}>
                <div style={{
                  fontSize: 10,
                  color: T.text.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontWeight: 600,
                  marginBottom: 8
                }}>
                  Monthly Salary
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: T.accent,
                  marginBottom: 4
                }}>
                  {fmt(selected.salary)}
                </div>
                <div style={{
                  fontSize: 11,
                  color: T.text.muted,
                  fontWeight: 500
                }}>
                  Current compensation
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16 }}>
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isTeaching = section.id === "teaching";

            return (
              <div
                key={section.id}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: expandedSection === section.id ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (expandedSection !== section.id) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = section.color;
                    el.style.boxShadow = `0 12px 32px ${section.color}12`;
                    el.style.transform = "translateY(-4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (expandedSection !== section.id) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = T.border;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }
                }}
              >
                {/* Section Header */}
                <div style={{
                  padding: "16px 18px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: `${section.bg}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: section.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${section.color}20`
                  }}>
                    <SectionIcon size={16} color={section.color} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: T.text.primary
                    }}>
                      {section.title}
                    </div>
                  </div>
                  {!isTeaching && (
                    <ArrowRight
                      size={16}
                      color={T.text.muted}
                      style={{
                        transition: "transform 0.3s ease",
                        transform: expandedSection === section.id ? "rotate(90deg)" : "rotate(0deg)"
                      }}
                    />
                  )}
                </div>

                {/* Section Content */}
                <div style={{ padding: "14px 18px" }}>
                  {isTeaching ? (
                    <>
                      {selected.teachingSubjects.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: T.text.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: 10
                          }}>
                            📚 Subjects Taught
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {selected.teachingSubjects.map(s => (
                              <span
                                key={s}
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  padding: "6px 12px",
                                  borderRadius: 20,
                                  background: `${T.accent}08`,
                                  color: T.accent,
                                  border: `1px solid ${T.accent}20`,
                                  transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background = `${T.accent}12`;
                                  el.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background = `${T.accent}08`;
                                  el.style.transform = "translateY(0)";
                                }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selected.qualifications.length > 0 && (
                        <div>
                          <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: T.text.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: 10
                          }}>
                            🎓 Qualifications
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {selected.qualifications.map(q => (
                              <span
                                key={q}
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  padding: "6px 12px",
                                  borderRadius: 20,
                                  background: "#F0FDF4",
                                  color: "#15803D",
                                  border: "1px solid #86EFAC",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background = "#DCFCE7";
                                  el.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background = "#F0FDF4";
                                  el.style.transform = "translateY(0)";
                                }}>
                                {q}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {!selected.teachingSubjects.length && !selected.qualifications.length && (
                        <div style={{
                          fontSize: 13,
                          color: T.text.muted,
                          padding: "12px",
                          textAlign: "center",
                          background: T.bg,
                          borderRadius: 8
                        }}>
                          No teaching details recorded.
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      {section.fields.map((field, idx) => {
                        const FieldIcon = field.icon;

                        return (
                          <div
                            key={idx}
                            style={{
                              paddingBottom: idx < section.fields.length - 1 ? 12 : 0,
                              marginBottom: idx < section.fields.length - 1 ? 12 : 0,
                              borderBottom: idx < section.fields.length - 1 ? `1px solid ${T.border}` : "none",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 12,
                              transition: "all 0.2s ease",
                              padding: "8px 0"
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = `${T.bg}`;
                              el.style.borderRadius = "6px";
                              el.style.padding = "8px 8px";
                              el.style.marginLeft = "-8px";
                              el.style.marginRight = "-8px";
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "transparent";
                              el.style.borderRadius = "0px";
                              el.style.padding = "8px 0";
                              el.style.marginLeft = "0";
                              el.style.marginRight = "0";
                            }}>
                            <div>
                              <div style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: T.text.muted,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: 4
                              }}>
                                {field.label}
                              </div>
                              <div style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: T.text.primary,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                              }}>
                                {FieldIcon && <FieldIcon size={14} color={T.text.muted} />}
                                {field.badge ? (
                                  <StatusBadge status={field.value} />
                                ) : (
                                  field.value || "—"
                                )}
                              </div>
                            </div>
                            {field.copyable && (
                              <button
                                onClick={() => handleCopy(field.value, field.label)}
                                style={{
                                  opacity: 0,
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 4,
                                  transition: "all 0.2s ease",
                                  color: T.text.muted,
                                  minWidth: 32,
                                  minHeight: 32
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.opacity = "1";
                                  el.style.background = T.bg;
                                  el.style.color = T.accent;
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.opacity = "0";
                                }}
                              >
                                {copiedField === field.label ? (
                                  <Check size={16} />
                                ) : (
                                  <Copy size={16} />
                                )}
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
