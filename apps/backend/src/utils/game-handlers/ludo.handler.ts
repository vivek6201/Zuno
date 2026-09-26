import { GameType, Ludo } from "@repo/game-engine";
import { RoomParticipant } from "@/modules/game/room";
import IGameHandler from "@/types/handler";

export class LudoGameHandler implements IGameHandler<Ludo.LudoPlayer, Ludo.LudoGameState, Ludo.LudoAction> {
  public readonly gameType = GameType.LUDO;

  public assignPlayerColor(slotIndex: number, currentParticipants: RoomParticipant[]): string | undefined {
    const usedColors = currentParticipants.map((p) => p.color);
    const availableColor = Ludo.LUDO_COLORS.find((c: Ludo.LudoColor) => !usedColors.includes(c));
    return availableColor ?? Ludo.LUDO_COLORS[slotIndex % Ludo.LUDO_COLORS.length];
  }

  public createEnginePlayer(participant: RoomParticipant): Ludo.LudoPlayer {
    return {
      id: participant.user.id,
      name: participant.user.name,
      color: (participant.color as Ludo.LudoColor) ?? Ludo.LudoColor.RED,
      tokens: [],
      rank: null,
      isReady: participant.isReady,
      isBot: false,
      isDisconnected: !participant.isConnected,
    };
  }

  public createEngine(roomId: string, gameConfig: Record<string, any>): Ludo.LudoGameManager {
    return new Ludo.LudoGameManager({
      gameId: roomId,
      finishOnFirstWinner: gameConfig.finishOnFirstWinner ?? false,
      autoMoveSingleToken: gameConfig.autoMoveSingleToken ?? true,
      seed: gameConfig.seed,
    });
  }
}

export default new LudoGameHandler;
