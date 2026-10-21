import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { Typography } from "heroui-native";
import { RotateCcw, Trophy, X } from "lucide-react-native";
import { Ludo } from "@repo/game-engine";

export interface LudoVictoryModalProps {
  visible: boolean;
  winner?: Ludo.LudoPlayer | null;
  onPlayAgain?: () => void;
  onExit: () => void;
}

export const LudoVictoryModal: React.FC<LudoVictoryModalProps> = ({
  visible,
  winner,
  onPlayAgain,
  onExit,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center p-6">
        <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-xl border border-slate-100">
          {/* Trophy Icon */}
          <View className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mb-4 border-2 border-amber-300 shadow-md">
            <Trophy size={42} color="#D97706" />
          </View>

          {/* Victory Label */}
          <Typography
            type="body-sm"
            className="text-amber-600 font-extrabold text-xs uppercase tracking-widest"
          >
            WINNER!
          </Typography>

          <Typography
            type="h2"
            className="text-slate-900 font-black text-2xl mt-1 text-center"
          >
            {winner?.name || "Player"} Wins!
          </Typography>

          <Typography
            type="body-sm"
            className="text-slate-500 font-medium text-xs text-center mt-1"
          >
            All 4 tokens reached home safely!
          </Typography>

          {/* Action Buttons */}
          <View className="w-full mt-6 gap-y-3">
            {onPlayAgain && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPlayAgain}
                className="w-full py-3.5 rounded-2xl bg-primary flex-row items-center justify-center shadow-md shadow-primary/25"
              >
                <RotateCcw size={18} color="white" className="mr-2" />
                <Typography
                  type="body"
                  className="text-white font-black text-sm"
                >
                  Play Again
                </Typography>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onExit}
              className="w-full py-3.5 rounded-2xl bg-slate-100 flex-row items-center justify-center border border-slate-200/80"
            >
              <X size={18} color="#64748B" className="mr-2" />
              <Typography
                type="body"
                className="text-slate-700 font-bold text-sm"
              >
                Exit to Lobby
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LudoVictoryModal;
