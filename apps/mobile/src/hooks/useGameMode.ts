import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { useSocket } from "@/hooks/useWebSocket";
import {
  ServerMessage,
  ServerMessageType,
  RoomJoinedServerMessage,
  GameStartedServerMessage,
  GameStateUpdateServerMessage,
} from "@repo/common/constants/websocket";
import {
  GameCapabilities,
  GameMode,
  SupportedGameId,
  getGameCapabilities,
  normalizeGameId,
} from "@/utils/game-capabilities";

export interface UseGameModeReturn {
  gameId: SupportedGameId;
  mode: GameMode;
  roomId: string;
  playerCount?: number;
  capabilities: GameCapabilities;
  isModeAllowed: boolean;
  handleExit: () => void;
}

/**
 * Hook to determine game type, validate supported game modes (e.g. local vs online),
 * and route the user safely if an unsupported mode is accessed.
 */
export const useGameMode = (): UseGameModeReturn => {
  const router = useRouter();
  const { toast } = useToast();
  const { addMessageListener } = useSocket();

  const params = useLocalSearchParams<{
    roomId?: string;
    gameId?: string;
    mode?: string;
    playerCount?: string;
  }>();

  const roomId = params.roomId || "local";
  const requestedMode: GameMode =
    params.mode === "local" || roomId === "local" ? "local" : "multiplayer";

  // Initial resolved game ID from params
  const [resolvedGameId, setResolvedGameId] = useState<SupportedGameId>(() =>
    normalizeGameId(params.gameId),
  );

  // Sync state if params.gameId updates
  useEffect(() => {
    if (params.gameId) {
      setResolvedGameId(normalizeGameId(params.gameId));
    }
  }, [params.gameId]);

  // If in an online room and gameId was not explicitly passed in route params,
  // infer it dynamically from incoming WebSocket server messages
  useEffect(() => {
    if (roomId === "local" || params.gameId) return;

    const unsubscribe = addMessageListener((message: ServerMessage) => {
      let inferredType: string | undefined;

      if (message.type === ServerMessageType.ROOM_JOINED) {
        inferredType = (message as RoomJoinedServerMessage).gameType;
      } else if (message.type === ServerMessageType.GAME_STARTED) {
        inferredType = (message as GameStartedServerMessage).gameType;
      } else if (message.type === ServerMessageType.GAME_STATE_UPDATE) {
        inferredType = (message as GameStateUpdateServerMessage).gameType;
      }

      if (inferredType) {
        setResolvedGameId(normalizeGameId(inferredType));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, params.gameId, addMessageListener]);

  const capabilities = getGameCapabilities(resolvedGameId);

  // Check if requested mode is allowed for this game
  // e.g. UNO and Matiks only support online mode; Ludo and Chess support both
  const isModeAllowed =
    requestedMode === "local"
      ? capabilities.supportsLocal
      : capabilities.supportsOnline;

  // Auto-route / redirect the user if they try to access an unsupported mode
  useEffect(() => {
    if (!isModeAllowed) {
      if (requestedMode === "local" && !capabilities.supportsLocal) {
        toast.show({
          variant: "warning",
          label: `${capabilities.title} only supports Online Multiplayer mode.`,
        });

        // Redirect to the multiplayer lobby for this game
        router.replace({
          pathname: "/games/[gameId]/lobby/multiplayer-lobby",
          params: { gameId: resolvedGameId },
        });
      } else {
        // Fallback safety redirect
        router.replace("/(tabs)/games");
      }
    }
  }, [
    isModeAllowed,
    requestedMode,
    capabilities.supportsLocal,
    capabilities.title,
    resolvedGameId,
    router,
    toast,
  ]);

  const handleExit = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/games");
    }
  }, [router]);

  const parsedPlayerCount = params.playerCount
    ? parseInt(params.playerCount, 10)
    : capabilities.defaultPlayerCount;

  return {
    gameId: resolvedGameId,
    mode: requestedMode,
    roomId,
    playerCount: parsedPlayerCount,
    capabilities,
    isModeAllowed,
    handleExit,
  };
};

export default useGameMode;
