import React, { useState } from 'react';
import {
  CreditCard, FileText, ArrowLeft, AlertCircle,
  CheckCircle, ChevronRight, BarChart2,
  RefreshCw, Wallet, BadgeCheck, TimerReset,
  GraduationCap, Users, TrendingUp, DollarSign,
  School, BookOpen, Shirt, Bus
} from 'lucide-react';
import PaymentRecords from './PaymentRecord';
import FeeStructure from './FeeStructure';
import FeesReport from './FeesReport';

interface FeeManagementProps {
  onBack: () => void;
}

type View = 'dashboard' | 'payments' | 'structure' | 'reports';

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0 });

const STATS = {
  totalStudents: 1002,
  paid: 756,
  partial: 168,
  overdue: 78,
  collected: 30547000,
  outstanding: 6823000,
  expected: 37370000,
};
const STATS_RATE = Math.round((STATS.paid / STATS.totalStudents) * 100);
const COLLECTION_RATE = Math.round((STATS.collected / STATS.expected) * 100);

const FEE_CATEGORIES = [
  { label: 'Tuition', amount: 18450000, icon: School, pct: 60.4 },
  { label: 'Boarding', amount: 4820000, icon: GraduationCap, pct: 15.8 },
  { label: 'Books & Stationery', amount: 2890000, icon: BookOpen, pct: 9.5 },
  { label: 'Transport', amount: 1960000, icon: Bus, pct: 6.4 },
  { label: 'Uniforms', amount: 1340000, icon: Shirt, pct: 4.4 },
  { label: 'Other Charges', amount: 1087000, icon: DollarSign, pct: 3.5 },
];

const RECENT_PAYMENTS = [
  { name: 'James Mwangi', grade: 'Grade 10', amount: 25000, date: '15 Feb 2025', status: 'completed' },
  { name: 'Amina Hassan', grade: 'Grade 11', amount: 15000, date: '14 Feb 2025', status: 'partial' },
  { name: 'Grace Wanjiku', grade: 'Grade 10', amount: 25000, date: '12 Feb 2025', status: 'completed' },
  { name: 'Kevin Kamau', grade: 'Grade 11', amount: 20000, date: '11 Feb 2025', status: 'completed' },
  { name: 'Sarah Achieng', grade: 'Grade 8', amount: 12000, date: '08 Feb 2025', status: 'completed' },
];

