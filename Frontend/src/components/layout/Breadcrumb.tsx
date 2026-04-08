import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ThemeColors, MenuSection, MenuItem, SubMenuItem } from '@/types/dashboard';
import { menuSections } from '@/config/menuData';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardList,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Award,
  CalendarDays,
  Layers,
  TrendingUp,
  DollarSign,
  Settings,
  Wallet,
  BarChart3,
  Shield,
} from 'lucide-react';

interface BreadcrumbProps {
  pathname: string;
  theme: ThemeColors;
}

// Menu data imported from config/menuData.ts - single source of truth for all navigation

// Memoize the menu items flat map to avoid recalculation
const flatMenuItems = menuSections.flatMap(s => s.items);

// Type guard for safe access
type NavItem = MenuItem | SubMenuItem;
const flatAllItems: NavItem[] = [
  ...menuSections.flatMap(s => s.items),
  ...menuSections.flatMap(s => s.items.flatMap(item => item.submenu || []))
];

export default function Breadcrumb({ pathname, theme }: BreadcrumbProps) {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Dashboard', href: '/school-admin/dashboard' }];
    
    let path = '';
    for (const segment of segments) {
      path += `/${segment}`;
      
      // Look for matching menu item (main or submenu)
      const foundItem = flatAllItems.find(item => item.href === path);
      
      if (foundItem) {
        crumbs.push({ label: foundItem.label, href: path });
      }
    }
    
    return crumbs;
  }, [segments]);

  // Don't render if only dashboard
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Dedupe breadcrumbs by href to avoid duplicate links
  const uniqueBreadcrumbs = breadcrumbs.filter((crumb, index, self) => 
    index === self.findIndex(c => c.href === crumb.href)
  );

  return (
    <nav 
      className={cn(
        "flex items-center gap-1 text-sm whitespace-nowrap overflow-hidden",
        theme.header.text
      )} 
      aria-label="Breadcrumb"
    >
      {uniqueBreadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1 flex-shrink-0">
          <Link
            to={crumb.href}
            className={cn(
              "hover:opacity-70 transition-opacity truncate max-w-[200px]",
              index === uniqueBreadcrumbs.length - 1 ? "font-semibold opacity-100" : "opacity-80"
            )}
            title={crumb.label}
          >
            {crumb.label}
          </Link>
          {index < uniqueBreadcrumbs.length - 1 && (
            <span className="opacity-50 flex-shrink-0">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}
