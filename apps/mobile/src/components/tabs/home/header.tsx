import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Typography } from "heroui-native";
import { Bell } from "lucide-react-native";
import QuickPlayCard from "./quick-play-card";
import { getGreeting } from "@repo/common/utils";
import useAuthStore from "@/hooks/useAuthStrore";

const Header = () => {
  const { user } = useAuthStore();
  const wish = useMemo(getGreeting, []);
  const userName = user?.name?.split(" ")[0] || "User";

  return (
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
  );
};

export default Header;
