/**
 * ArthSetu Color Palette
 *
 * Complete color scheme for consistent styling across the application.
 * Based on Tailwind CSS color standards with custom additions for financial metrics.
 *
 * Usage:
 * import colors from '../theme/colors';
 *
 * // Use specific color
 * background: colors.primary.blue[500];
 *
 * // Use semantic color
 * color: colors.status.healthy;
 *
 * // Use with opacity
 * backgroundColor: colors.primary.blue[50];
 */

const colors = {
  // ========================================================================
  // SEMANTIC COLORS - Use these for semantic meaning
  // ========================================================================
  status: {
    healthy: "#10b981", // Green - Good financial health
    warning: "#f59e0b", // Amber - Caution needed
    danger: "#ef4444", // Red - Critical attention needed
    neutral: "#6b7280", // Gray - Neutral information
    info: "#3b82f6", // Blue - Informational
  },

  // For financial metrics
  financial: {
    income: "#10b981", // Green - Money coming in
    expense: "#ef4444", // Red - Money going out
    savings: "#3b82f6", // Blue - Money saved
    goal: "#8b5cf6", // Purple - Goals/aspirations
    obligation: "#f59e0b", // Amber - Obligations/debt
    buffer: "#06b6d4", // Cyan - Safety buffer
  },

  // ========================================================================
  // PRIMARY COLORS - Main brand colors
  // ========================================================================
  primary: {
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Primary brand color
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    green: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#145231",
    },

    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
  },

  // ========================================================================
  // NEUTRAL COLORS - Backgrounds, borders, text
  // ========================================================================
  neutral: {
    white: "#ffffff",
    black: "#000000",

    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      150: "#ececf1", // Custom shade
      200: "#e5e7eb",
      250: "#d9dce1", // Custom shade
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },

  // ========================================================================
  // SUPPLEMENTARY COLORS - Status, feedback, actions
  // ========================================================================
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#10b981", // Use this for success states
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  warning: {
    50: "#fef3c7",
    100: "#fde68a",
    200: "#fcd34d",
    300: "#fbbf24",
    400: "#f59e0b", // Use this for warning states
    500: "#d97706",
    600: "#b45309",
    700: "#92400e",
    800: "#78350f",
    900: "#451a03",
  },

  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Use this for danger states
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Use this for info states
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // ========================================================================
  // ALLOCATION COLORS - For Safe-to-Save breakdown
  // ========================================================================
  allocation: {
    savings: "#10b981", // Green - Emergency savings
    goals: "#3b82f6", // Blue - Goal fund
    discretionary: "#a855f7", // Purple - Flexible spending
  },

  // ========================================================================
  // VOLATILITY COLORS - Income volatility visualization
  // ========================================================================
  volatility: {
    veryLow: "#10b981", // 0-20: Stable
    low: "#6ee7b7", // 20-40: Fairly stable
    medium: "#fbbf24", // 40-60: Variable
    high: "#f97316", // 60-80: Volatile
    veryHigh: "#ef4444", // 80-100: Very volatile
  },

  // ========================================================================
  // FINANCIAL SAFETY SCORE COLORS
  // ========================================================================
  safetyScore: {
    excellent: "#10b981", // 80-100: Healthy
    good: "#6ee7b7", // 60-80: Good
    fair: "#fbbf24", // 40-60: Fair
    poor: "#f97316", // 20-40: Poor
    critical: "#ef4444", // 0-20: Critical
  },

  // ========================================================================
  // TRANSACTION CATEGORY COLORS
  // ========================================================================
  categories: {
    food: "#f59e0b", // Amber
    transport: "#3b82f6", // Blue
    rent: "#8b5cf6", // Purple
    utilities: "#06b6d4", // Cyan
    entertainment: "#ec4899", // Pink
    work_expense: "#10b981", // Green
    savings: "#3b82f6", // Blue
    investment: "#8b5cf6", // Purple
    healthcare: "#ef4444", // Red
    education: "#6366f1", // Indigo
    shopping: "#ec4899", // Pink
    other: "#6b7280", // Gray
  },

  // ========================================================================
  // GRADIENT COLORS - For backgrounds and illustrations
  // ========================================================================
  gradients: {
    primary: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",

    // Card gradients
    cardLight: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    cardDark: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",

    // Status gradients
    healthyGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warningGradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    dangerGradient: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",

    // Background gradients
    bgGradient: "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
  },

  // ========================================================================
  // SHADOWS - Depth and elevation
  // ========================================================================
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 16px -2px rgba(0, 0, 0, 0.1)",
    xl: "0 12px 24px -4px rgba(0, 0, 0, 0.1)",

    // Colored shadows
    blueShadow: "0 0 12px rgba(59, 130, 246, 0.3)",
    greenShadow: "0 0 12px rgba(16, 185, 129, 0.3)",
    redShadow: "0 0 12px rgba(239, 68, 68, 0.3)",
    purpleShadow: "0 0 12px rgba(168, 85, 247, 0.3)",
  },

  // ========================================================================
  // SEMANTIC BACKGROUND COLORS
  // ========================================================================
  backgrounds: {
    primary: "#ffffff", // Main background
    secondary: "#f9fafb", // Secondary background
    tertiary: "#f3f4f6", // Tertiary background

    success: "#f0fdf4",
    warning: "#fef3c7",
    danger: "#fee2e2",
    info: "#eff6ff",
  },

  // ========================================================================
  // BORDER COLORS
  // ========================================================================
  borders: {
    light: "#e5e7eb",
    default: "#d1d5db",
    dark: "#9ca3af",

    // Status borders
    success: "#d1fae5",
    warning: "#fef3c7",
    danger: "#fee2e2",
    info: "#dbeafe",
  },

  // ========================================================================
  // TEXT COLORS
  // ========================================================================
  text: {
    primary: "#111827", // Main text
    secondary: "#6b7280", // Secondary text
    tertiary: "#9ca3af", // Tertiary text
    muted: "#d1d5db", // Muted text

    // On colored backgrounds
    onPrimary: "#ffffff",
    onSuccess: "#047857",
    onWarning: "#92400e",
    onDanger: "#991b1b",
    onInfo: "#1e40af",
  },

  // ========================================================================
  // OPACITY MODIFIERS - For creating variations
  // ========================================================================
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    80: "0.8",
    90: "0.9",
    95: "0.95",
    100: "1",
  },
};

