export type SupportedGameId = "ludo" | "chess" | "uno" | "matiks";
export type GameMode = "local" | "multiplayer";

export interface GameCapabilities {
  id: SupportedGameId;
  title: string;
  supportsLocal: boolean;
  supportsOnline: boolean;
  defaultPlayerCount: number;
  minPlayers: number;
  maxPlayers: number;
}

/**
 * Static registry of capabilities and supported game modes per game.
 * Note: UNO and Matiks only support online mode; Ludo and Chess support both local and online.
 */
export const GAME_CAPABILITIES: Record<SupportedGameId, GameCapabilities> = {
  ludo: {
    id: "ludo",
    title: "Ludo",
    supportsLocal: true,
    supportsOnline: true,
    defaultPlayerCount: 4,
    minPlayers: 2,
    maxPlayers: 4,
  },
  chess: {
    id: "chess",
    title: "Chess",
    supportsLocal: true,
    supportsOnline: true,
    defaultPlayerCount: 2,
    minPlayers: 2,
    maxPlayers: 2,
  },
  uno: {
    id: "uno",
    title: "UNO",
    supportsLocal: false,
    supportsOnline: true,
    defaultPlayerCount: 4,
    minPlayers: 2,
    maxPlayers: 4,
  },
  matiks: {
    id: "matiks",
    title: "Matiks",
    supportsLocal: false,
    supportsOnline: true,
    defaultPlayerCount: 4,
    minPlayers: 2,
    maxPlayers: 4,
  },
};

/**
 * Normalizes any incoming string or game type into a validated SupportedGameId.
 */
export const normalizeGameId = (gameId?: string | null): SupportedGameId => {
  if (!gameId) return "ludo";
  const lower = gameId.toLowerCase().trim();
  if (lower in GAME_CAPABILITIES) {
    return lower as SupportedGameId;
  }
  return "ludo";
};

/**
 * Retrieves the capabilities specification for a given game identifier.
 */
export const getGameCapabilities = (gameId?: string | null): GameCapabilities => {
  const normalized = normalizeGameId(gameId);
  return GAME_CAPABILITIES[normalized];
};
