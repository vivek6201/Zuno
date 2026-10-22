import { GameEvent, Ludo } from "@repo/game-engine";
import { ludoSound } from "../utils/ludo-sound";

const LudoGameEvent = Ludo.LudoGameEvent;

/**
 * Dispatches audio and haptics in response to Ludo engine domain events.
 */
export const handleLudoDomainEvents = (events: GameEvent[]) => {
  for (const evt of events) {
    switch (evt.type) {
      case LudoGameEvent.DICE_ROLLED:
        ludoSound.playDiceRoll();
        break;
      case LudoGameEvent.TOKEN_MOVED:
        ludoSound.playPieceStep();
        break;
      case LudoGameEvent.PIECE_CAPTURED:
        ludoSound.playPieceCapture();
        break;
      case LudoGameEvent.TOKEN_REACHED_HOME:
        ludoSound.playHomeEntry();
        break;
      case LudoGameEvent.BONUS_TURN_AWARDED:
        ludoSound.playBonusTurn();
        break;
      case LudoGameEvent.SAFE_SQUARE_REACHED:
        ludoSound.playSafeSquare();
        break;
    }
  }
};

/**
 * Triggers victory celebration audio if the game has completed.
 */
export const triggerLudoVictorySound = (status?: string) => {
  if (status === "FINISHED") {
    ludoSound.playVictory();
  }
};
