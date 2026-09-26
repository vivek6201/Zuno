import { AuthenticatedSocket, ClientMessage, ClientMessageType, ServerMessageType } from "../types";
import { RoomManager } from "../room-manager";
import { handleJoinRoom } from "./join-room";
import { handleStartGame } from "./start-game";
import { handleGameAction } from "./game-action";
import { handleLeaveRoom } from "./leave-room";
import { handleDisconnect } from "./disconnect";

export class SocketMessageHandler {
  constructor(private roomManager: RoomManager = RoomManager.getInstance()) {}

  /**
   * Routes incoming client messages to their respective message handler.
   */
  public handleMessage(socket: AuthenticatedSocket, message: ClientMessage): void {
    switch (message.type) {
      case ClientMessageType.PING: {
        socket.send(JSON.stringify({ type: ServerMessageType.PONG }));
        break;
      }

      case ClientMessageType.JOIN_ROOM: {
        handleJoinRoom(socket, message.roomId, this.roomManager);
        break;
      }

      case ClientMessageType.START_GAME: {
        handleStartGame(socket, this.roomManager);
        break;
      }

      case ClientMessageType.GAME_ACTION: {
        handleGameAction(socket, message.action, this.roomManager);
        break;
      }

      case ClientMessageType.LEAVE_ROOM: {
        handleLeaveRoom(socket, this.roomManager);
        break;
      }
    }
  }

  /**
   * Handles socket disconnect / close event.
   */
  public handleDisconnect(socket: AuthenticatedSocket): void {
    handleDisconnect(socket, this.roomManager);
  }
}

export * from "./join-room";
export * from "./start-game";
export * from "./game-action";
export * from "./leave-room";
export * from "./disconnect";