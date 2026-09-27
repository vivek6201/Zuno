import { AuthenticatedSocket, ServerMessageType } from "../types";
import { RoomManager } from "../room-manager";

export function handleJoinRoom(
  socket: AuthenticatedSocket,
  roomId: string,
  roomManager: RoomManager
): void {
  const user = socket.user;
  if (!user) return;

  const room = roomManager.getRoom(roomId);

  if (!room) {
    socket.roomId = undefined;
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: `Room '${roomId}' not found.`,
      })
    );
    return;
  }

  const result = room.addPlayer(user, socket);
  if (!result.success) {
    socket.roomId = undefined;
    socket.send(
      JSON.stringify({
        type: ServerMessageType.ERROR,
        message: result.error,
      })
    );
  }
}
