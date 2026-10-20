import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography, cn } from "heroui-native";
import { ArrowRight, Globe, Users } from "lucide-react-native";

export type GameModeType = "online" | "local";

export interface ModeCardProps {
  /**
   * Mode type: "online" or "local"
   */
  mode: GameModeType;

  /**
   * Title text. Defaults to "Play Online" or "Play Local" based on mode.
   */
  title?: string;

  /**
   * Subtitle description text.
   */
  subtitle?: string;

  /**
   * Custom icon component to override default Globe or Users icon.
   */
  icon?: React.ReactNode;

  /**
   * Gradient colors for the squircle badge.
   * Defaults to vibrant blue gradient.
   */
  gradientColors?: readonly [string, string, ...string[]] | string[];

  /**
   * Background color of the inner circular disc behind the icon.
   * Defaults to "#1D4ED8".
   */
  innerCircleColor?: string;

  /**
   * Color of the right navigation arrow. Defaults to "#2563EB".
   */
  arrowColor?: string;

  /**
   * Action when the card is pressed.
   */
  onPress?: () => void;

  /**
   * Additional className for the outer card container.
   */
  className?: string;

  /**
   * Additional style for the outer card container.
   */
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_CONFIGS = {
  online: {
    title: "Play Online",
    subtitle: "Play with random players or invite your friends",
    gradientColors: ["#60A5FA", "#3B82F6", "#2563EB"] as const,
    innerCircleColor: "#1D4ED8",
    arrowColor: "#2563EB",
  },
  local: {
    title: "Play Local",
    subtitle: "Play with friends on a single device",
    gradientColors: ["#60A5FA", "#3B82F6", "#2563EB"] as const,
    innerCircleColor: "#1D4ED8",
    arrowColor: "#2563EB",
  },
} as const;

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  title,
  subtitle,
  icon,
  gradientColors,
  innerCircleColor,
  arrowColor,
  onPress,
  className = "",
  style,
}) => {
  const config = DEFAULT_CONFIGS[mode] ?? DEFAULT_CONFIGS.online;

  const resolvedTitle = title ?? config.title;
  const resolvedSubtitle = subtitle ?? config.subtitle;
  const resolvedGradientColors = (gradientColors ?? config.gradientColors) as [
    string,
    string,
    ...string[],
  ];
  const resolvedInnerCircleColor = innerCircleColor ?? config.innerCircleColor;
  const resolvedArrowColor = arrowColor ?? config.arrowColor;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      className={cn(
        "bg-white rounded-2xl shadow py-4 px-3.5 flex-row items-center border border-slate-100",
        className,
      )}
    >
      {/* Left Icon Squircle Badge */}
      <View className="rounded-xl overflow-hidden">
        <LinearGradient
          colors={resolvedGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          className="w-14 h-14 items-center justify-center"
        >
          {/* Inner Circular Emblem */}
          <View
            className="rounded-full w-11 h-11 items-center justify-center"
            style={{ backgroundColor: resolvedInnerCircleColor }}
          >
            {icon ? (
              icon
            ) : mode === "online" ? (
              <Globe color="#FFFFFF" size={24} strokeWidth={2.3} />
            ) : (
              <Users color="#FFFFFF" size={24} strokeWidth={2.3} />
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Center Text Block */}
      <View className="flex-1 ml-3.5 mr-2 justify-center">
        <Typography
          type="h3"
          className="text-slate-900 font-extrabold text-[17px] tracking-tight"
        >
          {resolvedTitle}
        </Typography>
        <Typography
          type="body-sm"
          className="text-slate-500 font-medium text-xs mt-0.5 leading-snug"
        >
          {resolvedSubtitle}
        </Typography>
      </View>

      {/* Right Navigation Arrow */}
      <View className="items-center justify-center pr-1 pl-1">
        <ArrowRight color={resolvedArrowColor} size={22} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
};

export default ModeCard;
