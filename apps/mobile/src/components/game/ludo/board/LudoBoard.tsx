import React from "react";
import { StyleSheet, View } from "react-native";
import { Ludo } from "@repo/game-engine";
import { GRID_SIZE, LudoColor } from "../utils/board-coordinates";
import LudoYard from "./LudoYard";
import LudoTrackCell from "./LudoTrackCell";
import LudoCenterHome from "./LudoCenterHome";

export interface LudoBoardProps {
  boardSize: number;
  activeYardColor?: LudoColor | null;
  onPressYard?: (color: LudoColor) => void;
  children?: React.ReactNode;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  boardSize,
  activeYardColor,
  onPressYard,
  children,
}) => {
  // Use integer cell size calculation so all cells and pedestals align precisely to integer pixels
  const cellSize = Math.floor(boardSize / GRID_SIZE);
  const boardContentSize = cellSize * GRID_SIZE;
  const outerFramePadding = 4;
  const outerBoardSize = boardContentSize + outerFramePadding * 2;

  // Track cell filter: exclude 6x6 corner yards and 3x3 center
  const isYardCell = (col: number, row: number): boolean => {
    return (
      (col < 6 && row < 6) ||
      (col > 8 && row < 6) ||
      (col < 6 && row > 8) ||
      (col > 8 && row > 8)
    );
  };

  const isCenterCell = (col: number, row: number): boolean => {
    return col >= 6 && col <= 8 && row >= 6 && row <= 8;
  };

  return (
    // Outer Frame Container: deep bezel that guarantees corners are never cut off
    <View
      className="items-center justify-center"
      style={[
        styles.outerFrame,
        {
          width: outerBoardSize,
          height: outerBoardSize,
          padding: outerFramePadding,
        },
      ]}
    >
      {/* Inner Board Surface: exact integer dimension matching Image 1 standard orientation */}
      <View
        className="bg-white rounded-2xl"
        style={{
          width: boardContentSize,
          height: boardContentSize,
        }}
      >
        {/* 1. Four Corner Yards matching Image 1:
            - Red: Top-Left (cols 0..5, rows 0..5)
            - Green: Top-Right (cols 9..14, rows 0..5)
            - Yellow: Bottom-Right (cols 9..14, rows 9..14)
            - Blue: Bottom-Left (cols 0..5, rows 9..14)
        */}
        <LudoYard
          color={LudoColor.RED}
          col={0}
          row={0}
          cellSize={cellSize}
          isYardActive={activeYardColor === LudoColor.RED}
          cornerPosition="topLeft"
          onPressYard={onPressYard}
        />
        <LudoYard
          color={LudoColor.GREEN}
          col={9}
          row={0}
          cellSize={cellSize}
          isYardActive={activeYardColor === LudoColor.GREEN}
          cornerPosition="topRight"
          onPressYard={onPressYard}
        />
        <LudoYard
          color={LudoColor.YELLOW}
          col={9}
          row={9}
          cellSize={cellSize}
          isYardActive={activeYardColor === LudoColor.YELLOW}
          cornerPosition="bottomRight"
          onPressYard={onPressYard}
        />
        <LudoYard
          color={LudoColor.BLUE}
          col={0}
          row={9}
          cellSize={cellSize}
          isYardActive={activeYardColor === LudoColor.BLUE}
          cornerPosition="bottomLeft"
          onPressYard={onPressYard}
        />

        {/* 2. Track Cells (arms with stars, entry arrows, and home paths) */}
        {Array.from({ length: GRID_SIZE }).map((_, col) =>
          Array.from({ length: GRID_SIZE }).map((_, row) => {
            if (isYardCell(col, row) || isCenterCell(col, row)) {
              return null;
            }
            return (
              <LudoTrackCell
                key={`cell-${col}-${row}`}
                col={col}
                row={row}
                cellSize={cellSize}
              />
            );
          }),
        )}

        {/* 3. Center 3x3 Victory Triangles */}
        <LudoCenterHome cellSize={cellSize} />

        {/* 4. Active Moving Tokens Layer */}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
});

export default LudoBoard;
