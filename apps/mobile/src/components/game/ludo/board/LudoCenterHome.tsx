import React from "react";
import { View } from "react-native";
import Svg, { Path, Polygon } from "react-native-svg";
import { LudoColor, LUDO_COLOR_THEMES } from "../utils/board-coordinates";

export interface LudoCenterHomeProps {
  cellSize: number;
}

export const LudoCenterHome: React.FC<LudoCenterHomeProps> = ({ cellSize }) => {
  const centerLeft = 6 * cellSize;
  const centerTop = 6 * cellSize;
  const centerSize = 3 * cellSize;

  return (
    <View
      className="absolute overflow-hidden border-[1.5px] border-slate-900"
      style={{
        left: centerLeft,
        top: centerTop,
        width: centerSize,
        height: centerSize,
      }}
    >
      <Svg
        width={centerSize}
        height={centerSize}
        viewBox={`0 0 ${centerSize} ${centerSize}`}
      >
        {/* Top Triangle: Green */}
        <Polygon
          points={`0,0 ${centerSize},0 ${centerSize / 2},${centerSize / 2}`}
          fill={LUDO_COLOR_THEMES[LudoColor.GREEN].primary}
        />
        {/* Right Triangle: Yellow */}
        <Polygon
          points={`${centerSize},0 ${centerSize},${centerSize} ${centerSize / 2},${centerSize / 2}`}
          fill={LUDO_COLOR_THEMES[LudoColor.YELLOW].primary}
        />
        {/* Bottom Triangle: Blue */}
        <Polygon
          points={`0,${centerSize} ${centerSize},${centerSize} ${centerSize / 2},${centerSize / 2}`}
          fill={LUDO_COLOR_THEMES[LudoColor.BLUE].primary}
        />
        {/* Left Triangle: Red */}
        <Polygon
          points={`0,0 0,${centerSize} ${centerSize / 2},${centerSize / 2}`}
          fill={LUDO_COLOR_THEMES[LudoColor.RED].primary}
        />

        {/* Clean diagonal division lines */}
        <Path
          d={`M 0 0 L ${centerSize} ${centerSize} M 0 ${centerSize} L ${centerSize} 0`}
          stroke="#0F172A"
          strokeWidth={1.2}
        />
      </Svg>
    </View>
  );
};

export default LudoCenterHome;
