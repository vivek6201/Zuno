import { GameType } from "@repo/game-engine";
import { AuthenticatedSocket, ServerMessageType } from "../types";
import { RoomManager } from "../room-manager";

export function handleJoinRoom(
  socket: AuthenticatedSocket,
  roomId: string,
  roomManager: RoomManager
): void {
  const user = socket.user;
  if (!user) return;

  let room = roomManager.getRoom(roomId);

  if (!room) {
    // Create new room with this user as host
    room = roomManager.createRoom(user, GameType.LUDO, {}, 4, roomId);
  }

  const result = room.addPlayer(user, socket);
  if (!result.success) {
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: result.error,
      })
    );
  }
}
