import { AxiosRequestConfig } from "axios";
import { api } from "../client";
import { ApiSuccessResponse, ApiResponse } from "../types";

export const USER_ROUTES = {
  ALL: "/users",
  ME: "/users/me",
  PROFILE: "/users/profile",
} as const;

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type UsersListResponse = ApiSuccessResponse<{ users: UserSummary[] }>;
export type UserProfileResponse = ApiSuccessResponse<UserSummary>;

export type UsersListApiResponse = ApiResponse<{ users: UserSummary[] }>;
export type UserProfileApiResponse = ApiResponse<UserSummary>;


export const userRoutes = {
  /**
   * Fetch all registered users (sanitized).
   */
  getAll: (config?: AxiosRequestConfig): Promise<UsersListResponse> =>
    api.get<UsersListResponse>(USER_ROUTES.ALL, config),

  /**
   * Fetch currently authenticated user's details.
   */
  getMe: (config?: AxiosRequestConfig): Promise<UserProfileResponse> =>
    api.get<UserProfileResponse>(USER_ROUTES.ME, config),

  /**
   * Fetch currently authenticated user's profile.
   */
  getProfile: (config?: AxiosRequestConfig): Promise<UserProfileResponse> =>
    api.get<UserProfileResponse>(USER_ROUTES.PROFILE, config),
};
