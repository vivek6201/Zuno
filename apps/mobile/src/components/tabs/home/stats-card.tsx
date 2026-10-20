import { View } from "react-native";
import React from "react";
import { Typography, cn } from "heroui-native";
import { Ribbon } from "lucide-react-native";

export interface StatsCardProps {
  icon?: React.ReactNode;
  value?: string | number;
  label?: string;
  className?: string;
}

const StatsCard = ({
  icon = <Ribbon color="#2563EB" size={24} />,
  value = "12",
  label = "Games",
  className = "",
}: StatsCardProps) => {
  return (
    <View
      className={cn(
        "w-full rounded-2xl bg-white items-center justify-center py-3.5 px-2 border border-slate-100 shadow-sm",
        className,
      )}
    >
      <View className="mb-1.5 items-center justify-center">{icon}</View>
      <Typography
        type="body"
        className="font-extrabold text-slate-900 text-base"
      >
        {value}
      </Typography>
      <Typography
        type="body-sm"
        className="text-slate-400 font-medium text-[11px] text-center mt-0.5"
        numberOfLines={1}
      >
        {label}
      </Typography>
    </View>
  );
};

export default StatsCard;
