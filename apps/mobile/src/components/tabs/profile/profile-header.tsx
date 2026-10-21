import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, cn } from "heroui-native";
import { Award, Settings } from "lucide-react-native";
import BackButton from "@/components/common/back-button";
import useAuthStore from "@/hooks/useAuthStrore";
import defaultAvatar from "@assets/images/default-avatar.jpg";

export interface ProfileHeaderProps {
  onSettingsPress?: () => void;
  onBadgePress?: () => void;
  className?: string;
}

const ProfileHeader = ({
  onSettingsPress,
  onBadgePress,
  className,
}: ProfileHeaderProps) => {
  const { user } = useAuthStore();

  const userName = user?.name || "Vivek Kumar";
  const userHandle = user?.email ? `@${user.email.split("@")[0]}` : "@user";

  // XP progression calculation (default 320/500 XP = 64%)
  const currentXp = 320;
  const targetXp = 500;
  const progressPercent = Math.min(
    Math.round((currentXp / targetXp) * 100),
    100,
  );

  return (
    <View className={cn("pb-2", className)}>
      <SafeAreaView edges={["top"]} />

      {/* Top Bar: Back Button, Title, and Settings Icon */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
        <View className="flex-row items-center">
          <BackButton color="white" size={22} className="-ml-1 mr-2" />
          <Typography
            type="h3"
            className="text-white font-extrabold text-lg tracking-tight"
          >
            Profile
          </Typography>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={10}
          onPress={onSettingsPress}
          className="p-1.5 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
        >
          <Settings color="white" size={22} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View className="bg-white rounded-3xl p-4 mx-4 mt-1.5 mb-2 shadow-sm border border-slate-100 flex-row items-center">
        {/* Left Avatar */}
        <View className="w-18 h-18 rounded-full bg-blue-100 overflow-hidden mr-3.5 items-center justify-center border-2 border-white shadow-sm">
          <Image
            source={
              user?.image && typeof user.image === "string"
                ? { uri: user.image }
                : defaultAvatar
            }
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Center & Right Details */}
        <View className="flex-1">
          {/* Name & Badge Row */}
          <View className="flex-row items-center justify-between">
            <Typography
              type="h4"
              className="text-slate-900 font-extrabold text-base tracking-tight"
            >
              {userName}
            </Typography>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={8}
              onPress={onBadgePress}
              className="p-1 items-center justify-center"
            >
              <Award color="#2563EB" size={20} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* User Tag */}
          <Typography
            type="body-sm"
            className="text-slate-400 font-medium text-xs mt-0.5"
          >
            {userHandle}
          </Typography>

          {/* Level Pill */}
          <View className="self-start mt-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100/60">
            <Typography
              type="body-xs"
              className="text-primary font-bold text-xs"
            >
              Level 3
            </Typography>
          </View>

          {/* XP Progress Bar Row */}
          <View className="flex-row items-center mt-2.5 gap-x-2">
            <View className="flex-1 h-2 bg-blue-100/70 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Typography
              type="body-xs"
              className="text-slate-500 font-semibold text-[11px]"
            >
              {currentXp} / {targetXp} XP
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
