import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Users, Crown, School, CheckCircle2, Lock } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  value: string | number;
  type: 'total' | 'super_admin' | 'school_admin' | 'active' | 'locked';
  className?: string;
}

// Gradient color schemes for different user types
// Total Users (15): Deep purple to soft lavender gradient
// Super Admins (2): Royal blue to sky blue gradient
// School Admins (9): Emerald green to mint green gradient
// Active Users (12): Vibrant teal to soft cyan gradient
// Locked Users (0): Warm coral to peach gradient
const gradientStyles: Record<string, string> = {
  total: 'from-purple-900 via-purple-700 to-purple-300',
  super_admin: 'from-blue-700 via-blue-500 to-sky-300',
  school_admin: 'from-emerald-800 via-emerald-600 to-emerald-300',
  active: 'from-teal-600 via-teal-500 to-cyan-300',
  locked: 'from-rose-500 via-rose-400 to-orange-200',
};

// Icon mappings
const iconMap: Record<string, LucideIcon> = {
  total: Users,
  super_admin: Crown,
  school_admin: School,
  active: CheckCircle2,
  locked: Lock,
};

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  title,
  value,
  type,
  className,
}) => {
  const Icon = iconMap[type] || Users;
  const gradientClass = gradientStyles[type] || gradientStyles.total;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[12px] shadow-lg transition-transform hover:scale-[1.02] duration-200',
        'bg-gradient-to-br',
        gradientClass,
        className
      )}
    >
      {/* White semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-white/20" />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-light text-white/90 drop-shadow-sm">{title}</p>
            <p className="text-4xl font-bold text-white drop-shadow-md">{value}</p>
          </div>
          
          {/* Icon container with white background */}
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 shadow-sm">
            <Icon className="h-6 w-6 text-slate-800" />
          </div>
        </div>
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
      <div className="absolute -bottom-2 -left-2 h-10 w-10 rounded-full bg-white/10" />
    </div>
  );
};

export default UserStatsCard;
