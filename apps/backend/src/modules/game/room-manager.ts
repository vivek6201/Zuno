import { GameType } from "@repo/game-engine";
import { AuthenticatedUser } from "./types";
import { Room } from "./room";

export interface RoomSummary {
  roomId: string;
  gameType: GameType;
  gameConfig: Record<string, any>;
  hostUserId: string;
  playerCount: number;
  maxPlayers: number;
}

/**
 * Singleton manager coordinating all active game rooms.
 */
export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Room> = new Map();

  private constructor() {}

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  /**
   * Generates a clean 6-character alphanumeric room code.
   */
  public generateRoomId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (this.rooms.has(code)) {
      return this.generateRoomId();
    }
    return code;
  }

  /**
   * Creates a new game room hosted by the user for a specific game type and config.
   */
  public createRoom(
    hostUser: AuthenticatedUser,
    gameType: GameType = GameType.LUDO,
    gameConfig: Record<string, any> = {},
    maxPlayers?: number,
    customRoomId?: string
  ): Room {
    const roomId = customRoomId || this.generateRoomId();
    const room = new Room(roomId, hostUser, gameType, gameConfig, maxPlayers);
    this.rooms.set(roomId, room);
    return room;
  }

  /**
   * Retrieves an active room by ID.
   */
  public getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) ?? null;
  }

  /**
   * Removes and cleans up an empty or concluded room.
   */
  public removeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.destroy();
      this.rooms.delete(roomId);
    }
  }

  /**
   * Lists active rooms for lobby browsing, with optional gameType filtering.
   */
  public listRooms(filterGameType?: GameType): RoomSummary[] {
    let list = Array.from(this.rooms.values());
    if (filterGameType) {
      list = list.filter((r) => r.gameType === filterGameType);
    }

    return list.map((room) => ({
      roomId: room.roomId,
      gameType: room.gameType,
      gameConfig: room.gameConfig,
      hostUserId: room.hostUserId,
      playerCount: room.getPlayerCount(),
      maxPlayers: room.maxPlayers,
    }));
  }
}
