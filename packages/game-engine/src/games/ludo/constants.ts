import { LudoColor } from "./types";

/**
 * Total number of shared circuit tiles on the outer board perimeter.
 */
export const TOTAL_TRACK_TILES = 52;

/**
 * Step count milestones for any token:
 * - 0: In Yard / Base
 * - 1: On player's starting arrow tile
 * - 1..51: Outer common track
 * - 52..56: Colored home path corridor
 * - 57: Reached HOME (finished)
 */
export const STEP_BASE = 0;
export const STEP_START = 1;
export const STEP_TRACK_EXIT = 51;
export const STEP_HOME_PATH_START = 52;
export const STEP_HOME = 57;

/**
 * The global tile index where each color enters the outer 52-tile track.
 */
export const COLOR_START_OFFSETS: Record<LudoColor, number> = {
  [LudoColor.RED]: 0,
  [LudoColor.GREEN]: 13,
  [LudoColor.YELLOW]: 26,
  [LudoColor.BLUE]: 39,
};

/**
 * The 8 Safe Squares on the common 52-tile track where pieces cannot be captured.
 * - Starting tiles: 0 (Red), 13 (Green), 26 (Yellow), 39 (Blue)
 * - Star tiles: 8, 21, 34, 47
 */
export const SAFE_TILES: readonly number[] = [0, 8, 13, 21, 26, 34, 39, 47];

/**
 * Number of tokens each player controls.
 */
export const TOKENS_PER_PLAYER = 4;

/**
 * Standard colors in order of play (clockwise).
 */
export const LUDO_COLORS: readonly LudoColor[] = [
  LudoColor.RED,
  LudoColor.GREEN,
  LudoColor.YELLOW,
  LudoColor.BLUE,
] as const;

export const GRID_SIZE = 15;

export interface BoardCoordinate {
  col: number;
  row: number;
}

export interface LudoColorTheme {
  name: string;
  primary: string;
  secondary: string;
  light: string;
  dark: string;
  border: string;
  glow: string;
}

/**
 * 52 Track tile coordinates (col, row) on a 15x15 grid, clockwise from Red start (Tile 0).
 */
export const TRACK_COORDINATES: ReadonlyArray<BoardCoordinate> = [
  // ── Red Arm Exit & Top-Left (0..4) ──
  { col: 1, row: 6 }, // 0: Red Start (Safe)
  { col: 2, row: 6 }, // 1
  { col: 3, row: 6 }, // 2
  { col: 4, row: 6 }, // 3
  { col: 5, row: 6 }, // 4

  // ── Going Up Top Arm (5..10) ──
  { col: 6, row: 5 }, // 5
  { col: 6, row: 4 }, // 6
  { col: 6, row: 3 }, // 7
  { col: 6, row: 2 }, // 8: Safe Star
  { col: 6, row: 1 }, // 9
  { col: 6, row: 0 }, // 10

  // ── Top Crest (11..12) ──
  { col: 7, row: 0 }, // 11
  { col: 8, row: 0 }, // 12

  // ── Going Down Top Arm into Green Start (13..17) ──
  { col: 8, row: 1 }, // 13: Green Start (Safe)
  { col: 8, row: 2 }, // 14
  { col: 8, row: 3 }, // 15
  { col: 8, row: 4 }, // 16
  { col: 8, row: 5 }, // 17

  // ── Entering Right Arm (18..23) ──
  { col: 9, row: 6 }, // 18
  { col: 10, row: 6 }, // 19
  { col: 11, row: 6 }, // 20
  { col: 12, row: 6 }, // 21: Safe Star
  { col: 13, row: 6 }, // 22
  { col: 14, row: 6 }, // 23

  // ── Right Crest (24..25) ──
  { col: 14, row: 7 }, // 24
  { col: 14, row: 8 }, // 25

  // ── Going Left Right Arm into Yellow Start (26..30) ──
  { col: 13, row: 8 }, // 26: Yellow Start (Safe)
  { col: 12, row: 8 }, // 27
  { col: 11, row: 8 }, // 28
  { col: 10, row: 8 }, // 29
  { col: 9, row: 8 }, // 30

  // ── Entering Bottom Arm (31..36) ──
  { col: 8, row: 9 }, // 31
  { col: 8, row: 10 }, // 32
  { col: 8, row: 11 }, // 33
  { col: 8, row: 12 }, // 34: Safe Star
  { col: 8, row: 13 }, // 35
  { col: 8, row: 14 }, // 36

  // ── Bottom Crest (37..38) ──
  { col: 7, row: 14 }, // 37
  { col: 6, row: 14 }, // 38

  // ── Going Up Bottom Arm into Blue Start (39..43) ──
  { col: 6, row: 13 }, // 39: Blue Start (Safe)
  { col: 6, row: 12 }, // 40
  { col: 6, row: 11 }, // 41
  { col: 6, row: 10 }, // 42
  { col: 6, row: 9 }, // 43

  // ── Entering Left Arm (44..49) ──
  { col: 5, row: 8 }, // 44
  { col: 4, row: 8 }, // 45
  { col: 3, row: 8 }, // 46
  { col: 2, row: 8 }, // 47: Safe Star
  { col: 1, row: 8 }, // 48
  { col: 0, row: 8 }, // 49

  // ── Left Crest (50..51) ──
  { col: 0, row: 7 }, // 50
  { col: 0, row: 6 }, // 51
];

