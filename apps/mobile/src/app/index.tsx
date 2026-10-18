import { Redirect } from "expo-router";
import useAuthStore from "../hooks/useAuthStrore";

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding } = useAuthStore();

  if (!hasSeenOnboarding && !isAuthenticated) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}
