import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { History as HistoryIcon } from "lucide-react-native";
import { MatchHistoryItem } from "@repo/common/types";
import MatchItemCard from "./match-item-card";

export interface MatchHistoryListProps {
  matches: MatchHistoryItem[];
  isLoading?: boolean;
  onItemPress?: (item: MatchHistoryItem) => void;
  className?: string;
}

const MatchHistoryList = ({
  matches,
  isLoading = false,
  onItemPress,
  className = "",
}: MatchHistoryListProps) => {
  if (isLoading && matches.length === 0) {
    return (
      <View
        className={cn(
          "bg-white rounded-3xl border border-slate-100 p-8 items-center justify-center min-h-64 shadow-sm",
          className,
        )}
      >
        <ActivityIndicator size="large" color="#2563EB" />
        <Typography
          type="body-sm"
          className="text-slate-400 font-medium text-xs mt-3 text-center"
        >
          Loading match history...
        </Typography>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View
        className={cn(
          "bg-white rounded-3xl border border-slate-100 p-8 items-center justify-center min-h-64 shadow-sm",
          className,
        )}
      >
        <View className="w-14 h-14 rounded-full bg-blue-50 items-center justify-center mb-3">
          <HistoryIcon size={28} color="#2563EB" strokeWidth={2} />
        </View>
        <Typography
          type="h4"
          className="text-slate-800 font-bold text-base text-center"
        >
          No Matches Found
        </Typography>
        <Typography
          type="body-sm"
          className="text-slate-400 font-normal text-xs text-center mt-1 max-w-55"
        >
          You don't have any recorded matches in this category yet.
        </Typography>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "bg-white rounded-3xl border border-slate-100/90 shadow-sm overflow-hidden",
        className,
      )}
    >
      {matches.map((match, index) => (
        <MatchItemCard
          key={match.id}
          item={match}
          isLast={index === matches.length - 1}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
};

export default MatchHistoryList;
