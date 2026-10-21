import React from "react";
import { Share, TouchableOpacity, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { Share2, Users } from "lucide-react-native";

export interface RoomCodeCardProps {
  roomId: string;
  gameTitle?: string;
  currentPlayers: number;
  maxPlayers: number;
  className?: string;
}

const RoomCodeCard: React.FC<RoomCodeCardProps> = ({
  roomId,
  gameTitle,
  currentPlayers,
  maxPlayers,
  className = "",
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my ${gameTitle || "Zuno"} game! Room Code: ${roomId}`,
      });
    } catch (e) {
      console.warn("Error sharing room code:", e);
    }
  };

  return (
    <View
      className={cn(
        "bg-white rounded-3xl p-5 border border-slate-100 shadow-sm",
        className,
      )}
    >
      {/* Top Row: Game Title & Player Count Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <Typography
          type="body-sm"
          className="text-slate-500 font-semibold text-xs uppercase tracking-wider"
        >
          {gameTitle ? `${gameTitle} Room Code` : "Room Code"}
        </Typography>

        <View className="flex-row items-center bg-blue-50 px-2.5 py-1 rounded-full">
          <Users size={14} color="#2563EB" className="mr-1.5" />
          <Typography
            type="body-xs"
            className="text-primary font-bold text-xs"
          >
            {currentPlayers} / {maxPlayers} Players
          </Typography>
        </View>
      </View>

      {/* Center: Large Room Code */}
      <View className="flex-row items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3">
        <Typography
          type="h2"
          className="font-black text-2xl tracking-widest text-slate-800"
        >
          {roomId}
        </Typography>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleShare}
          className="flex-row items-center bg-primary px-3.5 py-2 rounded-xl"
        >
          <Share2 size={16} color="white" className="mr-1.5" />
          <Typography
            type="body-xs"
            className="text-white font-bold text-xs"
          >
            Share Code
          </Typography>
        </TouchableOpacity>
      </View>

      <Typography
        type="body-xs"
        className="text-slate-400 font-normal text-center text-[11px] mt-2.5"
      >
        Share this code with friends so they can join your lobby
      </Typography>
    </View>
  );
};

export default RoomCodeCard;
