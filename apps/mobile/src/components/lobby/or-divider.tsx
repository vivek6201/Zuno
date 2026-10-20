import React from "react";
import { View } from "react-native";
import { Typography, cn } from "heroui-native";

export interface OrDividerProps {
  label?: string;
  className?: string;
}

export const OrDivider: React.FC<OrDividerProps> = ({
  label = "OR",
  className = "",
}) => {
  return (
    <View className={cn("flex-row items-center my-1 px-1", className)}>
      <View className="flex-1 h-px bg-slate-200" />
      <Typography
        type="body-sm"
        className="px-3 text-slate-400 font-bold text-xs tracking-wider"
      >
        {label}
      </Typography>
      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
};

export default OrDivider;
