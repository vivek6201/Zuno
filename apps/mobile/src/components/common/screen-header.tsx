import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, cn } from "heroui-native";
import BackButton from "./back-button";

export interface ScreenHeaderProps {
  /**
   * Title text displayed in the center of the header bar.
   */
  title: string;

  /**
   * Optional subtitle displayed below the title.
   */
  subtitle?: string;

  /**
   * Whether to show the back button. Defaults to true.
   */
  showBackButton?: boolean;

  /**
   * Custom back button handler. Defaults to router.back().
   */
  onBackPress?: () => void;

  /**
   * Whether back button background is white. Defaults to false (for colored/gradient headers).
   */
  isBgWhite?: boolean;

  /**
   * Title text color class. Defaults to "text-white".
   */
  titleColorClassName?: string;

  /**
   * Optional right element (e.g. icon button, action).
   */
  rightElement?: React.ReactNode;

  /**
   * Optional children rendered below the top bar (e.g. game illustration, stats banner).
   */
  children?: React.ReactNode;

  /**
   * Style for the outer header container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Class name for the outer header container.
   */
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  isBgWhite = false,
  titleColorClassName = "text-white",
  rightElement,
  children,
  style,
  className = "",
}) => {
  return (
    <View style={style} className={cn(className)}>
      {/* Top Safe Area Inset to clear status bar / notch */}
      <SafeAreaView edges={["top"]} />

      {/* Centered Navigation Bar */}
      <View className="flex-row justify-center items-center py-3.5 px-4 relative min-h-12">
        {showBackButton && (
          <BackButton
            isBgWhite={isBgWhite}
            className="absolute left-4 z-10"
            onPress={onBackPress}
          />
        )}

        <View className="items-center justify-center px-12">
          <Typography
            type="h3"
            className={cn(
              titleColorClassName,
              "font-black text-xl tracking-tight capitalize text-center",
            )}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              type="body-sm"
              className="text-white/75 font-normal text-xs mt-0.5 text-center"
            >
              {subtitle}
            </Typography>
          ) : null}
        </View>

        {rightElement ? (
          <View className="absolute right-4 z-10">{rightElement}</View>
        ) : null}
      </View>

      {/* Optional extra header content (illustrations, banners, etc.) */}
      {children}
    </View>
  );
};

export default ScreenHeader;
