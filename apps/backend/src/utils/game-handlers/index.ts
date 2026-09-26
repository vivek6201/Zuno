import ludoHandler from "./ludo.handler";
import chessHandler from "./chess.handler";
import unoHandler from "./uno.handler";
import matiksHandler from "./matiks.handler";
import { GameType } from "@repo/game-engine";
import IGameHandler from "@/types/handler";

const HANDLERS: Record<GameType, IGameHandler> = {
  [GameType.LUDO]: ludoHandler,
  [GameType.CHESS]: chessHandler,
  [GameType.UNO]: unoHandler,
  [GameType.MATIKS]: matiksHandler,
};

/**
 * Returns the modular game handler for the specified GameType.
 */
export function getGameHandler(gameType: GameType): IGameHandler {
  const handler = HANDLERS[gameType];
  if (!handler) {
    throw new Error(`No game handler registered for GameType: ${gameType}`);
  }
  return handler;
}

export { default as ludoHandler } from "./ludo.handler";
export { default as chessHandler } from "./chess.handler";
export { default as unoHandler } from "./uno.handler";
export { default as matiksHandler } from "./matiks.handler";
