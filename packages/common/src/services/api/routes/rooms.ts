import { AxiosRequestConfig } from "axios";
import { api } from "../client";
import { ApiResponse, ApiSuccessResponse } from "../types";
import {
  CreateRoomInput,
  ListRoomsQueryInput,
  GameType,
} from "../../../validation/game";

export const ROOM_ROUTES = {
  BASE: "/rooms",
  BY_ID: (roomId: string) => `/rooms/${roomId}`,
} as const;

export interface RoomPlayer {
  id: string;
  name: string;
  email?: string;
  ready?: boolean;
  seatIndex?: number;
}

export interface RoomListItem {
  roomId: string;
  gameType: GameType;
  gameConfig: Record<string, any>;
  hostUserId: string;
  maxPlayers: number;
  playerCount?: number;
  status?: string;
}

export interface CreatedRoomData {
  roomId: string;
  gameType: GameType;
  gameConfig: Record<string, any>;
  hostUserId: string;
  maxPlayers: number;
}

export interface RoomDetailsData {
  roomId: string;
  gameType: GameType;
  gameConfig: Record<string, any>;
  hostUserId: string;
  players: RoomPlayer[];
  maxPlayers: number;
}

export type ListRoomsResponse = ApiSuccessResponse<RoomListItem[]>;
export type CreateRoomResponse = ApiSuccessResponse<CreatedRoomData>;
export type GetRoomResponse = ApiSuccessResponse<RoomDetailsData>;

export type ListRoomsApiResponse = ApiResponse<RoomListItem[]>;
export type CreateRoomApiResponse = ApiResponse<CreatedRoomData>;
export type GetRoomApiResponse = ApiResponse<RoomDetailsData>;


export const roomRoutes = {
  /**
   * List active game rooms with optional ?gameType= filter.
   */
  list: (
    query?: ListRoomsQueryInput,
    config?: AxiosRequestConfig
  ): Promise<ListRoomsResponse> =>
    api.get<ListRoomsResponse>(ROOM_ROUTES.BASE, {
      ...config,
      params: { ...query, ...config?.params },
    }),

  /**
   * Create a new room with configuration.
   */
  create: (
    data: CreateRoomInput,
    config?: AxiosRequestConfig
  ): Promise<CreateRoomResponse> =>
    api.post<CreateRoomResponse>(ROOM_ROUTES.BASE, data, config),

  /**
   * Get room metadata, game configuration, and current players.
   */
  getById: (
    roomId: string,
    config?: AxiosRequestConfig
  ): Promise<GetRoomResponse> =>
    api.get<GetRoomResponse>(ROOM_ROUTES.BY_ID(roomId), config),
};
