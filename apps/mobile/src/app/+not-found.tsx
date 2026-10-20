import { Link, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center p-6">
        <Text className="text-white text-3xl font-extrabold mb-3 text-center">
          Route Not Found
        </Text>
        <Text className="text-slate-400 text-center mb-8 text-base">
          This screen could not be found or has moved.
        </Text>
        <Link href="/(tabs)" asChild replace>
          <TouchableOpacity className="bg-primary px-8 py-3.5 rounded-full shadow-lg">
            <Text className="text-white font-bold text-base">
              Go to Home Screen
            </Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </>
  );
}
