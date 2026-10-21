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

  public prepareParticipants(participants: RoomParticipant[]): void {
    if (participants.length === 2) {
      // 2-player Ludo: Opposite corners (Red vs Yellow) for balanced play
      participants[0]!.color = Ludo.LudoColor.RED;
      participants[1]!.color = Ludo.LudoColor.YELLOW;
    } else if (participants.length === 3) {
      // 3-player Ludo: Red, Green, Yellow
      participants[0]!.color = Ludo.LudoColor.RED;
      participants[1]!.color = Ludo.LudoColor.GREEN;
      participants[2]!.color = Ludo.LudoColor.YELLOW;
    } else if (participants.length >= 4) {
      participants[0]!.color = Ludo.LudoColor.RED;
      participants[1]!.color = Ludo.LudoColor.GREEN;
      participants[2]!.color = Ludo.LudoColor.YELLOW;
      participants[3]!.color = Ludo.LudoColor.BLUE;
    }
  }
}

export default new LudoGameHandler;
