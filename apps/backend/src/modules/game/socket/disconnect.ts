import { AuthenticatedSocket } from "../types";
import { RoomManager } from "../room-manager";

export function handleDisconnect(
  socket: AuthenticatedSocket,
  roomManager: RoomManager
): void {
  const user = socket.user;
  if (!user) return;

  if (socket.roomId) {
    const room = roomManager.getRoom(socket.roomId);
    if (room) {
      room.handleDisconnect(user.id);
      if (room.isEmpty()) {
        roomManager.removeRoom(socket.roomId);
      }
    }
  }
}