const FeeManagement: React.FC<FeeManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  if (currentView === 'payments') return <PaymentRecords onBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'structure') return <FeeStructure onBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'reports') return <FeesReport onBack={() => setCurrentView('dashboard')} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 shadow-lg">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="flex items-center justify-between pt-5 pb-2">
            <div className="flex items-center gap-2.5">
              <button onClick={onBack} className="w-[34px] h-[34px] rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-white hover:bg-white/30 transition-colors">
                <ArrowLeft size={15} />
              </button>
              <div>
                <div className="text-[11px] text-white/80 font-medium tracking-wider uppercase">Center of Hope</div>
                <div className="text-[13px] text-white font-semibold mt-px">Finance Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-black/20 rounded-[10px] p-[3px] gap-[2px]">
                {['Term 1', 'Term 2', 'Term 3'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTerm(t)}
                    className={`px-3.5 py-1.5 text-xs font-semibold border-none cursor-pointer transition-all rounded-lg ${selectedTerm === t ? 'bg-white text-red-700 shadow-md' : 'bg-transparent text-white/90 hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="px-2.5 py-1.5 bg-white/20 border border-white/30 rounded-[10px] text-white text-xs font-semibold cursor-pointer outline-none hover:bg-white/30">
                {['2025', '2024', '2023'].map(y => <option key={y} value={y} className="text-gray-900">{y}</option>)}
              </select>
              <button onClick={handleRefresh} className="w-[34px] h-[34px] bg-white/20 border border-white/30 rounded-[10px] flex items-center justify-center cursor-pointer text-white hover:bg-white/30 transition-colors">
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          <div className="pt-7 pb-[52px]">
            <span className="inline-flex items-center gap-[5px] bg-white/20 border border-white/30 rounded-[20px] px-2.5 py-[3px] pl-1.5 text-[11px] text-white font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> LIVE · {selectedTerm} {selectedYear}
            </span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight m-0 leading-tight">Fee Management</h1>
            <p className="text-white/80 text-sm mt-1.5">Center of Hope and Transformation School</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto -mt-8 px-7 pb-16 relative z-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Collected', value: fmt(STATS.collected), sub: `${COLLECTION_RATE}% of expected`, subColor: 'text-green-700', Icon: Wallet, accent: '#16a34a', iconBg: 'bg-green-100' },
            { label: 'Outstanding', value: fmt(STATS.outstanding), sub: `${STATS.partial + STATS.overdue} students pending`, subColor: 'text-red-700', Icon: AlertCircle, accent: '#dc2626', iconBg: 'bg-red-100' },
            { label: 'Students Cleared', value: `${STATS.paid} / ${STATS.totalStudents}`, sub: `${STATS_RATE}% clearance rate`, subColor: 'text-blue-700', Icon: BadgeCheck, accent: '#2563eb', iconBg: 'bg-blue-100' },
            { label: 'Partial / Overdue', value: String(STATS.partial + STATS.overdue), sub: `${STATS.partial} partial · ${STATS.overdue} overdue`, subColor: 'text-amber-700', Icon: TimerReset, accent: '#d97706', iconBg: 'bg-amber-100' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-[22px] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl shadow-md">
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: card.accent }} />
              <div className="flex items-start justify-between mb-3.5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest m-0">{card.label}</p>
                <div className={`w-9 h-9 rounded-[10px] ${card.iconBg} flex items-center justify-center`}>
                  <card.Icon size={16} color={card.accent} />
                </div>
              </div>
              <p className="text-[22px] font-extrabold text-gray-900 tracking-tight m-0 mb-1.5">{card.value}</p>
              <p className={`text-[11px] font-semibold ${card.subColor} m-0`}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Collection Progress */}
        <div className="bg-white rounded-[18px] border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-end justify-between mb-[18px]">
            <div>
              <p className="text-[13px] font-bold text-gray-900 m-0 mb-[3px]">Collection Progress — {selectedTerm} {selectedYear}</p>
              <p className="text-[11px] text-gray-500 m-0">{STATS.paid} of {STATS.totalStudents} students have fully cleared fees</p>
            </div>
            <div className="flex items-baseline gap-[2px]">
              <span className="text-[44px] font-extrabold text-gray-900 leading-none">{COLLECTION_RATE}</span>
              <span className="text-xl font-bold text-gray-400">%</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex gap-[2px]">
            <div className="h-full rounded-l-full bg-green-500" style={{ width: `${(STATS.paid / STATS.totalStudents) * 100}%` }} />
            <div className="h-full bg-amber-500" style={{ width: `${(STATS.partial / STATS.totalStudents) * 100}%` }} />
            <div className="h-full rounded-r-full bg-red-500" style={{ width: `${(STATS.overdue / STATS.totalStudents) * 100}%` }} />
          </div>
          <div className="flex gap-5 mt-3">
            {[
              { color: '#22c55e', label: 'Paid', count: STATS.paid },
              { color: '#f59e0b', label: 'Partial', count: STATS.partial },
              { color: '#ef4444', label: 'Overdue', count: STATS.overdue },
            ].map(item => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-900 font-bold">{item.label}:</span> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* Fee Category Breakdown + Recent Payments */}
        <div className="grid grid-cols-[1fr_380px] gap-4 mb-6">
          <div className="bg-white rounded-[18px] border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-[10px] bg-red-100 flex items-center justify-center">
                <BarChart2 size={17} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 m-0">Fee Category Breakdown</p>
                <p className="text-[11px] text-gray-500 m-0 mt-0.5">Collection by fee type — {selectedTerm} {selectedYear}</p>
              </div>
            </div>
            <div className="space-y-3">
              {FEE_CATEGORIES.map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <cat.icon size={14} className="text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-900">{cat.label}</span>
                      <span className="text-xs font-bold text-gray-900">{fmt(cat.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${cat.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">{cat.pct}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[18px] border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp size={15} className="text-green-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 m-0">Recent Payments</p>
                </div>
                <button onClick={() => setCurrentView('payments')} className="text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer bg-transparent border-none">
                  View All →
                </button>
              </div>
            </div>
            <div>
              {RECENT_PAYMENTS.map((p, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3 ${i < RECENT_PAYMENTS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">{p.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{p.grade} · {p.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-gray-900">{fmt(p.amount)}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status === 'completed' ? '✓ Paid' : '◷ Partial'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.12em] mb-3.5">Quick Access</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { view: 'payments' as View, Icon: CreditCard, label: 'Payment Records', desc: 'View, search and manage all student fee payments', pill: `${STATS.totalStudents} records`, accent: '#dc2626', accentLight: 'bg-red-50', textAccent: 'text-red-600' },
            { view: 'structure' as View, Icon: FileText, label: 'Fee Structure', desc: 'Manage and update fee rates for each class and term', pill: '14 grade levels', accent: '#d97706', accentLight: 'bg-amber-50', textAccent: 'text-amber-600' },
            { view: 'reports' as View, Icon: BarChart2, label: 'Financial Reports', desc: 'Generate term and annual financial reports for export', pill: 'Export ready', accent: '#7c3aed', accentLight: 'bg-purple-50', textAccent: 'text-purple-600' },
          ].map(card => (
            <button key={card.view} onClick={() => setCurrentView(card.view)} className="bg-white rounded-[18px] border border-gray-200 overflow-hidden cursor-pointer text-left transition-all hover:-translate-y-1 hover:shadow-xl group">
              <div className="h-1 bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${card.accent}, ${card.accent}dd)` }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${card.accentLight} flex items-center justify-center`}>
                    <card.Icon size={20} color={card.accent} />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-1.5">{card.label}</h3>
                <p className="text-[12.5px] text-gray-600 m-0 mb-4 leading-relaxed">{card.desc}</p>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-[20px] ${card.accentLight} ${card.textAccent}`}>{card.pill}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;

