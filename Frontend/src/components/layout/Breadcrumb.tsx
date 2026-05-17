import { Link } from 'react-router-dom';
import { useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { ThemeColors, MenuItem, SubMenuItem } from '@/types/dashboard';
import { menuSections } from '@/config/menuData';

interface BreadcrumbProps {
  pathname: string;
  theme: ThemeColors;
  maxCrumbLength?: number;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

type NavigationItem = MenuItem | SubMenuItem;

// Constants
const DEFAULT_MAX_CRUMB_LENGTH = 200;
const DASHBOARD_PATH = '/school-admin/dashboard';

// Pre-compute flattened navigation items for performance
const FLATTENED_NAVIGATION_ITEMS: NavigationItem[] = (() => {
  const items: NavigationItem[] = [];
  
  for (const section of menuSections) {
    for (const item of section.items) {
      items.push(item);
      if (item.submenu?.length) {
        items.push(...item.submenu);
      }
    }
  }
  
  return items;
})();

// Utility function to find navigation item by href
const findNavigationItem = (href: string): NavigationItem | undefined => {
  return FLATTENED_NAVIGATION_ITEMS.find(item => item.href === href);
};

// Utility function to build breadcrumb path segments
const buildBreadcrumbSegments = (pathname: string): string[] => {
  return pathname.split('/').filter(Boolean);
};

// Utility function to generate breadcrumb items from path segments
const generateBreadcrumbItems = (segments: string[]): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [];
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const navigationItem = findNavigationItem(currentPath);
    
    if (navigationItem) {
      items.push({
        label: navigationItem.label,
        href: currentPath,
      });
    }
  }
  
  return items;
};

// Utility function to deduplicate breadcrumb items
const deduplicateBreadcrumbItems = (items: BreadcrumbItem[]): BreadcrumbItem[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
};

/**
 * Breadcrumb component for navigation hierarchy display
 * 
 * @component
 * @example
 * ```tsx
 * <Breadcrumb 
 *   pathname="/school-admin/students/grade-10"
 *   theme={currentTheme}
 *   maxCrumbLength={150}
 * />
 * ```
 */
const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ 
  pathname, 
  theme, 
  maxCrumbLength = DEFAULT_MAX_CRUMB_LENGTH,
  className 
}) => {
  // Memoize breadcrumb generation to prevent unnecessary recalculations
  const breadcrumbs = useMemo(() => {
    // Always include dashboard as root breadcrumb
    const rootCrumb: BreadcrumbItem = { 
      label: '', 
      href: DASHBOARD_PATH 
    };
    
    const segments = buildBreadcrumbSegments(pathname);
    const pathItems = generateBreadcrumbItems(segments);
    const allItems = [rootCrumb, ...pathItems];
    
    return deduplicateBreadcrumbItems(allItems);
  }, [pathname]);

  // Don't render if only dashboard is present (no nested navigation)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const isLastItem = (index: number): boolean => index === breadcrumbs.length - 1;

  return (
    <nav 
      className={cn(
        "flex items-center gap-1 text-sm whitespace-nowrap overflow-hidden",
        theme.header.text,
        className
      )}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center gap-1 flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <li 
            key={crumb.href}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Link
              to={crumb.href}
              className={cn(
                "transition-opacity duration-200 truncate hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary rounded px-1",
                isLastItem(index) 
                  ? "font-semibold opacity-100 cursor-default pointer-events-none" 
                  : "opacity-80 hover:opacity-100",
                !isLastItem(index) && "hover:underline"
              )}
              title={crumb.label || 'Dashboard'}
              aria-current={isLastItem(index) ? 'page' : undefined}
              tabIndex={isLastItem(index) ? -1 : 0}
            >
              {crumb.label || 'Dashboard'}
            </Link>
            {!isLastItem(index) && (
              <span 
                className="opacity-50 flex-shrink-0 select-none"
                aria-hidden="true"
              >
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;