import { AuthenticatedSocket, ServerMessageType } from "../types";
import { RoomManager } from "../room-manager";

export function handleStartGame(
  socket: AuthenticatedSocket,
  roomManager: RoomManager
): void {
  const user = socket.user;
  if (!user) return;

  if (!socket.roomId) {
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: "You are not in a room.",
      })
    );
    return;
  }

  const room = roomManager.getRoom(socket.roomId);
  if (!room) {
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: "Room not found.",
      })
    );
    return;
  }

  const result = room.startGame(user.id);
  if (!result.success) {
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: result.error,
      })
    );
  }
}
