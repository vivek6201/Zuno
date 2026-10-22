import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from "react-native-svg";
import { Ludo } from "@repo/game-engine";
import { GRID_SIZE, LUDO_COLOR_THEMES } from "../utils/board-coordinates";
import { getTokenPixelCenter } from "../utils/ludo-coordinates";
import { ludoSound } from "../utils/ludo-sound";

export interface LudoTokenProps {
  token: Ludo.LudoToken;
  boardSize: number;
  isMovable: boolean;
  stackIndex?: number;
  stackCount?: number;
  onPress: (tokenId: string) => void;
}

// Pre-computed 12-toothed gear points around center (16, 35)
const COG_POINTS = (() => {
  const cx = 16;
  const cy = 35;
  const outerR = 10.5;
  const innerR = 7.5;
  const pts: string[] = [];
  const teethCount = 12;
  const total = teethCount * 2;
  for (let i = 0; i < total; i++) {
    const angle = (i * Math.PI) / teethCount - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
})();

export const LudoToken: React.FC<LudoTokenProps> = ({
  token,
  boardSize,
  isMovable,
  stackIndex = 0,
  stackCount = 1,
  onPress,
}) => {
  const cellSize = boardSize / GRID_SIZE;
  const tokenWidth = cellSize * 1.05;
  const tokenHeight = cellSize * 1.35;

  const theme = LUDO_COLOR_THEMES[token.color];

  // Exact target center in board pixels (handles base vs track automatically)
  const center = getTokenPixelCenter(
    token.color,
    token.stepCount,
    token.index,
    cellSize,
  );

  // Stacking offset calculation so multi-piece tiles fan out
  let offsetX = 0;
  let offsetY = 0;
  if (stackCount > 1) {
    const shift = 4;
    if (stackIndex === 0) {
      offsetX = -shift;
      offsetY = -shift;
    } else if (stackIndex === 1) {
      offsetX = shift;
      offsetY = shift;
    } else if (stackIndex === 2) {
      offsetX = shift;
      offsetY = -shift;
    } else {
      offsetX = -shift;
      offsetY = shift;
    }
  }

  // Visual base anchor: ground contact point is at (16, 34) in 32x42 viewBox
  const anchorX = tokenWidth / 2;
  const anchorY = tokenHeight * (34 / 42);

  const targetX = center.x - anchorX + offsetX;
  const targetY = center.y - anchorY + offsetY;

  // Track previous step to calculate tile-by-tile hopping
  const previousStepRef = useRef<number>(token.stepCount);

  // Reanimated shared values
  const posX = useSharedValue(targetX);
  const posY = useSharedValue(targetY);
  const hopY = useSharedValue(0);
  const scale = useSharedValue(1);
  const bounceY = useSharedValue(0);
  const cogRotation = useSharedValue(0);

  // Tile-by-tile hopping animation without spring
  useEffect(() => {
    const fromStep = previousStepRef.current;
    const toStep = token.stepCount;
    previousStepRef.current = toStep;

    // Initial mount or no step change
    if (fromStep === toStep) {
      posX.value = targetX;
      posY.value = targetY;
      return;
    }

    // Piece captured: trace back path along the circuit back to the yard slot
    if (toStep === 0 && fromStep > 0) {
      ludoSound.playPieceCapture();

      const rewindXAnims: any[] = [];
      const rewindYAnims: any[] = [];
      const stepsToRewind = fromStep;
      // Fluid rewind speed: between 35ms and 65ms per tile so total rewind feels brisk and natural
      const rewindHopDuration = Math.max(
        35,
        Math.min(65, Math.floor(800 / Math.max(1, stepsToRewind))),
      );

      // Loop backwards from current position all the way down to base yard slot (step 0)
      for (let s = fromStep - 1; s >= 0; s--) {
        const pt = getTokenPixelCenter(token.color, s, token.index, cellSize);
        const stepX = pt.x - anchorX + offsetX;
        const stepY = pt.y - anchorY + offsetY;

        rewindXAnims.push(
          withTiming(stepX, {
            duration: rewindHopDuration,
            easing: Easing.linear,
          }),
        );
        rewindYAnims.push(
          withTiming(stepY, {
            duration: rewindHopDuration,
            easing: Easing.linear,
          }),
        );
      }

      // Slightly elevate token during rewind, then settle down when entering yard
      const totalRewindDuration = stepsToRewind * rewindHopDuration;
      hopY.value = withSequence(
        withTiming(-16, {
          duration: Math.min(140, totalRewindDuration / 4),
          easing: Easing.out(Easing.quad),
        }),
        withTiming(-16, {
          duration: Math.max(0, totalRewindDuration - 260),
        }),
        withTiming(0, {
          duration: 120,
          easing: Easing.in(Easing.quad),
        }),
      );

      posX.value = withSequence(...rewindXAnims);
      posY.value = withSequence(...rewindYAnims);
      return;
    }

    // Forward move (1 to 6 steps): hop tile by tile
    if (toStep > fromStep && toStep - fromStep <= 6) {
      const stepCountDiff = toStep - fromStep;
      const xAnims: any[] = [];
      const yAnims: any[] = [];
      const hopAnims: any[] = [];
      const hopDuration = 240; // ms per tile hop: bouncy, clear, enjoyable pacing

      for (let s = fromStep + 1; s <= toStep; s++) {
        const pt = getTokenPixelCenter(token.color, s, token.index, cellSize);
        const stepX = pt.x - anchorX + offsetX;
        const stepY = pt.y - anchorY + offsetY;

        xAnims.push(
          withTiming(stepX, {
            duration: hopDuration,
            easing: Easing.linear,
          }),
        );
        yAnims.push(
          withTiming(stepY, {
            duration: hopDuration,
            easing: Easing.linear,
          }),
        );
        hopAnims.push(
          withSequence(
            withTiming(-22, {
              duration: hopDuration * 0.45,
              easing: Easing.out(Easing.quad),
            }),
            withTiming(0, {
              duration: hopDuration * 0.55,
              easing: Easing.in(Easing.quad),
            }),
          ),
        );
      }

      posX.value = withSequence(...xAnims);
      posY.value = withSequence(...yAnims);
      hopY.value = withSequence(...hopAnims);
      return;
    }

    // General fallback: clean timing hop
    hopY.value = withSequence(
      withTiming(-20, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 120, easing: Easing.in(Easing.quad) }),
    );
    posX.value = withTiming(targetX, { duration: 240 });
    posY.value = withTiming(targetY, { duration: 240 });
  }, [
    token.stepCount,
    targetX,
    targetY,
    cellSize,
    token.color,
    token.index,
    anchorX,
    anchorY,
    offsetX,
    offsetY,
  ]);

  // Breathing & rotating cogwheel halo when movable
  useEffect(() => {
    if (isMovable) {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 320, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 320, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 320 }),
          withTiming(0.98, { duration: 320 }),
        ),
        -1,
        true,
      );

      cogRotation.value = withRepeat(
        withTiming(360, { duration: 2400, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      bounceY.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1, { duration: 150 });
      cogRotation.value = 0;
    }
  }, [isMovable]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
    transform: [
      { translateY: hopY.value + bounceY.value },
      { scale: scale.value },
    ],
  }));

  const cogAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${cogRotation.value}deg` }],
  }));

  const bezelId = `bezel-${token.id}`;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: tokenWidth,
          height: tokenHeight,
          zIndex: isMovable ? 50 : 20 + stackIndex,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={!isMovable}
        onPress={() => {
          ludoSound.playPieceStep();
          onPress(token.id);
        }}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        className="w-full h-full items-center justify-center"
      >
        <Svg
          width={tokenWidth}
          height={tokenHeight}
          viewBox="0 0 32 42"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            {/* Metallic Silver-Chrome Bezel Gradient */}
            <LinearGradient id={bezelId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="25%" stopColor="#F8FAFC" />
              <Stop offset="65%" stopColor="#CBD5E1" />
              <Stop offset="100%" stopColor="#94A3B8" />
            </LinearGradient>
          </Defs>

          {/* 1. Ground Drop Shadow under tip */}
          <Ellipse
            cx="16"
            cy="38"
            rx="7.5"
            ry="2.2"
            fill="rgba(0, 0, 0, 0.35)"
          />

          {/* 2. Base Ring at Tip */}
          <Circle cx="16" cy="35" r="3.5" fill={theme.dark} opacity={0.8} />

          {/* 3. Outer 3D Teardrop Pin Body (Metallic Bezel) */}
          <Path
            d="M 16 35 C 10.5 28 5 20.5 5 13 A 11 11 0 1 1 27 13 C 27 20.5 21.5 28 16 35 Z"
            fill={`url(#${bezelId})`}
            stroke="#64748B"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />

          {/* 4. Inner Saturated Color Jewel Sphere */}
          <Circle
            cx="16"
            cy="13"
            r="7.4"
            fill={theme.primary}
            stroke={theme.dark}
            strokeWidth="1.2"
          />

          {/* 5. 3D Specular Glass Glare Reflection (Top-Left Highlight) */}
          <Ellipse
            cx="13.5"
            cy="10"
            rx="3.4"
            ry="1.9"
            transform="rotate(-30 13.5 10)"
            fill="#FFFFFF"
            fillOpacity="0.88"
          />
          <Circle
            cx="12.2"
            cy="8.8"
            r="0.9"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />

          {/* 6. Subtle Rim Bounce Light (Bottom reflection) */}
          <Ellipse
            cx="17.2"
            cy="16"
            rx="3.6"
            ry="1.2"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
        </Svg>

        {/* 7. Rotating Sunburst / Cogwheel Halo (when movable) */}
        {isMovable && (
          <Animated.View
            pointerEvents="none"
            className="absolute -z-10 w-6 h-6"
            style={[
              {
                left: tokenWidth / 2 - 12,
                top: tokenHeight * (35 / 42) - 12,
              },
              cogAnimatedStyle,
            ]}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Polygon
                points={COG_POINTS}
                transform="translate(-4, -23)"
                fill={theme.dark}
                stroke="#FACC15"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LudoToken;
