import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { StaffMember, StaffManagementProps } from "./types";
import { 
  getTeachers, 
  inviteTeacher, 
  updateTeacher, 
  deleteTeacher
} from "@/lib/api/teacherApi";
import { uploadStaffPhoto } from "./photoUtils";

const camelToSnake = (obj: Record<string, any>): Record<string, any> => {
  const mapping: Record<string, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    phoneNumber: 'phone_number',
    mobilePhone: 'phone_number',
    idNumber: 'id_number',
    tscNumber: 'tsc_number',
    dateOfBirth: 'date_of_birth',
    hireDate: 'date_joined',
    dateJoined: 'date_joined',
    contractStart: 'contract_start',
    contractEnd: 'contract_end',
    jobStatus: 'job_status',
    staffType: 'staff_type',
    teachingSubjects: 'subjects_taught',
    subjectsTaught: 'subjects_taught',
  };

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const snakeKey = mapping[key] || key.replace(/([A-Z])/g, '_$1').toLowerCase();
      return [snakeKey, value];
    })
  );
};
import { DashboardView, ListView, FormView, DetailsView, PerformanceView } from "./components";


/* ─── MAIN ───────────────────────────────────────────────────────────── */
const StaffManagement: React.FC<StaffManagementProps> = ({ onBack }) => {
  const { isAuthenticated, schoolId } = useAuth();
  const [view, setView]         = useState<"dashboard"|"list"|"form"|"details"|"performance">("dashboard");
  const [staff, setStaff]       = useState<StaffMember[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [query, setQuery]       = useState("");
  const [fStatus, setFStatus]   = useState("all");
  const [fBranch, setFBranch]   = useState("all");
  const [fStaffType, setFStaffType] = useState("all");
  const [tab, setTab]           = useState<"general"|"teaching"|"contact">("general");
  const [toast, setToast]       = useState<string | null>(null);
  const [slots, setSlots]       = useState<string[]>(["","","",""]);


  const empty: StaffMember = { 
    id:"", 
    firstName:"", 
    lastName:"", 
    idNumber:"", 
    designation:"", 
    dateOfBirth:"", 
    contractStart:"", 
    contractEnd:"", 
    jobStatus:"Active", 
    sex:"Male", 
    branch:"", 
    county:"", 
    location:"", 
    email:"", 
    phoneNumber: "",
    tscNumber:"", 
    teachingSubjects:[], 
    qualifications:[], 
    salary:0, 
    hireDate:"",
    staffType: "teaching",
    photo: "",
    status: "active"
  };
  const [form, setForm] = useState<StaffMember>(empty);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = staff.filter(s => {
    const q = query.toLowerCase();
    const matchesQuery = !q || `${s.firstName} ${s.lastName} ${s.idNumber} ${s.email} ${s.tscNumber}`.toLowerCase().includes(q);
    const matchesStatus = fStatus === "all" || s.jobStatus === fStatus;
    const matchesBranch = fBranch === "all" || s.branch === fBranch;
    const matchesStaffType = fStaffType === "all" || s.staffType === fStaffType;
    
    return matchesQuery && matchesStatus && matchesBranch && matchesStaffType;
  });

  const openEdit = (m: StaffMember) => {
    console.log('[DEBUG] openEdit: Loading teacher:', m.id);
    console.log('[DEBUG] openEdit: Loaded teacher photo:', m.photo);
    setSelected(m); 
    setForm({...m});
    console.log('[DEBUG] openEdit: Form updated, form.photo should now be:', m.photo);
    setSlots([...m.teachingSubjects, "","",""].slice(0,4));
    setTab("general"); setView("form");
  };
  const openCreate = () => {
    setSelected(null); setForm(empty);
    setSlots(["","","",""]); setTab("general"); setView("form");
  };
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTeachers({ page: 1, limit: 100 });
      setStaff(result.teachers.filter((teacher): teacher is StaffMember => Boolean(teacher && teacher.id)));
    } catch (err: any) {
      setError(err.message);
      notify(`Failed to load staff: ${err.message}`);
      console.error('Fetch teachers error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, refreshKey]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const handleSave = async () => {
    // Validate for update only
    if (selected && !selected.id) {
      const msg = 'Invalid teacher ID. Please refresh the list.';
      setToast(msg);
      return;
    }

    try {
      console.log('[DEBUG] handleSave payload:', form);
      console.log('[DEBUG] handleSave photo field:', form.photo);
      console.log('[DEBUG] handleSave photo is base64:', form.photo?.startsWith('data:image'));

      let photoUrl = form.photo || '';

      // If photo is base64, upload it to Supabase Storage
      if (photoUrl && photoUrl.startsWith('data:image')) {
        console.log('[DEBUG] Uploading base64 photo to Supabase...');
        const staffId = selected?.id || `temp-${Date.now()}`;
        const uploadedUrl = await uploadStaffPhoto(photoUrl, staffId);
        
        if (uploadedUrl) {
          // Upload succeeded - use the new URL
          photoUrl = uploadedUrl;
          console.log('[DEBUG] Photo uploaded successfully, new URL:', photoUrl);
          setForm(f => ({ ...f, photo: photoUrl }));
        } else {
          // Upload failed - notify user and handle gracefully
          console.warn('[DEBUG] Photo upload failed, handling gracefully');
          if (selected?.photo) {
            // Update mode: keep existing photo
            photoUrl = selected.photo;
            notify("⚠️ Photo upload failed. Keeping existing photo. Changes to other fields will be saved.");
          } else {
            // Create mode: clear photo (don't send base64 to backend)
            photoUrl = '';
            notify("⚠️ Photo upload failed. Saving without photo. You can add a photo later.");
          }
          console.log('[DEBUG] Using fallback photo URL:', photoUrl);
        }
      }

      if (selected?.id) {
        // Update existing - pass camelCase form directly with uploaded photo URL
        console.log('[DEBUG] Updating teacher:', selected.id);
        console.log('[DEBUG] form.photo before merge:', form.photo);
        console.log('[DEBUG] photoUrl to merge:', photoUrl);
        const formWithPhoto = { ...form, photo: photoUrl };
        console.log('[DEBUG] formWithPhoto after merge:', formWithPhoto);
        console.log('[DEBUG] formWithPhoto.photo explicitly:', formWithPhoto.photo);
        console.log('[DEBUG] All keys in formWithPhoto:', Object.keys(formWithPhoto));
        const updated = await updateTeacher(selected.id, formWithPhoto, schoolId);
        setSelected(updated.data);
        notify("Staff record updated successfully.");
      } else {
        // Create new - convert to backend format for invite
        const invitePayload = {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone_number: form.mobilePhone || form.phoneNumber,
          tsc_number: form.tscNumber || null,
          qualifications: form.qualifications || [],
          date_joined: form.hireDate || new Date().toISOString().split('T')[0],
          // NEW FIELDS
          id_number: form.idNumber,
          designation: form.designation,
          branch: form.branch,
          job_status: form.jobStatus,
          staff_type: form.staffType,
          salary: form.salary,
          contract_start: form.contractStart,
          contract_end: form.contractEnd,
          date_of_birth: form.dateOfBirth,
          gender: form.sex || form.gender,
          county: form.county,
          location: form.location,
          subjects_taught: form.teachingSubjects,
          photo: photoUrl // Add photo to invite payload
        } as Parameters<typeof inviteTeacher>[0];
        
        console.log('[DEBUG] Creating new teacher with payload:', invitePayload);
        await inviteTeacher(invitePayload);
        notify("New staff member invited successfully. They will receive an email to complete registration.");
      }
      
      setView("list");
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      console.error('[DEBUG] handleSave error:', err);
      notify(`Operation failed: ${err.message}`);
    }
  };


  const del = async (id: string) => {
    try {
      await deleteTeacher(id);
      notify("Staff record deleted.");
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      notify(`Delete failed: ${err.message}`);
      console.error('Delete error:', err);
    }
  };


  const setF = <K extends keyof StaffMember>(k: K, v: StaffMember[K]) => setForm(f => ({...f, [k]: v}));

  /* ══════════ RENDER VIEWS ══════════ */
  
  // Dashboard View
  if (view === "dashboard") {
    return (
      <DashboardView
        staff={staff}
        onBack={onBack}
        onViewList={() => setView("list")}
        onCreate={openCreate}
        onViewPerformance={() => setView("performance")}
        toast={toast}
      />
    );
  }

  // List View
  if (view === "list") {
    return (
      <ListView
        staff={staff}
        filtered={filtered}
        query={query}
        fStatus={fStatus}
        fBranch={fBranch}
        fStaffType={fStaffType}
        onBack={() => setView("dashboard")}
        onCreate={openCreate}
        onViewDetails={(s) => { setSelected(s); setView("details"); }}
        onEdit={openEdit}
        onDelete={del}
        onQueryChange={setQuery}
        onStatusChange={setFStatus}
        onBranchChange={setFBranch}
        onStaffTypeChange={setFStaffType}
        onRefresh={() => setRefreshKey(k => k + 1)}
        toast={toast}
      />
    );
  }


  // Form View
  if (view === "form") {
    return (
      <FormView
        form={form}
        selected={selected}
        tab={tab}
        slots={slots}
        onBack={() => setView("list")}
        onSave={handleSave}
        onTabChange={setTab}
        onFieldChange={setF}
        onSlotsChange={setSlots}
        toast={toast}
      />
    );
  }

  // Details View
  if (view === "details" && selected) {
    return (
      <DetailsView
        selected={selected}
        onBack={() => setView("list")}
        onEdit={() => openEdit(selected)}
        toast={toast}
      />
    );
  }

  // Performance View
  if (view === "performance") {
    return (
      <PerformanceView
        staffList={staff.map(s => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
          role: s.designation,
          department: s.branch,
          attendanceRate: 95,
          presentDays: 38,
          totalDays: 40,
          performanceScore: 88,
          trend: "up" as const,
          lastCheckin: "Today 8:00 AM",
          status: "present" as const,
          employeeId: s.id,
          joiningDate: s.hireDate,
          qualifications: s.qualifications
        } as any))}
      />
    );
  }

  return null;
};

export default StaffManagement;
