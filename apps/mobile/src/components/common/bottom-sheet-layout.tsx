import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { cn } from "heroui-native";
import { DEFAULT_GRADIENT_COLORS } from "@repo/common/constants/gradients";

export const DEFAULT_GRADIENT_LOCATIONS: [number, number, ...number[]] = [
  0, 0.08, 0.18, 0.25, 0.3, 0.35, 0.4, 0.46,
];

export interface BottomSheetLayoutProps extends Omit<
  Partial<BottomSheetProps>,
  "snapPoints" | "children"
> {
  /**
   * Top header content rendered above the bottom sheet (e.g. title, greeting, icons, game banner).
   * The height of this view is dynamically measured to calculate snap points.
   */
  header?: React.ReactNode;

  /**
   * Content rendered inside the bottom sheet.
   */
  children?: React.ReactNode;

  /**
   * Custom gradient colors for the background.
   * Defaults to the standard blue palette.
   */
  gradientColors?: readonly [string, string, ...string[]] | string[];

  /**
   * Gradient color locations.
   */
  gradientLocations?: readonly [number, number, ...number[]] | number[];

  /**
   * Gradient start coordinates. Defaults to { x: 0, y: 0 }.
   */
  gradientStart?: { x: number; y: number };

  /**
   * Gradient end coordinates. Defaults to { x: 0.35, y: 1 }.
   */
  gradientEnd?: { x: number; y: number };

  /**
   * Background color of the root container. Defaults to "#F0F5FD".
   */
  backgroundColor?: string;

  /**
   * Background color of the bottom sheet surface. Defaults to "#F0F5FD".
   */
  sheetBackgroundColor?: string;

  /**
   * Additional spacing offset in pixels between the bottom of the header and the top of the collapsed sheet.
   * Defaults to 0 (sheet top aligns directly with header bottom).
   */
  headerOffset?: number;

  /**
   * Expanded snap point (index 1).
   * Can be a percentage string (e.g., "94%") or a number in points.
   * Defaults to "94%".
   */
  expandedSnapPoint?: string | number;

  /**
   * Explicit snap points override. If provided, disables dynamic header-based calculation.
   */
  snapPoints?: (string | number)[];

  /**
   * Content container style for the BottomSheetScrollView.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Whether to wrap children in a BottomSheetScrollView.
   * Defaults to true. If false, children are rendered directly in the BottomSheet.
   */
  scrollable?: boolean;

  /**
   * Ref for the BottomSheet instance when not using forwardRef.
   */
  sheetRef?: React.Ref<BottomSheet>;

  /**
   * Class name for the header container.
   */
  headerClassName?: string;

  /**
   * Style for the header container.
   */
  headerStyle?: StyleProp<ViewStyle>;

  /**
   * Class name for the outer root container.
   */
  className?: string;

  /**
   * Style for the outer root container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether to display the vertical scroll indicator in BottomSheetScrollView. Defaults to false.
   */
  showsVerticalScrollIndicator?: boolean;
}

