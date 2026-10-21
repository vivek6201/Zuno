import { useCallback, useEffect, useState } from "react";
import {
  historyRoutes,
  MatchFilterType,
  DUMMY_MATCH_HISTORY,
} from "@repo/common/api/routes/history";
import { MatchHistoryItem } from "@repo/common/types";

export interface UseMatchHistoryReturn {
  matches: MatchHistoryItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  filter: MatchFilterType;
  setFilter: (filter: MatchFilterType) => void;
  refresh: () => Promise<void>;
  error: string | null;
}

/**
 * Hook to fetch and manage Match History data.
 * Currently uses simulated API placeholder responses until the backend API is live.
 */
export const useMatchHistory = (
  initialFilter: MatchFilterType = "all",
): UseMatchHistoryReturn => {
  const [filter, setFilter] = useState<MatchFilterType>(initialFilter);
  const [matches, setMatches] = useState<MatchHistoryItem[]>(DUMMY_MATCH_HISTORY);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(
    async (activeFilter: MatchFilterType, isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await historyRoutes.getMatchHistory({
          filter: activeFilter,
        });

        if (response.success && response.data?.matches) {
          setMatches(response.data.matches);
        } else {
          // Fallback to local dummy filtering if needed
          const fallback =
            activeFilter === "all"
              ? DUMMY_MATCH_HISTORY
              : DUMMY_MATCH_HISTORY.filter(
                  (item) => item.result === activeFilter,
                );
          setMatches(fallback);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load match history");
        // Fallback to local dummy data on network failure
        const fallback =
          activeFilter === "all"
            ? DUMMY_MATCH_HISTORY
            : DUMMY_MATCH_HISTORY.filter(
                (item) => item.result === activeFilter,
              );
        setMatches(fallback);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchMatches(filter);
  }, [filter, fetchMatches]);

  const refresh = useCallback(async () => {
    await fetchMatches(filter, true);
  }, [fetchMatches, filter]);

  return {
    matches,
    isLoading,
    isRefreshing,
    filter,
    setFilter,
    refresh,
    error,
  };
};

export default useMatchHistory;
