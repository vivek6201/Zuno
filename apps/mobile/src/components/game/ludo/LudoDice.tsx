import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LudoColor, LUDO_COLOR_THEMES } from "./utils/board-coordinates";
import { ludoSound } from "./utils/ludo-sound";

export interface LudoDiceProps {
  color: LudoColor;
  value: number | null;
  isActive: boolean;
  canRoll: boolean;
  onRoll: () => void;
  size?: number;
}

export const LudoDice: React.FC<LudoDiceProps> = ({
  color,
  value,
  isActive,
  canRoll,
  onRoll,
  size = 50,
}) => {
  const theme = LUDO_COLOR_THEMES[color];

  // Authoritative value reference ensures the die always settles on the engine's real roll
  const authoritativeValueRef = useRef<number>(
    value && value >= 1 && value <= 6 ? value : 1,
  );
  const [displayValue, setDisplayValue] = useState<number>(
    authoritativeValueRef.current,
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const prevValueRef = useRef<number | null>(value);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pure scale and forward spin animation (no tilting, no spring-back wobble)
  const runScaleAndSpinAnimation = () => {
    setIsAnimating(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 1. Scale pop and settle
    scale.value = withSequence(
      withTiming(1.25, { duration: 180, easing: Easing.out(Easing.quad) }),
      withTiming(1.0, { duration: 240, easing: Easing.inOut(Easing.quad) }),
    );

    // 2. Pure forward 720° spin: completes upright without spring-back or tilt
    rotation.value = 0;
    rotation.value = withTiming(
      720,
      { duration: 420, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          rotation.value = 0;
        }
      },
    );

    // 3. Number shuffle during spin that cleanly settles on authoritative value
    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      if (count < 6) {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnimating(false);
        setDisplayValue(authoritativeValueRef.current);
      }
    }, 60);
  };

  // Sync display value when engine's authoritative value arrives
  useEffect(() => {
    if (value && value >= 1 && value <= 6) {
      authoritativeValueRef.current = value;
      if (!isAnimating) {
        if (prevValueRef.current !== value) {
          prevValueRef.current = value;
          runScaleAndSpinAnimation();
        } else {
          setDisplayValue(value);
        }
      }
    } else if (value === null) {
      prevValueRef.current = null;
    }
  }, [value, isAnimating]);

  const handlePress = () => {
    if (!isActive || !canRoll || isAnimating) return;

    ludoSound.playDiceRoll();

    // 1. Dispatch authoritative roll action to engine immediately
    onRoll();

    // 2. Trigger pure scale and spin animation
    runScaleAndSpinAnimation();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const dotSize = size * 0.18;

  // Render authentic 1-6 pip dots layout
  const renderDots = (num: number) => {
    const dots: { x: number; y: number }[] = [];

    // Positions (percentage from 0 to 1)
    const L = 0.25;
    const C = 0.5;
    const R = 0.75;

    switch (num) {
      case 1:
        dots.push({ x: C, y: C });
        break;
      case 2:
        dots.push({ x: L, y: L }, { x: R, y: R });
        break;
      case 3:
        dots.push({ x: L, y: L }, { x: C, y: C }, { x: R, y: R });
        break;
      case 4:
        dots.push(
          { x: L, y: L },
          { x: R, y: L },
          { x: L, y: R },
          { x: R, y: R },
        );
        break;
      case 5:
        dots.push(
          { x: L, y: L },
          { x: R, y: L },
          { x: C, y: C },
          { x: L, y: R },
          { x: R, y: R },
        );
        break;
      case 6:
        dots.push(
          { x: L, y: 0.22 },
          { x: R, y: 0.22 },
          { x: L, y: 0.5 },
          { x: R, y: 0.5 },
          { x: L, y: 0.78 },
          { x: R, y: 0.78 },
        );
        break;
      default:
        dots.push({ x: C, y: C });
    }

    return (
      <View style={{ width: size, height: size }} className="relative">
        {dots.map((dot, idx) => (
          <View
            key={`dot-${idx}`}
            style={[
              styles.dot,
              {
                left: dot.x * size - dotSize / 2,
                top: dot.y * size - dotSize / 2,
                width: dotSize,
                height: dotSize,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!isActive || !canRoll}
        onPress={handlePress}
        style={[
          styles.diceButton,
          {
            width: size,
            height: size,
            backgroundColor: theme.primary,
            borderColor: isActive && canRoll ? "#FDE047" : theme.border,
            shadowColor: theme.dark,
          },
        ]}
      >
        {renderDots(displayValue)}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  diceButton: {
    borderRadius: 12,
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LudoDice;
