import {
  BaseAction,
  BaseGameState,
  GameEvent,
  GameType,
} from "@repo/game-engine";

/**
 * Information extracted from verified JWT for the WebSocket connection.
 */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email?: string;
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
 * Individual Client Message Payloads.
 */
export interface JoinRoomClientMessage {
  type: ClientMessageType.JOIN_ROOM;
  roomId: string;
}

export interface LeaveRoomClientMessage {
  type: ClientMessageType.LEAVE_ROOM;
}

export interface StartGameClientMessage {
  type: ClientMessageType.START_GAME;
}

export interface GameActionClientMessage {
  type: ClientMessageType.GAME_ACTION;
  action: BaseAction;
}

export interface PingClientMessage {
  type: ClientMessageType.PING;
}

export type ClientMessage =
  | JoinRoomClientMessage
  | LeaveRoomClientMessage
  | StartGameClientMessage
  | GameActionClientMessage
  | PingClientMessage;

/**
 * Individual Server Message Payloads.
 */
export interface RoomJoinedServerMessage {
  type: ServerMessageType.ROOM_JOINED;
  roomId: string;
  gameType: GameType;
  gameConfig: Record<string, any>;
  players: RoomPlayerInfo[];
  isHost: boolean;
  maxPlayers: number;
}

export interface PlayerJoinedServerMessage {
  type: ServerMessageType.PLAYER_JOINED;
  player: RoomPlayerInfo;
}

export interface PlayerLeftServerMessage {
  type: ServerMessageType.PLAYER_LEFT;
  playerId: string;
}

export interface PlayerDisconnectedServerMessage {
  type: ServerMessageType.PLAYER_DISCONNECTED;
  playerId: string;
}

export interface PlayerReconnectedServerMessage {
  type: ServerMessageType.PLAYER_RECONNECTED;
  playerId: string;
}

export interface GameStartedServerMessage {
  type: ServerMessageType.GAME_STARTED;
  gameType: GameType;
  state: BaseGameState;
}

export interface GameStateUpdateServerMessage {
  type: ServerMessageType.GAME_STATE_UPDATE;
  gameType: GameType;
  state: BaseGameState;
}

export interface GameEventServerMessage {
  type: ServerMessageType.GAME_EVENT;
  event: GameEvent;
}

export interface ErrorServerMessage {
  type: ServerMessageType.ERROR;
  message: string;
}

export interface PongServerMessage {
  type: ServerMessageType.PONG;
}

export type ServerMessage =
  | RoomJoinedServerMessage
  | PlayerJoinedServerMessage
  | PlayerLeftServerMessage
  | PlayerDisconnectedServerMessage
  | PlayerReconnectedServerMessage
  | GameStartedServerMessage
  | GameStateUpdateServerMessage
  | GameEventServerMessage
  | ErrorServerMessage
  | PongServerMessage;
