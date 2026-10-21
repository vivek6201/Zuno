import { useCallback, useEffect, useRef, useState } from "react";
import { GameEvent, Ludo } from "@repo/game-engine";
import { useSocket } from "@/hooks/useWebSocket";
import {
  ClientMessageType,
  GameStateUpdateServerMessage,
  ServerMessage,
  ServerMessageType,
} from "@repo/common/constants/websocket";
import useAuthStore from "@/hooks/useAuthStrore";
import { ludoSound } from "../audio/ludo-sound";

type LudoColor = Ludo.LudoColor;
const LudoColor = Ludo.LudoColor;
type LudoGameState = Ludo.LudoGameState;
type LudoPlayer = Ludo.LudoPlayer;
type LudoTurnPhase = Ludo.LudoTurnPhase;
const LudoTurnPhase = Ludo.LudoTurnPhase;
const LudoActionType = Ludo.LudoActionType;
const LudoGameEvent = Ludo.LudoGameEvent;
const LudoGameManager = Ludo.LudoGameManager;
type LudoGameManager = Ludo.LudoGameManager;

export type GameMode = "local" | "multiplayer";

export interface UseLudoGameProps {
  roomId: string;
  mode?: GameMode;
  localPlayerCount?: number;
}

export interface UseLudoGameReturn {
  gameState: LudoGameState | null;
  mode: GameMode;
  isMyTurn: boolean;
  activeColor: LudoColor;
  canRoll: boolean;
  canMove: boolean;
  rollDice: () => void;
  moveToken: (tokenId: string) => void;
  restartGame: () => void;
  leaveGame: () => void;
}

export const useLudoGame = ({
  roomId,
  mode = "multiplayer",
  localPlayerCount = 4,
}: UseLudoGameProps): UseLudoGameReturn => {
  const { user } = useAuthStore();
  const { sendMessage, addMessageListener } = useSocket();

  const [gameState, setGameState] = useState<LudoGameState | null>(null);
  const localEngineRef = useRef<LudoGameManager | null>(null);

  // Sound event listener helper
  const handleDomainEvents = useCallback((events: GameEvent[]) => {
    for (const evt of events) {
      switch (evt.type) {
        case LudoGameEvent.DICE_ROLLED:
          ludoSound.playDiceRoll();
          break;
        case LudoGameEvent.TOKEN_MOVED:
          ludoSound.playPieceStep();
          break;
        case LudoGameEvent.PIECE_CAPTURED:
          ludoSound.playPieceCapture();
          break;
        case LudoGameEvent.TOKEN_REACHED_HOME:
          ludoSound.playHomeEntry();
          break;
        case LudoGameEvent.BONUS_TURN_AWARDED:
          ludoSound.playBonusTurn();
          break;
        case LudoGameEvent.SAFE_SQUARE_REACHED:
          ludoSound.playSafeSquare();
          break;
      }
    }
  }, []);

  // ─── 1. LOCAL PASS-AND-PLAY INITIALIZATION ────────────────────────────────────
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
    if (localPlayerCount === 2) {
      colors = [LudoColor.RED, LudoColor.YELLOW];
    } else if (localPlayerCount === 3) {
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

    // Subscribe to engine state updates
    manager.subscribe((newState: any, events: any[]) => {
      setGameState({ ...newState });
      handleDomainEvents(events);
    });

    manager.start(count);
    localEngineRef.current = manager;
    setGameState({ ...manager.getState() });
  }, [localPlayerCount, user, roomId, handleDomainEvents]);

  // ─── 2. MULTIPLAYER WEBSOCKET SUBSCRIPTION ────────────────────────────────────
  useEffect(() => {
    if (mode === "local" || roomId === "local") {
      initLocalGame();
      return;
    }

    // Request current room and game state upon mounting
    sendMessage({
      type: ClientMessageType.JOIN_ROOM,
      roomId,
    });

    // Listen for WebSocket state updates from backend
    const unsubscribe = addMessageListener((message: ServerMessage) => {
      if (message.type === ServerMessageType.GAME_STATE_UPDATE) {
        const update = message as GameStateUpdateServerMessage;
        setGameState(update.state as LudoGameState);
      } else if (message.type === ServerMessageType.GAME_STARTED) {
        setGameState(message.state as LudoGameState);
      } else if (message.type === ServerMessageType.GAME_EVENT) {
        handleDomainEvents([message.event]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    mode,
    roomId,
    initLocalGame,
    addMessageListener,
    sendMessage,
    handleDomainEvents,
  ]);

  // Trigger celebration audio upon match victory
  useEffect(() => {
    if (gameState?.status === "FINISHED") {
      ludoSound.playVictory();
    }
  }, [gameState?.status]);

  // ─── 3. ACTIONS ───────────────────────────────────────────────────────────────
  const activePlayer = gameState?.players.find(
    (p: any) => p.id === gameState.currentTurnPlayerId,
  );
  const activeColor = activePlayer?.color || LudoColor.RED;

  const isMyTurn =
    mode === "local" || roomId === "local"
      ? true // Local mode is pass-and-play so active player has control
      : gameState?.currentTurnPlayerId === user?.id;

  const canRoll =
    isMyTurn && gameState?.phase === LudoTurnPhase.AWAITING_DICE_ROLL;

  const canMove =
    isMyTurn &&
    gameState?.phase === LudoTurnPhase.AWAITING_TOKEN_MOVE &&
    (gameState?.movableTokenIds?.length || 0) > 0;

  const rollDice = useCallback(() => {
    if (!canRoll) return;

    if (mode === "local" || roomId === "local") {
      localEngineRef.current?.dispatch({
        type: LudoActionType.ROLL_DICE,
        playerId: gameState!.currentTurnPlayerId!,
      });
    } else {
      sendMessage({
        type: ClientMessageType.GAME_ACTION,
        action: {
          type: LudoActionType.ROLL_DICE,
          playerId: user?.id || "",
        } as any,
      });
    }
  }, [canRoll, mode, roomId, gameState, user, sendMessage]);

  const moveToken = useCallback(
    (tokenId: string) => {
      if (!canMove) return;

      if (mode === "local" || roomId === "local") {
        localEngineRef.current?.dispatch({
          type: LudoActionType.MOVE_TOKEN,
          playerId: gameState!.currentTurnPlayerId!,
          payload: { tokenId },
        });
      } else {
        sendMessage({
          type: ClientMessageType.GAME_ACTION,
          action: {
            type: LudoActionType.MOVE_TOKEN,
            playerId: user?.id || "",
            payload: { tokenId },
          } as any,
        });
      }
    },
    [canMove, mode, roomId, gameState, user, sendMessage],
  );

  const restartGame = useCallback(() => {
    if (mode === "local" || roomId === "local") {
      initLocalGame();
    }
  }, [mode, roomId, initLocalGame]);

  const leaveGame = useCallback(() => {
    if (mode === "multiplayer" && roomId && roomId !== "local") {
      sendMessage({
        type: ClientMessageType.LEAVE_ROOM,
      });
    }
  }, [mode, roomId, sendMessage]);

  return {
    gameState,
    mode: mode === "local" || roomId === "local" ? "local" : "multiplayer",
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

export default useLudoGame;
