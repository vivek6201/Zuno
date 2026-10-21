import React, { useMemo } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "heroui-native";
import {
  DEFAULT_GRADIENT_COLORS,
  GAME_GRADIENTS,
} from "@repo/common/constants/gradients";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ScreenHeader from "@/components/common/screen-header";
import {
  RoomCodeCard,
  PlayerSlotCard,
  WaitingActionFooter,
} from "@/components/waiting";
import { useWaitingRoom } from "@/hooks/useWaitingRoom";
import { MODE_GRADIENT_LOCATIONS } from "@/utils/constants";

const GAME_TITLES: Record<string, string> = {
  ludo: "Ludo",
  chess: "Chess",
  uno: "UNO",
  matiks: "Matiks",
};

const RoomWaitingArea = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ gameId: string; roomId: string }>();
  const gameId = params.gameId || "ludo";
  const roomId = params.roomId || "";

  const gameTitle = GAME_TITLES[gameId] ?? "Game";
  const gradientColors = GAME_GRADIENTS[gameId] ?? DEFAULT_GRADIENT_COLORS;

  const {
    players,
    isHost,
    maxPlayers,
    minPlayers,
    isLoading,
    isConnected,
    error,
    startGame,
    leaveRoom,
  } = useWaitingRoom(roomId, gameId);

  const handleBackPress = () => {
    Alert.alert(
      "Leave Room?",
      "Are you sure you want to leave the waiting room?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: leaveRoom,
        },
      ],
    );
  };

  const slots = useMemo(() => {
    return Array.from({ length: maxPlayers }, (_, idx) => players[idx]);
  }, [maxPlayers, players]);

  return (
    <BottomSheetLayout
      gradientColors={gradientColors}
      gradientLocations={MODE_GRADIENT_LOCATIONS}
      header={
        <ScreenHeader
          title={`${gameTitle} Lobby`}
          subtitle={
            isConnected
              ? "Waiting for players to join..."
              : "Connecting to server..."
          }
          onBackPress={handleBackPress}
        />
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: Math.max(insets.bottom + 24, 48),
        gap: 16,
      }}
    >
      {/* 1. Room Code Card with Share Button */}
      <RoomCodeCard
        roomId={roomId}
        gameTitle={gameTitle}
        currentPlayers={players.length}
        maxPlayers={maxPlayers}
      />

      {/* 2. Player Slots Section */}
      <View className="gap-y-2.5">
        <Typography
          type="h5"
          className="text-slate-800 font-extrabold text-sm px-1"
        >
          Players ({players.length}/{maxPlayers})
        </Typography>

        {isLoading ? (
          <View className="bg-white rounded-2xl p-8 items-center justify-center border border-slate-100 shadow-sm">
            <ActivityIndicator size="small" color="#2563EB" />
            <Typography
              type="body-xs"
              className="text-slate-400 font-medium text-xs mt-2"
            >
              Joining room lobby...
            </Typography>
          </View>
        ) : (
          slots.map((player, idx) => (
            <PlayerSlotCard
              key={player?.id || `slot-${idx}`}
              slotIndex={idx}
              player={player}
            />
          ))
        )}
      </View>

      {/* 3. Action Footer (Host Start Game / Guest Waiting indicator) */}
      {!isLoading && (
        <WaitingActionFooter
          isHost={isHost}
          playersCount={players.length}
          minPlayers={minPlayers}
          onStartGame={startGame}
          className="mt-2"
        />
      )}
    </BottomSheetLayout>
  );
};

export default RoomWaitingArea;
