import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Dialog, Typography, cn } from "heroui-native";
import { LogOut } from "lucide-react-native";
import useAuthStore from "@/hooks/useAuthStrore";

export interface ProfileLogoutButtonProps {
  onPress?: () => void;
  className?: string;
}

const ProfileLogoutButton = ({
  onPress,
  className,
}: ProfileLogoutButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthStore();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    setIsOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        className={cn(
          "rounded-[20px] overflow-hidden shadow-md shadow-red-500/25",
          className,
        )}
      >
        <LinearGradient
          colors={["#F43F5E", "#EF4444", "#B91C1C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
        >
          <View className="flex-row items-center justify-center py-4 px-6 gap-x-2.5">
            <LogOut color="white" size={20} strokeWidth={2.2} />
            <Typography
              type="h4"
              className="text-white font-extrabold text-base tracking-wide"
            >
              Log Out
            </Typography>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* HeroUI Dialog Modal */}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content className="p-6 rounded-[28px] bg-white max-w-85 w-full shadow-2xl items-center border border-slate-100">
            <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-3.5 border border-red-100">
              <LogOut color="#EF4444" size={26} strokeWidth={2.2} />
            </View>

            <Dialog.Title className="text-xl font-black text-slate-900 text-center tracking-tight">
              Log Out
            </Dialog.Title>

            <Dialog.Description className="text-slate-500 font-medium text-sm text-center mt-2 mb-6 leading-5">
              Are you sure you want to log out of Zuno? You will need to log
              back in to access your profile and join games.
            </Dialog.Description>

            <View className="flex-row items-center w-full gap-x-3">
              <Button
                variant="secondary"
                size="md"
                isDisabled={isLoggingOut}
                className="flex-1 rounded-2xl py-3 border border-slate-200"
                onPress={() => setIsOpen(false)}
              >
                <Button.Label className="font-bold text-slate-700">
                  Cancel
                </Button.Label>
              </Button>

              <Button
                variant="danger"
                size="md"
                isDisabled={isLoggingOut}
                className="flex-1  rounded-2xl py-3 bg-red-600 shadow-md shadow-red-500/20"
                onPress={handleConfirmLogout}
              >
                <Button.Label className="font-bold text-white">
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};

export default ProfileLogoutButton;
