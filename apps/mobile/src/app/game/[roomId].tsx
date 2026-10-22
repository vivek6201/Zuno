import React from "react";
import { ActivityIndicator, View } from "react-native";
import LudoArena from "@/components/game/ludo/board/LudoArena";
import GameArenaPlaceholder from "@/components/game/common/GameArenaPlaceholder";
import { useGameMode } from "@/hooks/useGameMode";

const GameRoom = () => {
  const {
    gameId,
    mode,
    roomId,
    playerCount,
    isModeAllowed,
    handleExit,
  } = useGameMode();

  // If the requested mode is unsupported (e.g. local for UNO/Matiks),
  // useGameMode will automatically redirect the user to the multiplayer lobby.
  if (!isModeAllowed) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Route to the appropriate game arena based on gameId
  switch (gameId) {
    case "ludo":
      return (
        <LudoArena
          roomId={roomId}
          mode={mode}
          playerCount={playerCount}
          onExit={handleExit}
        />
      );

    case "chess":
    case "uno":
    case "matiks":
    default:
      return (
        <GameArenaPlaceholder
          gameId={gameId}
          roomId={roomId}
          mode={mode}
          playerCount={playerCount}
          onExit={handleExit}
        />
      );
  }
};

export default GameRoom;
