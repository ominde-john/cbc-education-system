import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  submenu?: SubMenuItem[];
  badge?: number;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface ThemeColors {
  sidebar: {
    bg: string;
    border: string;
    text: string;
    textSecondary: string;
    hoverBg: string;
    activeBg: string;
    logoSection: string;
  };
  header: {
    bg: string;
    border: string;
    text: string;
    buttonHover: string;
  };
  main: {
    bg: string;
    text: string;
    textSecondary: string;
  };
  card: {
    bg: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  badge: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}
