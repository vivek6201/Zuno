import { Request, Response } from "express";
import { GameType } from "@repo/game-engine";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/errors";
import { ApiResponse } from "@/utils/response";
import { RoomManager } from "./room-manager";

export default class GameRouteHandler {
  private roomManager: RoomManager;

  constructor() {
    this.roomManager = RoomManager.getInstance();
  }

  /**
   * 1. List active rooms (with optional ?gameType= filter)
   */
  public listRooms = async (req: Request, res: Response): Promise<void> => {
    const rawGameType = req.query.gameType as string | undefined;
    let filterGameType: GameType | undefined;

    if (rawGameType) {
      if (!Object.values(GameType).includes(rawGameType as GameType)) {
        throw new BadRequestError(
          `Invalid gameType filter. Must be one of: ${Object.values(GameType).join(", ")}`
        );
      }
      filterGameType = rawGameType as GameType;
    }

    const rooms = this.roomManager.listRooms(filterGameType);
    ApiResponse.success(res, rooms, "Rooms fetched successfully");
  };

  /**
   * 2. Create room dynamically for specified game and config
   */
  public createRoom = async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const rawGameType = req.body?.gameType ?? GameType.LUDO;
    if (!Object.values(GameType).includes(rawGameType)) {
      throw new BadRequestError(
        `Invalid gameType. Must be one of: ${Object.values(GameType).join(", ")}`
      );
    }

    const gameType = rawGameType as GameType;
    const gameConfig = req.body?.gameConfig ?? {};
    const maxPlayers = req.body?.maxPlayers;

    const room = this.roomManager.createRoom(
      { id: user.id, name: user.name, email: user.email },
      gameType,
      gameConfig,
      maxPlayers
    );

    ApiResponse.success(
      res,
      {
        roomId: room.roomId,
        gameType: room.gameType,
        gameConfig: room.gameConfig,
        hostUserId: room.hostUserId,
        maxPlayers: room.maxPlayers,
      },
      "Room created successfully",
      201
    );
  };

  /**
   * 3. Get room info
   */
  public getRoom = async (req: Request, res: Response): Promise<void> => {
    const rawRoomId = req.params.roomId;
    const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId;
    if (!roomId) {
      throw new BadRequestError("roomId parameter is required");
    }

    const room = this.roomManager.getRoom(roomId);
    if (!room) {
      throw new NotFoundError("Room not found");
    }

    ApiResponse.success(
      res,
      {
        roomId: room.roomId,
        gameType: room.gameType,
        gameConfig: room.gameConfig,
        hostUserId: room.hostUserId,
        players: room.getPlayerList(),
        maxPlayers: room.maxPlayers,
      },
      "Room retrieved successfully"
    );
  };
}