import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { Typography, cn } from "heroui-native";
import { Play, Users } from "lucide-react-native";
import {
  DEFAULT_GRADIENT_COLORS,
  GAME_GRADIENTS,
} from "@repo/common/constants/gradients";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ScreenHeader from "@/components/common/screen-header";
import { MODE_GRADIENT_LOCATIONS } from "@/utils/constants";

import { getGameCapabilities } from "@/utils/game-capabilities";
import { useToast } from "heroui-native";

const LocalLobby = () => {
  const router = useRouter();
  const { toast } = useToast();
  const params = useGlobalSearchParams<{ gameId: string }>();
  const gameId = params.gameId ?? "ludo";
  const capabilities = getGameCapabilities(gameId);
  const gradientColors = GAME_GRADIENTS[gameId] ?? DEFAULT_GRADIENT_COLORS;

  const [playerCount, setPlayerCount] = useState<2 | 4>(4);

  // If local mode is not supported for this game, redirect to multiplayer lobby
  React.useEffect(() => {
    if (!capabilities.supportsLocal) {
      toast.show({
        variant: "warning",
        label: `${capabilities.title} only supports Online Multiplayer mode.`,
      });
      router.replace({
        pathname: "/games/[gameId]/lobby/multiplayer-lobby",
        params: { gameId },
      });
    }
  }, [capabilities.supportsLocal, capabilities.title, gameId, router, toast]);

  const handleStartGame = () => {
    router.push({
      pathname: "/game/[roomId]",
      params: {
        roomId: "local",
        gameId,
        mode: "local",
        playerCount: playerCount.toString(),
      },
    });
  };

  return (
    <BottomSheetLayout
      gradientColors={gradientColors}
      gradientLocations={MODE_GRADIENT_LOCATIONS}
      header={
        <ScreenHeader
          title={gameId}
          subtitle="Local Pass & Play"
        />
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 95,
        gap: 16,
      }}
    >
      {/* Player Count Selection Card */}
      <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <Typography
          type="h4"
          className="text-slate-900 font-extrabold text-base"
        >
          Select Players
        </Typography>
        <Typography
          type="body-sm"
          className="text-slate-500 font-medium text-xs mt-0.5"
        >
          Pass and play with friends on the same device
        </Typography>

        <View className="flex-row gap-x-3 mt-4">
          {[2, 4].map((count) => {
            const isSelected = playerCount === count;
            return (
              <TouchableOpacity
                key={count}
                activeOpacity={0.8}
                onPress={() => setPlayerCount(count as 2 | 4)}
                className={cn(
                  "flex-1 py-4 px-3 rounded-2xl items-center justify-center border-2",
                  isSelected
                    ? "bg-blue-50/80 border-primary"
                    : "bg-slate-50 border-slate-200",
                )}
              >
                <Users
                  size={24}
                  color={isSelected ? "#2563EB" : "#64748B"}
                  className="mb-1.5"
                />
                <Typography
                  type="body"
                  className={cn(
                    "font-black text-sm",
                    isSelected ? "text-primary" : "text-slate-700",
                  )}
                >
                  {count} Players
                </Typography>
                <Typography
                  type="body-xs"
                  className="text-slate-400 font-medium text-[11px] mt-0.5"
                >
                  {count === 2 ? "Red vs Yellow" : "4 Colors"}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Start Match Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleStartGame}
        className="w-full py-4 rounded-2xl bg-primary flex-row items-center justify-center shadow-md shadow-primary/30"
      >
        <Play size={18} color="white" fill="white" className="mr-2" />
        <Typography
          type="body"
          className="text-white font-black text-base"
        >
          Start Match
        </Typography>
      </TouchableOpacity>
    </BottomSheetLayout>
  );
};

export default LocalLobby;
