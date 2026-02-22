import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockStudents = [
  { id: '1', admNo: 'CBC/2024/001', firstName: 'John',  lastName: 'Kamau',    grade: 'Grade4', gender: 'Male',   guardianName: 'Mary Kamau',    guardianPhone: '0712345678', status: 'active' },
  { id: '2', admNo: 'CBC/2024/002', firstName: 'Jane',  lastName: 'Wanjiku',  grade: 'Grade5', gender: 'Female', guardianName: 'Peter Wanjiku', guardianPhone: '0723456789', status: 'active' },
  { id: '3', admNo: 'CBC/2024/003', firstName: 'David', lastName: 'Ochieng',  grade: 'Grade3', gender: 'Male',   guardianName: 'Sarah Ochieng', guardianPhone: '0734567890', status: 'active' },
  { id: '4', admNo: 'CBC/2024/004', firstName: 'Grace', lastName: 'Njeri',    grade: 'PP2',    gender: 'Female', guardianName: 'James Njeri',   guardianPhone: '0745678901', status: 'transferred' },
  { id: '5', admNo: 'CBC/2024/005', firstName: 'Brian', lastName: 'Mwangi',   grade: 'Grade6', gender: 'Male',   guardianName: 'Anne Mwangi',   guardianPhone: '0756789012', status: 'active' },
  { id: '6', admNo: 'CBC/2024/006', firstName: 'Faith', lastName: 'Akinyi',   grade: 'Grade7', gender: 'Female', guardianName: 'Tom Akinyi',    guardianPhone: '0767890123', status: 'active' },
  { id: '7', admNo: 'CBC/2024/007', firstName: 'Kevin', lastName: 'Kipchoge', grade: 'Grade8', gender: 'Male',   guardianName: 'Rose Kipchoge', guardianPhone: '0778901234', status: 'active' },
  { id: '8', admNo: 'CBC/2024/008', firstName: 'Lucy',  lastName: 'Wambui',   grade: 'PP1',    gender: 'Female', guardianName: 'John Wambui',   guardianPhone: '0789012345', status: 'active' },
];

const grades = ['PP1','PP2','Grade1','Grade2','Grade3','Grade4','Grade5','Grade6','Grade7','Grade8','Grade9'];

