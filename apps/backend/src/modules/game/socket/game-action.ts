import { BaseAction } from "@repo/game-engine";
import { AuthenticatedSocket, ServerMessageType } from "../types";
import { RoomManager } from "../room-manager";

export function handleGameAction(
  socket: AuthenticatedSocket,
  action: BaseAction,
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

  room.handleAction(user.id, action);
}
