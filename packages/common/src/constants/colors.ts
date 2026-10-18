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
    950: "#0F172A",
  },

  // Base Canvas & Surfaces
  background: {
    DEFAULT: "#F4F8FD", // Light soft blue-gray main screen background (Home, Lobby, History)
    secondary: "#FFFFFF", // Pure white for cards, bottom bar, modal sheets
    subtle: "#EFF5FD", // Hero card background tint
    heroSplash: "#1D4ED8", // Onboarding 1 top royal blue splash background
    gameScreen: "#0F1E36", // Dark immersive backdrop for live game arena (Screen 9)
    gameScreenHeader: "#0B1528", // Header bar in Game Screen
  },

  surface: {
    DEFAULT: "#FFFFFF",
    card: "#FFFFFF",
    elevated: "#FFFFFF",
    secondary: "#F1F5F9", // Pill filters (All / Wins / Losses) & segmented tabs
    muted: "#E2E8F0",
    darkCard: "#1E40AF", // Profile hero banner card
  },

  // Typography
  text: {
    primary: "#0F172A", // Deep slate for headings & primary labels
    secondary: "#475569", // Subtitles & metadata
    muted: "#94A3B8", // Captions, dates, and placeholders
    inverse: "#FFFFFF", // White text on dark/primary backgrounds
    link: "#2563EB",
    highlight: "#38BDF8", // Cyan / sky blue highlight text in profile
  },

  // Borders & Dividers
  border: {
    DEFAULT: "#E2E8F0",
    subtle: "#F1F5F9",
    strong: "#CBD5E1",
    focus: "#2563EB",
    dark: "#1E3A8A", // Borders inside dark game room screen
  },

  // Status & Feedback Badges
  status: {
    success: {
      DEFAULT: "#16A34A",
      bg: "#DCFCE7", // "Won" badge background in History
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

  // Game Identities & Theme Gradients (Matching Game Selector & Badges)
  games: {
    ludo: {
      name: "Ludo",
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
        safeSquare: "#FACC15",
      },
    },
    uno: {
      name: "UNO",
      primary: "#EF4444",
      gradient: ["#EF4444", "#DC2626"] as const,
      cssGradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
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
      name: "Matiks",
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
      name: "Chess",
      primary: "#0F766E",
      gradient: ["#115E59", "#042F2E"] as const, // Dark teal / forest slate gradient
      cssGradient: "linear-gradient(135deg, #115E59 0%, #042F2E 100%)",
      badgeBg: "#F0FDFA",
      board: {
        lightSquare: "#EBECD0",
        darkSquare: "#739552",
        lightPiece: "#F8FAFC",
        darkPiece: "#1E293B",
      },
    },
  },

  // Interactive UI Elements (Per screen component)
  ui: {
    // Bottom Tab Bar (Screens 5, 6, 10, 11)
    tabBar: {
      bg: "#FFFFFF",
      border: "#E2E8F0",
      active: "#2563EB",
      inactive: "#94A3B8",
    },
    // Onboarding Pager Dots (Screens 1-4)
    pagination: {
      dotActive: "#2563EB",
      dotInactive: "#CBD5E1",
    },
    // Lobby Room States (Screen 8)
    lobby: {
      joinBtn: "#2563EB",
      fullBtn: "#94A3B8",
      fullBtnBg: "#F1F5F9",
      inputBorder: "#E2E8F0",
      inputBg: "#FFFFFF",
    },
    // Game Arena Controls (Screen 9)
    gameArena: {
      roomBadgeBg: "#1E3A8A",
      leaveBtnBg: "#1E40AF",
      diceContainer: "#FFFFFF",
      diceActionBtn: "#2563EB",
      controlBtnBg: "#1E293B", // Chat & Mic buttons
      turnIndicator: "#38BDF8", // Pulsing ring for active turn
    },
    // Profile Elements (Screen 11)
    profile: {
      bannerGradient: ["#2563EB", "#1D4ED8"] as const,
      levelBadgeBg: "#1E3A8A",
      levelBadgeText: "#BFDBFE",
      xpBarTrack: "#1E40AF",
      xpBarFill: "#38BDF8", // Cyan progress bar
    },
  },
} as const;

export type ColorsType = typeof COLORS;
export type GameId = keyof typeof COLORS.games;

export default COLORS;
