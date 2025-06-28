/**
 * Unified Theme Configuration
 * Extracted from Login.vue design system
 */

export const themeColors = {
  // Primary Colors (Teal)
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main teal color from login
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Secondary Colors (Purple)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87', // Purple accent from login background
  },

  // Neutral Colors (Slate)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8', // Placeholder text
    500: '#64748b',
    600: '#475569', // Border colors
    700: '#334155', // Input backgrounds
    800: '#1e293b', // Card backgrounds
    900: '#0f172a', // Main dark background
  },

  // Status Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Error messages from login
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Blue accent (from login decorative elements)
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Blue accent from login
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
}

// Semantic color mappings
export const semanticColors = {
  // Background colors
  background: {
    primary: themeColors.neutral[900], // Main dark background
    secondary: themeColors.neutral[800], // Card backgrounds
    tertiary: themeColors.neutral[700], // Input backgrounds
    overlay: 'rgba(15, 23, 42, 0.5)', // Modal overlays
  },

  // Text colors
  text: {
    primary: '#ffffff', // Main text
    secondary: themeColors.neutral[400], // Secondary text
    tertiary: themeColors.neutral[500], // Muted text
    accent: themeColors.primary[400], // Links and accents
  },

  // Border colors
  border: {
    primary: themeColors.neutral[600], // Main borders
    secondary: themeColors.neutral[700], // Subtle borders
    focus: themeColors.primary[500], // Focus states
  },

  // Interactive colors
  interactive: {
    primary: themeColors.primary[500], // Main buttons
    primaryHover: themeColors.primary[600], // Button hover
    secondary: themeColors.secondary[500], // Secondary buttons
    secondaryHover: themeColors.secondary[600], // Secondary button hover
  },
}

// Gradient definitions
export const gradients = {
  background: 'linear-gradient(to bottom right, #0f172a, #7c3aed, #0f172a)',
  primary: 'linear-gradient(to right, #14b8a6, #0d9488)',
  primaryHover: 'linear-gradient(to right, #0d9488, #0f766e)',
  card: 'rgba(30, 41, 59, 0.5)', // Semi-transparent card background
}

// Shadow definitions
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Card shadows from login
}

// Animation durations
export const animations = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
}

// Spacing scale (consistent with Tailwind)
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
}

// Border radius scale
export const borderRadius = {
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.5rem', // 24px - Used in login form
  full: '9999px',
}

export default {
  colors: themeColors,
  semantic: semanticColors,
  gradients,
  shadows,
  animations,
  spacing,
  borderRadius,
}