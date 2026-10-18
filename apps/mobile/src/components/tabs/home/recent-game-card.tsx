import { Image, TouchableOpacity, View } from "react-native";
import { Button, Typography } from "heroui-native";
import { ArrowRight } from "lucide-react-native";
import { COLORS } from "@repo/common/constants/colors";
import LudoIcon from "@assets/images/ludo-icon.jpg";

export interface Player {
  id: string;
  avatar: string;
  name?: string;
}

export interface RecentGameCardProps {
  title?: string;
  timeAgo?: string;
  status?: string;
  icon?: any;
  players?: Player[];
  onResume?: () => void;
  onPress?: () => void;
}

const DEFAULT_PLAYERS: Player[] = [
  {
    id: "1",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    name: "Player 1",
  },
  {
    id: "2",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    name: "Player 2",
  },
  {
    id: "3",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    name: "Player 3",
  },
  {
    id: "4",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    name: "Player 4",
  },
];

const RecentGameCard = ({
  title = "Ludo",
  timeAgo = "2h ago",
  status = "Online",
  icon = LudoIcon,
  players = DEFAULT_PLAYERS,
  onResume,
  onPress,
}: RecentGameCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-surface rounded-2xl p-3 border border-border/80 shadow-sm"
    >
      {/* Top Row: Game Icon, Title & Arrow */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-3 flex-1">
          <Image
            source={icon}
            className="w-12 h-12 rounded-xl"
            resizeMode="cover"
          />
          <View className="gap-y-0.5 flex-1">
            <Typography
              type="h5"
              className="font-extrabold text-text-primary text-base"
            >
              {title}
            </Typography>
            <View className="flex-row items-center gap-x-1.5">
              <Typography
                type="body-sm"
                className="text-muted font-medium text-xs"
              >
                {timeAgo}
              </Typography>
              <View className="w-1 h-1 rounded-full bg-default-soft-hover" />
              <Typography
                type="body-sm"
                className="text-primary font-semibold text-xs"
              >
                {status}
              </Typography>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onPress}
          hitSlop={8}
          className="p-1 items-center justify-center"
        >
          <ArrowRight size={20} color={COLORS.primary.DEFAULT} />
        </TouchableOpacity>
      </View>

      {/* Bottom Row: Player Avatars & Resume Button */}
      <View className="flex-row items-center justify-between mt-3 pt-1">
        {/* Left: 4 Players Avatars (2 vs 2 layout) */}
        <View className="flex-row items-center">
          {/* Pair 1 */}
          <View className="flex-row items-center">
            {players[0] && (
              <Image
                source={{ uri: players[0].avatar }}
                className="w-6 h-6 rounded-full border border-surface bg-surface-secondary"
              />
            )}
            {players[1] && (
              <Image
                source={{ uri: players[1].avatar }}
                className="w-6 h-6 rounded-full border border-surface bg-surface-secondary -ml-1.5"
              />
            )}
          </View>

          {/* Separator */}
          <View className="mx-2 w-1 h-1 rounded-full bg-border-strong" />

          {/* Pair 2 */}
          <View className="flex-row items-center">
            {players[2] && (
              <Image
                source={{ uri: players[2].avatar }}
                className="w-6 h-6 rounded-full border border-surface bg-surface-secondary"
              />
            )}
            {players[3] && (
              <Image
                source={{ uri: players[3].avatar }}
                className="w-6 h-6 rounded-full border border-surface bg-surface-secondary -ml-1.5"
              />
            )}
          </View>
        </View>

        {/* Right: Resume Pill Button */}
        <Button
          variant="primary"
          size="sm"
          className="rounded-full px-5 py-2 shadow-sm shadow-primary/20"
          onPress={onResume}
        >
          <Button.Label className="font-bold text-sm text-white">
            Resume
          </Button.Label>
        </Button>
      </View>
    </TouchableOpacity>
  );
};

export default RecentGameCard;
