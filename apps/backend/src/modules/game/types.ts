import { BaseAction, BaseGameState, GameEvent, GameType } from "@repo/game-engine";
import { WebSocket } from "ws";

/**
 * Information extracted from verified JWT for the WebSocket connection.
 */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email?: string;
}

/**
 * Augmented WebSocket instance containing authentication and room metadata.
 */
export interface AuthenticatedSocket extends WebSocket {
  user?: AuthenticatedUser;
  roomId?: string;
  isAlive?: boolean;
}

/**
 * Summary of a player inside a room lobby.
 */
export interface RoomPlayerInfo {
  id: string;
  name: string;
  color?: string;
  slotIndex: number;
  isReady: boolean;
  isConnected: boolean;
  isHost: boolean;
}

/**
 * Client-to-Server incoming message types.
 */
export enum ClientMessageType {
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  START_GAME = "START_GAME",
  GAME_ACTION = "GAME_ACTION",
  PING = "PING",
}

/**
 * Server-to-Client outgoing message types.
 */
export enum ServerMessageType {
  ROOM_JOINED = "ROOM_JOINED",
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
  PLAYER_RECONNECTED = "PLAYER_RECONNECTED",
  GAME_STARTED = "GAME_STARTED",
  GAME_STATE_UPDATE = "GAME_STATE_UPDATE",
  GAME_EVENT = "GAME_EVENT",
  ERROR = "ERROR",
  PONG = "PONG",
}

/**
 * Client Message Payloads.
 */
export type ClientMessage =
  | { type: ClientMessageType.JOIN_ROOM; roomId: string }
  | { type: ClientMessageType.LEAVE_ROOM }
  | { type: ClientMessageType.START_GAME }
  | { type: ClientMessageType.GAME_ACTION; action: BaseAction }
  | { type: ClientMessageType.PING };

/**
 * Server Message Payloads.
 */
export type ServerMessage =
  | {
      type: ServerMessageType.ROOM_JOINED;
      roomId: string;
      gameType: GameType;
      gameConfig: Record<string, any>;
      players: RoomPlayerInfo[];
      isHost: boolean;
      maxPlayers: number;
    }
  | { type: ServerMessageType.PLAYER_JOINED; player: RoomPlayerInfo }
  | { type: ServerMessageType.PLAYER_LEFT; playerId: string }
  | { type: ServerMessageType.PLAYER_DISCONNECTED; playerId: string }
  | { type: ServerMessageType.PLAYER_RECONNECTED; playerId: string }
  | { type: ServerMessageType.GAME_STARTED; gameType: GameType; state: BaseGameState }
  | { type: ServerMessageType.GAME_STATE_UPDATE; gameType: GameType; state: BaseGameState }
  | { type: ServerMessageType.GAME_EVENT; event: GameEvent }
  | { type: ServerMessageType.ERROR; message: string }
  | { type: ServerMessageType.PONG };
