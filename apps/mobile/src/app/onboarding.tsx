import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuthStore from "../hooks/useAuthStrore";
import { PressableFeedback, Typography } from "heroui-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("../../assets/images/onboarding/onboarding-slide1-transparent.png"),
    tagline: "Play • Connect • Compete",
  },
  {
    id: "2",
    image: require("../../assets/images/onboarding/onboarding-slide2-transparent.png"),
    tagline: "Connect & Play with Friends",
  },
  {
    id: "3",
    image: require("../../assets/images/onboarding/onboarding-slide3-transparent.png"),
    tagline: "Climb Ranks & Win Rewards",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace("/(auth)/login");
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );
    if (slideIndex >= 0 && slideIndex < SLIDES.length) {
      setCurrentIndex(slideIndex);
    }
  };

  return (
    <View className="flex-1 justify-center">
      <SafeAreaView />
      {/* Shared Background Image */}
      <Image
        source={require("../../assets/images/onboarding/zuno-boarding-bg.png")}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      {/* Skip button in upper right */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleFinish}
        style={{ top: insets.top + 20 }}
        className="absolute right-5 px-3.5 py-1.5 rounded-full bg-white/15"
      >
        <Text className="text-white text-sm font-semibold opacity-90">
          Skip
        </Text>
      </TouchableOpacity>

      <View
        pointerEvents="box-none"
        className="flex-1/6 justify-center items-center "
      >
        <Image
          source={require("../../assets/images/onboarding/zuno-logo.png")}
          className="w-44 h-18"
          resizeMode="contain"
        />

        <Text className="text-white text-lg font-bold tracking-wide mt-2 text-center">
          {SLIDES[currentIndex]?.tagline ?? "Play • Connect • Compete"}
        </Text>
      </View>

      {/* Swipeable Carousel with Zoomed Out Transparent Mascot */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="flex-4/6 items-center justify-center"
          >
            <Image
              source={item.image}
              className="w-4/6 h-4/6"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Bottom Footer Overlay: Pagination Dots & Action Button */}
      <View
        pointerEvents="box-none"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        className="flex-2/6 items-center gap-4"
      >
        <View className="flex-row items-center justify-center gap-2">
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <Pressable
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                  });
                }}
                hitSlop={8}
                className={
                  isActive
                    ? "w-6 h-2 rounded-full bg-white"
                    : "w-2 h-2 rounded-full bg-white/40"
                }
              />
            );
          })}
        </View>

        {/* Action Button: Visible on last slide */}
        {currentIndex === SLIDES.length - 1 && (
          <PressableFeedback
            onPress={handleFinish}
            className="w-3/5 mx-auto bg-surface justify-center items-center py-4 shadow-xl rounded-full font-bold"
          >
            <PressableFeedback.Ripple />
            <Typography
              type="body"
              className="text-primary text-base font-bold tracking-wide"
            >
              Get Started
            </Typography>
          </PressableFeedback>
        )}
      </View>
    </View>
  );
}
