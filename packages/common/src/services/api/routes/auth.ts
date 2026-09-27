import { AxiosRequestConfig } from "axios";
import { api } from "../client";
import { ApiSuccessResponse, ApiResponse } from "../types";
import { RegisterUserInput, LoginUserInput } from "../../../validation/user";

export const AUTH_ROUTES = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  LOGOUT_ALL: "/auth/logout-all",
  SESSIONS: "/auth/sessions",
} as const;

export interface AuthData {
  token: string;
  expiresAt: string | Date;
}

export interface SessionItem {
  id: string;
  userId: string;
  tokenHash?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string | Date;
  expiresAt: string | Date;
  isCurrent?: boolean;
}

export interface SessionsData {
  sessions: SessionItem[];
}

export type AuthResponse = ApiSuccessResponse<AuthData>;
export type MessageResponse = ApiSuccessResponse<null>;
export type SessionsResponse = ApiSuccessResponse<SessionsData>;

export type AuthApiResponse = ApiResponse<AuthData>;
export type SessionsApiResponse = ApiResponse<SessionsData>;


export const authRoutes = {
  /**
   * Register a new user account.
   */
  register: (
    data: RegisterUserInput,
    config?: AxiosRequestConfig
  ): Promise<AuthResponse> =>
    api.post<AuthResponse>(AUTH_ROUTES.REGISTER, data, config),

  /**
   * Log into an existing account.
   */
  login: (
    data: LoginUserInput,
    config?: AxiosRequestConfig
  ): Promise<AuthResponse> =>
    api.post<AuthResponse>(AUTH_ROUTES.LOGIN, data, config),

  /**
   * Log out from the current active session.
   */
  logout: (config?: AxiosRequestConfig): Promise<MessageResponse> =>
    api.delete<MessageResponse>(AUTH_ROUTES.LOGOUT, config),

  /**
   * Terminate all active sessions for the current user.
   */
  logoutAll: (config?: AxiosRequestConfig): Promise<MessageResponse> =>
    api.delete<MessageResponse>(AUTH_ROUTES.LOGOUT_ALL, config),

  /**
   * Retrieve all active sessions for the current user.
   */
  getSessions: (config?: AxiosRequestConfig): Promise<SessionsResponse> =>
    api.get<SessionsResponse>(AUTH_ROUTES.SESSIONS, config),
};
