import { GameManager, GameManagerConfig } from "../../core/game-manager";
import { ActionResult, BaseAction, BaseGameState, BasePlayer, GameStatus, TurnDirection } from "../../core/types";

export enum UnoCardColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  WILD = "WILD",
}

export enum UnoActionType {
  PLAY_CARD = "PLAY_CARD",
  DRAW_CARD = "DRAW_CARD",
  CALL_UNO = "CALL_UNO",
}

export interface UnoCard {
  id: string;
  color: UnoCardColor;
  value: string;
}

export interface UnoPlayer extends BasePlayer {
  hand: UnoCard[];
  cardCount: number;
}

export interface UnoConfig extends GameManagerConfig {
  drawToMatch?: boolean; // Default false. If true, keep drawing until playable.
  forcePlay?: boolean;    // Default true. Must play drawn card if playable.
}

export interface UnoAction extends BaseAction<UnoActionType> {
  payload?: {
    cardId?: string;
    chosenColor?: UnoCardColor;
  };
}

export interface UnoGameState extends BaseGameState<UnoPlayer> {
  topCard: UnoCard | null;
  drawPileCount: number;
  currentColor: UnoCardColor | null;
}

export class UnoGameManager extends GameManager<UnoGameState, UnoAction, UnoPlayer> {
  private config: UnoConfig;

  constructor(config: UnoConfig) {
    super(config);
    this.config = config;
  }

  protected initGameState(gameId: string): UnoGameState {
    return {
      gameId,
      status: GameStatus.LOBBY,
      players: [],
      currentTurnPlayerId: null,
      turnIndex: 0,
      turnDirection: TurnDirection.CLOCKWISE,
      winnerPlayerIds: [],
      topCard: null,
      drawPileCount: 108,
      currentColor: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  protected validateAction(action: UnoAction): ActionResult {
    if (this.state.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: "Game is not in progress." };
    }
    if (this.state.currentTurnPlayerId !== action.playerId) {
      return { success: false, error: "Not your turn." };
    }
    return { success: true };
  }

  protected applyAction(_action: UnoAction): void {
    this.nextTurn();
  }

  protected checkWinCondition(): string[] | null {
    for (const player of this.state.players) {
      if (player.cardCount === 0 && this.state.status === GameStatus.IN_PROGRESS) {
        return [player.id];
      }
    }
    return null;
  }
}

export default UnoGameManager;