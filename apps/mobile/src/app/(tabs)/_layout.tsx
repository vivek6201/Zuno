import React from "react";
import { Tabs } from "expo-router";
import { Gamepad, History, Home, User } from "lucide-react-native";
import { COLORS } from "@repo/common/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = COLORS.ui.tabBar.active;
const INACTIVE = COLORS.ui.tabBar.inactive;
const BORDER = COLORS.ui.tabBar.border;
const SHADOW = COLORS.primary[400];

const TAB_BAR_HEIGHT = 64;

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  const makeIcon =
    (Icon: React.ComponentType<any>, fillWhenActive = false) =>
    ({ focused, size }: { focused: boolean; size: number }) => (
      <Icon
        size={size}
        color={focused ? ACTIVE : INACTIVE}
        fill={focused && fillWhenActive ? ACTIVE : "none"}
        strokeWidth={focused ? 2.5 : 2}
      />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarHideOnKeyboard: true,

        sceneStyle: {
          flex: 1,
        },

        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),

          backgroundColor: COLORS.ui.tabBar.bg,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderRightWidth: 1.5,
          borderColor: BORDER,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,

          shadowColor: SHADOW,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: makeIcon(Home, true),
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="games"
        options={{
          tabBarIcon: makeIcon(Gamepad),
          tabBarLabel: "Games",
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: makeIcon(History),
          tabBarLabel: "History",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: makeIcon(User),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
