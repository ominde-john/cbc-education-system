import React, { useState, useEffect } from 'react';
import {
  CreditCard, DollarSign, FileText, TrendingUp,
  ArrowLeft, Search, Download, AlertCircle,
  CheckCircle, Clock, ChevronRight, BarChart2,
  RefreshCw, Filter, Wallet, BadgeCheck, TimerReset
} from 'lucide-react';
import PaymentRecords from './PaymentRecord';
import FeeStructure from './FeeStructure';
import FeesReport from './FeesReport';

interface FeePayment {
  id?: string;
  studentId?: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  feeAmount: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'paid' | 'partial' | 'overdue';
  balance: number;
}

interface FeeManagementProps {
  onBack: () => void;
}

type View = 'dashboard' | 'payments' | 'structure' | 'reports';

const fmt = (n: number) =>
  'KES ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0 });

const FeeManagement: React.FC<FeeManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/fees/term-summary?term=${encodeURIComponent(selectedTerm)}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NWM1MzgyOS1kMWYxLTQ1NWQtYjkzZi0yODNmMjcxMzUwOGIiLCJyb2xlIjoiYWRtaW4iLCJicmFuY2hJZCI6bnVsbCwiaWF0IjoxNzU1MTE3OTk3LCJleHAiOjE3NTUxNjExOTd9.ro7lyj9sUE8y3qso1TcRJxO1M0HuWz_G8HOfb6sJtF0`,
          },
        }
      );
      const data = await response.json();
      const normalized = data.map((item: any) => ({
        id: item.id,
        studentId: item.admission_number,
        studentName: item.student_name,
        admissionNumber: item.admission_number,
        className: item.class_name,
        feeAmount: Number(item.fee_amount || 0),
        amountPaid: Number(item.amount_paid || 0),
        paymentDate: item.payment_date,
        paymentMethod: item.payment_method,
        status: item.status,
        balance: Number(item.balance || 0),
      }));
      setFeePayments(normalized);
    } catch (error) {
      console.error('Error fetching payment records:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [selectedTerm, selectedYear]);

  const handleRefresh = () => { setRefreshing(true); fetchPayments(); };

  const getTotalCollected = () => feePayments.reduce((t, p) => t + p.amountPaid, 0);
  const getTotalOutstanding = () => feePayments.reduce((t, p) => t + p.balance, 0);
  const getStats = () => {
    const total = feePayments.length;
    const paid = feePayments.filter(p => p.status === 'paid').length;
    const partial = feePayments.filter(p => p.status === 'partial').length;
    const overdue = feePayments.filter(p => p.status === 'overdue').length;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { total, paid, partial, overdue, rate };
  };

  // ── Shared sub-page header ──────────────────────────────────────────────
  const SubPageHeader = ({
    title, subtitle, actions,
  }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  if (currentView === 'dashboard') {
    const s = getStats();

    return (
      <div className="min-h-screen bg-[#f4f6f9]">

        {/* ── Hero Header ───────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-green-800 via-green-600 to-emerald-500 overflow-hidden">
          {/* Grid watermark */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Glow blob */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6">
            {/* Top row */}
            <div className="flex items-center justify-between pt-5 pb-2">
            

              {/* Controls */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl overflow-hidden border border-white/20">
                  {['Term 1', 'Term 2', 'Term 3'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTerm(t)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedTerm === t
                          ? 'bg-white text-green-800'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 bg-white/15 border border-white/25 rounded-xl text-white text-xs font-semibold focus:outline-none hover:bg-white/25 transition-colors"
                >
                  {['2025', '2024', '2023'].map(y => (
                    <option key={y} value={y} className="text-gray-800 bg-white">{y}</option>
                  ))}
                </select>
                <button
                  onClick={handleRefresh}
                  title="Refresh"
                  className="w-8 h-8 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title block */}
            <div className="py-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-300" />
                </span>
                <span className="text-green-100 text-xs font-semibold tracking-wide uppercase">
                  Live · {selectedTerm} {selectedYear}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Fee Management</h1>
              <p className="text-green-100/80 text-sm">Center of Hope and Transformation School</p>
            </div>
          </div>
        </div>

        {/* ── Stat Cards (overlap hero bottom) ──────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 -mt-8 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Collected',
                value: fmt(getTotalCollected()),
                sub: '▲ 12% vs last term',
                subColor: 'text-emerald-600',
                Icon: Wallet,
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                accent: 'before:bg-emerald-500',
              },
              {
                label: 'Outstanding',
                value: fmt(getTotalOutstanding()),
                sub: `${s.overdue} accounts overdue`,
                subColor: 'text-red-500',
                Icon: AlertCircle,
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500',
                accent: 'before:bg-red-500',
              },
              {
                label: 'Fully Paid',
                value: `${s.paid} / ${s.total}`,
                sub: `${s.rate}% collection rate`,
                subColor: 'text-blue-600',
                Icon: BadgeCheck,
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                accent: 'before:bg-blue-500',
              },
              {
                label: 'Partial / Overdue',
                value: String(s.partial + s.overdue),
                sub: 'Pending clearance',
                subColor: 'text-amber-600',
                Icon: TimerReset,
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-600',
                accent: 'before:bg-amber-500',
              },
            ].map(card => (
              <div
                key={card.label}
                className="relative bg-white rounded-2xl shadow-md overflow-hidden flex flex-col gap-3 p-5 before:absolute before:top-0 before:left-0 before:w-full before:h-1"
                style={{ ['--tw-before-content' as any]: '""' }}
              >
                {/* colored top stripe via inline style trick */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] ${card.accent.replace('before:', '')}`}
                />
                <div className="flex items-start justify-between">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                    {card.label}
                  </p>
                  <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <card.Icon className={`w-4.5 h-4.5 ${card.iconColor}`} style={{ width: 18, height: 18 }} />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-none">{card.value}</p>
                <p className={`text-[11px] font-semibold ${card.subColor}`}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-12 space-y-5">
          {/* ── Collection Progress ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-800">Collection Rate — {selectedTerm} {selectedYear}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.paid} of {s.total} students have fully paid
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">{s.rate}</span>
                <span className="text-xl font-bold text-gray-300">%</span>
              </div>
            </div>

            {/* Stacked bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${s.total > 0 ? (s.paid / s.total) * 100 : 0}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-700"
                style={{ width: `${s.total > 0 ? (s.partial / s.total) * 100 : 0}%` }}
              />
              <div
                className="h-full bg-red-400 transition-all duration-700"
                style={{ width: `${s.total > 0 ? (s.overdue / s.total) * 100 : 0}%` }}
              />
            </div>

            <div className="flex gap-6 mt-3">
              {[
                { dot: 'bg-emerald-400', label: 'Paid', count: s.paid },
                { dot: 'bg-amber-400',   label: 'Partial', count: s.partial },
                { dot: 'bg-red-400',     label: 'Overdue', count: s.overdue },
              ].map(item => (
                <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                  <span className="font-medium">{item.label}:</span> {item.count}
                </span>
              ))}
            </div>
          </div>

          {/* ── Quick Access ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Quick Access</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  view: 'payments' as View,
                  Icon: CreditCard,
                  label: 'Payment Records',
                  desc: 'View, search and manage all student fee payments',
                  pill: `${s.total} records`,
                  pillClass: 'bg-emerald-100 text-emerald-700',
                  iconColor: 'text-emerald-600',
                  iconBg: 'bg-emerald-50',
                  stripe: 'bg-emerald-500',
                  hoverRing: 'hover:ring-emerald-200',
                },
                {
                  view: 'structure' as View,
                  Icon: FileText,
                  label: 'Fee Structure',
                  desc: 'Manage and update fee rates for each class and term',
                  pill: '11 grade levels',
                  pillClass: 'bg-blue-100 text-blue-700',
                  iconColor: 'text-blue-600',
                  iconBg: 'bg-blue-50',
                  stripe: 'bg-blue-500',
                  hoverRing: 'hover:ring-blue-200',
                },
                {
                  view: 'reports' as View,
                  Icon: BarChart2,
                  label: 'Financial Reports',
                  desc: 'Generate term and annual financial reports for export',
                  pill: 'Export ready',
                  pillClass: 'bg-purple-100 text-purple-700',
                  iconColor: 'text-purple-600',
                  iconBg: 'bg-purple-50',
                  stripe: 'bg-purple-500',
                  hoverRing: 'hover:ring-purple-200',
                },
              ].map(card => (
                <button
                  key={card.view}
                  onClick={() => setCurrentView(card.view)}
                  className={`text-left bg-white rounded-2xl shadow-sm border border-gray-100 ring-2 ring-transparent ${card.hoverRing} hover:shadow-md transition-all duration-200 group overflow-hidden`}
                >
                  <div className={`h-1 ${card.stripe}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                        <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{card.label}</h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{card.desc}</p>
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${card.pillClass}`}>
                      {card.pill}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAYMENT RECORDS
  // ══════════════════════════════════════════════════════════════════════════
  if (currentView === 'payments') {
    const s = getStats();
    return (
      <div className="min-h-screen bg-[#f4f6f9]">
        <SubPageHeader
          title="Payment Records"
          subtitle={`${selectedTerm} · ${selectedYear} · ${s.total} students`}
          actions={
            <>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 text-sm font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          }
        />

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold text-gray-500">Filter:</span>
            </div>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Term 1</option><option>Term 2</option><option>Term 3</option>
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>2025</option><option>2024</option><option>2023</option>
            </select>
            <div className="flex-1 min-w-[220px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or admission no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Collected', value: fmt(getTotalCollected()), color: 'text-emerald-600', stripe: 'bg-emerald-500' },
              { label: 'Outstanding', value: fmt(getTotalOutstanding()), color: 'text-red-500', stripe: 'bg-red-500' },
              { label: 'Total Students', value: String(s.total), color: 'text-blue-600', stripe: 'bg-blue-500' },
            ].map(st => (
              <div key={st.label} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`h-1 ${st.stripe}`} />
                <div className="px-5 py-4">
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">{st.label}</p>
                  <p className={`text-xl font-black ${st.color}`}>{st.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <PaymentRecords />
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FEE STRUCTURE
  // ══════════════════════════════════════════════════════════════════════════
  if (currentView === 'structure') {
    return (
      <div className="min-h-screen bg-[#f4f6f9]">
        <SubPageHeader
          title="Fee Structure"
          subtitle="CBC · PP1 through Grade 9 · Academic Year 2025"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          }
        />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <FeeStructure />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // REPORTS
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <SubPageHeader
        title="Financial Reports"
        subtitle="Term and annual financial summaries"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        }
      />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <FeesReport />
      </div>
    </div>
  );
};

export default FeeManagement;