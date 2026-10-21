import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import useAuthStore from "../hooks/useAuthStrore";
import SplashScreen from "@/components/common/splash-screen";
import { setApiBaseUrl } from "@repo/common/api/client";
import RootWrapper from "@/components/common/root-wrapper";

const API_HOST = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.3:8080";
setApiBaseUrl(`${API_HOST}/api/v1`);

export default function RootLayout() {
  const { isAuthenticated, isLoading, hasSeenOnboarding, bootstrap } =
    useAuthStore();

  // Restore token + onboarding flag from SecureStore on app boot
  useEffect(() => {
    bootstrap();
  }, []);

  // Show splash while bootstrapping
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <RootWrapper>
      <StatusBar barStyle={"default"} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry & Fallback screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />

        {/* Onboarding: only shown the very first time the app is opened by an unauthenticated user */}
        <Stack.Protected guard={!hasSeenOnboarding && !isAuthenticated}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        {/* Auth screens: only when user has seen onboarding but is NOT logged in */}
        <Stack.Protected guard={hasSeenOnboarding && !isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* App screens: only when logged in */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="games/[gameId]/mode" />
          <Stack.Screen name="games/[gameId]/lobby/multiplayer-lobby" />
          <Stack.Screen name="games/[gameId]/lobby/local-lobby" />
          <Stack.Screen name="games/[gameId]/waiting/[roomId]" />
          <Stack.Screen name="game/[roomId]" />
        </Stack.Protected>
      </Stack>
    </RootWrapper>
  );
}