/**
 * Utility Functions for Colors
 */

/**
 * Get color with opacity
 * Usage: getColorWithOpacity(colors.primary.blue[500], 0.5)
 */
export function getColorWithOpacity(color, opacity) {
  if (!color.startsWith("#")) return color;

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get status color based on volatility score
 */
export function getVolatilityColor(volatilityScore) {
  if (volatilityScore <= 20) return colors.volatility.veryLow;
  if (volatilityScore <= 40) return colors.volatility.low;
  if (volatilityScore <= 60) return colors.volatility.medium;
  if (volatilityScore <= 80) return colors.volatility.high;
  return colors.volatility.veryHigh;
}

/**
 * Get safety score color
 */
export function getSafetyScoreColor(score) {
  if (score >= 80) return colors.safetyScore.excellent;
  if (score >= 60) return colors.safetyScore.good;
  if (score >= 40) return colors.safetyScore.fair;
  if (score >= 20) return colors.safetyScore.poor;
  return colors.safetyScore.critical;
}

/**
 * Get status color (healthy, warning, danger)
 */
export function getStatusColor(status) {
  const statusColors = {
    healthy: colors.status.healthy,
    warning: colors.status.warning,
    danger: colors.status.danger,
    neutral: colors.status.neutral,
  };

  return statusColors[status] || colors.status.neutral;
}

/**
 * Get category color
 */
export function getCategoryColor(category) {
  const categoryLower = category?.toLowerCase() || "other";
  return colors.categories[categoryLower] || colors.categories.other;
}

export default colors;
