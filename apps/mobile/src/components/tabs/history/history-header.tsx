import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "heroui-native";
import BackButton from "@/components/common/back-button";

export interface HistoryHeaderProps {
  title?: string;
  onBackPress?: () => void;
  className?: string;
}

const HistoryHeader = ({
  title = "Match History",
  onBackPress,
  className = "",
}: HistoryHeaderProps) => {
  return (
    <View className={className}>
      <SafeAreaView edges={["top"]} />

      {/* Top Header Bar: Left Arrow & Title */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <BackButton
          color="white"
          size={24}
          className="-ml-1 mr-3"
          onPress={onBackPress}
        />
        <Typography
          type="h2"
          className="text-white font-extrabold text-xl tracking-tight"
        >
          {title}
        </Typography>
      </View>
    </View>
  );
};

export default HistoryHeader;