const STATUS_CONFIG = {
  active:      { label: 'Active',      style: { background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0' }, darkStyle: { background:'#14532d', color:'#86efac', border:'1px solid #166534' } },
  transferred: { label: 'Transferred', style: { background:'#fef9c3', color:'#92400e', border:'1px solid #fde68a' }, darkStyle: { background:'#451a03', color:'#fcd34d', border:'1px solid #78350f' } },
  graduated:   { label: 'Graduated',   style: { background:'#dbeafe', color:'#1d4ed8', border:'1px solid #bfdbfe' }, darkStyle: { background:'#1e3a5f', color:'#93c5fd', border:'1px solid #1d4ed8' } },
  withdrawn:   { label: 'Withdrawn',   style: { background:'#fee2e2', color:'#b91c1c', border:'1px solid #fecaca' }, darkStyle: { background:'#450a0a', color:'#fca5a5', border:'1px solid #991b1b' } },
};

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Props:
 *   onAddStudent  — callback/navigation function wired up by the parent
 *                   e.g. () => router.push('/students/add')
 *                        () => navigate('/add-student')
 *                        () => setPage('addStudent')
 */
const StudentManagement = ({ onAddStudent }) => {
  const [students, setStudents]           = useState(mockStudents);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = students.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q)  ||
      s.admNo.toLowerCase().includes(q);
    const matchGrade  = selectedGrade  === 'all' || s.grade  === selectedGrade;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchGrade && matchStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}
      className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
    >
      <style>{`
        /* ── Search input ───────────────────────────────────────── */
        .sm-search {
          width: 100%;
          height: 40px;
          padding: 0 14px 0 40px;
          font-size: 13px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          transition: all 0.2s;
          outline: none;
          font-family: inherit;
        }
        .sm-search::placeholder { color: #94a3b8; }
        .sm-search:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
          background: #fff;
        }
        .dark .sm-search {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .dark .sm-search::placeholder { color: #64748b; }
        .dark .sm-search:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          background: #1e293b;
        }

        /* ── Select trigger box ─────────────────────────────────── */
        .sm-select-trigger {
          height: 40px;
          min-width: 130px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0 !important;
          background: #ffffff !important;
          color: #0f172a !important;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sm-select-trigger:hover { border-color: #94a3b8 !important; }
        .sm-select-trigger:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important;
          outline: none;
        }
        .dark .sm-select-trigger {
          background: #1e293b !important;
          border-color: #334155 !important;
          color: #f1f5f9 !important;
        }
        .dark .sm-select-trigger:hover { border-color: #64748b !important; }

        /* ── Select dropdown content ────────────────────────────── */
        .sm-select-content {
          background: #ffffff !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.12) !important;
          overflow: hidden;
          z-index: 9999 !important;
          padding: 4px !important;
        }
        .dark .sm-select-content {
          background: #1e293b !important;
          border-color: #334155 !important;
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.5) !important;
        }

        /* ── Select items ───────────────────────────────────────── */
        .sm-select-item {
          padding: 9px 12px !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          color: #374151 !important;
          border-radius: 8px !important;
          cursor: pointer;
        }
        .sm-select-item:hover,
        .sm-select-item[data-highlighted] {
          background: #f1f5f9 !important;
          color: #4f46e5 !important;
        }
        .dark .sm-select-item { color: #e2e8f0 !important; }
        .dark .sm-select-item:hover,
        .dark .sm-select-item[data-highlighted] {
          background: #334155 !important;
          color: #818cf8 !important;
        }

        /* ── Export button ──────────────────────────────────────── */
        .sm-export-btn {
          height: 40px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .sm-export-btn:hover { background: #f8fafc; border-color: #94a3b8; }
        .dark .sm-export-btn {
          background: #1e293b;
          border-color: #334155;
          color: #e2e8f0;
        }
        .dark .sm-export-btn:hover { background: #334155; border-color: #475569; }

        /* ── Add Student button ─────────────────────────────────── */
        .sm-add-btn {
          height: 40px;
          padding: 0 20px;
          border-radius: 10px;
          border: none;
          background: #4f46e5;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79,70,229,0.3);
          transition: all 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }
        .sm-add-btn:hover {
          background: #4338ca;
          box-shadow: 0 6px 20px rgba(79,70,229,0.4);
          transform: translateY(-1px);
        }
        .sm-add-btn:active { transform: translateY(0); }

        /* ── Table card ─────────────────────────────────────────── */
        .sm-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .dark .sm-card {
          background: #0f172a;
          border-color: #1e293b;
        }

        /* ── Table head ─────────────────────────────────────────── */
        .sm-table { width: 100%; border-collapse: collapse; }
        .sm-table thead tr { background: #f8fafc; }
        .dark .sm-table thead tr { background: #1e293b; }
        .sm-table th {
          padding: 13px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }
        .dark .sm-table th { color: #94a3b8; border-color: #1e293b; }
        .sm-table th.right { text-align: right; }

        /* ── Table body ─────────────────────────────────────────── */
        .sm-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        .sm-table tbody tr:last-child { border-bottom: none; }
        .sm-table tbody tr:hover { background: #f8fafc; }
        .dark .sm-table tbody tr { border-color: #1e293b; }
        .dark .sm-table tbody tr:hover { background: #1e293b; }
        .sm-table td {
          padding: 13px 16px;
          font-size: 13px;
          color: #374151;
          vertical-align: middle;
        }
        .dark .sm-table td { color: #cbd5e1; }
        .sm-table td.right { text-align: right; }

        /* ── Adm No chip ────────────────────────────────────────── */
        .sm-adm {
          font-family: 'SF Mono', 'Courier New', monospace;
          font-size: 11.5px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 6px;
          padding: 4px 10px;
          display: inline-block;
        }
        .dark .sm-adm {
          color: #818cf8;
          background: #1e1b4b;
          border-color: #3730a3;
        }

        /* ── Student name ───────────────────────────────────────── */
        .sm-name { font-weight: 600; color: #0f172a; }
        .dark .sm-name { color: #f1f5f9; }

        /* ── Gender pill ────────────────────────────────────────── */
        .sm-gender {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        .sm-gender-m { color:#1d4ed8; background:#dbeafe; border:1px solid #bfdbfe; }
        .sm-gender-f { color:#be185d; background:#fce7f3; border:1px solid #fbcfe8; }
        .dark .sm-gender-m { color:#93c5fd; background:#1e3a5f; border-color:#1d4ed8; }
        .dark .sm-gender-f { color:#f9a8d4; background:#4a1942; border-color:#be185d; }

        /* ── Status pill ────────────────────────────────────────── */
        .sm-status {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          white-space: nowrap;
        }

        /* ── Action button ──────────────────────────────────────── */
        .sm-action-btn {
          background: transparent;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          color: #64748b;
          margin-left: auto;
        }
        .sm-action-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #374151;
        }
        .dark .sm-action-btn { border-color: #334155; color: #94a3b8; }
        .dark .sm-action-btn:hover { background: #334155; border-color: #475569; color: #e2e8f0; }

        /* ── Dropdown (dark) ────────────────────────────────────── */
        .dark [data-radix-popper-content-wrapper] [role="menu"] {
          background: #1e293b !important;
          border-color: #334155 !important;
        }
        .dark [data-radix-popper-content-wrapper] [role="menuitem"] {
          color: #e2e8f0 !important;
        }
        .dark [data-radix-popper-content-wrapper] [role="menuitem"]:hover,
        .dark [data-radix-popper-content-wrapper] [role="menuitem"]:focus {
          background: #334155 !important;
        }

        /* ── Pagination buttons ─────────────────────────────────── */
        .sm-pag-btn {
          height: 34px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #374151;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .sm-pag-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .sm-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .dark .sm-pag-btn {
          background: #1e293b;
          border-color: #334155;
          color: #e2e8f0;
        }
        .dark .sm-pag-btn:hover:not(:disabled) { background: #334155; }
      `}</style>

      <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Toolbar ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

          {/* Left: Search + Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1, alignItems: 'center' }}>

            {/* Search box */}
            <div style={{ position: 'relative', minWidth: 200, flex: 1, maxWidth: 300 }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
              />
              <input
                className="sm-search"
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Grade filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="sm-select-trigger">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent className="sm-select-content">
                <SelectItem className="sm-select-item" value="all">All Grades</SelectItem>
                {grades.map(g => (
                  <SelectItem className="sm-select-item" key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="sm-select-trigger">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="sm-select-content">
                <SelectItem className="sm-select-item" value="all">All Status</SelectItem>
                <SelectItem className="sm-select-item" value="active">Active</SelectItem>
                <SelectItem className="sm-select-item" value="transferred">Transferred</SelectItem>
                <SelectItem className="sm-select-item" value="graduated">Graduated</SelectItem>
                <SelectItem className="sm-select-item" value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right: Export + Add Student */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="sm-export-btn">
              <Download size={14} /> Export
            </button>

            {/*
              ── ADD STUDENT ──────────────────────────────────────────────
              Calls the `onAddStudent` prop passed in from the parent.
              Wire it up like:
                <StudentManagement onAddStudent={() => router.push('/students/add')} />
                <StudentManagement onAddStudent={() => navigate('/add-student')} />
                <StudentManagement onAddStudent={() => setCurrentPage('addStudent')} />
              ─────────────────────────────────────────────────────────── */}
            <button className="sm-add-btn" onClick={onAddStudent}>
              <Plus size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────── */}
        <div className="sm-card" style={{ overflowX: 'auto' }}>
          <table className="sm-table">
            <thead>
              <tr>
                <th>Adm. No</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Gender</th>
                <th>Guardian</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#475569' }}>No students found</div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search or filters</div>
                  </td>
                </tr>
              ) : filtered.map(s => {
                const sc   = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.active;
                const isDark = document.documentElement.classList.contains('dark');
                const statusStyle = isDark ? sc.darkStyle : sc.style;

                return (
                  <tr key={s.id}>
                    <td><span className="sm-adm">{s.admNo}</span></td>
                    <td><span className="sm-name">{s.firstName} {s.lastName}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.grade}</td>
                    <td>
                      <span className={`sm-gender ${s.gender === 'Male' ? 'sm-gender-m' : 'sm-gender-f'}`}>
                        {s.gender}
                      </span>
                    </td>
                    <td>{s.guardianName}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.guardianPhone}</td>
                    <td>
                      {/* Using CSS class for dark/light instead of inline style for status */}
                      <span
                        className="sm-status"
                        style={sc.style}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="sm-action-btn">
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="dark:bg-slate-800 dark:border-slate-700"
                        >
                          <DropdownMenuItem className="cursor-pointer dark:text-slate-200 dark:focus:bg-slate-700">
                            <Eye size={14} className="mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer dark:text-slate-200 dark:focus:bg-slate-700">
                            <Edit size={14} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-rose-600 dark:text-rose-400 dark:focus:bg-slate-700"
                            onClick={() => handleDelete(s.id)}
                          >
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Pagination ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <p style={{ fontSize: 13, color: '#64748b' }} className="dark:text-slate-400">
            Showing{' '}
            <strong style={{ color: '#0f172a' }} className="dark:text-slate-200">{filtered.length}</strong>
            {' '}of{' '}
            <strong style={{ color: '#0f172a' }} className="dark:text-slate-200">{students.length}</strong>
            {' '}students
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="sm-pag-btn" disabled>Previous</button>
            <button className="sm-pag-btn">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentManagement;