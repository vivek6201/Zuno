import { GameType, Matiks } from "@repo/game-engine";
import IGameHandler from "@/types/handler";
import { RoomParticipant } from "@/modules/game/room";

export class MatiksGameHandler implements IGameHandler<Matiks.MatiksPlayer, Matiks.MatiksGameState, Matiks.MatiksAction> {
  public readonly gameType = GameType.MATIKS;

  public assignPlayerColor(_slotIndex: number): string | undefined {
    return undefined;
  }

  public createEnginePlayer(participant: RoomParticipant): Matiks.MatiksPlayer {
    return {
      id: participant.user.id,
      name: participant.user.name,
      score: 0,
      isReady: participant.isReady,
      isBot: false,
      isDisconnected: !participant.isConnected,
    };
  }

  public createEngine(roomId: string, gameConfig: Record<string, any>): Matiks.MatiksGameManager {
    return new Matiks.MatiksGameManager({
      gameId: roomId,
      targetScore: gameConfig.targetScore,
      timeLimitSeconds: gameConfig.timeLimitSeconds,
      seed: gameConfig.seed,
    });
  }
}

export default new MatiksGameHandler();
