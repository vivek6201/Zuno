import { GameManager } from "./game-manager";
import { GameType } from "./types";
import { LudoGameManager } from "../games/ludo/ludo-engine";
import { ChessGameManager } from "../games/chess/chess-manager";
import { UnoGameManager } from "../games/uno/uno-engine";
import { MatiksGameManager } from "../games/matiks/matiks-engine";

export interface GameTypeMetadata {
  type: GameType;
  displayName: string;
  minPlayers: number;
  maxPlayers: number;
  defaultMaxPlayers: number;
  supportsBots: boolean;
}

export const GAME_METADATA_MAP: Record<GameType, GameTypeMetadata> = {
  [GameType.LUDO]: {
    type: GameType.LUDO,
    displayName: "Ludo",
    minPlayers: 2,
    maxPlayers: 4,
    defaultMaxPlayers: 4,
    supportsBots: true,
  },
  [GameType.UNO]: {
    type: GameType.UNO,
    displayName: "Uno",
    minPlayers: 2,
    maxPlayers: 10,
    defaultMaxPlayers: 4,
    supportsBots: true,
  },
  [GameType.CHESS]: {
    type: GameType.CHESS,
    displayName: "Chess",
    minPlayers: 2,
    maxPlayers: 2,
    defaultMaxPlayers: 2,
    supportsBots: true,
  },
  [GameType.MATIKS]: {
    type: GameType.MATIKS,
    displayName: "Matiks",
    minPlayers: 2,
    maxPlayers: 4,
    defaultMaxPlayers: 4,
    supportsBots: false,
  },
};

/**
 * Factory creating authoritative game manager instances dynamically
 * based on selected GameType and game-specific config.
 */
export function createGameEngine(
  gameType: GameType,
  gameId: string,
  config: Record<string, any> = {}
): GameManager<any, any, any> {
  switch (gameType) {
    case GameType.LUDO:
      return new LudoGameManager({
        gameId,
        finishOnFirstWinner: config.finishOnFirstWinner ?? false,
        autoMoveSingleToken: config.autoMoveSingleToken ?? true,
        seed: config.seed,
      });

    case GameType.UNO:
      return new UnoGameManager({
        gameId,
        drawToMatch: config.drawToMatch ?? false,
        forcePlay: config.forcePlay ?? true,
        seed: config.seed,
      });

    case GameType.CHESS:
      return new ChessGameManager({
        gameId,
        timeControlSeconds: config.timeControlSeconds,
        incrementSeconds: config.incrementSeconds,
        seed: config.seed,
      });

    case GameType.MATIKS:
      return new MatiksGameManager({
        gameId,
        targetScore: config.targetScore,
        timeLimitSeconds: config.timeLimitSeconds,
        seed: config.seed,
      });

    default:
      throw new Error(`Unsupported game type: ${gameType}`);
  }
}
