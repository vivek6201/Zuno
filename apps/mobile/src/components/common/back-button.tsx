import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import COLORS from "@repo/common/constants/colors";

export interface BackButtonProps {
  className?: string;
  isBgWhite?: boolean;
  color?: string;
  size?: number;
}

const BackButton = ({
  className = "",
  isBgWhite = false,
  color,
  size = 20,
}: BackButtonProps) => {
  const router = useRouter();
  const iconColor =
    color ?? (isBgWhite ? COLORS.primary.DEFAULT : COLORS.surface.DEFAULT);

  return (
    <TouchableOpacity
      onPress={router.back}
      hitSlop={8}
      activeOpacity={0.7}
      className={`p-1 items-center justify-center ${className}`.trim()}
    >
      <ArrowLeft size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
