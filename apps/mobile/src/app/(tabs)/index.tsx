import { useMemo } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Typography, Button } from "heroui-native";
import { Ribbon, Trophy, Star, Flame, Coins, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";

//components
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import RecentGameCard from "@/components/tabs/home/recent-game-card";
import StatsCard from "@/components/tabs/home/stats-card";
import Header from "@/components/tabs/home/header";

// Game icon assets
import ludoIcon from "@assets/images/ludo-icon.jpg";
import unoIcon from "@assets/images/uno-icon.jpg";
import matiksIcon from "@assets/images/matiks-icon.jpg";
import chessIcon from "@assets/images/chess-icon.jpg";

// demo data will fetch this from api
const STATS_DATA = [
  {
    id: "games",
    label: "Games Played",
    value: "12",
    icon: <Ribbon color="#2563EB" size={24} />,
  },
  {
    id: "won",
    label: "Wins",
    value: "8",
    icon: <Trophy color="#2563EB" size={24} />,
  },
  {
    id: "streak",
    label: "Streak",
    value: "4",
    icon: <Star color="#F59E0B" fill="#F59E0B" size={24} />,
  },
  {
    id: "win-rate",
    label: "Win Rate",
    value: "67%",
    icon: <Flame color="#EF4444" size={24} />,
  },
  {
    id: "coins",
    label: "Coins",
    value: "2,450",
    icon: <Coins color="#EAB308" size={24} />,
  },
  {
    id: "rank",
    label: "Rank",
    value: "#4",
    icon: <Zap color="#7C3AED" size={24} />,
  },
];

const POPULAR_GAMES = [
  { id: "ludo", name: "Ludo", icon: ludoIcon },
  { id: "uno", name: "UNO", icon: unoIcon },
  { id: "matiks", name: "Matiks", icon: matiksIcon },
  { id: "chess", name: "Chess", icon: chessIcon },
];

const Home = () => {
  const router = useRouter();

  const { width: windowWidth } = useWindowDimensions();

  // Dynamic card width: 2 for small screens (<380), 3 for medium (<500), 4 for large
  const statsCardWidth = useMemo(() => {
    if (windowWidth < 380) return Math.round((windowWidth - 48) / 2.3);
    if (windowWidth < 500) return Math.round((windowWidth - 56) / 3.2);
    return Math.round((windowWidth - 64) / 4.3);
  }, [windowWidth]);

  const nativeScrollGesture = useMemo(
    () =>
      Gesture.Native().shouldActivateOnStart(true).disallowInterruption(true),
    [],
  );

  return (
    <BottomSheetLayout
      header={<Header />}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 95,
        gap: 10,
      }}
    >
      {/* Section 1: Continue Playing */}
      <View className="gap-y-2.5">
        <View className="flex-row justify-between items-center px-1">
          <Typography
            type="body"
            className="font-extrabold text-slate-900 text-base"
          >
            Continue Playing
          </Typography>
          <Button variant="ghost" className="p-0">
            <Typography
              type="body-sm"
              className="text-primary font-semibold text-xs"
            >
              See All
            </Typography>
          </Button>
        </View>
        <RecentGameCard />
      </View>

      {/* Section 2: Your Stats (Horizontal Scroll) */}
      <View className="gap-y-2.5">
        <View className="px-1">
          <Typography
            type="body"
            className="font-extrabold text-slate-900 text-base"
          >
            Your Stats
          </Typography>
        </View>
        <GestureDetector gesture={nativeScrollGesture}>
          <ScrollView
            horizontal
            nestedScrollEnabled={true}
            directionalLockEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingRight: 16,
            }}
          >
            {STATS_DATA.map((item) => (
              <View key={item.id} style={{ width: statsCardWidth }}>
                <StatsCard
                  icon={item.icon}
                  value={item.value}
                  label={item.label}
                />
              </View>
            ))}
          </ScrollView>
        </GestureDetector>
      </View>

      {/* Section 3: Popular Games */}
      <View className="gap-y-2">
        <View className="flex-row justify-between items-center px-1">
          <Typography
            type="body"
            className="font-extrabold text-slate-900 text-base"
          >
            Popular Games
          </Typography>
          <Button
            variant="ghost"
            className="p-0"
            onPress={() => router.push("/games")}
          >
            <Typography
              type="body-sm"
              className="text-primary font-semibold text-xs"
            >
              See All
            </Typography>
          </Button>
        </View>
        <View className="flex-row justify-between items-center px-2 pt-1">
          {POPULAR_GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.8}
              className="items-center"
              onPress={() => router.push(`/games/${game.id}/mode`)}
            >
              <Image
                source={game.icon}
                className="w-14 h-14 rounded-2xl shadow-sm"
                resizeMode="cover"
              />
              <Typography
                type="body-sm"
                className="text-slate-600 font-semibold text-xs mt-2 text-center"
              >
                {game.name}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheetLayout>
  );
};

export default Home;
