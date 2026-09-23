import { EventEmitter } from "./event-emitter";
import { PRNG } from "./prng";
import { TurnManager } from "./turn-manager";
import {
  ActionResult,
  BaseAction,
  BaseGameState,
  BasePlayer,
  CoreGameEvent,
  GameEvent,
  GameStatus,
  StateChangeListener,
} from "./types";

export interface GameManagerConfig {
  gameId: string;
  seed?: number;
}

/**
 * Universal, Isomorphic Game Manager Base Class.
 * 
 * Works identically in:
 * - React Native (offline, local pass-and-play, or vs Bot)
 * - Web Browsers (offline or client-side prediction)
 * - Node / Bun (authoritative game server over WebSockets)
 */
export abstract class GameManager<
  TState extends BaseGameState<TPlayer>,
  TAction extends BaseAction,
  TPlayer extends BasePlayer = BasePlayer,
> {
  protected state: TState;
  protected prng: PRNG;
  protected events: EventEmitter;
  protected turnManager: TurnManager;
  private stateChangeListeners: Set<StateChangeListener<TState>> = new Set();
  private pendingEvents: GameEvent[] = [];

  constructor(config: GameManagerConfig) {
    this.prng = new PRNG(config.seed);
    this.events = new EventEmitter();
    this.turnManager = new TurnManager();

    // Initialize the default state defined by sub-class
    this.state = this.initGameState(config.gameId);
  }

  // ─── ABSTRACT METHODS (Must be implemented by each game) ──────────────────────

  /**
   * Initializes the initial game state for this specific game.
   */
  protected abstract initGameState(gameId: string): TState;

  /**
   * Validates if an action is legally permitted in the current game state.
   */
  protected abstract validateAction(action: TAction): ActionResult;

  /**
   * Mutates the state by executing the validated action.
   */
  protected abstract applyAction(action: TAction): void;

  /**
   * Evaluates if a player or team has won or drawn the game.
   * Returns an array of winner player IDs, or null if game is ongoing.
   */
  protected abstract checkWinCondition(): string[] | null;

  // ─── OPTIONAL HOOKS (Can be overridden by sub-games) ──────────────────────────

  /**
   * Hook called immediately when the game starts.
   * (e.g. dealing 7 cards each in Uno, placing pieces on board in Ludo).
   */
  protected onGameStart(): void {}

  /**
   * Hook called immediately after an action is applied and win check is performed.
   */
  protected afterAction(_action: TAction): void {}

  /**
   * Determines if an action is allowed out-of-turn.
   * (e.g., calling "Uno!", reacting with an emoji, or timed buzzer).
   */
  protected isOutOfTurnActionAllowed(_action: TAction): boolean {
    return false;
  }

  /**
   * Returns a sanitized view of the state for a specific player.
   * In open-information games (Ludo, Chess), this can return the full state.
   * In hidden-information games (Uno), this masks other players' hands.
   */
  public getPlayerView(_playerId: string): TState {
    return this.getState();
  }

  // ─── PLAYER LOBBY MANAGEMENT ──────────────────────────────────────────────────

  /**
   * Adds a new player to the game lobby.
   */
  public addPlayer(player: TPlayer): ActionResult {
    if (this.state.status !== GameStatus.LOBBY) {
      return { success: false, error: "Cannot add player: game has already started." };
    }

    if (this.state.players.some((p) => p.id === player.id)) {
      return { success: false, error: `Player ${player.id} is already in the game.` };
    }

    this.state.players.push(player);
    this.turnManager.setPlayers(this.state.players.map((p) => p.id));
    this.emitEvent(CoreGameEvent.PLAYER_JOINED, { player });
    this.notifyStateChange();

    return { success: true };
  }

  /**
   * Removes a player from the game.
   */
  public removePlayer(playerId: string): ActionResult {
    const index = this.state.players.findIndex((p) => p.id === playerId);
    if (index === -1) {
      return { success: false, error: "Player not found." };
    }

    const [removed] = this.state.players.splice(index, 1);
    this.turnManager.setPlayers(this.state.players.map((p) => p.id));
    this.state.currentTurnPlayerId = this.turnManager.getCurrentPlayerId();

    this.emitEvent(CoreGameEvent.PLAYER_LEFT, { player: removed });
    this.notifyStateChange();

    return { success: true };
  }

  /**
   * Toggle a player's ready state in the lobby.
   */
  public setPlayerReady(playerId: string, isReady: boolean): ActionResult {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "Player not found." };
    }

    player.isReady = isReady;
    this.notifyStateChange();
    return { success: true };
  }

  // ─── GAME LIFECYCLE ───────────────────────────────────────────────────────────

  /**
   * Starts the game if at least 2 players are present and game is in LOBBY.
   */
  public start(minPlayers = 2): ActionResult {
    if (this.state.status !== GameStatus.LOBBY) {
      return { success: false, error: "Game can only be started from LOBBY status." };
    }

    if (this.state.players.length < minPlayers) {
      return {
        success: false,
        error: `At least ${minPlayers} players are required to start the game.`,
      };
    }

    this.state.status = GameStatus.IN_PROGRESS;
    this.turnManager.setPlayers(this.state.players.map((p) => p.id));
    this.state.currentTurnPlayerId = this.turnManager.getCurrentPlayerId();
    this.state.turnIndex = this.turnManager.getCurrentIndex();
    this.state.turnDirection = this.turnManager.getDirection();

    // Call sub-game initialization hook
    this.onGameStart();

    this.emitEvent(CoreGameEvent.GAME_STARTED, {
      gameId: this.state.gameId,
      firstTurnPlayerId: this.state.currentTurnPlayerId,
    });
    this.notifyStateChange();

    return { success: true };
  }

  /**
   * Pauses the game.
   */
  public pause(): void {
    if (this.state.status === GameStatus.IN_PROGRESS) {
      this.state.status = GameStatus.PAUSED;
      this.emitEvent(CoreGameEvent.GAME_PAUSED, {});
      this.notifyStateChange();
    }
  }

  /**
   * Resumes a paused game.
   */
  public resume(): void {
    if (this.state.status === GameStatus.PAUSED) {
      this.state.status = GameStatus.IN_PROGRESS;
      this.emitEvent(CoreGameEvent.GAME_RESUMED, {});
      this.notifyStateChange();
    }
  }

  /**
   * Ends the game and crowns winner(s).
   */
  protected endGame(winnerPlayerIds: string[]): void {
    this.state.status = GameStatus.FINISHED;
    this.state.winnerPlayerIds = winnerPlayerIds;
    this.emitEvent(CoreGameEvent.GAME_FINISHED, { winners: winnerPlayerIds });
    this.notifyStateChange();
  }

  // ─── ACTION EXECUTION PIPELINE ────────────────────────────────────────────────

  /**
   * Central dispatch pipeline for all gameplay actions.
   */
  public dispatch(action: TAction): ActionResult {
    // 1. Lifecycle check
    if (this.state.status !== GameStatus.IN_PROGRESS) {
      return {
        success: false,
        error: `Action rejected: Game is currently ${this.state.status}.`,
      };
    }

    // 2. Turn check
    const isCurrentTurn = this.state.currentTurnPlayerId === action.playerId;
    if (!isCurrentTurn && !this.isOutOfTurnActionAllowed(action)) {
      return {
        success: false,
        error: `It is not player ${action.playerId}'s turn.`,
      };
    }

    // 3. Sub-game custom validation
    const validation = this.validateAction(action);
    if (!validation.success) {
      return validation;
    }

    // 4. Apply action mutation
    this.applyAction(action);
    this.state.updatedAt = Date.now();

    // 5. Check win condition
    const winners = this.checkWinCondition();
    if (winners && winners.length > 0) {
      this.endGame(winners);
      return { success: true };
    }

    // 6. Sub-game post-action hook
    this.afterAction(action);

    // 7. Sync turn status to state
    this.state.currentTurnPlayerId = this.turnManager.getCurrentPlayerId();
    this.state.turnIndex = this.turnManager.getCurrentIndex();
    this.state.turnDirection = this.turnManager.getDirection();

    // 8. Notify listeners and clear pending events
    this.notifyStateChange();

    return { success: true };
  }

  // ─── TURN SHORTCUTS ───────────────────────────────────────────────────────────

  /**
   * Advance to the next player's turn.
   */
  protected nextTurn(step = 1): void {
    const nextPlayerId = this.turnManager.nextTurn(step);
    this.state.currentTurnPlayerId = nextPlayerId;
    this.state.turnIndex = this.turnManager.getCurrentIndex();
    this.emitEvent(CoreGameEvent.TURN_CHANGED, { currentTurnPlayerId: nextPlayerId });
  }

  /**
   * Reverse turn direction (e.g. Uno reverse).
   */
  protected reverseTurn(): void {
    const newDirection = this.turnManager.reverse();
    this.state.turnDirection = newDirection;
    this.emitEvent(CoreGameEvent.TURN_DIRECTION_REVERSED, { direction: newDirection });
  }

  // ─── EVENTS & OBSERVERS ───────────────────────────────────────────────────────

  /**
   * Emit a game event. Events are buffered and delivered to subscribers upon state update.
   */
  protected emitEvent<TPayload = any>(eventType: string, payload: TPayload): void {
    const event = this.events.emit(eventType, payload);
    this.pendingEvents.push(event);
  }

  /**
   * Subscribe to state updates. Returns an unsubscribe function.
   * Perfect for React `useEffect` or React Native hooks!
   */
  public subscribe(listener: StateChangeListener<TState>): () => void {
    this.stateChangeListeners.add(listener);
    return () => {
      this.stateChangeListeners.delete(listener);
    };
  }

  /**
   * Notifies all state change subscribers.
   */
  protected notifyStateChange(): void {
    const snapshot = this.getState();
    const eventsToDeliver = [...this.pendingEvents];
    this.pendingEvents = [];

    for (const listener of this.stateChangeListeners) {
      listener(snapshot, eventsToDeliver);
    }
  }

  /**
   * Returns a deep-cloned readonly snapshot of current state to ensure
   * React/React Native components reliably detect state changes and re-render.
   */
  public getState(): Readonly<TState> {
    if (typeof structuredClone === "function") {
      return structuredClone(this.state);
    }
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Returns the underlying event emitter for direct event listening.
   */
  public getEventEmitter(): EventEmitter {
    return this.events;
  }

  // ─── SNAPSHOT & PERSISTENCE ───────────────────────────────────────────────────

  /**
   * Exports full state, PRNG, and turn state into a JSON string.
   * Can be saved to Redis, AsyncStorage, SQLite, or file system.
   */
  public exportSnapshot(): string {
    return JSON.stringify({
      state: this.state,
      turn: this.turnManager.exportState(),
      prng: this.prng.exportState(),
    });
  }

  /**
   * Restores a game state from a saved snapshot.
   */
  public loadSnapshot(json: string): void {
    const data = JSON.parse(json);
    this.state = data.state;
    this.turnManager.importState(data.turn);
    this.prng.importState(data.prng);
    this.notifyStateChange();
  }
}
