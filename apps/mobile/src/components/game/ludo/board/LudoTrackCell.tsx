import React from "react";
import { View } from "react-native";
import Svg, { Path, Polygon } from "react-native-svg";
import { LudoColor, LUDO_COLOR_THEMES } from "../utils/board-coordinates";

// 5-pointed outlined star matching Image 1
export const SafeStarIcon: React.FC<{ size: number }> = ({ size }) => {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.2;
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon
        points={points.join(" ")}
        fill="none"
        stroke="#475569"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Directional entry arrow matching Image 1
export const DirectionalArrowIcon: React.FC<{
  direction: "right" | "down" | "left" | "up";
  color: string;
  size: number;
}> = ({ direction, color, size }) => {
  let angle = 0;
  if (direction === "down") angle = 90;
  if (direction === "left") angle = 180;
  if (direction === "up") angle = 270;

  return (
    <View style={{ transform: [{ rotate: `${angle}deg` }] }}>
      <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24">
        <Path
          d="M 4 12 L 18 12 M 12 6 L 18 12 L 12 18"
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export interface LudoTrackCellProps {
  col: number;
  row: number;
  cellSize: number;
}

export const LudoTrackCell: React.FC<LudoTrackCellProps> = ({
  col,
  row,
  cellSize,
}) => {
  // Safe star tile coordinates in standard board (Image 1)
  const isSafeStar =
    (col === 2 && row === 8) ||
    (col === 6 && row === 2) ||
    (col === 12 && row === 6) ||
    (col === 8 && row === 12);

  // Directional entry arrows
  let arrow: {
    direction: "right" | "down" | "left" | "up";
    color: string;
  } | null = null;
  if (col === 0 && row === 7) {
    arrow = {
      direction: "right",
      color: LUDO_COLOR_THEMES[LudoColor.RED].primary,
    };
  } else if (col === 7 && row === 0) {
    arrow = {
      direction: "down",
      color: LUDO_COLOR_THEMES[LudoColor.GREEN].primary,
    };
  } else if (col === 14 && row === 7) {
    arrow = {
      direction: "left",
      color: LUDO_COLOR_THEMES[LudoColor.YELLOW].primary,
    };
  } else if (col === 7 && row === 14) {
    arrow = {
      direction: "up",
      color: LUDO_COLOR_THEMES[LudoColor.BLUE].primary,
    };
  }

  // Start tile colors
  let startColor: LudoColor | null = null;
  if (col === 1 && row === 6) startColor = LudoColor.RED;
  else if (col === 8 && row === 1) startColor = LudoColor.GREEN;
  else if (col === 13 && row === 8) startColor = LudoColor.YELLOW;
  else if (col === 6 && row === 13) startColor = LudoColor.BLUE;

  // Home corridor colors
  let homePathColor: LudoColor | null = null;
  if (row === 7 && col >= 1 && col <= 5) homePathColor = LudoColor.RED;
  else if (col === 7 && row >= 1 && row <= 5) homePathColor = LudoColor.GREEN;
  else if (row === 7 && col >= 9 && col <= 13) homePathColor = LudoColor.YELLOW;
  else if (col === 7 && row >= 9 && row <= 13) homePathColor = LudoColor.BLUE;

  let cellBg = "#FFFFFF";
  if (startColor) {
    cellBg = LUDO_COLOR_THEMES[startColor].primary;
  } else if (homePathColor) {
    cellBg = LUDO_COLOR_THEMES[homePathColor].primary;
  }

  return (
    <View
      className="absolute items-center justify-center border-[0.75px] border-slate-300"
      style={{
        left: col * cellSize,
        top: row * cellSize,
        width: cellSize,
        height: cellSize,
        backgroundColor: cellBg,
      }}
    >
      {/* Outlined 5-pointed Safe Star matching Image 1 */}
      {isSafeStar && <SafeStarIcon size={cellSize * 0.75} />}

      {/* Directional Entry Arrow matching Image 1 */}
      {arrow && (
        <DirectionalArrowIcon
          direction={arrow.direction}
          color={arrow.color}
          size={cellSize}
        />
      )}
    </View>
  );
};

export default LudoTrackCell;
