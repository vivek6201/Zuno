import { WebSocket } from "ws";
import type { AuthenticatedUser } from "@repo/common/constants/websocket";

/**
 * Augmented WebSocket instance containing authentication and room metadata (backend specific).
 */
export interface AuthenticatedSocket extends WebSocket {
  user?: AuthenticatedUser;
  roomId?: string;
  isAlive?: boolean;
}

export * from "@repo/common/constants/websocket";
