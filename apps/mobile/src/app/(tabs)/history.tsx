import React from "react";
import { useRouter } from "expo-router";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import {
  HistoryHeader,
  HistoryFilterTabs,
  MatchHistoryList,
} from "@/components/tabs/history";
import { useMatchHistory } from "@/hooks/useMatchHistory";

const History = () => {
  const router = useRouter();
  const { matches, isLoading, filter, setFilter } = useMatchHistory();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <BottomSheetLayout
      header={<HistoryHeader onBackPress={handleBack} />}
      handleIndicatorStyle={{ display: "none" }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 110,
        gap: 16,
      }}
    >
      {/* 1. Filter Tabs (All / Wins / Losses) */}
      <HistoryFilterTabs
        activeFilter={filter}
        onSelectFilter={setFilter}
      />

      {/* 2. Grouped Match History Card List */}
      <MatchHistoryList
        matches={matches}
        isLoading={isLoading}
      />
    </BottomSheetLayout>
  );
};

export default History;
