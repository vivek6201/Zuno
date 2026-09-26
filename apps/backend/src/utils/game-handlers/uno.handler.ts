import { GameType, Uno } from "@repo/game-engine";
import IGameHandler from "@/types/handler";
import { RoomParticipant } from "@/modules/game/room";

export class UnoGameHandler implements IGameHandler<Uno.UnoPlayer, Uno.UnoGameState, Uno.UnoAction> {
  public readonly gameType = GameType.UNO;

  public assignPlayerColor(_slotIndex: number): string | undefined {
    return undefined;
  }

  public createEnginePlayer(participant: RoomParticipant): Uno.UnoPlayer {
    return {
      id: participant.user.id,
      name: participant.user.name,
      hand: [],
      cardCount: 0,
      isReady: participant.isReady,
      isBot: false,
      isDisconnected: !participant.isConnected,
    };
  }

  public createEngine(roomId: string, gameConfig: Record<string, any>): Uno.UnoGameManager {
    return new Uno.UnoGameManager({
      gameId: roomId,
      drawToMatch: gameConfig.drawToMatch ?? false,
      forcePlay: gameConfig.forcePlay ?? true,
      seed: gameConfig.seed,
    });
  }
}

export default new UnoGameHandler();
