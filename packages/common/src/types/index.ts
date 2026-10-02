import { GameType } from "../validation/game";

/**
 * Client-facing game catalog configuration.
 */
export type GameSlug = "ludo" | "uno" | "matiks" | "chess";

export type PlayMode = "online" | "local" | "ai";

export interface GameCatalogItem {
  id: GameSlug;
  type: GameType;
  title: string;
  subtitle: string;
  playersText: string;
  supportedModes: PlayMode[];
  badgeColor?: string;
}

/**
 * User Profile & Gamification Stats.
 */
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  streak: number;
}

/**
 * Match History records displayed on the History tab.
 */
export type MatchResult = "won" | "lost";

export interface MatchHistoryItem {
  id: string;
  gameType: GameSlug;
  opponents: string[];
  playersCount: number;
  playedAt: string; // ISO date string or formatted label
  result: MatchResult;
}

/**
 * Lobby Room Summary displayed on Multiplayer Lobby.
 */
export interface LobbyRoomSummary {
  id: string;
  name: string;
  hostName: string;
  roomCode: string;
  gameType: GameSlug;
  currentPlayers: number;
  maxPlayers: number;
  isPrivate: boolean;
  status: "waiting" | "in_progress" | "full";
}
