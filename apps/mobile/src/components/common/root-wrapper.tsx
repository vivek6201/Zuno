import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { HeroUINativeProvider } from "heroui-native";
import { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { SocketProvider } from "@/context/SocketContext";

const RootWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <HeroUINativeProvider
          config={{
            toast: {
              defaultProps: {
                placement: "bottom",
                isSwipeable: true,
                animation: {
                  entering: {
                    bottom: FadeInDown.springify().damping(18).stiffness(200),
                  },
                  exiting: {
                    bottom: FadeOutDown.duration(180),
                  },
                },
              },
              insets: {
                bottom: 24,
                left: 16,
                right: 16,
                top: 16,
              },
              maxVisibleToasts: 2,
              contentWrapper: (toastChildren) => (
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
                  style={{ flex: 1 }}
                  pointerEvents="box-none"
                >
                  {toastChildren}
                </KeyboardAvoidingView>
              ),
            },
          }}
        >
          <SocketProvider>{children}</SocketProvider>
        </HeroUINativeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootWrapper;
