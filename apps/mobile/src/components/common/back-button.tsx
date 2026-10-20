import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { cn } from "heroui-native";
import COLORS from "@repo/common/constants/colors";

export interface BackButtonProps {
  className?: string;
  isBgWhite?: boolean;
  color?: string;
  size?: number;
  onPress?: () => void;
}

const BackButton = ({
  className = "",
  isBgWhite = false,
  color,
  size = 20,
  onPress,
}: BackButtonProps) => {
  const router = useRouter();
  const iconColor =
    color ?? (isBgWhite ? COLORS.primary.DEFAULT : COLORS.surface.DEFAULT);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={8}
      activeOpacity={0.7}
      className={cn("p-1 items-center justify-center", className)}
    >
      <ArrowLeft size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
