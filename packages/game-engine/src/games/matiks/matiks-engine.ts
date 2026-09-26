import { GameManager, GameManagerConfig } from "../../core/game-manager";
import { ActionResult, BaseAction, BaseGameState, BasePlayer, GameStatus, TurnDirection } from "../../core/types";

export interface MatiksPlayer extends BasePlayer {
  score: number;
}

export interface MatiksConfig extends GameManagerConfig {
  targetScore?: number;
  timeLimitSeconds?: number;
}

export enum MatiksActionType {
  SUBMIT_MATH_ANSWER = "SUBMIT_MATH_ANSWER",
  PASS = "PASS",
}

export interface MatiksAction extends BaseAction<MatiksActionType> {
  payload?: {
    answer?: number | string;
  };
}

export interface MatiksGameState extends BaseGameState<MatiksPlayer> {
  currentQuestion: string | null;
  targetScore: number;
}

export class MatiksGameManager extends GameManager<MatiksGameState, MatiksAction, MatiksPlayer> {
  private config: MatiksConfig;

  constructor(config: MatiksConfig) {
    super(config);
    this.config = config;
    if (config.targetScore) {
      this.state.targetScore = config.targetScore;
    }
  }

  protected initGameState(gameId: string): MatiksGameState {
    return {
      gameId,
      status: GameStatus.LOBBY,
      players: [],
      currentTurnPlayerId: null,
      turnIndex: 0,
      turnDirection: TurnDirection.CLOCKWISE,
      winnerPlayerIds: [],
      currentQuestion: null,
      targetScore: 100,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  protected validateAction(action: MatiksAction): ActionResult {
    if (this.state.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: "Game is not in progress." };
    }
    if (this.state.currentTurnPlayerId !== action.playerId) {
      return { success: false, error: "Not your turn." };
    }
    return { success: true };
  }

  protected applyAction(_action: MatiksAction): void {
    this.nextTurn();
  }

  protected checkWinCondition(): string[] | null {
    for (const player of this.state.players) {
      if (player.score >= this.state.targetScore) {
        return [player.id];
      }
    }
    return null;
  }
}

export default MatiksGameManager;