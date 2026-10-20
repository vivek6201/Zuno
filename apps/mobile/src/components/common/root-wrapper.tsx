import { SocketProvider } from "@/context/SocketContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { HeroUINativeProvider } from "heroui-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <HeroUINativeProvider>
          <SocketProvider>{children}</SocketProvider>
        </HeroUINativeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootWrapper;
