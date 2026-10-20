import { View, Image, ImageSourcePropType } from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Typography } from "heroui-native";
import {
  GAME_GRADIENTS,
  DEFAULT_GRADIENT_COLORS,
} from "@repo/common/constants/gradients";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ModeCard from "@/components/lobby/mode-card";

import ludoImage from "@assets/images/ludo-transparent.png";
import unoImage from "@assets/images/uno-image.png";
import matiksImage from "@assets/images/matiks-image.png";
import chessImage from "@assets/images/chess-image.png";
import { MODE_GRADIENT_LOCATIONS } from "@/utils/constants";

import ScreenHeader from "@/components/common/screen-header";

const gameImages: Record<string, ImageSourcePropType> = {
  ludo: ludoImage as ImageSourcePropType,
  uno: unoImage as ImageSourcePropType,
  matiks: matiksImage as ImageSourcePropType,
  chess: chessImage as ImageSourcePropType,
};

const Mode = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const gameId = params.gameId as string;
  const pageImage = gameImages[gameId];
  const gradientColors = GAME_GRADIENTS[gameId] ?? DEFAULT_GRADIENT_COLORS;

  const handlePlayOnline = () => {
    router.push({
      pathname: "/games/[gameId]/lobby/multiplayer-lobby",
      params: { gameId },
    });
  };

  const handlePlayLocal = () => {
    router.push({
      pathname: "/games/[gameId]/lobby/local-lobby",
      params: { gameId },
    });
  };

  return (
    <BottomSheetLayout
      gradientColors={gradientColors}
      gradientLocations={MODE_GRADIENT_LOCATIONS}
      header={
        <ScreenHeader title={gameId}>
          {pageImage ? (
            <View className="flex-row justify-center items-center h-fit">
              <Image
                source={pageImage}
                resizeMode="contain"
                className="w-60 h-60"
              />
            </View>
          ) : null}
        </ScreenHeader>
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 95,
        gap: 14,
      }}
    >
      <View className="items-center py-1">
        <Typography
          type="body"
          className="font-extrabold text-balance text-xl text-slate-900"
        >
          How do you want to play?
        </Typography>
      </View>

      <ModeCard mode="online" onPress={handlePlayOnline} />

      <ModeCard mode="local" onPress={handlePlayLocal} />
    </BottomSheetLayout>
  );
};

export default Mode;
