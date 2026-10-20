import { SocketContext, SocketContextType } from "@/context/SocketContext";
import { useContext } from "react";

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside a SocketProvider");
  }

  return context;
};
