import React from "react";
import { useGlobalSearchParams } from "expo-router";
import {
  DEFAULT_GRADIENT_COLORS,
  GAME_GRADIENTS,
} from "@repo/common/constants/gradients";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ScreenHeader from "@/components/common/screen-header";
import { MODE_GRADIENT_LOCATIONS } from "@/utils/constants";

const LocalLobby = () => {
  const params = useGlobalSearchParams<{ gameId: string }>();
  const gameId = params.gameId ?? "Game";
  const gradientColors = GAME_GRADIENTS[gameId] ?? DEFAULT_GRADIENT_COLORS;

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
        gap: 14,
      }}
    >
      {/* Local lobby content */}
    </BottomSheetLayout>
  );
};

export default LocalLobby;
