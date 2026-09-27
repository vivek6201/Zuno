import {
  BaseAction,
  BaseGameState,
  GAME_METADATA_MAP,
  GameEvent,
  GameManager,
  GameType,
} from "@repo/game-engine";
import {
  AuthenticatedSocket,
  AuthenticatedUser,
  RoomPlayerInfo,
  ServerMessage,
  ServerMessageType,
} from "./types";
import { getGameHandler } from "@/utils/game-handlers";
import IGameHandler from "@/types/handler";

export interface RoomParticipant {
  user: AuthenticatedUser;
  socket?: AuthenticatedSocket;
  slotIndex: number;
  color?: string;
  isReady: boolean;
  isConnected: boolean;
}

/**
 * Encapsulates an active multiplayer game room.
 * Game-specific logic is completely delegated to modular GameHandlers.
 */
export class Room {
  public readonly roomId: string;
  public readonly gameType: GameType;
  public readonly gameConfig: Record<string, any>;
  public hostUserId: string;
  public maxPlayers: number;
  private participants: Map<string, RoomParticipant> = new Map();
  private gameManager: GameManager<BaseGameState, any, any> | null = null;
  private unsubscribeEngine: (() => void) | null = null;
  private gameHandler: IGameHandler;

  constructor(
    roomId: string,
    hostUser: AuthenticatedUser,
    gameType: GameType = GameType.LUDO,
    gameConfig: Record<string, any> = {},
    maxPlayers?: number
  ) {
    this.roomId = roomId;
    this.hostUserId = hostUser.id;
    this.gameType = gameType;
    this.gameConfig = gameConfig;
    this.gameHandler = getGameHandler(gameType);

    const metadata = GAME_METADATA_MAP[gameType] ?? GAME_METADATA_MAP[GameType.LUDO];
    const requestedMax = maxPlayers ?? metadata.defaultMaxPlayers;
    this.maxPlayers = Math.max(metadata.minPlayers, Math.min(metadata.maxPlayers, requestedMax));

    // Register host as initial participant in slot 0
    const hostColor = this.gameHandler.assignPlayerColor(0, []);
    this.participants.set(hostUser.id, {
      user: hostUser,
      slotIndex: 0,
      color: hostColor,
      isReady: true,
      isConnected: false,
    });
  }

  // ─── PLAYER MANAGEMENT ────────────────────────────────────────────────────────

  /**
   * Adds or reconnects a player into the room.
   */
  public addPlayer(
    user: AuthenticatedUser,
    socket: AuthenticatedSocket
  ): { success: boolean; error?: string } {
    // 1. If game already started and player is not an existing participant: reject
    if (this.gameManager && !this.participants.has(user.id)) {
      return { success: false, error: "Game has already started in this room." };
    }

    // 2. Check if room is full
    if (!this.participants.has(user.id) && this.participants.size >= this.maxPlayers) {
      return { success: false, error: "Room is full." };
    }

    // 3. Existing participant connecting or reconnecting
    if (this.participants.has(user.id)) {
      const participant = this.participants.get(user.id)!;
      const wasConnected = participant.isConnected;
      participant.socket = socket;
      participant.isConnected = true;
      socket.roomId = this.roomId;

      this.sendTo(user.id, {
        type: ServerMessageType.ROOM_JOINED,
        roomId: this.roomId,
        gameType: this.gameType,
        gameConfig: this.gameConfig,
        players: this.getPlayerList(),
        isHost: user.id === this.hostUserId,
        maxPlayers: this.maxPlayers,
      });

      // If game is in progress, sync state immediately
      if (this.gameManager) {
        this.sendTo(user.id, {
          type: ServerMessageType.GAME_STATE_UPDATE,
          gameType: this.gameType,
          state: this.gameManager.getState(),
        });
      }

      if (wasConnected) {
        this.broadcast(
          { type: ServerMessageType.PLAYER_RECONNECTED, playerId: user.id },
          user.id
        );
      } else {
        this.broadcast(
          {
            type: ServerMessageType.PLAYER_JOINED,
            player: {
              id: user.id,
              name: user.name,
              slotIndex: participant.slotIndex,
              color: participant.color,
              isReady: participant.isReady,
              isConnected: true,
              isHost: user.id === this.hostUserId,
            },
          },
          user.id
        );
      }

      return { success: true };
    }

    // 4. Assign slot index and role/color via game handler
    const slotIndex = this.participants.size;
    const assignedColor = this.gameHandler.assignPlayerColor(
      slotIndex,
      Array.from(this.participants.values())
    );

    const participant: RoomParticipant = {
      user,
      socket,
      slotIndex,
      color: assignedColor,
      isReady: user.id === this.hostUserId, // Host is ready by default
      isConnected: true,
    };

    this.participants.set(user.id, participant);
    socket.roomId = this.roomId;

    // Send room welcome packet to newly joined user
    this.sendTo(user.id, {
      type: ServerMessageType.ROOM_JOINED,
      roomId: this.roomId,
      gameType: this.gameType,
      gameConfig: this.gameConfig,
      players: this.getPlayerList(),
      isHost: user.id === this.hostUserId,
      maxPlayers: this.maxPlayers,
    });

    // Notify other players in the room
    this.broadcast(
      {
        type: ServerMessageType.PLAYER_JOINED,
        player: {
          id: user.id,
          name: user.name,
          slotIndex: participant.slotIndex,
          color: participant.color,
          isReady: participant.isReady,
          isConnected: true,
          isHost: user.id === this.hostUserId,
        },
      },
      user.id
    );

    return { success: true };
  }

  /**
   * Handle socket disconnection (player lost network connection).
   */
  public handleDisconnect(userId: string): void {
    const participant = this.participants.get(userId);
    if (!participant) return;

    participant.isConnected = false;
    participant.socket = undefined;

    this.broadcast({
      type: ServerMessageType.PLAYER_DISCONNECTED,
      playerId: userId,
    });
  }

  /**
   * Explicit player leave.
   */
  public removePlayer(userId: string): void {
    const participant = this.participants.get(userId);
    if (!participant) return;

    this.participants.delete(userId);

    // If host left, elect next available player as host
    if (userId === this.hostUserId && this.participants.size > 0) {
      this.hostUserId = Array.from(this.participants.keys())[0]!;
    }

    this.broadcast({
      type: ServerMessageType.PLAYER_LEFT,
      playerId: userId,
    });
  }

  // ─── GAME LIFECYCLE ───────────────────────────────────────────────────────────

  /**
   * Starts the game match. Only the room host can initiate.
   */
  public startGame(requesterUserId: string): { success: boolean; error?: string } {
    if (requesterUserId !== this.hostUserId) {
      return { success: false, error: "Only the room host can start the game." };
    }

    const metadata = GAME_METADATA_MAP[this.gameType];
    if (this.participants.size < metadata.minPlayers) {
      return {
        success: false,
        error: `At least ${metadata.minPlayers} players are required to start ${metadata.displayName}.`,
      };
    }

    if (this.gameManager) {
      return { success: false, error: "Game is already in progress." };
    }

    try {
      // 1. Create Game Engine instance dynamically via gameHandler
      this.gameManager = this.gameHandler.createEngine(this.roomId, this.gameConfig);

      // 2. Add room participants into the engine formatted by gameHandler
      for (const participant of this.participants.values()) {
        const enginePlayer = this.gameHandler.createEnginePlayer(participant);
        this.gameManager.addPlayer(enginePlayer);
      }

      // 3. Subscribe to engine updates to broadcast over WebSocket
      this.unsubscribeEngine = this.gameManager.subscribe(
        (state: BaseGameState, events: GameEvent[]) => {
          this.broadcast({
            type: ServerMessageType.GAME_STATE_UPDATE,
            gameType: this.gameType,
            state,
          });

          for (const event of events) {
            this.broadcast({
              type: ServerMessageType.GAME_EVENT,
              event,
            });
          }
        }
      );

      // 4. Start the engine
      const startResult = this.gameManager.start(this.participants.size);
      if (!startResult.success) {
        return startResult;
      }

      // 5. Notify all players that game started
      this.broadcast({
        type: ServerMessageType.GAME_STARTED,
        gameType: this.gameType,
        state: this.gameManager.getState(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to start game." };
    }
  }

  /**
   * Dispatches a gameplay action into the authoritative game manager.
   */
  public handleAction(userId: string, action: BaseAction): void {
    if (!this.gameManager) {
      this.sendTo(userId, {
        type: ServerMessageType.ERROR,
        message: "No active game in this room. Please wait for host to start.",
      });
      return;
    }

    const participant = this.participants.get(userId);
    let actionToDispatch = action;
    if (participant && this.gameHandler.beforeDispatch) {
      actionToDispatch = this.gameHandler.beforeDispatch(action, participant);
    }

    // Dispatch action through the engine pipeline
    const result = this.gameManager.dispatch({
      ...actionToDispatch,
      playerId: userId,
    });

    if (!result.success) {
      this.sendTo(userId, {
        type: ServerMessageType.ERROR,
        message: result.error || "Illegal move.",
      });
    }
  }

  // ─── MESSAGING / BROADCASTING ─────────────────────────────────────────────────

  /**
   * Broadcasts a JSON message to all connected players in the room.
   */
  public broadcast(message: ServerMessage, excludeUserId?: string): void {
    const raw = JSON.stringify(message);

    for (const [userId, participant] of this.participants) {
      if (excludeUserId && userId === excludeUserId) continue;
      if (participant.socket && participant.socket.readyState === participant.socket.OPEN) {
        participant.socket.send(raw);
      }
    }
  }

  /**
   * Sends a JSON message directly to a specific user.
   */
  public sendTo(userId: string, message: ServerMessage): void {
    const participant = this.participants.get(userId);
    if (participant?.socket && participant.socket.readyState === participant.socket.OPEN) {
      participant.socket.send(JSON.stringify(message));
    }
  }

  // ─── GETTERS & CLEANUP ────────────────────────────────────────────────────────

  public getPlayerList(): RoomPlayerInfo[] {
    return Array.from(this.participants.values()).map((p) => ({
      id: p.user.id,
      name: p.user.name,
      slotIndex: p.slotIndex,
      color: p.color,
      isReady: p.isReady,
      isConnected: p.isConnected,
      isHost: p.user.id === this.hostUserId,
    }));
  }

  public getPlayerCount(): number {
    return this.participants.size;
  }

  public isEmpty(): boolean {
    return this.participants.size === 0;
  }

  public destroy(): void {
    if (this.unsubscribeEngine) {
      this.unsubscribeEngine();
      this.unsubscribeEngine = null;
    }
    this.participants.clear();
    this.gameManager = null;
  }
}