const BottomSheetLayout = forwardRef<BottomSheet, BottomSheetLayoutProps>(
  (
    {
      header,
      children,
      gradientColors = DEFAULT_GRADIENT_COLORS,
      gradientLocations = DEFAULT_GRADIENT_LOCATIONS,
      gradientStart = { x: 0, y: 0 },
      gradientEnd = { x: 0.35, y: 1 },
      backgroundColor = "#F0F5FD",
      sheetBackgroundColor = "#F0F5FD",
      headerOffset = 0,
      expandedSnapPoint = "94%",
      snapPoints: customSnapPoints,
      contentContainerStyle,
      scrollable = true,
      sheetRef,
      headerClassName,
      headerStyle,
      className,
      style,
      showsVerticalScrollIndicator = false,
      index = 0,
      enablePanDownToClose = false,
      enableDynamicSizing = false,
      handleIndicatorStyle,
      backgroundStyle,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const { height: windowHeight } = useWindowDimensions();
    const [containerHeight, setContainerHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const effectiveContainerHeight =
      containerHeight > 0 ? containerHeight : windowHeight;

    const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
      const h = Math.round(event.nativeEvent.layout.height);
      if (h > 0) {
        setContainerHeight((prev) => (prev === h ? prev : h));
      }
    }, []);

    const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
      const h = Math.round(event.nativeEvent.layout.height);
      if (h > 0) {
        setHeaderHeight((prev) => (prev === h ? prev : h));
      }
    }, []);

    // Dynamically calculate snap points based on measured header size
    const dynamicSnapPoints = useMemo(() => {
      if (customSnapPoints && customSnapPoints.length > 0) {
        return customSnapPoints;
      }

      const totalHeight = effectiveContainerHeight;
      if (totalHeight <= 0) {
        return ["75%", "94%"];
      }

      // If header is not yet measured, use safe proportional defaults
      if (headerHeight <= 0) {
        return ["75%", "94%"];
      }

      // Collapsed height: height from bottom so top of sheet touches bottom of header
      const targetCollapsed = Math.round(
        totalHeight - headerHeight - headerOffset,
      );

      // Keep collapsed height within reasonable bounds (between 20% and 92% of total height)
      const minCollapsed = Math.round(totalHeight * 0.2);
      const maxCollapsed = Math.round(totalHeight * 0.92);
      const collapsedHeight = Math.min(
        Math.max(targetCollapsed, minCollapsed),
        maxCollapsed,
      );

      // Expanded height calculation
      let expandedHeight: number;
      if (typeof expandedSnapPoint === "number") {
        expandedHeight = Math.round(expandedSnapPoint);
      } else if (
        typeof expandedSnapPoint === "string" &&
        expandedSnapPoint.endsWith("%")
      ) {
        const pct = parseFloat(expandedSnapPoint) / 100;
        expandedHeight = Math.round(totalHeight * pct);
      } else {
        expandedHeight = Math.round(totalHeight * 0.94);
      }

      // BottomSheet requires ascending order: snapPoints[0] < snapPoints[1]
      if (expandedHeight <= collapsedHeight + 20) {
        expandedHeight = Math.min(totalHeight - 16, collapsedHeight + 40);
      }

      return [collapsedHeight, expandedHeight];
    }, [
      customSnapPoints,
      effectiveContainerHeight,
      headerHeight,
      headerOffset,
      expandedSnapPoint,
    ]);

    const activeRef = (ref || sheetRef) as React.Ref<BottomSheet>;

    // Safely match gradient locations length with colors length to prevent Expo LinearGradient warning
    const resolvedLocations = useMemo(() => {
      if (!gradientLocations || !Array.isArray(gradientLocations)) return undefined;
      if (gradientLocations.length === gradientColors.length) {
        return gradientLocations as [number, number, ...number[]];
      }
      return undefined;
    }, [gradientColors, gradientLocations]);

    return (
      <View
        className={cn("flex-1", className)}
        style={[{ backgroundColor }, style]}
        onLayout={handleContainerLayout}
      >
        {/* Background Linear Gradient */}
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          locations={resolvedLocations}
          start={gradientStart}
          end={gradientEnd}
          style={StyleSheet.absoluteFill}
        />

        {/* Dynamic Header */}
        {header ? (
          <View
            onLayout={handleHeaderLayout}
            className={headerClassName}
            style={headerStyle}
          >
            {header}
          </View>
        ) : null}

        {/* Bottom Sheet Surface */}
        <BottomSheet
          ref={activeRef}
          index={index}
          snapPoints={dynamicSnapPoints}
          enableDynamicSizing={enableDynamicSizing}
          enablePanDownToClose={enablePanDownToClose}
          handleIndicatorStyle={[
            styles.defaultHandleIndicator,
            handleIndicatorStyle,
          ]}
          backgroundStyle={[
            styles.defaultBackground,
            { backgroundColor: sheetBackgroundColor },
            backgroundStyle,
          ]}
          onChange={onChange}
          {...restProps}
        >
          {scrollable ? (
            <BottomSheetScrollView
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              contentContainerStyle={[
                styles.defaultContentContainer,
                contentContainerStyle,
              ]}
            >
              {children}
            </BottomSheetScrollView>
          ) : (
            children
          )}
        </BottomSheet>
      </View>
    );
  },
);

BottomSheetLayout.displayName = "BottomSheetLayout";

const styles = StyleSheet.create({
  defaultHandleIndicator: {
    backgroundColor: "#CBD5E1",
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  defaultBackground: {
    backgroundColor: "#F0F5FD",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  defaultContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 95,
    gap: 14,
  },
});

export default BottomSheetLayout;
