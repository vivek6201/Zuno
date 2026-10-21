import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography, cn } from "heroui-native";
import { Bell, ChevronRight, HelpCircle, User } from "lucide-react-native";

export interface ProfileMenuCardProps {
  onEditProfile?: () => void;
  onNotifications?: () => void;
  onHelpSupport?: () => void;
  className?: string;
}

const ProfileMenuCard = ({
  onEditProfile,
  onNotifications,
  onHelpSupport,
  className,
}: ProfileMenuCardProps) => {
  const menuItems = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: User,
      hasChevron: true,
      onPress: onEditProfile,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      hasChevron: true,
      onPress: onNotifications,
    },
    {
      id: "help-support",
      title: "Help & Support",
      icon: HelpCircle,
      hasChevron: true,
      onPress: onHelpSupport,
    },
  ];

  return (
    <View
      className={cn(
        "bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden",
        className,
      )}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === menuItems.length - 1;

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={item.onPress}
            className={cn(
              "flex-row items-center justify-between px-4 py-4 active:bg-slate-50/80",
              !isLast && "border-b border-slate-100",
            )}
          >
            <View className="flex-row items-center">
              <View className="w-8 items-center justify-center mr-2.5">
                <Icon color="#475569" size={20} strokeWidth={2} />
              </View>
              <Typography
                type="body"
                className="text-slate-700 font-semibold text-sm"
              >
                {item.title}
              </Typography>
            </View>

            {item.hasChevron && (
              <ChevronRight color="#94A3B8" size={18} strokeWidth={2} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ProfileMenuCard;
