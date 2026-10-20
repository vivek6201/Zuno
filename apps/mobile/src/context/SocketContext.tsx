import useAuthStore from "@/hooks/useAuthStrore";
import React, { createContext, useEffect, useState } from "react";
import Constants from "expo-constants";

export interface SocketContextType {
  socket: WebSocket | null;
  status: SocketStatus;
}

export enum SocketStatus {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only connect if the user is authenticated and token is present
    if (!isAuthenticated || !token) {
      setSocket((prev) => {
        if (prev) {
          prev.close(1000, "User logged out or unauthenticated");
        }
        return null;
      });
      setStatus(SocketStatus.DISCONNECTED);
      return;
    }

    let rawWsUrl = process.env.EXPO_PUBLIC_SOCKET_URL?.trim();
    if (!rawWsUrl) {
      const hostUri = Constants.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(":")[0] : "192.168.1.2";
      rawWsUrl = `ws://${ip}:8080/ws`;
    }

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let reconnectAttempts = 0;
    let disposed = false;

    const connect = () => {
      if (disposed) return;

      setStatus(SocketStatus.CONNECTING);
      const separator = rawWsUrl.includes("?") ? "&" : "?";
      const wsUrl = `${rawWsUrl}${separator}token=${encodeURIComponent(token)}`;

      ws = new WebSocket(wsUrl);
      setSocket(ws);

      ws.onopen = () => {
        if (disposed) return;
        reconnectAttempts = 0;
        setStatus(SocketStatus.CONNECTED);
        console.log("WebSocket connected successfully");
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message:", event.data);
      };

      ws.onerror = (event) => {
        console.log("WebSocket error:", event);
      };

      ws.onclose = () => {
        setStatus(SocketStatus.DISCONNECTED);
        setSocket((current) => (current === ws ? null : current));

        if (disposed) return;

        // Exponential backoff reconnect
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
        reconnectAttempts += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close(1000, "SocketProvider unmounted or auth changed");
      }
      setSocket(null);
      setStatus(SocketStatus.DISCONNECTED);
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, status }}>
      {children}
    </SocketContext.Provider>
  );
};
