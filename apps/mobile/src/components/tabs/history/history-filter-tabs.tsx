import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { MatchFilterType } from "@repo/common/api/routes/history";

export interface FilterOption {
  key: MatchFilterType;
  label: string;
}

export interface HistoryFilterTabsProps {
  activeFilter: MatchFilterType;
  onSelectFilter: (filter: MatchFilterType) => void;
  className?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "won", label: "Wins" },
  { key: "lost", label: "Losses" },
];

const HistoryFilterTabs = ({
  activeFilter,
  onSelectFilter,
  className = "",
}: HistoryFilterTabsProps) => {
  return (
    <View className={cn("flex-row items-center gap-x-2.5", className)}>
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;

        return (
          <TouchableOpacity
            key={option.key}
            activeOpacity={0.8}
            onPress={() => onSelectFilter(option.key)}
            className={cn(
              "flex-1 py-2.5 rounded-xl items-center justify-center transition-all",
              isActive
                ? "bg-blue-600 shadow-sm shadow-blue-500/20"
                : "bg-[#EAF2FD] active:bg-[#DFECFD]",
            )}
          >
            <Typography
              type="body-sm"
              className={cn(
                "text-sm tracking-tight",
                isActive
                  ? "text-white font-bold"
                  : "text-[#3B82F6] font-semibold",
              )}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HistoryFilterTabs;
