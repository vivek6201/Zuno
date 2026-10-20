import { useRouter } from "expo-router";

import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ScreenHeader from "@/components/common/screen-header";
import GameCard from "@/components/tabs/games/game-card";
import { GAMES_LIST } from "@/utils/constants";

const Games = () => {
  const router = useRouter();

  const handleGamePress = (gameId: string) => {
    router.push({
      pathname: "/games/[gameId]/mode",
      params: { gameId },
    });
  };

  return (
    <BottomSheetLayout
      header={<ScreenHeader title="Choose a Game" />}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 95,
        gap: 14,
      }}
    >
      {GAMES_LIST.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          subtitle={game.subtitle}
          icon={game.icon}
          colors={game.colors}
          onPress={() => handleGamePress(game.id)}
        />
      ))}
    </BottomSheetLayout>
  );
};

export default Games;
