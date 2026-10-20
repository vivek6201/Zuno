import { View, Image, ActivityIndicator } from "react-native";

const SplashScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("../../../assets/images/onboarding/zuno-boarding-bg.png")}
        className="absolute inset-0"
        resizeMode="cover"
      />
      <Image
        source={require("../../../assets/images/onboarding/zuno-logo.png")}
        className="w-24 h-24"
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default SplashScreen;
