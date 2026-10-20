import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Share,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Typography, useToast, cn } from "heroui-native";
import { RefreshCw, Share2 } from "lucide-react-native";
import { GameType } from "@repo/common/validations/game";
import { roomRoutes, RoomListItem } from "@repo/common/api/routes/rooms";

export interface AvailableRoomsListProps {
  /**
   * Game type filter for listing rooms (e.g. LUDO, CHESS, UNO, MATIKS).
   */
  gameType?: GameType;

  /**
   * Section title. Defaults to "Available Rooms".
   */
  title?: string;

  /**
   * Callback fired when user taps "Join" on a room item.
   */
  onJoinRoom?: (roomId: string, room: RoomListItem) => void;

  /**
   * Additional style for the container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Additional className for the container.
   */
  className?: string;
}

export const AvailableRoomsList: React.FC<AvailableRoomsListProps> = ({
  gameType,
  title = "Available Rooms",
  onJoinRoom,
  style,
  className = "",
}) => {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchRooms = useCallback(async () => {
    try {
      const res = await roomRoutes.list(gameType ? { gameType } : undefined);
      if (res.success && Array.isArray(res.data)) {
        setRooms(res.data);
      } else {
        setRooms([]);
      }
    } catch {
      // Quiet fail on poll, user can tap refresh
      setRooms([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [gameType]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchRooms();
  };

  const handleShare = async (room: RoomListItem) => {
    try {
      const code = room.roomId.toUpperCase();
      await Share.share({
        message: `Join my ${room.gameType || "game"} room on Zuno! Use room code: ${code}`,
      });
    } catch (err: any) {
      toast.show({
        variant: "danger",
        label: "Failed to open share sheet",
      });
    }
  };

  return (
    <View className={cn("mt-2", className)} style={style}>
      {/* Section Header */}
      <View className="flex-row justify-between items-center mb-2.5 px-0.5">
        <Typography
          type="h3"
          className="text-slate-900 font-extrabold text-[17px] tracking-tight"
        >
          {title}
        </Typography>

        <TouchableOpacity
          onPress={handleManualRefresh}
          hitSlop={8}
          activeOpacity={0.7}
          className="p-1"
        >
          <RefreshCw
            color="#64748B"
            size={16}
            className={cn(isRefreshing && "animate-spin")}
          />
        </TouchableOpacity>
      </View>

      {/* Rooms Container Card */}
      <View className="bg-white rounded-2xl p-3 border border-slate-100 shadow">
        {isLoading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator color="#2563EB" size="small" />
            <Typography
              type="body-sm"
              className="text-slate-400 font-medium text-xs mt-2"
            >
              Loading active rooms...
            </Typography>
          </View>
        ) : rooms.length === 0 ? (
          <View className="py-6 items-center justify-center px-4">
            <Typography
              type="body-sm"
              className="text-slate-400 font-semibold text-xs text-center leading-relaxed"
            >
              No active rooms found right now.{"\n"}Create one above to start
              playing!
            </Typography>
          </View>
        ) : (
          <View className="gap-y-2">
            {rooms.map((room, index) => {
              const playerCount = room.playerCount ?? 1;
              const maxPlayers = room.maxPlayers || 4;
              const isFull = playerCount >= maxPlayers;
              const displayCode =
                room.roomId.length > 6
                  ? room.roomId.slice(0, 5).toUpperCase()
                  : room.roomId.toUpperCase();
              const displayName =
                room.gameConfig?.roomName || `Room #${displayCode}`;

              return (
                <View
                  key={room.roomId || index}
                  className={cn(
                    "flex-row items-center justify-between py-2.5 px-2",
                    index < rooms.length - 1 && "border-b border-slate-100",
                  )}
                >
                  {/* Left: Room Title & Player Count */}
                  <View className="flex-1 mr-2">
                    <Typography
                      type="body"
                      className="text-slate-900 font-bold text-sm tracking-tight"
                      numberOfLines={1}
                    >
                      {displayName}
                    </Typography>
                    <Typography
                      type="body-sm"
                      className="text-slate-500 font-medium text-xs mt-0.5"
                    >
                      {playerCount}/{maxPlayers} players
                    </Typography>
                  </View>

                  {/* Middle: Code Badge */}
                  <View className="bg-blue-50 border border-blue-100/60 px-2.5 py-1 rounded-full mr-2.5">
                    <Typography
                      type="body-sm"
                      className="text-blue-600 font-black text-xs tracking-wider"
                    >
                      {displayCode}
                    </Typography>
                  </View>

                  {/* Right Actions: Share + Join/Full */}
                  <View className="flex-row items-center gap-x-2">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      hitSlop={6}
                      onPress={() => handleShare(room)}
                      className="p-1.5 rounded-full hover:bg-slate-100 active:bg-slate-100"
                    >
                      <Share2 color="#2563EB" size={18} strokeWidth={2.2} />
                    </TouchableOpacity>

                    {isFull ? (
                      <View className="bg-slate-200 px-4 py-1.5 rounded-full items-center justify-center min-w-13.5">
                        <Typography
                          type="body-sm"
                          className="text-slate-400 font-bold text-xs"
                        >
                          Full
                        </Typography>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => onJoinRoom?.(room.roomId, room)}
                        className="bg-blue-600 active:bg-blue-700 px-4 py-1.5 rounded-full items-center justify-center min-w-13.5 shadow-sm shadow-blue-500/20"
                      >
                        <Typography
                          type="body-sm"
                          className="text-white font-extrabold text-xs"
                        >
                          Join
                        </Typography>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default AvailableRoomsList;
