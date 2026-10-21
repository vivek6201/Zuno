import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LudoColor, LUDO_COLOR_THEMES } from "../constants/board-coordinates";

export interface LudoYardProps {
  color: LudoColor;
  col: number;
  row: number;
  cellSize: number;
  isYardActive?: boolean;
  cornerPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  onPressYard?: (color: LudoColor) => void;
}

export const LudoYard: React.FC<LudoYardProps> = ({
  color,
  col,
  row,
  cellSize,
  isYardActive,
  cornerPosition,
  onPressYard,
}) => {
  const theme = LUDO_COLOR_THEMES[color];
  const yardSize = cellSize * 6;

  const YardWrapper = onPressYard && isYardActive ? TouchableOpacity : View;

  // Corner radius mapping for seamless inner frame blending
  const cornerRadiusStyle = {
    borderTopLeftRadius: cornerPosition === "topLeft" ? 14 : 0,
    borderTopRightRadius: cornerPosition === "topRight" ? 14 : 0,
    borderBottomLeftRadius: cornerPosition === "bottomLeft" ? 14 : 0,
    borderBottomRightRadius: cornerPosition === "bottomRight" ? 14 : 0,
  };

  // 4 Pedestals centered at exact relative coordinates (2, 2), (4, 2), (2, 4), (4, 4)
  const pedestalCenters = [
    { x: 2 * cellSize, y: 2 * cellSize },
    { x: 4 * cellSize, y: 2 * cellSize },
    { x: 2 * cellSize, y: 4 * cellSize },
    { x: 4 * cellSize, y: 4 * cellSize },
  ];

  const outerRadius = cellSize * 0.62;
  const innerRadius = cellSize * 0.4;

  return (
    <YardWrapper
      activeOpacity={0.8}
      onPress={() => onPressYard?.(color)}
      className="absolute"
      style={[
        {
          left: col * cellSize,
          top: row * cellSize,
          width: yardSize,
          height: yardSize,
          backgroundColor: theme.primary,
          borderWidth: isYardActive ? 3 : 1.5,
          borderColor: isYardActive ? "#FACC15" : "#0F172A",
        },
        cornerRadiusStyle,
      ]}
    >
      {/* Inner White Box matching Image 1 (cells 1..4 x 1..4) */}
      <View
        className="absolute bg-white rounded-[10px] border-2"
        style={[
          styles.innerBox,
          {
            left: 1 * cellSize,
            top: 1 * cellSize,
            width: 4 * cellSize,
            height: 4 * cellSize,
            borderColor: theme.dark,
          },
        ]}
      />

      {/* 4 Concentric Circular Pedestals matching Image 1 */}
      {pedestalCenters.map((pt, idx) => (
        <React.Fragment key={`pedestal-${color}-${idx}`}>
          {/* Outer white disc with player color rim */}
          <View
            className="absolute items-center justify-center bg-white rounded-full border-[2.8px]"
            style={[
              styles.outerDisc,
              {
                left: pt.x - outerRadius,
                top: pt.y - outerRadius,
                width: outerRadius * 2,
                height: outerRadius * 2,
                borderColor: theme.primary,
              },
            ]}
          >
            {/* Inner solid colored recessed pedestal with dark border */}
            <View
              className="rounded-full border-[1.5px]"
              style={{
                width: innerRadius * 2,
                height: innerRadius * 2,
                backgroundColor: theme.primary,
                borderColor: theme.dark,
              }}
            />
          </View>
        </React.Fragment>
      ))}
    </YardWrapper>
  );
};

const styles = StyleSheet.create({
  innerBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  outerDisc: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default LudoYard;
