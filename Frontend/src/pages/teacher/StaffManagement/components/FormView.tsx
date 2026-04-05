import React, { useState, useMemo } from "react";
import {
  Users,
  X,
  Save,
  ChevronDown,
  CheckCircle,
  Camera,
  AlertCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { StaffMember } from "../types";
import {
  STATUS_CFG,
  DESIGNATIONS,
  COUNTIES,
  ALL_SUBJECTS,
} from "../constants";
import { initials, avatarBg } from "../helpers";
import { TopNav, NavBtn, StatusBadge, FormField, Toast } from "./index";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { Branch } from "@/lib/api/schoolsApi";


interface FormViewProps {
  form: StaffMember;
  selected: StaffMember | null;
  tab: "general" | "teaching" | "contact";
  slots: string[];
  branches: Branch[];
  onBack: () => void;
  onSave: () => void;
  onDiscard?: () => void;
  onTabChange: (tab: "general" | "teaching" | "contact") => void;
  onFieldChange: <K extends keyof StaffMember>(
    key: K,
    value: StaffMember[K]
  ) => void;
  onSlotsChange: (slots: string[]) => void;
  toast: string | null;
}

const inputClasses =
  "w-full px-3 py-2.5 border border-border rounded-lg text-sm text-foreground bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground font-sans";
const selectClasses = cn(inputClasses, "appearance-none pr-8 cursor-pointer");

export const FormView: React.FC<FormViewProps> = ({
  form,
  selected,
  tab,
  slots,
  branches,
  onBack,
  onSave,
  onDiscard,
  onTabChange,
  onFieldChange,
  onSlotsChange,
  toast,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string>(form.photo || "");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoPreview(url);
    onFieldChange("photo", url);
  };

  const handleImagePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            setPhotoPreview(base64String);
            onFieldChange("photo", base64String);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const DD = ({
    k,
    opts,
    placeholder,
  }: {
    k: keyof StaffMember;
    opts: string[];
    placeholder?: string;
  }) => {
    const currentValue = String(form[k] ?? "").trim();
    const normalizedOptions = opts.map((o) => String(o).trim()).filter(Boolean);
    const includeCurrent = currentValue && !normalizedOptions.includes(currentValue);
    const optionValues = includeCurrent
      ? [...normalizedOptions, currentValue]
      : normalizedOptions;

    return (
      <div className="relative">
        <select
          className={selectClasses}
          value={currentValue}
          onChange={(e) =>
            onFieldChange(k, e.target.value as StaffMember[typeof k])
          }
        >
          {placeholder && <option value="">{placeholder}</option>}
          {optionValues.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
        />
      </div>
    );
  };

const branchOptions = useMemo(() => {
  const normalized = branches
    .map((branch) => branch.name?.trim())
    .filter(Boolean);
  
  const unique = Array.from(new Set(normalized));
  const selectedBranch = form.branch?.trim();

  if (selectedBranch && !unique.includes(selectedBranch)) {
    return [...unique, selectedBranch];
  }

  return unique;
}, [branches, form.branch]);

  // Calculate form completion
  const requiredFields = [
    form.firstName,
    form.lastName,
    form.idNumber,
    form.sex,
    form.designation,
    form.branch,
    form.email,
    form.mobilePhone,
  ];
  const completedCount = requiredFields.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / requiredFields.length) * 100);

  const completionChecks = [
    ["Full Name", !!(form.firstName && form.lastName)],
    ["ID Number", !!form.idNumber],
    ["Gender", !!form.sex],
    ["Designation", !!form.designation],
    ["Branch", !!form.branch],
    ["Email", !!form.email],
    ["Phone", !!form.mobilePhone],
    ["Salary", !!form.salary],
  ] as [string, boolean][];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {selected ? "Edit Staff Member" : "Register New Staff"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selected ? "Update staff information" : "Add a new staff member to your school"}
            </p>
          </div>
        </div>
      </div>

      {/* Header Alert */}
      {!selected && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Fill in all required fields (marked with <span className="font-bold">*</span>) to register the staff member.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(t) => onTabChange(t as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent border-b border-border rounded-none">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Personal & Employment</span>
              <span className="sm:hidden">Personal</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="teaching"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
          >
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Teaching Details</span>
              <span className="sm:hidden">Teaching</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contact & Address</span>
              <span className="sm:hidden">Contact</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 mt-0">
              {/* Photo Section */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Staff Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-end gap-6">
                    {/* Photo Preview */}
                    <div className="flex-shrink-0">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Staff preview"
                          className="w-24 h-24 rounded-lg object-cover shadow-md border border-border"
                          onError={() => setPhotoPreview("")}
                        />
                      ) : (
                        <div
                          className="w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-md border border-border"
                          style={{
                            background: form.firstName
                              ? `linear-gradient(135deg, ${avatarBg(selected?.id ?? "0")}, ${avatarBg(selected?.id ?? "0")}dd)`
                              : undefined,
                          }}
                        >
                          {form.firstName && form.lastName ? (
                            initials(form.firstName, form.lastName)
                          ) : (
                            <Camera size={24} className="text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Photo URL or Paste Image
                      </label>
                      <input
                        className={inputClasses}
                        value={form.photo || ""}
                        onChange={handlePhotoChange}
                        onPaste={handleImagePaste}
                        placeholder="Enter photo URL or paste an image"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter a URL or paste an image directly from clipboard
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="First Name" required>
                      <input
                        className={inputClasses}
                        value={form.firstName}
                        onChange={(e) =>
                          onFieldChange("firstName", e.target.value)
                        }
                        placeholder="e.g. Jeremy"
                      />
                    </FormField>
                    <FormField label="Last Name" required>
                      <input
                        className={inputClasses}
                        value={form.lastName}
                        onChange={(e) =>
                          onFieldChange("lastName", e.target.value)
                        }
                        placeholder="e.g. Bravoge"
                      />
                    </FormField>
                    <FormField label="National ID" required>
                      <input
                        className={inputClasses}
                        value={form.idNumber}
                        onChange={(e) =>
                          onFieldChange("idNumber", e.target.value)
                        }
                        placeholder="e.g. ID001234567"
                      />
                    </FormField>
                    <FormField label="Gender" required>
                      <DD k="sex" opts={["Male", "Female"]} />
                    </FormField>
                    <FormField label="Date of Birth">
                      <input
                        className={inputClasses}
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          onFieldChange("dateOfBirth", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Salary (KSh/month)">
                      <input
                        className={inputClasses}
                        type="number"
                        value={form.salary || ""}
                        onChange={(e) =>
                          onFieldChange("salary", Number(e.target.value) || 0)
                        }
                        placeholder="e.g. 45000"
                      />
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-50/50 pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Staff Type" required>
                      <div className="relative">
                        <select
                          className={selectClasses}
                          value={String(form.staffType || "teaching")}
                          onChange={(e) =>
                            onFieldChange(
                              "staffType",
                              e.target.value as "teaching" | "non-teaching"
                            )
                          }
                        >
                          <option value="teaching">Teaching Staff</option>
                          <option value="non-teaching">Non-Teaching Staff</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        />
                      </div>
                    </FormField>
                    <FormField label="Designation" required>
                      <DD k="designation" opts={DESIGNATIONS} placeholder="Select…" />
                    </FormField>
                    <FormField label="Job Status">
                      <DD k="jobStatus" opts={Object.keys(STATUS_CFG)} />
                    </FormField>
                    <FormField label="Branch" required>
                      <div className="relative">
                        <select
                          className={selectClasses}
                          value={form.branch || ""}
                          onChange={(e) =>
                            onFieldChange("branch", e.target.value as StaffMember["branch"])
                          }
                        >
                          <option value="">Select…</option>
                          {branchOptions.map((branchName) => (
                            <option key={branchName} value={branchName}>
                              {branchName}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        />
                      </div>
                    </FormField>
                    <FormField label="Hire Date">
                      <input
                        className={inputClasses}
                        type="date"
                        value={form.hireDate}
                        onChange={(e) =>
                          onFieldChange("hireDate", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Contract Start">
                      <input
                        className={inputClasses}
                        type="date"
                        value={form.contractStart}
                        onChange={(e) =>
                          onFieldChange("contractStart", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Contract End">
                      <input
                        className={inputClasses}
                        type="date"
                        value={form.contractEnd}
                        onChange={(e) =>
                          onFieldChange("contractEnd", e.target.value)
                        }
                      />
                    </FormField>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teaching Tab */}
            <TabsContent value="teaching" className="space-y-6 mt-0">
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 pb-3">
                  <CardTitle className="text-sm">Teaching Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* TSC Number */}
                  <FormField label="TSC Number">
                    <input
                      className={inputClasses}
                      value={form.tscNumber}
                      onChange={(e) =>
                        onFieldChange("tscNumber", e.target.value)
                      }
                      placeholder="e.g. TSC123456"
                    />
                  </FormField>

                  {/* Subjects */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Subjects Assigned (up to 4)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {slots.map((s, i) => (
                        <div key={i}>
                          <label className="text-xs text-muted-foreground block mb-2">
                            Subject {i + 1}
                          </label>
                          <div className="relative">
                            <select
                              className={selectClasses}
                              value={s}
                              onChange={(e) => {
                                const ns = [...slots];
                                ns[i] = e.target.value;
                                onSlotsChange(ns);
                              }}
                            >
                              <option value="">— None —</option>
                              {ALL_SUBJECTS.map((sub) => (
                                <option key={sub}>{sub}</option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Qualifications */}
                  <FormField label="Qualifications (comma separated)">
                    <input
                      className={inputClasses}
                      value={form.qualifications.join(", ")}
                      onChange={(e) =>
                        onFieldChange(
                          "qualifications",
                          e.target.value
                            .split(",")
                            .map((q) => q.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="e.g. B.Ed Mathematics, Diploma in Education"
                    />
                  </FormField>

                  {/* Qualification Tags */}
                  {form.qualifications && form.qualifications.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Added Qualifications
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {form.qualifications.map((qual, idx) => (
                          <Badge key={idx} variant="outline">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6 mt-0">
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/50 pb-3">
                  <CardTitle className="text-sm">Contact & Address</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Email" required>
                      <input
                        className={inputClasses}
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          onFieldChange("email", e.target.value)
                        }
                        placeholder="name@school.ac.ke"
                      />
                    </FormField>
                    <FormField label="Mobile" required>
                      <input
                        className={inputClasses}
                        value={form.mobilePhone}
                        onChange={(e) =>
                          onFieldChange("mobilePhone", e.target.value)
                        }
                        placeholder="+254712345678"
                      />
                    </FormField>
                    <FormField label="County">
                      <DD k="county" opts={COUNTIES} placeholder="Select county…" />
                    </FormField>
                    <FormField label="Location">
                      <input
                        className={inputClasses}
                        value={form.location}
                        onChange={(e) =>
                          onFieldChange("location", e.target.value)
                        }
                        placeholder="e.g. Mathare North"
                      />
                    </FormField>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile Preview */}
            <Card className="border-0 shadow-sm overflow-hidden sticky top-6">
              <CardContent className="p-6 text-center">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Staff"
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3 shadow-md border border-border"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-md border border-border"
                    style={{
                      background: form.firstName
                        ? `linear-gradient(135deg, ${avatarBg(selected?.id ?? "0")}, ${avatarBg(selected?.id ?? "0")}dd)`
                        : undefined,
                      color: form.firstName ? "white" : undefined,
                    }}
                  >
                    {form.firstName && form.lastName ? (
                      initials(form.firstName, form.lastName)
                    ) : (
                      <Users size={20} className="text-muted-foreground" />
                    )}
                  </div>
                )}
                <p className="text-sm font-semibold text-foreground">
                  {form.firstName || "First"} {form.lastName || "Last"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {form.designation || "No designation"}
                </p>
                {form.jobStatus && (
                  <div className="mt-3 flex justify-center">
                    <StatusBadge status={form.jobStatus} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completion Checklist */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Form Completion</span>
                  <span className="text-xs font-bold text-primary">
                    {completionPercent}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={completionPercent} className="h-2" />
                <div className="space-y-2">
                  {completionChecks.map(([label, done]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                      {done ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sticky bottom-6">
              <Button
                onClick={onSave}
                className="w-full gap-2"
                size="lg"
              >
                <Save className="w-4 h-4" />
                {selected ? "Save Changes" : "Register"}
              </Button>
              {selected && onDiscard && (
                <Button
                  onClick={onDiscard}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                >
                  <X className="w-4 h-4" />
                  Discard Changes
                </Button>
              )}
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4" />
                {selected ? "Cancel" : "Back"}
              </Button>
            </div>
          </div>
        </div>
      </Tabs>

      {toast && <Toast msg={toast} />}
    </div>
  );
};