import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Typography, useToast, cn } from "heroui-native";
import { LogIn } from "lucide-react-native";
import { roomRoutes, RoomDetailsData } from "@repo/common/api/routes/rooms";

export interface JoinRoomCardProps {
  /**
   * Card title text. Defaults to "Join Room".
   */
  title?: string;

  /**
   * Card subtitle description. Defaults to "Enter room code to join".
   */
  subtitle?: string;

  /**
   * Input placeholder text. Defaults to "Enter room code".
   */
  placeholder?: string;

  /**
   * Action button label. Defaults to "Join".
   */
  buttonText?: string;

  /**
   * Default initial room code.
   */
  initialRoomCode?: string;

  /**
   * Callback fired when room is successfully validated via API.
   */
  onJoinSuccess?: (room: RoomDetailsData) => void;

  /**
   * Callback fired on room join failure.
   */
  onJoinError?: (error: string) => void;

  /**
   * Custom join handler to override default API validation.
   */
  onCustomJoin?: (roomCode: string) => Promise<void> | void;

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

export const JoinRoomCard: React.FC<JoinRoomCardProps> = ({
  title = "Join Room",
  subtitle = "Enter room code to join",
  placeholder = "Enter room code",
  buttonText = "Join",
  initialRoomCode = "",
  onJoinSuccess,
  onJoinError,
  onCustomJoin,
  isLoading: externalLoading,
  style,
  className = "",
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [internalLoading, setInternalLoading] = useState(false);
  const { toast } = useToast();

  const isBusy = externalLoading ?? internalLoading;
  const isInputEmpty = roomCode.trim().length === 0;

  const handleJoin = async () => {
    const trimmedCode = roomCode.trim().toUpperCase();
    if (!trimmedCode || isBusy) return;

    if (onCustomJoin) {
      await onCustomJoin(trimmedCode);
      return;
    }

    try {
      setInternalLoading(true);
      const res = await roomRoutes.getById(trimmedCode);

      if (res.success && res.data) {
        // Check if room is already full
        if (
          res.data.players &&
          res.data.maxPlayers &&
          res.data.players.length >= res.data.maxPlayers
        ) {
          const fullMsg = "Room is already full!";
          toast.show({
            variant: "warning",
            label: fullMsg,
          });
          onJoinError?.(fullMsg);
          return;
        }

        toast.show({
          variant: "success",
          label: "Room joined successfully!",
        });
        onJoinSuccess?.(res.data);
      } else {
        const errorMsg = res.message || "Room not found. Check code and retry.";
        toast.show({
          variant: "danger",
          label: errorMsg,
        });
        onJoinError?.(errorMsg);
      }
    } catch (err: any) {
      const errorMsg =
        err?.message || "Room not found. Please verify the code.";
      toast.show({
        variant: "danger",
        label: errorMsg,
      });
      onJoinError?.(errorMsg);
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
          <LogIn color="#FFFFFF" size={19} strokeWidth={2.8} />
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

      {/* Room Code Text Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={roomCode}
        onChangeText={setRoomCode}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!isBusy}
        className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl px-4 py-3 text-slate-900 font-bold text-sm mt-3.5 tracking-wider"
      />

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handleJoin}
        disabled={isBusy || isInputEmpty}
        className={cn(
          "w-full rounded-xl py-3 mt-3 items-center justify-center flex-row",
          isInputEmpty || isBusy
            ? "bg-blue-600/50"
            : "bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-600/20",
        )}
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

export default JoinRoomCard;
