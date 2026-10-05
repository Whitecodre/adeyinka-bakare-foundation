export const brandColors = {
  primary: "#1e3a8a", // Deep blue
  primaryDark: "#1e40af",
  primaryLight: "#3b82f6",
  secondary: "#f59e0b", // Gold/amber accent
  secondaryDark: "#d97706",
  secondaryLight: "#fbbf24",
  accent: "#10b981", // Green accent
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

export const brandFonts = {
  sans: ["Inter", "system-ui", "sans-serif"],
  heading: ["Georgia", "serif"],
} as const;

export const brandConfig = {
  colors: brandColors,
  fonts: brandFonts,
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
} as const;
