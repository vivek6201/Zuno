// Per-game themed gradient palettes for easy reuse across screens
export const GAME_GRADIENTS: Record<string, [string, string, ...string[]]> = {
  ludo: [
    "#1E3A8A",
    "#1D4ED8",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#DBEAFE",
  ],
  uno: [
    "#7F1D1D",
    "#991B1B",
    "#B91C1C",
    "#DC2626",
    "#EF4444",
    "#F87171",
    "#FECACA",
  ],
  matiks: [
    "#3B0764",
    "#581C87",
    "#6D28D9",
    "#7C3AED",
    "#8B5CF6",
    "#A78BFA",
    "#DDD6FE",
  ],
  chess: [
    "#052E16",
    "#14532D",
    "#166534",
    "#15803D",
    "#22C55E",
    "#4ADE80",
    "#BBF7D0",
  ],
};

export const DEFAULT_GRADIENT_COLORS: [string, string, ...string[]] = [
  "#1E3A8A",
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#DBEAFE",
  "#F0F5FD",
];
