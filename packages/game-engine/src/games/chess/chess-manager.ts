import { GameManager, GameManagerConfig } from "../../core/game-manager";
import { ActionResult, BaseAction, BaseGameState, BasePlayer, GameStatus, TurnDirection } from "../../core/types";

export enum ChessColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export interface ChessPlayer extends BasePlayer {
  color: ChessColor;
  timeRemainingMs?: number;
}

export interface ChessConfig extends GameManagerConfig {
  timeControlSeconds?: number;
  incrementSeconds?: number;
}

export enum ChessActionType {
  MOVE = "MOVE",
  RESIGN = "RESIGN",
  OFFER_DRAW = "OFFER_DRAW",
}

export interface ChessAction extends BaseAction<ChessActionType> {
  payload?: {
    from?: string;
    to?: string;
    promotion?: string;
  };
}

export interface ChessGameState extends BaseGameState<ChessPlayer> {
  fen: string;
  history: string[];
}

export class ChessGameManager extends GameManager<ChessGameState, ChessAction, ChessPlayer> {
  private config: ChessConfig;

  constructor(config: ChessConfig) {
    super(config);
    this.config = config;
  }

  protected initGameState(gameId: string): ChessGameState {
    return {
      gameId,
      status: GameStatus.LOBBY,
      players: [],
      currentTurnPlayerId: null,
      turnIndex: 0,
      turnDirection: TurnDirection.CLOCKWISE,
      winnerPlayerIds: [],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      history: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  protected validateAction(action: ChessAction): ActionResult {
    if (this.state.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: "Game is not in progress." };
    }
    if (this.state.currentTurnPlayerId !== action.playerId && action.type !== ChessActionType.RESIGN) {
      return { success: false, error: "Not your turn." };
    }
    return { success: true };
  }

  protected applyAction(action: ChessAction): void {
    if (action.type === ChessActionType.RESIGN) {
      const opponent = this.state.players.find((p) => p.id !== action.playerId);
      if (opponent) {
        this.state.winnerPlayerIds = [opponent.id];
      }
      return;
    }

    if (action.payload?.from && action.payload?.to) {
      this.state.history.push(`${action.payload.from}-${action.payload.to}`);
    }
    this.nextTurn();
  }

  protected checkWinCondition(): string[] | null {
    if (this.state.winnerPlayerIds.length > 0) {
      return this.state.winnerPlayerIds;
    }
    return null;
  }
}

export default ChessGameManager;