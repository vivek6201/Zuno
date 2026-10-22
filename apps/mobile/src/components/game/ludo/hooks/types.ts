import { Ludo } from "@repo/game-engine";

export type LudoColor = Ludo.LudoColor;
export const LudoColor = Ludo.LudoColor;
export type LudoGameState = Ludo.LudoGameState;
export type LudoTurnPhase = Ludo.LudoTurnPhase;
export const LudoTurnPhase = Ludo.LudoTurnPhase;
export const LudoActionType = Ludo.LudoActionType;
export const LudoGameEvent = Ludo.LudoGameEvent;
export type LudoGameManager = Ludo.LudoGameManager;
export const LudoGameManager = Ludo.LudoGameManager;

export type GameMode = "local" | "multiplayer";

export interface UseLudoGameReturn {
  gameState: LudoGameState | null;
  mode: GameMode;
  isMyTurn: boolean;
  activeColor: LudoColor;
  canRoll: boolean;
  canMove: boolean;
  rollDice: () => void;
  moveToken: (tokenId: string) => void;
  restartGame: () => void;
  leaveGame: () => void;
}

export interface UseLudoLocalProps {
  roomId?: string;
  playerCount?: number;
  localPlayerCount?: number;
  enabled?: boolean;
}

export interface UseLudoOnlineProps {
  roomId: string;
  enabled?: boolean;
}

export interface UseLudoGameProps {
  roomId: string;
  mode?: GameMode;
  localPlayerCount?: number;
  playerCount?: number;
}
