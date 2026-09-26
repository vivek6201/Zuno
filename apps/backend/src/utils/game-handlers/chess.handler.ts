import { Chess, GameType } from "@repo/game-engine";
import IGameHandler from "@/types/handler";
import { RoomParticipant } from "@/modules/game/room";

export class ChessGameHandler implements IGameHandler<Chess.ChessPlayer, Chess.ChessGameState, Chess.ChessAction> {
  public readonly gameType = GameType.CHESS;

  public assignPlayerColor(slotIndex: number): string | undefined {
    return slotIndex === 0 ? Chess.ChessColor.WHITE : Chess.ChessColor.BLACK;
  }

  public createEnginePlayer(participant: RoomParticipant): Chess.ChessPlayer {
    return {
      id: participant.user.id,
      name: participant.user.name,
      color: (participant.color as Chess.ChessColor) ?? Chess.ChessColor.WHITE,
      isReady: participant.isReady,
      isBot: false,
      isDisconnected: !participant.isConnected,
    };
  }

  public createEngine(roomId: string, gameConfig: Record<string, any>): Chess.ChessGameManager {
    return new Chess.ChessGameManager({
      gameId: roomId,
      timeControlSeconds: gameConfig.timeControlSeconds,
      incrementSeconds: gameConfig.incrementSeconds,
      seed: gameConfig.seed,
    });
  }
}

export default new ChessGameHandler();
