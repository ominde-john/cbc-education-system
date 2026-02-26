import React from "react";
import { Users, X, Save, ChevronDown, CheckCircle } from "lucide-react";
import { StaffMember } from "../types";
import { T, STATUS_CFG, DESIGNATIONS, BRANCHES, COUNTIES, ALL_SUBJECTS } from "../constants";
import { inp, sel, GLOBAL_CSS } from "../styles";
import { initials, avatarBg } from "../helpers";
import { TopNav, NavBtn, StatusBadge, FormField, Toast } from "./index";

/* ─── FORM VIEW ───────────────────────────────────────────────────────── */
interface FormViewProps {
  form: StaffMember;
  selected: StaffMember | null;
  tab: "general" | "teaching" | "contact";
  slots: string[];
  onBack: () => void;
  onSave: () => void;
  onTabChange: (tab: "general" | "teaching" | "contact") => void;
  onFieldChange: <K extends keyof StaffMember>(key: K, value: StaffMember[K]) => void;
  onSlotsChange: (slots: string[]) => void;
  toast: string | null;
}

export const FormView: React.FC<FormViewProps> = ({
  form,
  selected,
  tab,
  slots,
  onBack,
  onSave,
  onTabChange,
  onFieldChange,
  onSlotsChange,
  toast,
}) => {
  const sectionHeader = (title: string) => (
    <div style={{ fontSize: 12, fontWeight: 800, color: T.text.primary, marginBottom: 14, paddingBottom: 9, borderBottom: `1px solid ${T.border}`, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
      {title}
    </div>
  );

  const DD = ({ k, opts, placeholder }: { k: keyof StaffMember; opts: string[]; placeholder?: string }) => (
    <div style={{ position: "relative" }}>
      <select
        style={sel}
        value={String(form[k])}
        onChange={e => onFieldChange(k, e.target.value as StaffMember[typeof k])}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} color={T.text.muted} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <TopNav
        crumb={selected ? "Edit Staff" : "Register Staff"}
        onBack={onBack}
        actions={
          <>
            <NavBtn icon={X} label="Cancel" onClick={onBack} />
            <NavBtn icon={Save} label={selected ? "Save Changes" : "Register"} onClick={onSave} primary />
          </>
        }
      />
      <div style={{ background: "#0F1624", padding: "18px 32px 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 3 }}>
            {selected ? `Edit — ${selected.firstName} ${selected.lastName}` : "Register New Staff Member"}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Fields marked * are required</p>
        </div>
      </div>

      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {(["general", "teaching", "contact"] as const).map(t => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              style={{
                padding: "12px 18px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? T.accent : T.text.muted,
                borderBottom: `2.5px solid ${tab === t ? T.accent : "transparent"}`,
              }}
            >
              {t === "general" ? "Personal & Employment" : t === "teaching" ? "Teaching Details" : "Contact & Address"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 205px", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* General Tab */}
            {tab === "general" && (
              <>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
                  {sectionHeader("Personal Information")}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="First Name" required>
                      <input style={inp} value={form.firstName} onChange={e => onFieldChange("firstName", e.target.value)} placeholder="e.g. Jeremy" />
                    </FormField>
                    <FormField label="Last Name" required>
                      <input style={inp} value={form.lastName} onChange={e => onFieldChange("lastName", e.target.value)} placeholder="e.g. Bravoge" />
                    </FormField>
                    <FormField label="National ID" required>
                      <input style={inp} value={form.idNumber} onChange={e => onFieldChange("idNumber", e.target.value)} placeholder="e.g. ID001234567" />
                    </FormField>
                    <FormField label="Gender" required>
                      <DD k="sex" opts={["Male", "Female"]} />
                    </FormField>
                    <FormField label="Date of Birth">
                      <input style={inp} type="date" value={form.dateOfBirth} onChange={e => onFieldChange("dateOfBirth", e.target.value)} />
                    </FormField>
                    <FormField label="Salary (KSh/month)">
                      <input style={inp} type="number" value={form.salary || ""} onChange={e => onFieldChange("salary", Number(e.target.value))} placeholder="e.g. 45000" />
                    </FormField>
                  </div>
                </div>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
                  {sectionHeader("Employment Details")}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="Designation" required>
                      <DD k="designation" opts={DESIGNATIONS} placeholder="Select…" />
                    </FormField>
                    <FormField label="Job Status">
                      <DD k="jobStatus" opts={Object.keys(STATUS_CFG)} />
                    </FormField>
                    <FormField label="Branch" required>
                      <DD k="branch" opts={BRANCHES} placeholder="Select…" />
                    </FormField>
                    <FormField label="Hire Date">
                      <input style={inp} type="date" value={form.hireDate} onChange={e => onFieldChange("hireDate", e.target.value)} />
                    </FormField>
                    <FormField label="Contract Start">
                      <input style={inp} type="date" value={form.contractStart} onChange={e => onFieldChange("contractStart", e.target.value)} />
                    </FormField>
                    <FormField label="Contract End">
                      <input style={inp} type="date" value={form.contractEnd} onChange={e => onFieldChange("contractEnd", e.target.value)} />
                    </FormField>
                  </div>
                </div>
              </>
            )}

            {/* Teaching Tab */}
            {tab === "teaching" && (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
                {sectionHeader("Teaching Details")}
                <div style={{ display: "grid", gap: 14 }}>
                  <FormField label="TSC Number">
                    <input style={inp} value={form.tscNumber} onChange={e => onFieldChange("tscNumber", e.target.value)} placeholder="e.g. TSC123456" />
                  </FormField>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.text.secondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                      Subjects Assigned (up to 4)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {slots.map((s, i) => (
                        <div key={i}>
                          <label style={{ fontSize: 11, color: T.text.muted, display: "block", marginBottom: 4 }}>Subject {i + 1}</label>
                          <div style={{ position: "relative" }}>
                            <select
                              style={sel}
                              value={s}
                              onChange={e => {
                                const ns = [...slots];
                                ns[i] = e.target.value;
                                onSlotsChange(ns);
                              }}
                            >
                              <option value="">— None —</option>
                              {ALL_SUBJECTS.map(sub => <option key={sub}>{sub}</option>)}
                            </select>
                            <ChevronDown size={12} color={T.text.muted} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormField label="Qualifications (comma separated)">
                    <input
                      style={inp}
                      value={form.qualifications.join(", ")}
                      onChange={e => onFieldChange("qualifications", e.target.value.split(",").map(q => q.trim()).filter(Boolean))}
                      placeholder="e.g. B.Ed Mathematics, Diploma in Education"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {tab === "contact" && (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
                {sectionHeader("Contact & Address")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormField label="Email" required>
                    <input style={inp} type="email" value={form.email} onChange={e => onFieldChange("email", e.target.value)} placeholder="name@school.ac.ke" />
                  </FormField>
                  <FormField label="Mobile" required>
                    <input style={inp} value={form.mobilePhone} onChange={e => onFieldChange("mobilePhone", e.target.value)} placeholder="+254712345678" />
                  </FormField>
                  <FormField label="County">
                    <DD k="county" opts={COUNTIES} placeholder="Select county…" />
                  </FormField>
                  <FormField label="Location">
                    <input style={inp} value={form.location} onChange={e => onFieldChange("location", e.target.value)} placeholder="e.g. Mathare North" />
                  </FormField>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: form.firstName ? avatarBg(selected?.id ?? "0") : T.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  fontSize: 20,
                  fontWeight: 800,
                  color: form.firstName ? "white" : T.text.muted,
                }}
              >
                {form.firstName && form.lastName ? initials(form.firstName, form.lastName) : <Users size={22} color={T.text.muted} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text.primary }}>{form.firstName || "First"} {form.lastName || "Last"}</div>
              <div style={{ fontSize: 11, color: T.text.muted, marginTop: 2 }}>{form.designation || "No designation"}</div>
              {form.jobStatus && <div style={{ marginTop: 8 }}><StatusBadge status={form.jobStatus} /></div>}
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.text.primary, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Completion</div>
              {([
                ["Name", !!(form.firstName && form.lastName)],
                ["ID Number", !!form.idNumber],
                ["Designation", !!form.designation],
                ["Branch", !!form.branch],
                ["Email", !!form.email],
                ["Phone", !!form.mobilePhone],
              ] as [string, boolean][]).map(([lbl, done]) => (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 12, color: T.text.secondary }}>{lbl}</span>
                  {done ? <CheckCircle size={14} color="#15803D" /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${T.border}` }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
};
