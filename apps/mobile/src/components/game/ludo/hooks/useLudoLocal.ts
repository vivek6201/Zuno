import { useCallback, useEffect, useRef, useState } from "react";
import useAuthStore from "@/hooks/useAuthStrore";
import {
  LudoActionType,
  LudoColor,
  LudoGameManager,
  LudoGameState,
  LudoTurnPhase,
  UseLudoGameReturn,
  UseLudoLocalProps,
} from "./types";
import {
  handleLudoDomainEvents,
  triggerLudoVictorySound,
} from "./domain-events";

/**
 * Hook for managing Local Pass & Play Ludo game logic.
 * Runs completely on-device using LudoGameManager without WebSocket dependencies.
 */
export const useLudoLocal = ({
  roomId = "local",
  playerCount = 4,
  localPlayerCount,
  enabled = true,
}: UseLudoLocalProps = {}): UseLudoGameReturn => {
  const { user } = useAuthStore();
  const [gameState, setGameState] = useState<LudoGameState | null>(null);
  const localEngineRef = useRef<LudoGameManager | null>(null);

  const effectivePlayerCount = localPlayerCount ?? playerCount ?? 4;

  // Initialize or reset the local game instance
  const initLocalGame = useCallback(() => {
    const manager = new LudoGameManager({
      gameId: roomId || "local-game",
      finishOnFirstWinner: true,
      autoMoveSingleToken: false,
    });

    // Determine colors based on player count:
    // 2 players: RED and YELLOW (opposite sides of board for balanced play)
    // 3 players: RED, GREEN, YELLOW
    // 4 players: RED, GREEN, YELLOW, BLUE
    let colors: LudoColor[];
    if (effectivePlayerCount === 2) {
      colors = [LudoColor.RED, LudoColor.YELLOW];
    } else if (effectivePlayerCount === 3) {
      colors = [LudoColor.RED, LudoColor.GREEN, LudoColor.YELLOW];
    } else {
      colors = [
        LudoColor.RED,
        LudoColor.GREEN,
        LudoColor.YELLOW,
        LudoColor.BLUE,
      ];
    }

    const count = colors.length;
    for (let i = 0; i < count; i++) {
      const color = colors[i]!;
      manager.addPlayer({
        id: `player-${color.toLowerCase()}`,
        name:
          i === 0 ? user?.name?.split(" ")[0] || "Player 1" : `Player ${i + 1}`,
        color,
        tokens: [],
        rank: null,
        isReady: true,
        isBot: false,
        isDisconnected: false,
      });
    }

    // Subscribe to engine state updates and domain audio events
    manager.subscribe((newState: any, events: any[]) => {
      setGameState({ ...newState });
      handleLudoDomainEvents(events);
    });

    manager.start(count);
    localEngineRef.current = manager;
    setGameState({ ...manager.getState() });
  }, [roomId, effectivePlayerCount, user]);

  // Mount/unmount engine lifecycle
  useEffect(() => {
    if (!enabled) {
      localEngineRef.current = null;
      setGameState(null);
      return;
    }

    initLocalGame();

    return () => {
      localEngineRef.current = null;
    };
  }, [enabled, initLocalGame]);

  // Victory celebration
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

  // In local pass & play, the player holding the device is active when it's their turn
  const isMyTurn =
    enabled &&
    !!gameState &&
    gameState.status === "IN_PROGRESS" &&
    !!gameState.currentTurnPlayerId;

  const canRoll =
    isMyTurn && gameState?.phase === LudoTurnPhase.AWAITING_DICE_ROLL;

  const canMove =
    isMyTurn &&
    gameState?.phase === LudoTurnPhase.AWAITING_TOKEN_MOVE &&
    (gameState?.movableTokenIds?.length || 0) > 0;

  const rollDice = useCallback(() => {
    if (!canRoll || !localEngineRef.current || !gameState?.currentTurnPlayerId) {
      return;
    }

    localEngineRef.current.dispatch({
      type: LudoActionType.ROLL_DICE,
      playerId: gameState.currentTurnPlayerId,
    });
  }, [canRoll, gameState?.currentTurnPlayerId]);

  const moveToken = useCallback(
    (tokenId: string) => {
      if (
        !canMove ||
        !localEngineRef.current ||
        !gameState?.currentTurnPlayerId
      ) {
        return;
      }

      localEngineRef.current.dispatch({
        type: LudoActionType.MOVE_TOKEN,
        playerId: gameState.currentTurnPlayerId,
        payload: { tokenId },
      });
    },
    [canMove, gameState?.currentTurnPlayerId],
  );

  const restartGame = useCallback(() => {
    if (enabled) {
      initLocalGame();
    }
  }, [enabled, initLocalGame]);

  const leaveGame = useCallback(() => {
    localEngineRef.current = null;
    setGameState(null);
  }, []);

  return {
    gameState,
    mode: "local",
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

export default useLudoLocal;
