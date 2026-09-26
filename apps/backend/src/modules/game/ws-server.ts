import http from "node:http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import UserService from "@/modules/users/service";
import { RoomManager } from "./room-manager";
import {
  AuthenticatedSocket,
  AuthenticatedUser,
  ClientMessage,
  ClientMessageType,
  ServerMessageType,
} from "./types";
import { SocketMessageHandler } from "./socket";

interface JwtPayload {
  sub: string;
  email: string;
}

export class GameWebSocketServer {
  private wss: WebSocketServer;
  private roomManager: RoomManager;
  private userService: UserService;
  private messageHandler: SocketMessageHandler;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(server: http.Server, private readonly jwtSecret: string) {
    this.roomManager = RoomManager.getInstance();
    this.userService = new UserService();
    this.messageHandler = new SocketMessageHandler(this.roomManager);

    // Create WebSocket server in noServer mode so we intercept the HTTP upgrade event
    this.wss = new WebSocketServer({ noServer: true });

    this.setupUpgradeHandler(server);
    this.setupConnectionHandler();
    this.setupHeartbeat();
  }

  /**
   * Intercepts HTTP upgrade requests matching path `/ws` and authenticates via JWT.
   */
  private setupUpgradeHandler(server: http.Server): void {
    server.on("upgrade", async (request, socket, head) => {
      try {
        const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);

        // Only handle `/ws` route
        if (url.pathname !== "/ws") {
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
          socket.destroy();
          return;
        }

        // 1. Extract token and roomId from query params
        const token = url.searchParams.get("token");
        const roomId = url.searchParams.get("roomId");

        if (!token) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }

        // 2. Verify JWT signature
        let payload: JwtPayload;
        try {
          payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
        } catch {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }

        // 3. Resolve user details
        let authenticatedUser: AuthenticatedUser | null = null;
        try {
          const dbUser = await this.userService.getById(payload.sub);
          if (dbUser) {
            authenticatedUser = {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
            };
          }
        } catch {
          // Fallback if user information was embedded directly in token
          if ((payload as any).name || payload.email) {
            authenticatedUser = {
              id: payload.sub,
              name: (payload as any).name || payload.email.split("@")[0] || "Player",
              email: payload.email,
            };
          }
        }

        if (!authenticatedUser) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }

        // 4. Upgrade connection to WebSocket
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          const authSocket = ws as AuthenticatedSocket;
          authSocket.user = authenticatedUser;
          authSocket.roomId = roomId || undefined;
          authSocket.isAlive = true;

          this.wss.emit("connection", authSocket, request);
        });
      } catch (err) {
        socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
        socket.destroy();
      }
    });
  }

  /**
   * Sets up event listeners for newly connected WebSocket clients.
   */
  private setupConnectionHandler(): void {
    this.wss.on("connection", (socket: AuthenticatedSocket) => {
      const user = socket.user!;
      socket.isAlive = true;

      // Pong response for heartbeat
      socket.on("pong", () => {
        socket.isAlive = true;
      });

      // If initial connection specified a roomId, join it immediately
      if (socket.roomId) {
        this.messageHandler.handleMessage(socket, {
          type: ClientMessageType.JOIN_ROOM,
          roomId: socket.roomId,
        });
      }

      // Handle incoming messages from client
      socket.on("message", (data) => {
        try {
          const message: ClientMessage = JSON.parse(data.toString());
          this.messageHandler.handleMessage(socket, message);
        } catch (err) {
          socket.send(
            JSON.stringify({
              type: ServerMessageType.ERROR,
              message: "Invalid JSON message format.",
            })
          );
        }
      });

      // Handle socket closure
      socket.on("close", () => {
        this.messageHandler.handleDisconnect(socket);
      });

      socket.on("error", (err) => {
        console.error(`WebSocket error for user ${user.id}:`, err);
      });
    });
  }

  /**
   * Heartbeat to prevent zombie connections.
   */
  private setupHeartbeat(): void {
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const socket = ws as AuthenticatedSocket;
        if (socket.isAlive === false) {
          return socket.terminate();
        }
        socket.isAlive = false;
        socket.ping();
      });
    }, 30000);
  }

  public close(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.wss.close();
  }
}
