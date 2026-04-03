import React, { useState } from "react";
import { Users, X, Save, ChevronDown, CheckCircle, Camera } from "lucide-react";
import { StaffMember } from "../types";
import { STATUS_CFG, DESIGNATIONS, BRANCHES, COUNTIES, ALL_SUBJECTS } from "../constants";
import { initials, avatarBg } from "../helpers";
import { TopNav, NavBtn, StatusBadge, FormField, Toast } from "./index";
import { cn } from "@/lib/utils";

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

const inputClasses = "w-full px-3 py-2.5 border border-border rounded-lg text-[13px] text-foreground bg-card outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground font-sans";
const selectClasses = cn(inputClasses, "appearance-none pr-8 cursor-pointer");

export const FormView: React.FC<FormViewProps> = ({ form, selected, tab, slots, onBack, onSave, onTabChange, onFieldChange, onSlotsChange, toast }) => {
  const [photoPreview, setPhotoPreview] = useState<string>(form.photo || "");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    console.log('[DEBUG] FormView handlePhotoChange:', url);
    setPhotoPreview(url);
    onFieldChange("photo", url);
  };

  const handleImagePaste = (event: React.ClipboardEvent) => {
    console.log('[DEBUG] handleImagePaste triggered');
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        console.log('[DEBUG] Image item found, converting to base64...');
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            console.log('[DEBUG] Image converted to base64, length:', base64String.length);
            setPhotoPreview(base64String);
            onFieldChange('photo', base64String);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const DD = ({ k, opts, placeholder }: { k: keyof StaffMember; opts: string[]; placeholder?: string }) => (
    <div className="relative">
      <select className={selectClasses} value={String(form[k])} onChange={e => onFieldChange(k, e.target.value as StaffMember[typeof k])}>
        {placeholder && <option value="">{placeholder}</option>}
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <p className="text-xs font-extrabold text-foreground mb-3.5 pb-2.5 border-b border-border uppercase tracking-wide">{title}</p>
  );

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      <TopNav crumb={selected ? "Edit Staff" : "Register Staff"} onBack={onBack} actions={
        <div className="flex gap-2">
          <NavBtn icon={X} label="Cancel" onClick={onBack} />
          <NavBtn icon={Save} label={selected ? "Save Changes" : "Register"} onClick={onSave} primary />
        </div>
      } />

      {/* Dark Header */}
      <div className="bg-foreground px-8 py-5">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-xl font-extrabold text-background mb-1">
            {selected ? `Edit — ${selected.firstName} ${selected.lastName}` : "Register New Staff Member"}
          </h1>
          <p className="text-[13px] text-background/40">Fields marked · are required</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-card border-b border-border px-8">
        <div className="max-w-[1100px] mx-auto flex">
          {(["general", "teaching", "contact"] as const).map(t => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={cn(
                "px-5 py-3 text-[13px] font-medium transition-colors border-b-[2.5px]",
                tab === t
                  ? "font-bold text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {t === "general" ? "Personal & Employment" : t === "teaching" ? "Teaching Details" : "Contact & Address"}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-[1100px] mx-auto px-6 py-5">
        <div className="grid grid-cols-[1fr_205px] gap-4">
          <div className="flex flex-col gap-4">
            {tab === "general" && (
              <>
                {/* Photo Section */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <SectionHeader title="Staff Photo" />
                  <div className="flex items-center gap-5">
                    <div className="shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Staff preview" className="w-20 h-20 rounded-xl object-cover shadow-md" onError={() => setPhotoPreview("")} />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-extrabold text-white"
                          style={{ background: `linear-gradient(135deg, ${avatarBg(selected?.id ?? "0")}, ${avatarBg(selected?.id ?? "0")}dd)` }}
                        >
                          {form.firstName && form.lastName ? initials(form.firstName, form.lastName) : <Camera size={24} className="text-white" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <FormField label="Photo URL">
                        <input 
                          className={inputClasses} 
                          value={form.photo || ""} 
                          onChange={handlePhotoChange} 
                          onPaste={handleImagePaste}
                          placeholder="Enter photo URL or paste an image" 
                        />
                      </FormField>
                      <p className="text-[11px] text-muted-foreground mt-1.5">Paste a URL to a photo or paste an image directly</p>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <SectionHeader title="Personal Information" />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="First Name" required><input className={inputClasses} value={form.firstName} onChange={e => onFieldChange("firstName", e.target.value)} placeholder="e.g. Jeremy" /></FormField>
                    <FormField label="Last Name" required><input className={inputClasses} value={form.lastName} onChange={e => onFieldChange("lastName", e.target.value)} placeholder="e.g. Bravoge" /></FormField>
                    <FormField label="National ID" required><input className={inputClasses} value={form.idNumber} onChange={e => onFieldChange("idNumber", e.target.value)} placeholder="e.g. ID001234567" /></FormField>
                    <FormField label="Gender" required><DD k="sex" opts={["Male", "Female"]} /></FormField>
                    <FormField label="Date of Birth"><input className={inputClasses} type="date" value={form.dateOfBirth} onChange={e => onFieldChange("dateOfBirth", e.target.value)} /></FormField>
                    <FormField label="Salary (KSh/month)"><input className={inputClasses} type="number" value={form.salary || ""} onChange={e => onFieldChange("salary", Number(e.target.value))} placeholder="e.g. 45000" /></FormField>
                  </div>
                </div>

                {/* Employment */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <SectionHeader title="Employment Details" />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Staff Type" required>
                      <div className="relative">
                        <select className={selectClasses} value={String(form.staffType || "teaching")} onChange={e => onFieldChange("staffType", e.target.value as "teaching" | "non-teaching")}>
                          <option value="teaching">Teaching Staff</option><option value="non-teaching">Non-Teaching Staff</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                      </div>
                    </FormField>
                    <FormField label="Designation" required><DD k="designation" opts={DESIGNATIONS} placeholder="Select…" /></FormField>
                    <FormField label="Job Status"><DD k="jobStatus" opts={Object.keys(STATUS_CFG)} /></FormField>
                    <FormField label="Branch" required><DD k="branch" opts={BRANCHES} placeholder="Select…" /></FormField>
                    <FormField label="Hire Date"><input className={inputClasses} type="date" value={form.hireDate} onChange={e => onFieldChange("hireDate", e.target.value)} /></FormField>
                    <FormField label="Contract Start"><input className={inputClasses} type="date" value={form.contractStart} onChange={e => onFieldChange("contractStart", e.target.value)} /></FormField>
                    <FormField label="Contract End"><input className={inputClasses} type="date" value={form.contractEnd} onChange={e => onFieldChange("contractEnd", e.target.value)} /></FormField>
                  </div>
                </div>
              </>
            )}

            {tab === "teaching" && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <SectionHeader title="Teaching Details" />
                <div className="flex flex-col gap-4">
                  <FormField label="TSC Number"><input className={inputClasses} value={form.tscNumber} onChange={e => onFieldChange("tscNumber", e.target.value)} placeholder="e.g. TSC123456" /></FormField>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2.5">Subjects Assigned (up to 4)</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {slots.map((s, i) => (
                        <div key={i}>
                          <label className="text-[11px] text-muted-foreground block mb-1">Subject {i + 1}</label>
                          <div className="relative">
                            <select className={selectClasses} value={s} onChange={e => { const ns = [...slots]; ns[i] = e.target.value; onSlotsChange(ns); }}>
                              <option value="">— None —</option>
                              {ALL_SUBJECTS.map(sub => <option key={sub}>{sub}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormField label="Qualifications (comma separated)">
                    <input className={inputClasses} value={form.qualifications.join(", ")} onChange={e => onFieldChange("qualifications", e.target.value.split(",").map(q => q.trim()).filter(Boolean))} placeholder="e.g. B.Ed Mathematics, Diploma in Education" />
                  </FormField>
                </div>
              </div>
            )}

            {tab === "contact" && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <SectionHeader title="Contact & Address" />
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Email" required><input className={inputClasses} type="email" value={form.email} onChange={e => onFieldChange("email", e.target.value)} placeholder="name@school.ac.ke" /></FormField>
                  <FormField label="Mobile" required><input className={inputClasses} value={form.mobilePhone} onChange={e => onFieldChange("mobilePhone", e.target.value)} placeholder="+254712345678" /></FormField>
                  <FormField label="County"><DD k="county" opts={COUNTIES} placeholder="Select county…" /></FormField>
                  <FormField label="Location"><input className={inputClasses} value={form.location} onChange={e => onFieldChange("location", e.target.value)} placeholder="e.g. Mathare North" /></FormField>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              {form.photo ? (
                <img src={form.photo} alt="Staff" className="w-16 h-16 rounded-full object-cover mx-auto mb-2.5 shadow-md" />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2.5 text-lg font-extrabold"
                  style={{
                    background: form.firstName ? avatarBg(selected?.id ?? "0") : undefined,
                    color: form.firstName ? "white" : undefined,
                  }}
                >
                  {form.firstName && form.lastName ? initials(form.firstName, form.lastName) : <Users size={18} className="text-muted-foreground" />}
                </div>
              )}
              <p className="text-[13px] font-bold text-foreground">{form.firstName || "First"} {form.lastName || "Last"}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{form.designation || "No designation"}</p>
              {form.jobStatus && <div className="mt-2"><StatusBadge status={form.jobStatus} /></div>}
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-[11px] font-extrabold text-foreground mb-2.5 uppercase tracking-wide">Completion</p>
              {([["Name", !!(form.firstName && form.lastName)], ["ID Number", !!form.idNumber], ["Designation", !!form.designation], ["Branch", !!form.branch], ["Email", !!form.email], ["Phone", !!form.mobilePhone]] as [string, boolean][]).map(([lbl, done]) => (
                <div key={lbl} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{lbl}</span>
                  {done ? <CheckCircle size={14} className="text-primary" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-border" />}
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
