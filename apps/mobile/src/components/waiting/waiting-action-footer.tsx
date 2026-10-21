import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { Play } from "lucide-react-native";

export interface WaitingActionFooterProps {
  isHost: boolean;
  playersCount: number;
  minPlayers: number;
  onStartGame: () => void;
  className?: string;
}

const WaitingActionFooter: React.FC<WaitingActionFooterProps> = ({
  isHost,
  playersCount,
  minPlayers,
  onStartGame,
  className = "",
}) => {
  const canStart = isHost && playersCount >= minPlayers;

  if (isHost) {
    return (
      <View className={cn("gap-y-2", className)}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canStart}
          onPress={onStartGame}
          className={cn(
            "w-full py-4 rounded-2xl flex-row items-center justify-center shadow-md",
            canStart
              ? "bg-primary shadow-primary/30 active:bg-blue-700"
              : "bg-slate-200 shadow-none",
          )}
        >
          <Play
            size={18}
            color={canStart ? "white" : "#94A3B8"}
            fill={canStart ? "white" : "#94A3B8"}
            className="mr-2"
          />
          <Typography
            type="body"
            className={cn(
              "font-black text-base tracking-wide",
              canStart ? "text-white" : "text-slate-400",
            )}
          >
            Start Game
          </Typography>
        </TouchableOpacity>

        {!canStart && (
          <Typography
            type="body-xs"
            className="text-slate-400 font-medium text-center text-xs"
          >
            Need at least {minPlayers} players to start ({playersCount} currently joined)
          </Typography>
        )}
      </View>
    );
  }

  return (
    <View
      className={cn(
        "bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center justify-center gap-x-3 shadow-sm",
        className,
      )}
    >
      <ActivityIndicator size="small" color="#2563EB" />
      <Typography
        type="body-sm"
        className="text-slate-600 font-bold text-sm"
      >
        Waiting for host to start the game...
      </Typography>
    </View>
  );
};

export default WaitingActionFooter;
