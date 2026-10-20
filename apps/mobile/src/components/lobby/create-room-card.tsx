import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Typography, useToast, cn } from "heroui-native";
import { Plus } from "lucide-react-native";
import { GameType, GameTypeEnum } from "@repo/common/validations/game";
import { roomRoutes, CreatedRoomData } from "@repo/common/api/routes/rooms";

export interface CreateRoomCardProps {
  /**
   * Game type for room creation (e.g. LUDO, CHESS, UNO, MATIKS). Defaults to LUDO.
   */
  gameType?: GameType;

  /**
   * Card title text. Defaults to "Create Room".
   */
  title?: string;

  /**
   * Card subtitle description. Defaults to "Share the room code with your friends".
   */
  subtitle?: string;

  /**
   * Action button label. Defaults to "Create Room".
   */
  buttonText?: string;

  /**
   * Custom maximum players override.
   */
  maxPlayers?: number;

  /**
   * Custom game configuration object.
   */
  gameConfig?: Record<string, any>;

  /**
   * Callback fired when a room is successfully created via API.
   */
  onCreateSuccess?: (room: CreatedRoomData) => void;

  /**
   * Callback fired on room creation failure.
   */
  onCreateError?: (error: string) => void;

  /**
   * Custom handler to completely override default API creation.
   */
  onCustomCreate?: () => Promise<void> | void;

  /**
   * External loading state override.
   */
  isLoading?: boolean;

  /**
   * Additional style for the card container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Additional className for the card container.
   */
  className?: string;
}

const getDefaultConfig = (gameType: GameType) => {
  switch (gameType) {
    case GameTypeEnum.CHESS:
      return { timeControlSeconds: 600, incrementSeconds: 0 };
    case GameTypeEnum.UNO:
      return { drawToMatch: false, forcePlay: true };
    case GameTypeEnum.MATIKS:
      return { targetScore: 100, timeLimitSeconds: 60, difficulty: "EASY" };
    case GameTypeEnum.LUDO:
    default:
      return { finishOnFirstWinner: false, autoMoveSingleToken: true };
  }
};

const getDefaultMaxPlayers = (gameType: GameType) => {
  if (gameType === GameTypeEnum.CHESS) return 2;
  return 4;
};

export const CreateRoomCard: React.FC<CreateRoomCardProps> = ({
  gameType = GameTypeEnum.LUDO,
  title = "Create Room",
  subtitle = "Share the room code with your friends",
  buttonText = "Create Room",
  maxPlayers,
  gameConfig,
  onCreateSuccess,
  onCreateError,
  onCustomCreate,
  isLoading: externalLoading,
  style,
  className = "",
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const { toast } = useToast();

  const isBusy = externalLoading ?? internalLoading;

  const handleCreate = async () => {
    if (isBusy) return;

    if (onCustomCreate) {
      await onCustomCreate();
      return;
    }

    try {
      setInternalLoading(true);
      const resolvedMaxPlayers = maxPlayers ?? getDefaultMaxPlayers(gameType);
      const resolvedConfig = gameConfig ?? getDefaultConfig(gameType);

      const res = await roomRoutes.create({
        gameType,
        maxPlayers: resolvedMaxPlayers,
        gameConfig: resolvedConfig,
      } as any);

      if (res.success && res.data) {
        toast.show({
          variant: "success",
          label: "Room created successfully!",
        });
        onCreateSuccess?.(res.data);
      } else {
        const errorMsg = res.message || "Failed to create room";
        toast.show({
          variant: "danger",
          label: errorMsg,
        });
        onCreateError?.(errorMsg);
      }
    } catch (err: any) {
      const errorMsg =
        err?.message || "Network error while creating room. Please try again.";
      toast.show({
        variant: "danger",
        label: errorMsg,
      });
      onCreateError?.(errorMsg);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <View
      className={cn(
        "bg-surface rounded-2xl shadow p-4 border border-surface",
        className,
      )}
    >
      {/* Header Row: Icon Badge + Text */}
      <View className="flex-row items-center">
        {/* Left Icon Badge */}
        <View className="w-9 h-9 rounded-xl items-center justify-center bg-blue-600 shadow-sm shadow-blue-500/30 mr-3">
          <Plus color="#FFFFFF" size={20} strokeWidth={2.8} />
        </View>

        {/* Title and Subtitle */}
        <View className="flex-1 justify-center">
          <Typography
            type="h3"
            className="text-slate-900 font-extrabold text-[16px] tracking-tight"
          >
            {title}
          </Typography>
          <Typography
            type="body-sm"
            className="text-slate-500 font-medium text-xs mt-0.5"
          >
            {subtitle}
          </Typography>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handleCreate}
        disabled={isBusy}
        className="w-full bg-blue-600 active:bg-blue-700 rounded-xl py-3 mt-3.5 items-center justify-center flex-row shadow-sm shadow-blue-600/20"
      >
        {isBusy ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Typography
            type="body"
            className="text-white font-extrabold text-sm tracking-wide"
          >
            {buttonText}
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoomCard;
