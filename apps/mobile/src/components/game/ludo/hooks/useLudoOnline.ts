import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/hooks/useWebSocket";
import {
  ClientMessageType,
  GameStateUpdateServerMessage,
  ServerMessage,
  ServerMessageType,
} from "@repo/common/constants/websocket";
import useAuthStore from "@/hooks/useAuthStrore";
import {
  LudoActionType,
  LudoColor,
  LudoGameState,
  LudoTurnPhase,
  UseLudoGameReturn,
  UseLudoOnlineProps,
} from "./types";
import {
  handleLudoDomainEvents,
  triggerLudoVictorySound,
} from "./domain-events";

/**
 * Hook for managing Online Multiplayer Ludo game logic.
 * Synchronizes state and player actions via WebSocket with the backend server.
 */
export const useLudoOnline = ({
  roomId,
  enabled = true,
}: UseLudoOnlineProps): UseLudoGameReturn => {
  const { user } = useAuthStore();
  const { sendMessage, addMessageListener } = useSocket();
  const [gameState, setGameState] = useState<LudoGameState | null>(null);

  // WebSocket subscription and room join
  useEffect(() => {
    if (!enabled || !roomId || roomId === "local") {
      setGameState(null);
      return;
    }

    // Request current room and game state upon mounting
    sendMessage({
      type: ClientMessageType.JOIN_ROOM,
      roomId,
    });

    const unsubscribe = addMessageListener((message: ServerMessage) => {
      if (message.type === ServerMessageType.GAME_STATE_UPDATE) {
        const update = message as GameStateUpdateServerMessage;
        setGameState(update.state as LudoGameState);
      } else if (message.type === ServerMessageType.GAME_STARTED) {
        setGameState(message.state as LudoGameState);
      } else if (message.type === ServerMessageType.GAME_EVENT) {
        handleLudoDomainEvents([message.event]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [enabled, roomId, sendMessage, addMessageListener]);

  // Victory celebration audio
  useEffect(() => {
    if (enabled && gameState?.status === "FINISHED") {
      triggerLudoVictorySound(gameState.status);
    }
  }, [enabled, gameState?.status]);

  // Current turn calculations
  const activePlayer = gameState?.players.find(
    (p: any) => p.id === gameState.currentTurnPlayerId,
  );
  const activeColor = activePlayer?.color || LudoColor.RED;

  // In online multiplayer, it is only my turn if currentTurnPlayerId matches logged-in user id
  const isMyTurn =
    enabled &&
    !!user?.id &&
    gameState?.status === "IN_PROGRESS" &&
    gameState?.currentTurnPlayerId === user.id;

  const canRoll =
    isMyTurn && gameState?.phase === LudoTurnPhase.AWAITING_DICE_ROLL;

  const canMove =
    isMyTurn &&
    gameState?.phase === LudoTurnPhase.AWAITING_TOKEN_MOVE &&
    (gameState?.movableTokenIds?.length || 0) > 0;

  const rollDice = useCallback(() => {
    if (!canRoll || !user?.id) return;

    sendMessage({
      type: ClientMessageType.GAME_ACTION,
      action: {
        type: LudoActionType.ROLL_DICE,
        playerId: user.id,
      } as any,
    });
  }, [canRoll, user?.id, sendMessage]);

  const moveToken = useCallback(
    (tokenId: string) => {
      if (!canMove || !user?.id) return;

      sendMessage({
        type: ClientMessageType.GAME_ACTION,
        action: {
          type: LudoActionType.MOVE_TOKEN,
          playerId: user.id,
          payload: { tokenId },
        } as any,
      });
    },
    [canMove, user?.id, sendMessage],
  );

  const restartGame = useCallback(() => {
    // In online mode, rematches are handled by server room transitions
  }, []);

  const leaveGame = useCallback(() => {
    if (roomId && roomId !== "local") {
      sendMessage({
        type: ClientMessageType.LEAVE_ROOM,
      });
    }
  }, [roomId, sendMessage]);

  return {
    gameState,
    mode: "multiplayer",
    isMyTurn,
    activeColor,
    canRoll,
    canMove,
    rollDice,
    moveToken,
    restartGame,
    leaveGame,
  };
};

export default useLudoOnline;
