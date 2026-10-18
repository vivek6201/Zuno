import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "heroui-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";

import BackButton from "@/components/common/back-button";
import GameCard from "@/components/tabs/games/game-card";

// Game icon assets (Zero-background transparent 3D renders)
import ludoIcon from "@assets/images/ludo-transparent.png";
import unoIcon from "@assets/images/uno-transparent.png";
import matiksIcon from "@assets/images/matiks-transparent.png";
import chessIcon from "@assets/images/chess-transparent.png";

interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colors: [string, string, ...string[]];
}

const GAMES_LIST: GameItem[] = [
  {
    id: "ludo",
    title: "Ludo",
    subtitle: "Classic board game for 2-4 players",
    icon: ludoIcon,
    colors: ["#0284C7", "#2563EB", "#1E40AF"],
  },
  {
    id: "uno",
    title: "UNO",
    subtitle: "Match cards, score and win",
    icon: unoIcon,
    colors: ["#F43F5E", "#EF4444", "#B91C1C"],
  },
  {
    id: "matiks",
    title: "Matiks",
    subtitle: "Strategize, make moves, win the round",
    icon: matiksIcon,
    colors: ["#8B5CF6", "#7C3AED", "#581C87"],
  },
  {
    id: "chess",
    title: "Chess",
    subtitle: "Think. Plan. Checkmate.",
    icon: chessIcon,
    colors: ["#22C55E", "#16A34A", "#14532D"],
  },
];

const Games = () => {
  const router = useRouter();
  const snapPoints = useMemo(() => ["91%", "96%"], []);

  const handleGamePress = (gameId: string) => {
    router.push({
      pathname: "/games/[gameId]/mode",
      params: { gameId },
    });
  };

  return (
    <View className="flex-1 bg-[#F0F5FD]">
      {/* Background Linear Gradient with Faded Bottom Transition */}
      <LinearGradient
        colors={[
          "#1E3A8A",
          "#1D4ED8",
          "#2563EB",
          "#3B82F6",
          "#60A5FA",
          "#93C5FD",
          "#DBEAFE",
          "#F0F5FD",
        ]}
        locations={[0, 0.08, 0.18, 0.25, 0.3, 0.35, 0.4, 0.46]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header (Fixed at top above the sheet) */}
      <View>
        <SafeAreaView edges={["top"]} />
        <View className="flex-row justify-center items-center py-3.5 px-4 relative">
          <BackButton isBgWhite={false} className="absolute left-4" />
          <Typography
            type="h3"
            className="text-white font-black text-xl tracking-tight"
          >
            Choose a Game
          </Typography>
        </View>
      </View>

      {/* Draggable & Scrollable Surface Bottom Sheet */}
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{
          backgroundColor: "#CBD5E1",
          width: 44,
          height: 4,
          borderRadius: 2,
        }}
        backgroundStyle={{
          backgroundColor: "#F0F5FD",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 95,
            gap: 14,
          }}
        >
          {GAMES_LIST.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              subtitle={game.subtitle}
              icon={game.icon}
              colors={game.colors}
              onPress={() => handleGamePress(game.id)}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Games;
