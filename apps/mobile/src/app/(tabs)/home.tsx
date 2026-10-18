import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, Avatar, Button } from "heroui-native";
import {
  Bell,
  Ribbon,
  Trophy,
  Star,
  Flame,
  Coins,
  Zap,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import useAuthStore from "@/hooks/useAuthStrore";
import QuickPlayCard from "@/components/tabs/home/quick-play-card";
import RecentGameCard from "@/components/tabs/home/recent-game-card";
import StatsCard from "@/components/tabs/home/stats-card";

// Game icon assets
import ludoIcon from "@assets/images/ludo-icon.jpg";
import unoIcon from "@assets/images/uno-icon.jpg";
import matiksIcon from "@assets/images/matiks-icon.jpg";
import chessIcon from "@assets/images/chess-icon.jpg";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

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
  const { user } = useAuthStore();
  const wish = useMemo(getGreeting, []);
  const snapPoints = useMemo(() => ["68%", "95%"], []);

  const userName = user?.name?.split(" ")[0] || "Vivek";
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
    <View className="flex-1 bg-[#F0F5FD]">
      {/* Background Linear Gradient with Faded Bottom Transition */}
      <LinearGradient
        colors={[
          "#1E3A8A",
          "#1D4ED8",
          "#2563EB",
          "#3B82F6",
          "#60A5FA",
          "#93C5FD",
          "#DBEAFE",
          "#F0F5FD",
        ]}
        locations={[0, 0.08, 0.18, 0.25, 0.3, 0.35, 0.4, 0.46]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header (Fixed at top above the sheet) */}
      <View>
        <SafeAreaView edges={["top"]} />

        {/* Top Bar: Greeting & Profile Actions */}
        <View className="flex-row justify-between items-center px-4 pt-2 pb-1">
          <View>
            <Typography
              type="body-sm"
              className="text-white/90 font-medium text-sm"
            >
              Good {wish},
            </Typography>
            <Typography
              type="h1"
              className="text-white font-black text-2xl tracking-tight mt-0.5"
            >
              {userName} 👋
            </Typography>
            <Typography
              type="body-sm"
              className="text-white/75 font-normal text-xs mt-1"
            >
              Play. Connect. Win.
            </Typography>
          </View>

          {/* Right: Bell & Avatar */}
          <View className="flex-row items-center gap-x-3.5">
            <TouchableOpacity
              activeOpacity={0.8}
              className="relative p-1 items-center justify-center"
            >
              <Bell color="white" size={24} />
              <View className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-blue-600" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8}>
              <Avatar size="md" className="border-2 border-white">
                <Avatar.Fallback className=" text-white font-bold">
                  {userName[0]}
                </Avatar.Fallback>
                <Avatar.Image />
              </Avatar>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Play Banner Card */}
        <QuickPlayCard />
      </View>

      {/* Draggable & Scrollable Surface Bottom Sheet */}
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{
          backgroundColor: "#CBD5E1",
          width: 44,
          height: 4,
          borderRadius: 2,
        }}
        backgroundStyle={{
          backgroundColor: "#F0F5FD",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
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
              <Button variant="ghost" className="p-0">
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
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Home;
