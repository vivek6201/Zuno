import {
  BASE_SLOT_COORDINATES,
  BoardCoordinate,
  COLOR_START_OFFSETS,
  HOME_PATH_COORDINATES,
  HOME_TARGET_COORDINATES,
  SAFE_TILES,
  STEP_BASE,
  STEP_HOME,
  STEP_HOME_PATH_START,
  STEP_START,
  STEP_TRACK_EXIT,
  TOTAL_TRACK_TILES,
  TRACK_COORDINATES,
} from "./constants";
import { LudoColor, LudoPlayer, LudoToken, TokenZone } from "./types";

/**
 * Determines which zone a token is in based on its stepCount (0 to 57).
 */
export function getTokenZone(stepCount: number): TokenZone {
  if (stepCount === STEP_BASE) {
    return TokenZone.BASE;
  }
  if (stepCount >= STEP_START && stepCount <= STEP_TRACK_EXIT) {
    return TokenZone.TRACK;
  }
  if (stepCount >= STEP_HOME_PATH_START && stepCount < STEP_HOME) {
    return TokenZone.HOME_PATH;
  }
  return TokenZone.HOME;
}

/**
 * Translates a token's color and step count into its global index (0..51) on the outer circuit.
 * Returns null if the token is in BASE, HOME_PATH, or HOME.
 */
export function getGlobalTileIndex(color: LudoColor, stepCount: number): number | null {
  if (stepCount < STEP_START || stepCount > STEP_TRACK_EXIT) {
    return null;
  }
  const offset = COLOR_START_OFFSETS[color];
  return (offset + (stepCount - 1)) % TOTAL_TRACK_TILES;
}

/**
 * Returns true if the global tile index is one of the 8 safe squares.
 */
export function isSafeTile(globalTileIndex: number | null): boolean {
  if (globalTileIndex === null) {
    return false;
  }
  return SAFE_TILES.includes(globalTileIndex);
}

/**
 * Checks if a specific token can legally move with a given dice roll.
 */
export function canMoveToken(token: LudoToken, diceRoll: number): boolean {
  // 1. Tokens already finished in HOME cannot move
  if (token.zone === TokenZone.HOME) {
    return false;
  }

  // 2. Tokens in BASE require exactly a 6 to exit to START
  if (token.zone === TokenZone.BASE) {
    return diceRoll === 6;
  }

  // 3. Tokens on TRACK or HOME_PATH cannot overshoot HOME (step 57)
  const targetStep = token.stepCount + diceRoll;
  return targetStep <= STEP_HOME;
}

/**
 * Computes the new step count for a token given a dice roll.
 */
export function calculateNewStepCount(token: LudoToken, diceRoll: number): number {
  if (token.zone === TokenZone.BASE && diceRoll === 6) {
    return STEP_START; // Exits to step 1
  }
  return token.stepCount + diceRoll;
}

/**
 * Filters a player's tokens to find all that can legally move with the given roll.
 */
export function getMovableTokens(player: LudoPlayer, diceRoll: number): LudoToken[] {
  return player.tokens.filter((token) => canMoveToken(token, diceRoll));
}

/**
 * Detects if the moving token lands on and captures opponent tokens.
 * Safe squares are immune from captures.
 * Returns an array of all captured opponent tokens (supporting multiple captures if stacked).
 */
export function findCapturedTokens(
  movingToken: LudoToken,
  targetGlobalPosition: number | null,
  allPlayers: LudoPlayer[]
): LudoToken[] {
  // If not on the common track or on a safe square, no capture can happen
  if (targetGlobalPosition === null || isSafeTile(targetGlobalPosition)) {
    return [];
  }

  const captured: LudoToken[] = [];

  for (const player of allPlayers) {
    // Cannot capture your own pieces
    if (player.color === movingToken.color) {
      continue;
    }

    for (const opponentToken of player.tokens) {
      if (
        opponentToken.zone === TokenZone.TRACK &&
        opponentToken.globalPosition === targetGlobalPosition
      ) {
        captured.push(opponentToken);
      }
    }
  }

  return captured;
}

/**
 * Returns grid (col, row) for any token given its color, stepCount, and index.
 */
export function getTileCoordinate(
  color: LudoColor,
  stepCount: number,
  tokenIndex = 0,
): BoardCoordinate {
  // 1. BASE (step 0)
  if (stepCount === STEP_BASE) {
    const slots = BASE_SLOT_COORDINATES[color];
    return slots[tokenIndex % slots.length]!;
  }

  // 2. TRACK (step 1..51)
  if (stepCount >= STEP_START && stepCount <= STEP_TRACK_EXIT) {
    const globalIdx = (COLOR_START_OFFSETS[color] + (stepCount - 1)) % TOTAL_TRACK_TILES;
    return TRACK_COORDINATES[globalIdx]!;
  }

  // 3. HOME PATH (step 52..56)
  if (stepCount >= STEP_HOME_PATH_START && stepCount < STEP_HOME) {
    const pathIdx = stepCount - STEP_HOME_PATH_START;
    return HOME_PATH_COORDINATES[color][pathIdx]!;
  }

  // 4. HOME (step 57)
  return HOME_TARGET_COORDINATES[color];
}

/**
 * Returns the exact (x, y) center pixel coordinate on the board for a token.
 * Base pedestals (step 0) use exact pedestal centers (2, 4, 11, 13).
 * Track and home path tiles use the tile center (col + 0.5, row + 0.5).
 */
export function getTokenPixelCenter(
  color: LudoColor,
  stepCount: number,
  tokenIndex: number,
  cellSize: number,
): { x: number; y: number } {
  if (stepCount === STEP_BASE) {
    const slots = BASE_SLOT_COORDINATES[color];
    const slot = slots[tokenIndex % slots.length]!;
    return {
      x: slot.col * cellSize,
      y: slot.row * cellSize,
    };
  }

  const coord = getTileCoordinate(color, stepCount, tokenIndex);
  return {
    x: (coord.col + 0.5) * cellSize,
    y: (coord.row + 0.5) * cellSize,
  };
}

/**
 * Generates an array of pixel waypoints from fromStep to toStep for parabolic hopping.
 */
export function getHopWaypoints(
  color: LudoColor,
  fromStep: number,
  toStep: number,
  tokenIndex: number,
  cellSize: number,
): Array<{ x: number; y: number }> {
  const waypoints: Array<{ x: number; y: number }> = [];
  for (let s = fromStep + 1; s <= toStep; s++) {
    waypoints.push(getTokenPixelCenter(color, s, tokenIndex, cellSize));
  }
  return waypoints;
}
