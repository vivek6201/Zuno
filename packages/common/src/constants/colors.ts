export const COLORS = {
  // Brand Primary (Royal Blue)
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    DEFAULT: "#2563EB", // Primary action button & active tab color
    500: "#2563EB",
    600: "#1D4ED8", // Button pressed / active state
    700: "#1E40AF",
    800: "#1E3A8A",
    900: "#172554",
  },

  // Base Canvas & Surfaces
  background: {
    DEFAULT: "#F4F8FD", // Light soft blue-gray main screen background
    secondary: "#FFFFFF", // Pure white for cards, bottom bar, sheets
    subtle: "#EFF5FD", // Hero card background tint
  },

  surface: {
    DEFAULT: "#FFFFFF",
    card: "#FFFFFF",
    elevated: "#FFFFFF",
    secondary: "#F1F5F9", // Pill filters (All / Wins / Losses) & segmented tabs
    muted: "#E2E8F0",
  },

  // Typography
  text: {
    primary: "#0F172A", // Deep slate for headings & primary labels
    secondary: "#475569", // Subtitles & metadata
    muted: "#94A3B8", // Captions, dates, and placeholders
    inverse: "#FFFFFF", // White text on dark/primary backgrounds
    link: "#2563EB",
  },

  // Borders & Dividers
  border: {
    DEFAULT: "#E2E8F0",
    subtle: "#F1F5F9",
    strong: "#CBD5E1",
    focus: "#2563EB",
  },

  // Status & Feedback Badges
  status: {
    success: {
      DEFAULT: "#16A34A",
      bg: "#DCFCE7", // "Won" badge background
      border: "#BBF7D0",
      text: "#15803D",
    },
    danger: {
      DEFAULT: "#EF4444",
      bg: "#FEE2E2", // "Lost" badge background & Logout
      border: "#FECACA",
      text: "#B91C1C",
    },
    warning: {
      DEFAULT: "#F59E0B",
      bg: "#FEF3C7", // Streak & stars badge background
      border: "#FDE68A",
      text: "#B45309",
    },
    info: {
      DEFAULT: "#2563EB",
      bg: "#DBEAFE",
      border: "#BFDBFE",
      text: "#1D4ED8",
    },
  },

  // Game Identities & Theme Gradients
  games: {
    ludo: {
      primary: "#2563EB",
      gradient: ["#3B82F6", "#1D4ED8"] as const,
      cssGradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
      badgeBg: "#EFF6FF",
      board: {
        red: "#EF4444",
        green: "#22C55E",
        yellow: "#EAB308",
        blue: "#2563EB",
        path: "#FFFFFF",
        border: "#0F172A",
      },
    },
    uno: {
      primary: "#EF4444",
      gradient: ["#EF4444", "#EA580C"] as const,
      cssGradient: "linear-gradient(135deg, #EF4444 0%, #EA580C 100%)",
      badgeBg: "#FFF1F2",
      cards: {
        red: "#EF4444",
        yellow: "#FACC15",
        green: "#22C55E",
        blue: "#2563EB",
        wild: "#0F172A",
      },
    },
    matiks: {
      primary: "#7C3AED",
      gradient: ["#8B5CF6", "#6D28D9"] as const,
      cssGradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
      badgeBg: "#F5F3FF",
      tiles: {
        purple: "#8B5CF6",
        amber: "#F59E0B",
      },
    },
    chess: {
      primary: "#059669",
      gradient: ["#10B981", "#047857"] as const,
      cssGradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
      badgeBg: "#ECFDF5",
      board: {
        lightSquare: "#EBECD0",
        darkSquare: "#739552",
      },
    },
  },

  // Interactive UI Elements
  ui: {
    tabBarActive: "#2563EB",
    tabBarInactive: "#94A3B8",
    dotActive: "#2563EB",
    dotInactive: "#CBD5E1",
    turnBanner: "#1D4ED8",
    xpBarFill: "#2563EB",
    xpBarTrack: "#E2E8F0",
  },
} as const;

export type ColorsType = typeof COLORS;
export type GameId = keyof typeof COLORS.games;

export default COLORS;
