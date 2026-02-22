import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Student {
  id: number;
  admissionNo: string;
  upi: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  photo: string | null;
}

interface FormErrors {
  admissionNo?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
}

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  light: string;
  dark: string;
  trend?: number;
}

interface TabItem {
  id: string;
  label: string;
  count: number;
  icon: string;
}

interface GenderStyle {
  bg: string;
  color: string;
  dot: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GENDERS: string[] = ["Male", "Female", "Other"];

const AVATAR_COLORS: [string, string][] = [
  ["#4f46e5", "#818cf8"],
  ["#0891b2", "#67e8f9"],
  ["#059669", "#6ee7b7"],
  ["#d97706", "#fcd34d"],
  ["#db2777", "#f9a8d4"],
  ["#7c3aed", "#c4b5fd"],
];

const GENDER_CONFIG: Record<string, GenderStyle> = {
  Male:   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", label: "Male" },
  Female: { bg: "#fce7f3", color: "#be185d", dot: "#ec4899", label: "Female" },
  Other:  { bg: "#f3e8ff", color: "#7e22ce", dot: "#a855f7", label: "Other" },
};

const initialStudents: Student[] = [
  { id: 1, admissionNo: "ADM202562925", upi: "UPI2025001", firstName: "James",  lastName: "Mwangi", gender: "Male",   dob: "2005-03-12", photo: null },
  { id: 2, admissionNo: "ADM202562369", upi: "",           firstName: "Amina",  lastName: "Hassan", gender: "Female", dob: "2006-07-22", photo: null },
  { id: 3, admissionNo: "ADM202562738", upi: "UPI2025003", firstName: "Brian",  lastName: "Otieno", gender: "Male",   dob: "2005-11-05", photo: null },
  { id: 4, admissionNo: "ADM202562307", upi: "",           firstName: "Grace",  lastName: "Wanjiku",gender: "Female", dob: "2007-01-18", photo: null },
  { id: 5, admissionNo: "ADM202562971", upi: "UPI2025005", firstName: "Kevin",  lastName: "Kamau",  gender: "Male",   dob: "2006-09-30", photo: null },
  { id: 6, admissionNo: "ADM202562226", upi: "",           firstName: "Purity", lastName: "Njeri",  gender: "Female", dob: "2005-05-14", photo: null },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateAdmissionNo(): string {
  return "ADM" + Date.now().toString().slice(-9);
}

function getInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function avatarColor(id: number): [string, string] {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calculateAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// ─── Component ────────────────────────────────────────────────────────────────
const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch]     = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal]   = useState<boolean>(false);
  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview]   = useState<string | null>(null);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const emptyForm: Student = {
    id: 0,
    admissionNo: generateAdmissionNo(),
    upi: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    photo: null,
  };
  const [form, setForm] = useState<Student>(emptyForm);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered: Student[] = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.admissionNo.toLowerCase().includes(q) ||
      s.firstName.toLowerCase().includes(q)   ||
      s.lastName.toLowerCase().includes(q)    ||
      s.upi.toLowerCase().includes(q);
    const matchTab =
      activeTab === "all"    ||
      (activeTab === "male"   && s.gender === "Male")   ||
      (activeTab === "female" && s.gender === "Female") ||
      (activeTab === "upi"    && s.upi !== "");
    return matchSearch && matchTab;
  });

  const stats: StatItem[] = [
    { 
      label: "Total Students",  
      value: students.length, 
      icon: "👥", 
      color: "#4f46e5", 
      light: "#eef2ff", 
      dark: "#c7d2fe",
      trend: 12 
    },
    { 
      label: "Male Students",   
      value: students.filter(s => s.gender === "Male").length,   
      icon: "👦", 
      color: "#0891b2", 
      light: "#ecfeff", 
      dark: "#a5f3fc",
      trend: 8 
    },
    { 
      label: "Female Students", 
      value: students.filter(s => s.gender === "Female").length, 
      icon: "👧", 
      color: "#db2777", 
      light: "#fdf2f8", 
      dark: "#fbcfe8",
      trend: 5 
    },
    { 
      label: "With UPI",        
      value: students.filter(s => s.upi !== "").length,   
      icon: "🆔", 
      color: "#059669", 
      light: "#ecfdf5", 
      dark: "#a7f3d0",
      trend: 15 
    },
  ];

  const tabs: TabItem[] = [
    { id: "all",    label: "All Students", count: students.length, icon: "📋" },
    { id: "male",   label: "Male",         count: students.filter(s => s.gender === "Male").length, icon: "👦" },
    { id: "female", label: "Female",       count: students.filter(s => s.gender === "Female").length, icon: "👧" },
    { id: "upi",    label: "Has UPI",      count: students.filter(s => s.upi !== "").length, icon: "🆔" },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const openAdd = (): void => {
    setForm({ ...emptyForm, admissionNo: generateAdmissionNo() });
    setPhotoPreview(null);
    setErrors({});
    setEditStudentId(null);
    setShowModal(true);
  };

  const openEdit = (student: Student): void => {
    setForm({ ...student });
    setPhotoPreview(student.photo);
    setErrors({});
    setEditStudentId(student.id);
    setShowModal(true);
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim())   e.firstName   = "First name is required";
    if (!form.lastName.trim())    e.lastName    = "Last name is required";
    if (!form.gender)             e.gender      = "Please select a gender";
    if (!form.dob)                e.dob         = "Date of birth is required";
    if (!form.admissionNo.trim()) e.admissionNo = "Admission number is required";
    const dup = students.find(
      (s) => s.admissionNo === form.admissionNo && s.id !== editStudentId
    );
    if (dup) e.admissionNo = "Admission number must be unique";
    return e;
  };

  const handleSubmit = async (): Promise<void> => {
    const e = validate();
    if (Object.keys(e).length) { 
      setErrors(e); 
      showNotification('Please fix the errors in the form', 'error');
      return; 
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (editStudentId !== null) {
      setStudents(students.map((s) =>
        s.id === editStudentId ? { ...form, id: editStudentId } : s
      ));
      showNotification('Student updated successfully!', 'success');
    } else {
      setStudents([...students, { ...form, id: Date.now() }]);
      showNotification('Student added successfully!', 'success');
    }
    
    setIsLoading(false);
    setShowModal(false);
  };

  const handleDelete = (id: number): void => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((s) => s.id !== id));
      setSelected(selected.filter((x) => x !== id));
      showNotification('Student deleted successfully', 'success');
    }
  };

  const handleBulkDelete = (): void => {
    if (window.confirm(`Are you sure you want to delete ${selected.length} student(s)?`)) {
      setStudents(students.filter((s) => !selected.includes(s.id)));
      setSelected([]);
      showNotification(`${selected.length} student(s) deleted successfully`, 'success');
    }
  };

  const toggleSelect = (id: number): void =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = (): void =>
    setSelected(
      selected.length === filtered.length && filtered.length > 0
        ? []
        : filtered.map((s) => s.id)
    );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setForm((f) => ({ ...f, photo: result }));
    };
    reader.readAsDataURL(file);
  };

  const updateForm = (key: keyof Student, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    color: "#0f172a",
    background: hasError ? "#fff7f7" : "#fff",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    outline: "none",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 6,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { 
          box-sizing: border-box; 
          margin: 0;
          padding: 0;
        }
        
        input, select, button, textarea { 
          font-family: inherit; 
        }
        
        input::placeholder { 
          color: #94a3b8; 
          font-weight: 400;
        }
        
        input:focus, select:focus { 
          outline: none !important; 
          border-color: #4f46e5 !important; 
          box-shadow: 0 0 0 4px rgba(79,70,229,0.1) !important; 
        }
        
        .row-hover {
          transition: background-color 0.2s ease;
        }
        
        .row-hover:hover { 
          background: #f8fafc !important; 
        }
        
        .stat-card { 
          transition: all 0.2s ease; 
          cursor: pointer; 
        }
        
        .stat-card:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15) !important; 
        }
        
        .tab-button {
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          background: #f1f5f9 !important;
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content {
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        
        @keyframes slideUp { 
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.98); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          } 
        }
        
        .action-button {
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background: #f1f5f9 !important;
          border-color: #94a3b8 !important;
        }
        
        .delete-button:hover {
          background: #fee2e2 !important;
          border-color: #f87171 !important;
          color: #dc2626 !important;
        }
        
        .photo-zone {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .photo-zone:hover {
          border-color: #4f46e5 !important;
          background: #f5f3ff !important;
          transform: scale(1.02);
        }
        
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 3px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .notification {
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Responsive Styles */
        @media (max-width: 1280px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          .search-input {
            width: 100% !important;
          }
          
          .table-container {
            min-width: 600px;
          }
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notification"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: notification.type === 'success' ? '#22c55e' : '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 18 }}>
            {notification.type === 'success' ? '✓' : '⚠'}
          </span>
          {notification.message}
        </div>
      )}

      {/* Navbar */}
      <nav style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        background: "rgba(255,255,255,0.9)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e2e8f0", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", 
        padding: "0 32px", 
        height: 70, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            width: 42, 
            height: 42, 
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)", 
            borderRadius: 12, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: 22, 
            boxShadow: "0 4px 12px rgba(79,70,229,0.3)" 
          }}>
            🎓
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>
              Student Management
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 2 }}>
              School Administration Portal
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="action-button"
            style={{ 
              background: "#fff", 
              color: "#475569", 
              border: "1.5px solid #e2e8f0", 
              borderRadius: 10, 
              padding: "8px 20px", 
              fontWeight: 600, 
              fontSize: 13, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: 8 
            }}
          >
            <span>📊</span> Export
          </button>
          <button 
            className="add-btn" 
            onClick={openAdd} 
            style={{ 
              background: "#4f46e5", 
              color: "#fff", 
              border: "none", 
              borderRadius: 10, 
              padding: "8px 22px", 
              fontWeight: 600, 
              fontSize: 13, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)", 
              transition: "all 0.2s" 
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Student
          </button>
        </div>
      </nav>

      <div style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Stats Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4,1fr)", 
          gap: 20, 
          marginBottom: 28 
        }} className="stats-grid">
          {stats.map((st, index) => (
            <div 
              key={st.label} 
              className="stat-card" 
              style={{ 
                background: "#fff", 
                borderRadius: 20, 
                padding: "24px", 
                border: "1px solid #e2e8f0", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", 
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ 
                position: "absolute", 
                top: 0, 
                right: 0, 
                width: 100, 
                height: 100, 
                background: st.light, 
                opacity: 0.3, 
                borderRadius: "0 0 0 100px" 
              }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", lineHeight: 1, marginBottom: 8 }}>
                    {st.value}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{st.label}</div>
                </div>
                <div style={{ 
                  width: 56, 
                  height: 56, 
                  background: st.light, 
                  borderRadius: 16, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 26, 
                  border: `1px solid ${st.dark}` 
                }}>
                  {st.icon}
                </div>
              </div>
              {st.trend && (
                <div style={{ 
                  marginTop: 16, 
                  fontSize: 12, 
                  color: "#22c55e", 
                  background: "#dcfce7", 
                  padding: "4px 8px", 
                  borderRadius: 20, 
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  ↑ {st.trend}% from last month
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{ 
          background: "#fff", 
          borderRadius: 24, 
          border: "1px solid #e2e8f0", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)", 
          overflow: "hidden" 
        }}>

          {/* Toolbar */}
          <div style={{ 
            padding: "20px 24px", 
            borderBottom: "1px solid #e2e8f0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            flexWrap: "wrap", 
            gap: 16,
            background: "#fff"
          }}>
            <div style={{ display: "flex", gap: 4 }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className="tab-button"
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    background: activeTab === t.id ? "#4f46e5" : "transparent",
                    color: activeTab === t.id ? "#fff" : "#64748b",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{t.icon}</span>
                  {t.label}
                  <span style={{
                    background: activeTab === t.id ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                    color: activeTab === t.id ? "#fff" : "#64748b",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    marginLeft: 4
                  }}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {selected.length > 0 && (
                <button
                  className="delete-button"
                  onClick={handleBulkDelete}
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  🗑 Delete ({selected.length})
                </button>
              )}
              <div style={{ position: "relative" }}>
                <span style={{ 
                  position: "absolute", 
                  left: 12, 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: "#94a3b8", 
                  pointerEvents: "none",
                  fontSize: 16
                }}>
                  🔍
                </span>
                <input
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "10px 16px 10px 42px",
                    color: "#0f172a",
                    fontSize: 13,
                    width: 260,
                    transition: "all 0.2s",
                  }}
                  placeholder="Search by name, ID, or UPI..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }} className="scrollbar-custom">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", width: 44 }}>
                    <input 
                      type="checkbox" 
                      checked={selected.length === filtered.length && filtered.length > 0} 
                      onChange={toggleAll} 
                      style={{ 
                        accentColor: "#4f46e5", 
                        width: 18, 
                        height: 18, 
                        cursor: "pointer",
                        borderRadius: 4
                      }} 
                    />
                  </th>
                  {["Student", "Admission No.", "UPI", "Gender", "Age", "Date of Birth", "Actions"].map((h) => (
                    <th 
                      key={h} 
                      style={{ 
                        padding: "16px 16px", 
                        textAlign: "left", 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: "#64748b", 
                        letterSpacing: "0.3px", 
                        textTransform: "uppercase",
                        whiteSpace: "nowrap" 
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ textAlign: "center", padding: "80px 24px", color: "#94a3b8" }}>
                        <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>🔍</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: "#475569" }}>No students found</div>
                        <div style={{ fontSize: 14, marginTop: 8, color: "#64748b" }}>
                          Try adjusting your search or filters
                        </div>
                        <button
                          onClick={() => { setSearch(""); setActiveTab("all"); }}
                          style={{
                            marginTop: 20,
                            background: "#fff",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: 10,
                            padding: "8px 20px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#475569",
                            cursor: "pointer",
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((s) => {
                  const [c1, c2] = avatarColor(s.id);
                  const gc: GenderStyle = GENDER_CONFIG[s.gender] ?? { bg: "#f3e8ff", color: "#7e22ce", dot: "#a855f7", label: "Other" };
                  const age = calculateAge(s.dob);
                  
                  return (
                    <tr 
                      key={s.id} 
                      className="row-hover" 
                      style={{ 
                        borderBottom: "1px solid #f1f5f9", 
                        background: selected.includes(s.id) ? "#f5f3ff" : "#fff",
                        transition: "background 0.2s"
                      }}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <input 
                          type="checkbox" 
                          checked={selected.includes(s.id)} 
                          onChange={() => toggleSelect(s.id)} 
                          style={{ 
                            accentColor: "#4f46e5", 
                            width: 18, 
                            height: 18, 
                            cursor: "pointer" 
                          }} 
                        />
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: "12px", 
                            background: `linear-gradient(135deg,${c1},${c2})`, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontSize: 16, 
                            fontWeight: 700, 
                            color: "#fff", 
                            flexShrink: 0, 
                            overflow: "hidden", 
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)" 
                          }}>
                            {s.photo ? 
                              <img src={s.photo} alt={s.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : 
                              getInitials(s.firstName, s.lastName)
                            }
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                              {s.firstName} {s.lastName}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, fontWeight: 500 }}>
                              ID: {s.id.toString().padStart(4, '0')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <span style={{ 
                          fontFamily: "'SF Mono', 'Courier New', monospace", 
                          fontSize: 12, 
                          fontWeight: 600, 
                          color: "#4f46e5", 
                          background: "#eef2ff", 
                          padding: "6px 12px", 
                          borderRadius: 8, 
                          border: "1px solid #c7d2fe",
                          display: "inline-block"
                        }}>
                          {s.admissionNo}
                        </span>
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        {s.upi ? (
                          <span style={{ 
                            fontFamily: "monospace", 
                            fontSize: 12, 
                            color: "#059669", 
                            background: "#d1fae5", 
                            padding: "6px 12px", 
                            borderRadius: 8, 
                            fontWeight: 600, 
                            border: "1px solid #a7f3d0",
                            display: "inline-block"
                          }}>
                            {s.upi}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <span style={{ 
                          background: gc.bg, 
                          color: gc.color, 
                          fontSize: 12, 
                          fontWeight: 600, 
                          padding: "6px 14px", 
                          borderRadius: 20, 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 6,
                          border: `1px solid ${gc.dot}`,
                        }}>
                          <span style={{ width: 6, height: 6, background: gc.dot, borderRadius: "50%", display: "inline-block" }} />
                          {gc.label}
                        </span>
                      </td>
                      <td style={{ padding: "16px 16px", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                        {age} years
                      </td>
                      <td style={{ padding: "16px 16px", fontSize: 13, color: "#64748b" }}>
                        {formatDate(s.dob)}
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button 
                            className="action-button" 
                            onClick={() => openEdit(s)} 
                            style={{ 
                              background: "transparent", 
                              border: "1.5px solid #e2e8f0", 
                              borderRadius: 8, 
                              padding: "6px 14px", 
                              fontSize: 12, 
                              fontWeight: 600, 
                              color: "#475569", 
                              cursor: "pointer", 
                              transition: "all 0.2s", 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 6 
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDelete(s.id)} 
                            style={{ 
                              background: "transparent", 
                              border: "1.5px solid #fecdd3", 
                              borderRadius: 8, 
                              padding: "6px 10px", 
                              fontSize: 14, 
                              color: "#e11d48", 
                              cursor: "pointer", 
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: "16px 24px", 
            borderTop: "1px solid #e2e8f0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            background: "#fff",
            fontSize: 13
          }}>
            <div style={{ color: "#64748b", fontWeight: 500 }}>
              Showing <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> of <strong style={{ color: "#0f172a" }}>{students.length}</strong> students
            </div>
            {selected.length > 0 && (
              <div style={{ 
                color: "#4f46e5", 
                fontWeight: 600, 
                background: "#eef2ff", 
                padding: "4px 14px", 
                borderRadius: 20,
                fontSize: 12
              }}>
                {selected.length} row{selected.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="modal-overlay"
          style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0.5)", 
            backdropFilter: "blur(8px)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000, 
            padding: 24 
          }}
        >
          <div 
            ref={modalRef}
            className="modal-content"
            style={{ 
              background: "#fff", 
              borderRadius: 28, 
              width: "100%", 
              maxWidth: 620, 
              boxShadow: "0 32px 64px -12px rgba(0,0,0,0.2)", 
              maxHeight: "90vh", 
              overflowY: "auto" 
            }}
          >

            {/* Modal Header */}
            <div style={{ 
              padding: "28px 32px 20px", 
              borderBottom: "1px solid #e2e8f0", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  background: "#eef2ff", 
                  borderRadius: 16, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 24, 
                  border: "1px solid #c7d2fe" 
                }}>
                  {editStudentId !== null ? "✏️" : "➕"}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                    {editStudentId !== null ? "Edit Student" : "Add New Student"}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                    {editStudentId !== null ? "Update the student's information below" : "Fill in all required fields to enroll a student"}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ 
                  background: "#f8fafc", 
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: 12, 
                  width: 40, 
                  height: 40, 
                  fontSize: 22, 
                  cursor: "pointer", 
                  color: "#64748b", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0,
                  transition: "all 0.2s",
                  outline: "none"
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "32px" }}>

              {/* Photo Upload */}
              <div style={{ marginBottom: 32, textAlign: "center" }}>
                <label style={labelStyle}>Passport Photo</label>
                <div 
                  className="photo-zone" 
                  onClick={() => fileRef.current?.click()}
                  style={{ 
                    border: "2px dashed #cbd5e1", 
                    borderRadius: 20, 
                    padding: "32px 20px", 
                    cursor: "pointer", 
                    transition: "all 0.2s", 
                    background: "#fafafa", 
                    display: "inline-flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    gap: 12, 
                    minWidth: 260 
                  }}
                >
                  {photoPreview ? (
                    <>
                      <img 
                        src={photoPreview} 
                        alt="preview" 
                        style={{ 
                          width: 100, 
                          height: 100, 
                          borderRadius: "50%", 
                          objectFit: "cover", 
                          border: "3px solid #4f46e5", 
                          boxShadow: "0 8px 24px rgba(79,70,229,0.25)" 
                        }} 
                      />
                      <span style={{ fontSize: 13, color: "#4f46e5", fontWeight: 600 }}>
                        Click to change photo
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ 
                        width: 72, 
                        height: 72, 
                        background: "#eef2ff", 
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: 32, 
                        border: "2px solid #c7d2fe" 
                      }}>
                        📷
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>
                          Upload Passport Photo
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                          JPG or PNG · Max 5MB
                        </div>
                      </div>
                    </>
                  )}
                  <input 
                    ref={fileRef} 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }} 
                    onChange={handlePhotoChange} 
                  />
                </div>
              </div>

              {/* Academic Info */}
              <div style={{ 
                background: "#f8fafc", 
                borderRadius: 16, 
                padding: "20px", 
                marginBottom: 20, 
                border: "1px solid #e2e8f0" 
              }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: "#64748b", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px", 
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 16 }}>📚</span> Academic Information
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      Admission Number <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input 
                      style={inputStyle(!!errors.admissionNo)} 
                      value={form.admissionNo} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("admissionNo", e.target.value)} 
                      placeholder="e.g. ADM202562925" 
                    />
                    {errors.admissionNo && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
                        ⚠ {errors.admissionNo}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      UPI <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginLeft: 4 }}>(optional)</span>
                    </label>
                    <input 
                      style={inputStyle(false)} 
                      value={form.upi} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("upi", e.target.value)} 
                      placeholder="Enter UPI if available" 
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div style={{ 
                background: "#f8fafc", 
                borderRadius: 16, 
                padding: "20px", 
                border: "1px solid #e2e8f0" 
              }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: "#64748b", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px", 
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 16 }}>👤</span> Personal Information
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      First Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input 
                      style={inputStyle(!!errors.firstName)} 
                      value={form.firstName} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("firstName", e.target.value)} 
                      placeholder="First name" 
                    />
                    {errors.firstName && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
                        ⚠ {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Last Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input 
                      style={inputStyle(!!errors.lastName)} 
                      value={form.lastName} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("lastName", e.target.value)} 
                      placeholder="Last name" 
                    />
                    {errors.lastName && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
                        ⚠ {errors.lastName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Gender <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select 
                      style={{ ...inputStyle(!!errors.gender), cursor: "pointer" }} 
                      value={form.gender} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateForm("gender", e.target.value)}
                    >
                      <option value="">Select gender</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.gender && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
                        ⚠ {errors.gender}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Date of Birth <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input 
                      type="date" 
                      style={inputStyle(!!errors.dob)} 
                      value={form.dob} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("dob", e.target.value)} 
                    />
                    {errors.dob && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
                        ⚠ {errors.dob}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: "flex", 
                gap: 12, 
                marginTop: 32, 
                justifyContent: "flex-end" 
              }}>
                <button 
                  onClick={() => setShowModal(false)} 
                  style={{ 
                    background: "#fff", 
                    border: "1.5px solid #e2e8f0", 
                    color: "#475569", 
                    borderRadius: 12, 
                    padding: "12px 28px", 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  style={{ 
                    background: isLoading ? "#94a3b8" : "#4f46e5", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: 12, 
                    padding: "12px 32px", 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: isLoading ? "not-allowed" : "pointer", 
                    boxShadow: "0 4px 16px rgba(79,70,229,0.35)", 
                    transition: "all 0.2s", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8,
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {editStudentId !== null ? "💾 Save Changes" : "✅ Add Student"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudentManagement;