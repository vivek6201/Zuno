import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { useSocket } from "./useWebSocket";
import { SocketStatus } from "@/context/SocketContext";
import {
  ClientMessageType,
  GameStartedServerMessage,
  RoomJoinedServerMessage,
  RoomPlayerInfo,
  ServerMessage,
  ServerMessageType,
} from "@repo/common/constants/websocket";
import { GameType } from "@repo/common/validations/game";

export interface UseWaitingRoomReturn {
  players: RoomPlayerInfo[];
  isHost: boolean;
  maxPlayers: number;
  minPlayers: number;
  gameType: GameType | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  startGame: () => void;
  leaveRoom: () => void;
}

export const useWaitingRoom = (
  roomId: string,
  gameId?: string,
): UseWaitingRoomReturn => {
  const router = useRouter();
  const { status, sendMessage, addMessageListener } = useSocket();
  const { toast } = useToast();

  const [players, setPlayers] = useState<RoomPlayerInfo[]>([]);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const minPlayers = gameType === "CHESS" ? 2 : 2;
  const hasSentJoinRef = useRef<boolean>(false);

  // Send JOIN_ROOM message to backend
  const sendJoinRoom = useCallback(() => {
    if (!roomId) return;

    const sent = sendMessage({
      type: ClientMessageType.JOIN_ROOM,
      roomId,
    });

    if (sent) {
      hasSentJoinRef.current = true;
    }
  }, [roomId, sendMessage]);

  // When socket connects or reconnects, send JOIN_ROOM
  useEffect(() => {
    if (status === SocketStatus.CONNECTED && roomId) {
      sendJoinRoom();
    }
  }, [status, roomId, sendJoinRoom]);

  // Listen for socket messages from the server
  useEffect(() => {
    const unsubscribe = addMessageListener((message: ServerMessage) => {
      switch (message.type) {
        case ServerMessageType.ROOM_JOINED: {
          const roomMsg = message as RoomJoinedServerMessage;
          if (roomMsg.roomId === roomId) {
            setPlayers(roomMsg.players);
            setIsHost(roomMsg.isHost);
            setMaxPlayers(roomMsg.maxPlayers);
            setGameType(roomMsg.gameType);
            setIsLoading(false);
            setError(null);
          }
          break;
        }

        case ServerMessageType.PLAYER_JOINED: {
          const newPlayer = message.player;
          setPlayers((prev) => {
            const exists = prev.some((p) => p.id === newPlayer.id);
            if (exists) {
              return prev.map((p) => (p.id === newPlayer.id ? newPlayer : p));
            }
            return [...prev, newPlayer];
          });

          toast.show({
            variant: "default",
            label: `${newPlayer.name} joined the room!`,
          });
          break;
        }

        case ServerMessageType.PLAYER_LEFT: {
          const leftPlayerId = message.playerId;
          setPlayers((prev) => {
            const leavingPlayer = prev.find((p) => p.id === leftPlayerId);
            if (leavingPlayer) {
              toast.show({
                variant: "warning",
                label: `${leavingPlayer.name} left the room.`,
              });
            }
            return prev.filter((p) => p.id !== leftPlayerId);
          });
          break;
        }

        case ServerMessageType.PLAYER_DISCONNECTED: {
          const disconnectedId = message.playerId;
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === disconnectedId ? { ...p, isConnected: false } : p,
            ),
          );
          break;
        }

        case ServerMessageType.PLAYER_RECONNECTED: {
          const reconnectedId = message.playerId;
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === reconnectedId ? { ...p, isConnected: true } : p,
            ),
          );
          break;
        }

        case ServerMessageType.GAME_STARTED: {
          const startMsg = message as GameStartedServerMessage;
          const resolvedGame =
            gameId ||
            startMsg.gameType?.toLowerCase() ||
            gameType?.toLowerCase() ||
            "ludo";

          toast.show({
            variant: "success",
            label: "Game is starting! Entering arena...",
          });

          // Navigate directly to the live game screen
          router.replace({
            pathname: "/game/[roomId]",
            params: {
              roomId,
              gameId: resolvedGame,
              mode: "multiplayer",
              playerCount: players.length.toString(),
            },
          });
          break;
        }

        case ServerMessageType.ERROR: {
          setError(message.message);
          toast.show({
            variant: "danger",
            label: message.message,
          });
          setIsLoading(false);
          break;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, router, toast, addMessageListener]);

  // Host starts the game
  const startGame = useCallback(() => {
    if (!isHost) {
      toast.show({
        variant: "danger",
        label: "Only the room host can start the game.",
      });
      return;
    }

    if (players.length < minPlayers) {
      toast.show({
        variant: "warning",
        label: `At least ${minPlayers} players are required to start.`,
      });
      return;
    }

    sendMessage({
      type: ClientMessageType.START_GAME,
    });
  }, [isHost, players.length, minPlayers, sendMessage, toast]);

  // Leave room and go back to lobby
  const leaveRoom = useCallback(() => {
    sendMessage({
      type: ClientMessageType.LEAVE_ROOM,
    });
    router.back();
  }, [sendMessage, router]);

  return {
    players,
    isHost,
    maxPlayers,
    minPlayers,
    gameType,
    isLoading,
    isConnected: status === SocketStatus.CONNECTED,
    error,
    startGame,
    leaveRoom,
  };
};

export default useWaitingRoom;
