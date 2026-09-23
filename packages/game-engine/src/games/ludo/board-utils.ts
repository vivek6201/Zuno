import {
  COLOR_START_OFFSETS,
  SAFE_TILES,
  STEP_BASE,
  STEP_HOME,
  STEP_HOME_PATH_START,
  STEP_START,
  STEP_TRACK_EXIT,
  TOTAL_TRACK_TILES,
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
