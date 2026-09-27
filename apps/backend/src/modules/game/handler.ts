import { Request, Response } from "express";
import { GameType } from "@repo/game-engine";
import {
  createRoomSchema,
  listRoomsQuerySchema,
  getRoomParamsSchema,
} from "@repo/common/validations/game";
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
    const result = await listRoomsQuerySchema.safeParseAsync(req.query);
    if (!result.success) {
      throw new BadRequestError(
        "Invalid query parameters",
        result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }))
      );
    }

    const filterGameType = result.data.gameType as GameType | undefined;
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

    const result = await createRoomSchema.safeParseAsync(req.body);
    if (!result.success) {
      throw new BadRequestError(
        "Invalid request body",
        result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }))
      );
    }

    const { gameType, gameConfig, maxPlayers } = result.data;

    const room = this.roomManager.createRoom(
      { id: user.id, name: user.name, email: user.email },
      gameType as GameType,
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
    const result = await getRoomParamsSchema.safeParseAsync(req.params);
    if (!result.success) {
      throw new BadRequestError(
        "Invalid route parameters",
        result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }))
      );
    }

    const { roomId } = result.data;
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