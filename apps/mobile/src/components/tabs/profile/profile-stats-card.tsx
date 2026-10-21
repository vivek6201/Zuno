import React from "react";
import { View } from "react-native";
import { Typography, cn } from "heroui-native";
import { Ribbon, Swords, Trophy } from "lucide-react-native";

export interface ProfileStatsData {
  gamesPlayed?: number | string;
  wins?: number | string;
  losses?: number | string;
}

export interface ProfileStatsCardProps {
  stats?: ProfileStatsData;
  className?: string;
}

const ProfileStatsCard = ({ stats, className }: ProfileStatsCardProps) => {
  const gamesPlayed = stats?.gamesPlayed ?? 12;
  const wins = stats?.wins ?? 8;
  const losses = stats?.losses ?? 4;

  return (
    <View
      className={cn(
        "bg-white rounded-xl py-4 px-4 flex-row items-center border border-slate-100 shadow-sm",
        className,
      )}
    >
      {/* Column 1: Games Played */}
      <View className="flex-1 flex-row items-center justify-center">
        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-2.5">
          <Ribbon color="#2563EB" size={20} strokeWidth={2.2} />
        </View>
        <View>
          <Typography
            type="h3"
            className="text-slate-900 font-black text-lg leading-tight"
          >
            {gamesPlayed}
          </Typography>
          <Typography
            type="body-xs"
            className="text-slate-400 font-semibold text-[11px] mt-0.5"
          >
            Games Played
          </Typography>
        </View>
      </View>

      {/* Divider 1 */}
      <View className="w-px h-8 bg-slate-100 mx-1" />

      {/* Column 2: Wins */}
      <View className="flex-1 flex-row items-center justify-center">
        <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-2.5">
          <Trophy color="#059669" size={20} strokeWidth={2.2} />
        </View>
        <View>
          <Typography
            type="h3"
            className="text-slate-900 font-black text-lg leading-tight"
          >
            {wins}
          </Typography>
          <Typography
            type="body-xs"
            className="text-slate-400 font-semibold text-[11px] mt-0.5"
          >
            Wins
          </Typography>
        </View>
      </View>

      {/* Divider 2 */}
      <View className="w-px h-8 bg-slate-100 mx-1" />

      {/* Column 3: Losses */}
      <View className="flex-1 flex-row items-center justify-center">
        <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center mr-2.5">
          <Swords color="#EF4444" size={20} strokeWidth={2.2} />
        </View>
        <View>
          <Typography
            type="h3"
            className="text-slate-900 font-black text-lg leading-tight"
          >
            {losses}
          </Typography>
          <Typography
            type="body-xs"
            className="text-slate-400 font-semibold text-[11px] mt-0.5"
          >
            Losses
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default ProfileStatsCard;
