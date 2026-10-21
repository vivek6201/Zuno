import { authRoutes, AUTH_ROUTES } from "./auth";
import { userRoutes, USER_ROUTES } from "./users";
import { roomRoutes, ROOM_ROUTES } from "./rooms";
import { historyRoutes, HISTORY_ROUTES } from "./history";

import { safeApi, ApiClientError } from "../client";

export * from "../types";
export * from "../client";
export * from "./auth";
export * from "./users";
export * from "./rooms";
export * from "./history";

/**
 * All Express backend endpoint path definitions (base path: /api/v1).
 */
export const API_ROUTES = {
  AUTH: AUTH_ROUTES,
  USERS: USER_ROUTES,
  ROOMS: ROOM_ROUTES,
  HISTORY: HISTORY_ROUTES,
} as const;

/**
 * Unified API Routes client for backend communication.
 */
export const apiRoutes = {
  endpoints: API_ROUTES,
  auth: authRoutes,
  users: userRoutes,
  rooms: roomRoutes,
  history: historyRoutes,
  safe: safeApi,
};

export default apiRoutes;
