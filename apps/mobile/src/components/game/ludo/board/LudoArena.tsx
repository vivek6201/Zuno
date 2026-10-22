import React, { useEffect, useState } from "react";
import {
  Alert,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "heroui-native";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react-native";
import { Ludo } from "@repo/game-engine";
import {
  LudoBoard,
  LudoToken,
  LudoPlayerPod,
  LudoVictoryModal,
  useLudoGame,
  UseLudoGameReturn,
  ludoSound,
  LudoColor,
  GRID_SIZE,
} from "../index";

export interface LudoArenaProps {
  roomId: string;
  mode?: "local" | "multiplayer";
  playerCount?: number;
  onExit: () => void;
  game?: UseLudoGameReturn;
}

export const LudoArena: React.FC<LudoArenaProps> = ({
  roomId,
  mode = "multiplayer",
  playerCount,
  onExit,
  game: customGame,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Responsive board sizing: exact integer multiple of 15 to eliminate corner and cell clipping
  const maxBoardWidth = Math.min(windowWidth - 28, 380);
  const cellSize = Math.floor(maxBoardWidth / GRID_SIZE);
  const boardSize = cellSize * GRID_SIZE;

  const defaultGame = useLudoGame({
    roomId,
    mode,
    localPlayerCount: playerCount || 4,
  });

  const {
    gameState,
    isMyTurn,
    activeColor,
    canRoll,
    canMove,
    rollDice,
    moveToken,
    restartGame,
    leaveGame,
  } = customGame ?? defaultGame;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    ludoSound.setSoundEnabled(next);
  };

  const handleExitPress = () => {
    Alert.alert("Leave Game?", "Are you sure you want to exit the match?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        style: "destructive",
        onPress: () => {
          leaveGame();
          onExit();
        },
      },
    ]);
  };

  // Find players by color
  const playersByColor: Partial<Record<LudoColor, any>> = {};
  gameState?.players.forEach((p: any) => {
    playersByColor[p.color as LudoColor] = p;
  });

  // Collect all tokens on board to calculate tile stacking
  const allTokens: Ludo.LudoToken[] = [];
  gameState?.players.forEach((p: any) => {
    if (p.tokens) allTokens.push(...p.tokens);
  });

  // Calculate stacking per global position on track
  const stackMap = new Map<string, number>();
  allTokens.forEach((t) => {
    if (t.stepCount > 0 && t.stepCount < 57) {
      const key = `${t.globalPosition ?? t.stepCount}`;
      stackMap.set(key, (stackMap.get(key) || 0) + 1);
    }
  });

  const activePlayer = gameState?.players.find(
    (p: any) => p.id === gameState.currentTurnPlayerId,
  );

  // Check if active player has movable tokens on the track or in home path
  const movableOnBoard = activePlayer?.tokens?.filter(
    (t: any) =>
      t.zone !== Ludo.TokenZone.BASE &&
      (gameState?.movableTokenIds?.includes(t.id) ?? false),
  );

  // Active player has movable tokens in base that can exit on 6
  const hasMovableBaseTokens =
    canMove &&
    gameState?.currentDice === 6 &&
    (activePlayer?.tokens?.some(
      (t: any) =>
        t.zone === Ludo.TokenZone.BASE &&
        (gameState?.movableTokenIds?.includes(t.id) ?? false),
    ) ??
      false);

  const hasOnlyBaseMoves =
    hasMovableBaseTokens && (!movableOnBoard || movableOnBoard.length === 0);

  const handleYardPress = (color: LudoColor) => {
    if (!canMove || activeColor !== color) return;
    if (gameState?.currentDice === 6) {
      const baseToken = activePlayer?.tokens?.find(
        (t: any) =>
          t.zone === Ludo.TokenZone.BASE &&
          (gameState?.movableTokenIds?.includes(t.id) ?? false),
      );
      if (baseToken) {
        ludoSound.playPieceStep();
        moveToken(baseToken.id);
      }
    }
  };

  const handleDiceOrQuickMove = (color: LudoColor) => {
    if (activeColor !== color) return;
    if (canRoll) {
      rollDice();
    } else if (hasOnlyBaseMoves) {
      handleYardPress(color);
    }
  };

  // Determine active player count to cleanly format pods
  const activePlayers =
    gameState?.players.filter((p: any) => !p.isDisconnected && p.color) || [];
  const is2PlayerGame = activePlayers.length === 2 || playerCount === 2;
  const is3PlayerGame = activePlayers.length === 3 || playerCount === 3;

  return (
    <View
      className="flex-1 bg-slate-900 justify-between"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
        paddingLeft: Math.max(insets.left, 12),
        paddingRight: Math.max(insets.right, 12),
      }}
    >
      {/* ── 1. TOP HEADER BAR ── */}
      <View className="flex-row items-center justify-between px-3 py-1.5">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleExitPress}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Typography
            type="h3"
            className="text-white font-black text-lg tracking-tight"
          >
            Ludo
          </Typography>
          <View className="flex-row items-center bg-slate-800 px-2.5 py-0.5 rounded-full mt-0.5">
            <Typography
              type="body-xs"
              className="text-slate-300 font-bold text-[10px] uppercase tracking-wider"
            >
              {mode === "local" ? "Pass & Play" : `Room: ${roomId}`}
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleSound}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center"
        >
          {soundEnabled ? (
            <Volume2 size={20} color="#FBBF24" />
          ) : (
            <VolumeX size={20} color="#94A3B8" />
          )}
        </TouchableOpacity>
      </View>

      {/* ── 2. TOP PLAYER PODS (Red at Top-Left, Green at Top-Right) ── */}
      <View className="flex-row justify-between items-center px-4">
        {/* Red Pod (Top-Left, sitting directly above Red Yard) */}
        <LudoPlayerPod
          player={playersByColor[LudoColor.RED]}
          slot={gameState?.slots?.[LudoColor.RED]}
          color={LudoColor.RED}
          isCurrentTurn={activeColor === LudoColor.RED}
          phase={gameState?.phase!}
          currentDice={gameState?.currentDice!}
          canRoll={
            (canRoll || (canMove && hasOnlyBaseMoves)) &&
            activeColor === LudoColor.RED
          }
          align="left"
          hideWhenLocked={false}
          onRollDice={() => handleDiceOrQuickMove(LudoColor.RED)}
        />

        {/* Green Pod (Top-Right, sitting directly above Green Yard) */}
        <LudoPlayerPod
          player={playersByColor[LudoColor.GREEN]}
          slot={gameState?.slots?.[LudoColor.GREEN]}
          color={LudoColor.GREEN}
          isCurrentTurn={activeColor === LudoColor.GREEN}
          phase={gameState?.phase!}
          currentDice={gameState?.currentDice!}
          canRoll={
            (canRoll || (canMove && hasOnlyBaseMoves)) &&
            activeColor === LudoColor.GREEN
          }
          align="right"
          hideWhenLocked={is2PlayerGame}
          onRollDice={() => handleDiceOrQuickMove(LudoColor.GREEN)}
        />
      </View>

      {/* ── 3. CENTER LUDO BOARD (Identical to Image 1 standard orientation, 0° rotation) ── */}
      <View className="items-center justify-center my-1">
        <LudoBoard
          boardSize={boardSize}
          activeYardColor={hasMovableBaseTokens ? activeColor : null}
          onPressYard={handleYardPress}
        >
          {allTokens.map((token) => {
            const isMovable =
              canMove &&
              activeColor === token.color &&
              (gameState?.movableTokenIds?.includes(token.id) ?? false);

            const stackKey = `${token.globalPosition ?? token.stepCount}`;
            const totalOnTile = stackMap.get(stackKey) || 1;

            return (
              <LudoToken
                key={token.id}
                token={token}
                boardSize={boardSize}
                isMovable={isMovable}
                stackCount={totalOnTile}
                onPress={moveToken}
              />
            );
          })}
        </LudoBoard>
      </View>

      {/* ── 4. BOTTOM PLAYER PODS (Blue at Bottom-Left, Yellow at Bottom-Right) ── */}
      <View className="flex-row justify-between items-center px-4">
        {/* Blue Pod (Bottom-Left, sitting directly below Blue Yard) */}
        <LudoPlayerPod
          player={playersByColor[LudoColor.BLUE]}
          slot={gameState?.slots?.[LudoColor.BLUE]}
          color={LudoColor.BLUE}
          isCurrentTurn={activeColor === LudoColor.BLUE}
          phase={gameState?.phase!}
          currentDice={gameState?.currentDice!}
          canRoll={
            (canRoll || (canMove && hasOnlyBaseMoves)) &&
            activeColor === LudoColor.BLUE
          }
          align="left"
          hideWhenLocked={is2PlayerGame || is3PlayerGame}
          onRollDice={() => handleDiceOrQuickMove(LudoColor.BLUE)}
        />

        {/* Yellow Pod (Bottom-Right, sitting directly below Yellow Yard) */}
        <LudoPlayerPod
          player={playersByColor[LudoColor.YELLOW]}
          slot={gameState?.slots?.[LudoColor.YELLOW]}
          color={LudoColor.YELLOW}
          isCurrentTurn={activeColor === LudoColor.YELLOW}
          phase={gameState?.phase!}
          currentDice={gameState?.currentDice!}
          canRoll={
            (canRoll || (canMove && hasOnlyBaseMoves)) &&
            activeColor === LudoColor.YELLOW
          }
          align="right"
          hideWhenLocked={false}
          onRollDice={() => handleDiceOrQuickMove(LudoColor.YELLOW)}
        />
      </View>

      {/* ── 6. VICTORY CELEBRATION MODAL ── */}
      <LudoVictoryModal
        visible={gameState?.status === "FINISHED"}
        winner={gameState?.players.find((p: any) => p.rank === 1)}
        onPlayAgain={mode === "local" ? restartGame : undefined}
        onExit={onExit}
      />
    </View>
  );
};

export default LudoArena;
