import { GameManagerConfig } from "../../core/game-manager";
import { BaseAction, BaseGameState, BasePlayer } from "../../core/types";

/**
 * Configuration options for a Ludo game instance.
 */
export interface LudoConfig extends GameManagerConfig {
  finishOnFirstWinner?: boolean; // Default true. If false, continues for 2nd and 3rd ranks.
  autoMoveSingleToken?: boolean; // Default false. If true, auto-moves when only 1 token is movable.
}

/**
 * The 4 player colors in Ludo.
 */
export enum LudoColor {
  RED = "RED",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  BLUE = "BLUE",
}

/**
 * The 4 distinct zones where a token can be located:
 * - BASE: Waiting in starting yard (stepCount = 0)
 * - TRACK: Moving on the 52-tile common circuit (stepCount 1..51)
 * - HOME_PATH: In the safe 5-tile colored corridor (stepCount 52..56)
 * - HOME: Successfully reached the center goal (stepCount = 57)
 */
export enum TokenZone {
  BASE = "BASE",
  TRACK = "TRACK",
  HOME_PATH = "HOME_PATH",
  HOME = "HOME",
}

/**
 * The two phases of a turn in Ludo.
 */
export enum LudoTurnPhase {
  AWAITING_DICE_ROLL = "AWAITING_DICE_ROLL",
  AWAITING_TOKEN_MOVE = "AWAITING_TOKEN_MOVE",
}

/**
 * Action type identifiers for Ludo.
 */
export enum LudoActionType {
  ROLL_DICE = "ROLL_DICE",
  MOVE_TOKEN = "MOVE_TOKEN",
}

/**
 * Domain events emitted by the Ludo engine for UI animations, audio, and network sync.
 */
export enum LudoGameEvent {
  DICE_ROLLED = "DICE_ROLLED",
  TOKEN_MOVED = "TOKEN_MOVED",
  PIECE_CAPTURED = "PIECE_CAPTURED",
  TOKEN_REACHED_HOME = "TOKEN_REACHED_HOME",
  BONUS_TURN_AWARDED = "BONUS_TURN_AWARDED",
  THREE_SIXES_PENALTY = "THREE_SIXES_PENALTY",
  NO_LEGAL_MOVES = "NO_LEGAL_MOVES",
}

/**
 * Represents a single piece/token on the board.
 */
export interface LudoToken {
  id: string;                    // e.g. "RED_0", "GREEN_2"
  color: LudoColor;
  index: number;                  // 0, 1, 2, or 3
  stepCount: number;             // 0 to 57
  zone: TokenZone;
  globalPosition: number | null; // 0..51 when on TRACK, null otherwise
}

/**
 * Represents a Ludo player. Extends BasePlayer from core.
 */
export interface LudoPlayer extends BasePlayer {
  color: LudoColor;
  tokens: LudoToken[];
  rank: number | null;           // 1 for 1st place, 2 for 2nd, etc.
}

/**
 * The full game state for a Ludo match.
 */
export interface LudoGameState extends BaseGameState<LudoPlayer> {
  phase: LudoTurnPhase;
  currentDice: number | null;     // Value of last dice roll (1..6)
  consecutiveSixes: number;       // Tracks 6s in a row (3 sixes rule)
  movableTokenIds: string[];      // IDs of tokens legally allowed to move with currentDice
  hasBonusTurn: boolean;          // True if player earned an extra roll (e.g. rolled 6, captured a piece)
}

/**
 * Action: Roll the dice
 */
export interface RollDiceAction extends BaseAction<LudoActionType.ROLL_DICE> {
  type: LudoActionType.ROLL_DICE;
  playerId: string;
}

/**
 * Action: Select and move a token
 */
export interface MoveTokenAction extends BaseAction<LudoActionType.MOVE_TOKEN, { tokenId: string }> {
  type: LudoActionType.MOVE_TOKEN;
  playerId: string;
  payload: {
    tokenId: string;
  };
}

/**
 * Union of all legal player actions in Ludo.
 */
export type LudoAction = RollDiceAction | MoveTokenAction;
