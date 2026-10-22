import React from "react";
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "heroui-native";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import { SupportedGameId, getGameCapabilities } from "@/utils/game-capabilities";

import ludoImage from "@assets/images/ludo-transparent.png";
import unoImage from "@assets/images/uno-image.png";
import matiksImage from "@assets/images/matiks-image.png";
import chessImage from "@assets/images/chess-image.png";

const GAME_IMAGES: Record<SupportedGameId, ImageSourcePropType> = {
  ludo: ludoImage as ImageSourcePropType,
  uno: unoImage as ImageSourcePropType,
  matiks: matiksImage as ImageSourcePropType,
  chess: chessImage as ImageSourcePropType,
};

export interface GameArenaPlaceholderProps {
  gameId: SupportedGameId;
  roomId: string;
  mode: "local" | "multiplayer";
  playerCount?: number;
  onExit: () => void;
}

export const GameArenaPlaceholder: React.FC<GameArenaPlaceholderProps> = ({
  gameId,
  roomId,
  mode,
  playerCount,
  onExit,
}) => {
  const insets = useSafeAreaInsets();
  const capabilities = getGameCapabilities(gameId);
  const imageSource = GAME_IMAGES[gameId];

  return (
    <View
      className="flex-1 bg-slate-900 justify-between"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
        paddingLeft: Math.max(insets.left, 16),
        paddingRight: Math.max(insets.right, 16),
      }}
    >
      {/* ── TOP HEADER BAR ── */}
      <View className="flex-row items-center justify-between py-1.5">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onExit}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Typography
            type="h3"
            className="text-white font-black text-lg tracking-tight"
          >
            {capabilities.title}
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

        <View className="w-10 h-10" />
      </View>

      {/* ── CENTER CONTENT ── */}
      <View className="items-center px-4">
        {imageSource && (
          <Image
            source={imageSource}
            resizeMode="contain"
            className="w-48 h-48 mb-6"
          />
        )}

        <View className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 items-center w-full max-w-sm shadow-xl">
          <View className="w-12 h-12 rounded-2xl bg-primary/20 items-center justify-center mb-3">
            <Sparkles size={24} color="#3B82F6" />
          </View>

          <Typography
            type="h4"
            className="text-white font-black text-xl text-center"
          >
            {capabilities.title} Arena
          </Typography>

          <Typography
            type="body-sm"
            className="text-slate-400 font-medium text-center text-xs mt-1.5 leading-relaxed"
          >
            The dedicated {capabilities.title} gameplay interface is currently
            being prepared.
          </Typography>

          <View className="flex-row items-center bg-slate-700/50 px-3 py-1.5 rounded-full mt-4 gap-x-2">
            <View className="w-2 h-2 rounded-full bg-amber-400" />
            <Typography
              type="body-xs"
              className="text-slate-300 font-bold text-[11px]"
            >
              Mode: {mode === "local" ? "Pass & Play" : "Online Multiplayer"}
              {playerCount ? ` • ${playerCount} Players` : ""}
            </Typography>
          </View>
        </View>
      </View>

      {/* ── BOTTOM ACTION ── */}
      <View className="w-full">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onExit}
          className="w-full py-4 rounded-2xl bg-slate-800 border border-slate-700 items-center justify-center"
        >
          <Typography type="body" className="text-white font-black text-base">
            Exit to Games
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameArenaPlaceholder;
