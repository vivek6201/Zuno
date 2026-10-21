import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import LudoArena from "@/components/game/ludo/screens/LudoArena";

const GameRoom = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    roomId: string;
    mode?: string;
    playerCount?: string;
  }>();
  const roomId = params.roomId || "local";
  const mode =
    params.mode === "local" || roomId === "local" ? "local" : "multiplayer";
  const playerCount = params.playerCount
    ? parseInt(params.playerCount, 10)
    : undefined;

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/games");
    }
  };

  return (
    <LudoArena
      roomId={roomId}
      mode={mode}
      playerCount={playerCount}
      onExit={handleExit}
    />
  );
};

export default GameRoom;