/**
 * 4 Home Path corridors (5 tiles each, stepCount 52..56) leading to center home.
 */
export const HOME_PATH_COORDINATES: Record<
  LudoColor,
  ReadonlyArray<BoardCoordinate>
> = {
  [LudoColor.RED]: [
    { col: 1, row: 7 }, // Step 52
    { col: 2, row: 7 }, // Step 53
    { col: 3, row: 7 }, // Step 54
    { col: 4, row: 7 }, // Step 55
    { col: 5, row: 7 }, // Step 56
  ],
  [LudoColor.GREEN]: [
    { col: 7, row: 1 }, // Step 52
    { col: 7, row: 2 }, // Step 53
    { col: 7, row: 3 }, // Step 54
    { col: 7, row: 4 }, // Step 55
    { col: 7, row: 5 }, // Step 56
  ],
  [LudoColor.YELLOW]: [
    { col: 13, row: 7 }, // Step 52
    { col: 12, row: 7 }, // Step 53
    { col: 11, row: 7 }, // Step 54
    { col: 10, row: 7 }, // Step 55
    { col: 9, row: 7 }, // Step 56
  ],
  [LudoColor.BLUE]: [
    { col: 7, row: 13 }, // Step 52
    { col: 7, row: 12 }, // Step 53
    { col: 7, row: 11 }, // Step 54
    { col: 7, row: 10 }, // Step 55
    { col: 7, row: 9 }, // Step 56
  ],
};

/**
 * The 4 Center Home winning destination coordinates (Step 57).
 */
export const HOME_TARGET_COORDINATES: Record<
  LudoColor,
  BoardCoordinate
> = {
  [LudoColor.RED]: { col: 6, row: 7 },
  [LudoColor.GREEN]: { col: 7, row: 6 },
  [LudoColor.YELLOW]: { col: 8, row: 7 },
  [LudoColor.BLUE]: { col: 7, row: 8 },
};

/**
 * 4 Base token pedestal slots inside each corner yard (Step 0).
 */
export const BASE_SLOT_COORDINATES: Record<
  LudoColor,
  ReadonlyArray<BoardCoordinate>
> = {
  [LudoColor.RED]: [
    { col: 2, row: 2 },
    { col: 4, row: 2 },
    { col: 2, row: 4 },
    { col: 4, row: 4 },
  ],
  [LudoColor.GREEN]: [
    { col: 11, row: 2 },
    { col: 13, row: 2 },
    { col: 11, row: 4 },
    { col: 13, row: 4 },
  ],
  [LudoColor.YELLOW]: [
    { col: 11, row: 11 },
    { col: 13, row: 11 },
    { col: 11, row: 13 },
    { col: 13, row: 13 },
  ],
  [LudoColor.BLUE]: [
    { col: 2, row: 11 },
    { col: 4, row: 11 },
    { col: 2, row: 13 },
    { col: 4, row: 13 },
  ],
};

/**
 * Color definitions matching Ludo King's vibrant saturated palette.
 */
export const LUDO_COLOR_THEMES: Record<
  LudoColor,
  LudoColorTheme
> = {
  [LudoColor.RED]: {
    name: "Red",
    primary: "#E52521",
    secondary: "#C41411",
    light: "#FEE2E2",
    dark: "#881337",
    border: "#991B1B",
    glow: "rgba(229, 37, 33, 0.45)",
  },
  [LudoColor.GREEN]: {
    name: "Green",
    primary: "#009B3A",
    secondary: "#007A2E",
    light: "#DCFCE7",
    dark: "#14532D",
    border: "#166534",
    glow: "rgba(0, 155, 58, 0.45)",
  },
  [LudoColor.YELLOW]: {
    name: "Yellow",
    primary: "#F8B800",
    secondary: "#D99B00",
    light: "#FEF3C7",
    dark: "#78350F",
    border: "#B45309",
    glow: "rgba(248, 184, 0, 0.45)",
  },
  [LudoColor.BLUE]: {
    name: "Blue",
    primary: "#008CE3",
    secondary: "#0070B8",
    light: "#E0F2FE",
    dark: "#0C4A6E",
    border: "#0369A1",
    glow: "rgba(0, 140, 227, 0.45)",
  },
};
