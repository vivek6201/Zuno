/**
 * Core Game Status lifecycle enum.
 */
export enum GameStatus {
  LOBBY = "LOBBY",             // Waiting for players to join / ready up
  STARTING = "STARTING",       // Countdown or initial deal
  IN_PROGRESS = "IN_PROGRESS", // Active gameplay
  PAUSED = "PAUSED",           // Game paused (e.g. player reconnecting or timeout)
  FINISHED = "FINISHED",       // Game concluded with winner(s)
  ABORTED = "ABORTED",         // Cancelled before finishing (e.g. host quit)
}

/**
 * Supported game types across the platform.
 */
export enum GameType {
  LUDO = "LUDO",
  UNO = "UNO",
  CHESS = "CHESS",
  MATIKS = "MATIKS",
}

/**
 * Direction of play for turn-based games (crucial for Uno reverse cards).
 */
export enum TurnDirection {
  CLOCKWISE = 1,
  COUNTER_CLOCKWISE = -1,
}

/**
 * Standard lifecycle and turn events emitted by the core engine.
 */
export enum CoreGameEvent {
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  GAME_STARTED = "GAME_STARTED",
  GAME_PAUSED = "GAME_PAUSED",
  GAME_RESUMED = "GAME_RESUMED",
  GAME_FINISHED = "GAME_FINISHED",
  TURN_CHANGED = "TURN_CHANGED",
  TURN_DIRECTION_REVERSED = "TURN_DIRECTION_REVERSED",
}

/**
 * Base representation of any player in the platform.
 * Sub-games can extend this with game-specific player state
 * (e.g. tokens in Ludo, hand of cards in Uno, score in Matiks).
 */
export interface BasePlayer {
  id: string;
  name: string;
  isReady: boolean;
  isBot: boolean;
  isDisconnected: boolean;
}

/**
 * Standard Action interface. Every player move is an Action.
 */
export interface BaseAction<TType extends string = string, TPayload = any> {
  type: TType;
  playerId: string;
  payload?: TPayload;
  timestamp?: number;
}

/**
 * Result returned by action validation.
 */
export interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Core event structure emitted by the engine for UI animations,
 * sound effects, logs, or WebSocket broadcasts.
 */
export interface GameEvent<TType extends string = string, TPayload = any> {
  type: TType;
  payload: TPayload;
  timestamp: number;
}

/**
 * Minimal base game state every sub-game manager inherits.
 */
export interface BaseGameState<TPlayer extends BasePlayer = BasePlayer> {
  gameId: string;
  status: GameStatus;
  players: TPlayer[];
  currentTurnPlayerId: string | null;
  turnIndex: number;
  turnDirection: TurnDirection;
  winnerPlayerIds: string[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Listener callback for state changes.
 */
export type StateChangeListener<TState> = (state: TState, events: GameEvent[]) => void;
