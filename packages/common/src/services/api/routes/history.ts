import { AxiosRequestConfig } from "axios";
import { api } from "../client";
import { ApiSuccessResponse, ApiResponse } from "../types";
import { MatchHistoryItem, MatchResult, GameSlug } from "../../../types";

export const HISTORY_ROUTES = {
  MATCH_HISTORY: "/history/matches",
  STATS: "/history/stats",
} as const;

export type MatchFilterType = "all" | MatchResult;

export interface GetMatchHistoryParams {
  filter?: MatchFilterType;
  gameType?: GameSlug;
  page?: number;
  limit?: number;
}

export type MatchHistoryData = {
  matches: MatchHistoryItem[];
  total: number;
  page: number;
  limit: number;
};

export type MatchHistoryResponse = ApiSuccessResponse<MatchHistoryData>;
export type MatchHistoryApiResponse = ApiResponse<MatchHistoryData>;

/**
 * Mock / Dummy Match History data matching the reference design.
 * Used while the backend API endpoint is being built.
 */
export const DUMMY_MATCH_HISTORY: MatchHistoryItem[] = [
  {
    id: "match-1",
    gameType: "ludo",
    opponents: ["Rahul", "Aman", "Priya"],
    playersCount: 4,
    playedAt: "12 Sep 2025",
    result: "won",
  },
  {
    id: "match-2",
    gameType: "uno",
    opponents: ["Sameer", "Riya"],
    playersCount: 2,
    playedAt: "10 Sep 2025",
    result: "won",
  },
  {
    id: "match-3",
    gameType: "chess",
    opponents: ["Arjun"],
    playersCount: 2,
    playedAt: "8 Sep 2025",
    result: "lost",
  },
  {
    id: "match-4",
    gameType: "matiks",
    opponents: ["Neha", "Karan"],
    playersCount: 4,
    playedAt: "6 Sep 2025",
    result: "won",
  },
  {
    id: "match-5",
    gameType: "ludo",
    opponents: ["Team"],
    playersCount: 4,
    playedAt: "4 Sep 2025",
    result: "lost",
  },
];

export const historyRoutes = {
  /**
   * Fetch match history for the current authenticated user.
   *
   * [API PLACEHOLDER]
   * When backend endpoint is implemented, replace the simulated response
   * with the actual API call below.
   */
  getMatchHistory: async (
    params?: GetMatchHistoryParams,
    config?: AxiosRequestConfig
  ): Promise<MatchHistoryResponse> => {
    // -----------------------------------------------------------------------
    // PRODUCTION API CALL (Uncomment when backend endpoint is live):
    // return api.get<MatchHistoryResponse>(HISTORY_ROUTES.MATCH_HISTORY, {
    //   ...config,
    //   params: { ...config?.params, ...params },
    // });
    // -----------------------------------------------------------------------

    // Simulated network delay (250ms) to emulate real API request
    await new Promise((resolve) => setTimeout(resolve, 250));

    const filter = params?.filter ?? "all";
    const filteredMatches =
      filter === "all"
        ? DUMMY_MATCH_HISTORY
        : DUMMY_MATCH_HISTORY.filter((item) => item.result === filter);

    return {
      success: true,
      data: {
        matches: filteredMatches,
        total: filteredMatches.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
      message: "Match history fetched successfully",
    };
  },
};
