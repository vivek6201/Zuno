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
