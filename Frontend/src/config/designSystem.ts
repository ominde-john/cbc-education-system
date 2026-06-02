/**
 * Color Scheme and Design System Configuration
 * CBC Education System - Admin Dashboard
 * 
 * This file defines the professional color palette and design tokens
 * for consistency across the admin dashboard and student profile module.
 */

export const colorScheme = {
  // Primary Colors
  primary: {
    light: '#3B82F6',      // Blue
    main: '#1F2937',       // Dark Gray (Primary action)
    dark: '#111827',       // Very Dark Gray
  },
  
  // Status Colors
  status: {
    active: '#10B981',     // Emerald - Active students
    inactive: '#F59E0B',   // Amber - Inactive students
    graduated: '#8B5CF6',  // Purple - Graduated students
    pending: '#EF4444',    // Red - Pending items
  },
  
  // Academic Performance
  grades: {
    excellent: '#059669',  // Dark Emerald (A grade)
    good: '#0891B2',       // Cyan (B grade)
    satisfactory: '#D97706', // Orange (C grade)
    needsImprovement: '#DC2626', // Red (D grade)
  },
  
  // Attendance
  attendance: {
    present: '#10B981',    // Emerald
    late: '#F59E0B',       // Amber
    absent: '#EF4444',     // Red
  },
  
  // Neutral
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  }
};

export const colorThemes = {
  // Light Theme
  light: {
    background: colorScheme.neutral.white,
    surface: colorScheme.neutral.gray50,
    surfaceAlt: colorScheme.neutral.gray100,
    border: colorScheme.neutral.gray200,
    text: {
      primary: colorScheme.neutral.gray900,
      secondary: colorScheme.neutral.gray600,
      tertiary: colorScheme.neutral.gray500,
      muted: colorScheme.neutral.gray400,
    }
  },
  
  // Dark Theme
  dark: {
    background: colorScheme.neutral.gray900,
    surface: colorScheme.neutral.gray800,
    surfaceAlt: colorScheme.neutral.gray700,
    border: colorScheme.neutral.gray700,
    text: {
      primary: colorScheme.neutral.gray50,
      secondary: colorScheme.neutral.gray300,
      tertiary: colorScheme.neutral.gray400,
      muted: colorScheme.neutral.gray500,
    }
  }
};

/**
 * Design System Tokens for Consistency
 */
export const designTokens = {
  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '0.25rem',  // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem',   // 8px
    xl: '0.75rem',  // 12px
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
};

/**
 * Component-specific color mappings
 */
export const componentColors = {
  button: {
    primary: {
      background: colorScheme.primary.main,
      text: colorScheme.neutral.white,
      hover: colorScheme.primary.dark,
    },
    secondary: {
      background: colorScheme.neutral.gray100,
      text: colorScheme.primary.main,
      hover: colorScheme.neutral.gray200,
    },
    success: {
      background: colorScheme.status.active,
      text: colorScheme.neutral.white,
      hover: '#059669',
    },
  },
  
  badge: {
    active: {
      background: `${colorScheme.status.active}20`,
      text: colorScheme.status.active,
      border: `${colorScheme.status.active}40`,
    },
    inactive: {
      background: `${colorScheme.status.inactive}20`,
      text: colorScheme.status.inactive,
      border: `${colorScheme.status.inactive}40`,
    },
    graduated: {
      background: `${colorScheme.status.graduated}20`,
      text: colorScheme.status.graduated,
      border: `${colorScheme.status.graduated}40`,
    },
  },
  
  card: {
    background: colorScheme.neutral.white,
    border: colorScheme.neutral.gray200,
    shadow: colorScheme.neutral.gray100,
    darkBackground: colorScheme.neutral.gray800,
    darkBorder: colorScheme.neutral.gray700,
  }
};

export default {
  colorScheme,
  colorThemes,
  designTokens,
  componentColors
};
