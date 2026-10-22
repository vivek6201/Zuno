import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Typography, cn } from "heroui-native";
import { Crown, Lock } from "lucide-react-native";
import { Ludo } from "@repo/game-engine";
import { LudoColor, LUDO_COLOR_THEMES } from "./utils/board-coordinates";

const SlotStatus = Ludo.SlotStatus;

import LudoDice from "./LudoDice";
import defaultAvatar from "@assets/images/default-avatar.jpg";

export interface LudoPlayerPodProps {
  player?: Ludo.LudoPlayer;
  slot?: Ludo.ColorSlot;
  color: LudoColor;
  isCurrentTurn: boolean;
  phase: Ludo.LudoTurnPhase;
  currentDice: number | null;
  canRoll: boolean;
  align?: "left" | "right";
  onRollDice: () => void;
  className?: string;
  hideWhenLocked?: boolean;
}

export const LudoPlayerPod: React.FC<LudoPlayerPodProps> = ({
  player,
  slot,
  color,
  isCurrentTurn,
  phase,
  currentDice,
  canRoll,
  align = "left",
  onRollDice,
  className = "",
  hideWhenLocked = false,
}) => {
  const theme = LUDO_COLOR_THEMES[color];
  const isOccupied = !!player;

  const finishedTokensCount =
    player?.tokens?.filter((t: any) => t.stepCount === 57).length || 0;

  // Active turn pulsing aura background shared values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (isCurrentTurn) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 750,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1.0, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.65, {
            duration: 750,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 250 });
      pulseOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [isCurrentTurn]);

  const animatedPulseBgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // 1. Locked Slot (match started without this seat filled)
  if (
    slot?.status === SlotStatus.LOCKED ||
    (!isOccupied && slot?.status !== SlotStatus.ABANDONED)
  ) {
    if (hideWhenLocked) {
      return <View className="w-27.5 h-12 opacity-0" />;
    }
    return (
      <View
        className={cn(
          "flex-row items-center p-2 rounded-2xl opacity-35",
          align === "right" ? "flex-row-reverse" : "flex-row",
          className,
        )}
      >
        <View
          style={{ borderColor: theme.border }}
          className="w-12 h-12 rounded-full border-2 border-dashed bg-slate-800/80 items-center justify-center"
        >
          <Lock size={16} color="#94A3B8" />
        </View>
        <View className="mx-2 items-center">
          <Typography
            type="body-xs"
            className="text-slate-500 font-bold text-[10px] uppercase"
          >
            Locked
          </Typography>
        </View>
      </View>
    );
  }

  // 2. Abandoned Slot (player left or timed out mid-game)
  if (slot?.status === SlotStatus.ABANDONED) {
    return (
      <View
        className={cn(
          "flex-row items-center p-1 rounded-2xl opacity-40",
          align === "right" ? "flex-row-reverse" : "flex-row",
          className,
        )}
      >
        <View className="items-center">
          <View className="w-12 h-12 rounded-full p-0.5 border-2 border-slate-600 bg-slate-800 relative items-center justify-center">
            <Image
              source={slot?.avatarUrl ? { uri: slot.avatarUrl } : defaultAvatar}
              className="w-full h-full rounded-full grayscale"
              resizeMode="cover"
            />
          </View>
          <View className="items-center mt-1 max-w-17.5">
            <Typography
              type="body-xs"
              numberOfLines={1}
              className="font-extrabold text-[11px] text-center text-slate-400 line-through"
            >
              {slot?.playerName || player?.name || "Player"}
            </Typography>
            <View className="bg-rose-950/80 px-1.5 py-0.5 rounded-full mt-0.5 border border-rose-800">
              <Text className="text-rose-400 text-[8px] font-black uppercase">
                Left
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!player) {
    return null;
  }

  const avatarContent = (
    <View className="items-center">
      <View
        style={[
          styles.avatarRing,
          {
            borderColor: isCurrentTurn ? theme.primary : "transparent",
            shadowColor: theme.primary,
            shadowOpacity: isCurrentTurn ? 0.6 : 0,
            shadowRadius: isCurrentTurn ? 6 : 0,
            elevation: isCurrentTurn ? 6 : 0,
          },
        ]}
        className={cn(
          "w-12 h-12 rounded-full p-0.5 border-2 bg-white relative items-center justify-center",
        )}
      >
        <Image
          source={
            (player as any)?.avatarUrl &&
            typeof (player as any).avatarUrl === "string"
              ? { uri: (player as any).avatarUrl }
              : defaultAvatar
          }
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />

        {/* Crown Badge if winner */}
        {player.rank && player.rank > 0 && (
          <View className="absolute -top-2 -right-1 bg-amber-400 rounded-full p-0.5 border border-white">
            <Crown size={12} color="#78350F" />
          </View>
        )}

        {/* Turn indicator glow dot */}
        {isCurrentTurn && !player.isDisconnected && (
          <View
            style={{ backgroundColor: theme.primary }}
            className="absolute -bottom-1 w-3 h-3 rounded-full border-2 border-white"
          />
        )}
      </View>

      {/* Player Name & Finished Tokens / Offline Badge */}
      <View className="items-center mt-1 max-w-17.5">
        <Typography
          type="body-xs"
          numberOfLines={1}
          className={cn(
            "font-extrabold text-[11px] text-center",
            isCurrentTurn ? "text-white" : "text-slate-300",
            player.isDisconnected && "text-slate-500",
          )}
        >
          {player.name}
        </Typography>

        {player.isDisconnected ? (
          <View className="bg-amber-100 px-1.5 py-0.5 rounded-full mt-0.5 border border-amber-300">
            <Text className="text-amber-800 text-[8px] font-black uppercase">
              Offline
            </Text>
          </View>
        ) : finishedTokensCount > 0 ? (
          <View
            style={{ backgroundColor: theme.light }}
            className="px-1.5 py-0.2 rounded-full mt-0.5"
          >
            <Text
              style={{ color: theme.dark }}
              className="text-[9px] font-black"
            >
              {finishedTokensCount}/4 Home
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const diceContent = isCurrentTurn ? (
    <View className="mx-2">
      <LudoDice
        color={color}
        value={currentDice}
        isActive={isCurrentTurn}
        canRoll={canRoll}
        onRoll={onRollDice}
        size={46}
      />
    </View>
  ) : (
    <View className="w-14.5 h-11.5 opacity-0" />
  );

  return (
    <View style={styles.podContainer}>
      {/* 1. Pulsing glow aura background when it's this player's active turn */}
      {isCurrentTurn && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.pulseAura,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            },
            animatedPulseBgStyle,
          ]}
        />
      )}

      {/* 2. Crisp dark plate backdrop when active */}
      {isCurrentTurn && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.activeBackdrop,
            { borderColor: theme.primary },
          ]}
        />
      )}

      {/* 3. Pod content: Avatar & Die */}
      <View
        className={cn(
          "flex-row items-center",
          align === "right" ? "flex-row-reverse" : "flex-row",
          className,
        )}
      >
        {avatarContent}
        {diceContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  podContainer: {
    position: "relative",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pulseAura: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 8,
  },
  activeBackdrop: {
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderRadius: 20,
    borderWidth: 1.5,
  },
  avatarRing: {
    shadowOffset: { width: 0, height: 2 },
  },
});

export default LudoPlayerPod;
