import useAuthStore from "@/hooks/useAuthStrore";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Constants from "expo-constants";
import { ClientMessage, ServerMessage } from "@repo/common/constants/websocket";

export type MessageListener = (message: ServerMessage) => void;

export interface SocketContextType {
  socket: WebSocket | null;
  status: SocketStatus;
  sendMessage: (message: ClientMessage) => boolean;
  addMessageListener: (listener: MessageListener) => () => void;
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

  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<MessageListener>>(new Set());

  const addMessageListener = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const sendMessage = useCallback((message: ClientMessage): boolean => {
    const currentWs = wsRef.current;
    if (currentWs && currentWs.readyState === WebSocket.OPEN) {
      currentWs.send(JSON.stringify(message));
      return true;
    }
    console.warn("WebSocket is not connected. Unable to send message:", message);
    return false;
  }, []);

  useEffect(() => {
    // Only connect if the user is authenticated and token is present
    if (!isAuthenticated || !token) {
      if (wsRef.current) {
        wsRef.current.close(1000, "User logged out or unauthenticated");
        wsRef.current = null;
      }
      setSocket(null);
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
      wsRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        if (disposed) return;
        reconnectAttempts = 0;
        setStatus(SocketStatus.CONNECTED);
        console.log("WebSocket connected successfully");
      };

      ws.onmessage = (event) => {
        try {
          const parsed =
            typeof event.data === "string"
              ? JSON.parse(event.data)
              : event.data;

          listenersRef.current.forEach((listener) => {
            try {
              listener(parsed);
            } catch (err) {
              console.error("Error in WebSocket message listener:", err);
            }
          });
        } catch (err) {
          console.warn("Received unparseable WebSocket message:", event.data);
        }
      };

      ws.onerror = (event) => {
        console.log("WebSocket error:", event);
      };

      ws.onclose = () => {
        setStatus(SocketStatus.DISCONNECTED);
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
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
      wsRef.current = null;
      setSocket(null);
      setStatus(SocketStatus.DISCONNECTED);
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{ socket, status, sendMessage, addMessageListener }}
    >
      {children}
    </SocketContext.Provider>
  );
};
