import { TurnDirection } from "./types";

export interface TurnManagerSnapshot {
  playerIds: string[];
  currentIndex: number;
  direction: TurnDirection;
  turnCount: number;
}

/**
 * Handles round-robin player turns, turn direction (reverse), and skips.
 */
export class TurnManager {
  private playerIds: string[];
  private currentIndex: number;
  private direction: TurnDirection;
  private turnCount: number;

  constructor(
    playerIds: string[] = [],
    initialDirection: TurnDirection = TurnDirection.CLOCKWISE
  ) {
    this.playerIds = [...playerIds];
    this.currentIndex = 0;
    this.direction = initialDirection;
    this.turnCount = 1;
  }

  /**
   * Returns the player ID whose turn it is currently.
   */
  public getCurrentPlayerId(): string | null {
    if (this.playerIds.length === 0) return null;
    return this.playerIds[this.currentIndex] ?? null;
  }

  /**
   * Returns current 0-based turn index among the players array.
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Total number of turns executed so far in the game.
   */
  public getTurnCount(): number {
    return this.turnCount;
  }

  /**
   * Current direction enum.
   */
  public getDirection(): TurnDirection {
    return this.direction;
  }

  /**
   * Advances the turn to the next player.
   * @param step Number of players to advance (default 1; use 2 for Uno Skip card).
   */
  public nextTurn(step = 1): string | null {
    if (this.playerIds.length === 0) return null;

    const count = this.playerIds.length;
    // Calculate new index considering direction and step count
    const delta = (this.direction * step) % count;
    this.currentIndex = (this.currentIndex + delta + count) % count;
    this.turnCount++;

    return this.getCurrentPlayerId();
  }

  /**
   * Reverses the turn direction (e.g. Uno Reverse card).
   */
  public reverse(): TurnDirection {
    this.direction =
      this.direction === TurnDirection.CLOCKWISE
        ? TurnDirection.COUNTER_CLOCKWISE
        : TurnDirection.CLOCKWISE;
    return this.direction;
  }

  /**
   * Sets the turn to a specific player ID.
   */
  public setTurn(playerId: string): boolean {
    const index = this.playerIds.indexOf(playerId);
    if (index === -1) return false;
    this.currentIndex = index;
    return true;
  }

  /**
   * Update the active players list (e.g., if a player leaves or is eliminated).
   */
  public setPlayers(playerIds: string[]): void {
    const currentId = this.getCurrentPlayerId();
    this.playerIds = [...playerIds];

    if (currentId && this.playerIds.includes(currentId)) {
      this.currentIndex = this.playerIds.indexOf(currentId);
    } else {
      this.currentIndex = 0;
    }
  }

  /**
   * Export turn manager state for serialization / persistence.
   */
  public exportState(): TurnManagerSnapshot {
    return {
      playerIds: [...this.playerIds],
      currentIndex: this.currentIndex,
      direction: this.direction,
      turnCount: this.turnCount,
    };
  }

  /**
   * Restore turn manager state from a snapshot.
   */
  public importState(snapshot: TurnManagerSnapshot): void {
    this.playerIds = [...snapshot.playerIds];
    this.currentIndex = snapshot.currentIndex;
    this.direction = snapshot.direction;
    this.turnCount = snapshot.turnCount;
  }
}
