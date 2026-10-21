import React from "react";
import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { MatchHistoryItem } from "@repo/common/types";

// Game icon image assets matching the app design
import ludoIcon from "@assets/images/ludo-icon.jpg";
import unoIcon from "@assets/images/uno-icon.jpg";
import chessIcon from "@assets/images/chess-icon.jpg";
import matiksIcon from "@assets/images/matiks-icon.jpg";

export const GAME_ICONS: Record<string, ImageSourcePropType> = {
  ludo: ludoIcon,
  uno: unoIcon,
  chess: chessIcon,
  matiks: matiksIcon,
};

export const GAME_DISPLAY_NAMES: Record<string, string> = {
  ludo: "Ludo",
  uno: "UNO",
  chess: "Chess",
  matiks: "Matiks",
};

export interface MatchItemCardProps {
  item: MatchHistoryItem;
  isLast?: boolean;
  onPress?: (item: MatchHistoryItem) => void;
  className?: string;
}

const MatchItemCard = ({
  item,
  isLast = false,
  onPress,
  className = "",
}: MatchItemCardProps) => {
  const iconSource = GAME_ICONS[item.gameType] ?? ludoIcon;
  const gameName = GAME_DISPLAY_NAMES[item.gameType] ?? item.gameType;
  const opponentsText =
    item.opponents && item.opponents.length > 0
      ? `vs ${item.opponents.join(", ")}`
      : "Solo";
  const isWon = item.result === "won";

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress ? () => onPress(item) : undefined}
      className={cn(
        "flex-row items-center py-3.5 px-4",
        !isLast && "border-b border-slate-100/90",
        className,
      )}
    >
      {/* 1. Game Icon */}
      <Image
        source={iconSource}
        className="w-12 h-12 rounded-xl bg-slate-100"
        resizeMode="cover"
      />

      {/* 2. Match Details */}
      <View className="flex-1 ml-3.5 justify-center">
        {/* Game Title */}
        <Typography
          type="h5"
          className="font-extrabold text-slate-900 text-base leading-tight"
        >
          {gameName}
        </Typography>

        {/* Opponents List */}
        <Typography
          type="body-sm"
          className="text-slate-500 font-medium text-[13px] mt-0.5 leading-tight"
          numberOfLines={1}
        >
          {opponentsText}
        </Typography>

        {/* Players Count & Date */}
        <Typography
          type="body-xs"
          className="text-slate-400 font-normal text-xs mt-1 leading-tight"
        >
          {item.playersCount} Players • {item.playedAt}
        </Typography>
      </View>

      {/* 3. Result Pill Badge (Won: Green, Lost: Red) */}
      <View
        className={cn(
          "px-3.5 py-1 rounded-full items-center justify-center self-center",
          isWon ? "bg-emerald-500" : "bg-red-500",
        )}
      >
        <Typography
          type="body-xs"
          className="text-white font-bold text-xs leading-none"
        >
          {isWon ? "Won" : "Lost"}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default MatchItemCard;
