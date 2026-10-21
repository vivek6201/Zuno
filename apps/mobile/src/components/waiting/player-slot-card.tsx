import React from "react";
import { View } from "react-native";
import { Typography, cn } from "heroui-native";
import { Crown, UserCheck, UserPlus, WifiOff } from "lucide-react-native";
import { RoomPlayerInfo } from "@repo/common/constants/websocket";

export interface PlayerSlotCardProps {
  slotIndex: number;
  player?: RoomPlayerInfo;
  className?: string;
}

const SLOT_DEFAULT_COLORS = ["#2563EB", "#22C55E", "#EF4444", "#EAB308"];

const PlayerSlotCard: React.FC<PlayerSlotCardProps> = ({
  slotIndex,
  player,
  className = "",
}) => {
  const isOccupied = !!player;
  const slotColor = player?.color || SLOT_DEFAULT_COLORS[slotIndex % SLOT_DEFAULT_COLORS.length];

  if (!isOccupied) {
    return (
      <View
        className={cn(
          "bg-white/70 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex-row items-center",
          className,
        )}
      >
        <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mr-3.5">
          <UserPlus size={22} color="#94A3B8" />
        </View>

        <View className="flex-1">
          <Typography
            type="body"
            className="text-slate-400 font-bold text-sm"
          >
            Slot {slotIndex + 1}
          </Typography>
          <Typography
            type="body-xs"
            className="text-slate-300 font-medium text-xs mt-0.5"
          >
            Waiting for player to join...
          </Typography>
        </View>
      </View>
    );
  }

  const isDisconnected = !player.isConnected;

  return (
    <View
      className={cn(
        "bg-white border rounded-2xl p-4 flex-row items-center shadow-sm",
        isDisconnected
          ? "border-slate-200 opacity-60"
          : "border-slate-100",
        className,
      )}
    >
      {/* Player Avatar / Color Badge */}
      <View
        style={{ borderColor: slotColor }}
        className="w-12 h-12 rounded-full border-2 bg-slate-100 items-center justify-center mr-3.5 relative"
      >
        <Typography
          type="h4"
          className="font-black text-base text-slate-800"
        >
          {player.name?.[0]?.toUpperCase() || "P"}
        </Typography>

        {/* Color Dot indicator */}
        <View
          style={{ backgroundColor: slotColor }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
        />
      </View>

      {/* Player Details */}
      <View className="flex-1">
        <View className="flex-row items-center gap-x-2">
          <Typography
            type="body"
            className="font-extrabold text-slate-900 text-sm leading-tight"
          >
            {player.name}
          </Typography>

          {/* Host Crown Badge */}
          {player.isHost && (
            <View className="flex-row items-center bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              <Crown size={12} color="#D97706" className="mr-1" />
              <Typography
                type="body-xs"
                className="text-amber-700 font-black text-[10px]"
              >
                HOST
              </Typography>
            </View>
          )}
        </View>

        {/* Status / Connection Line */}
        <View className="flex-row items-center mt-1">
          {isDisconnected ? (
            <View className="flex-row items-center">
              <WifiOff size={12} color="#94A3B8" className="mr-1" />
              <Typography
                type="body-xs"
                className="text-slate-400 font-medium text-xs"
              >
                Reconnecting...
              </Typography>
            </View>
          ) : (
            <View className="flex-row items-center">
              <UserCheck size={12} color="#16A34A" className="mr-1" />
              <Typography
                type="body-xs"
                className="text-emerald-600 font-semibold text-xs"
              >
                Ready
              </Typography>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default PlayerSlotCard;
