import { useGlobalSearchParams, useRouter } from "expo-router";
import {
  DEFAULT_GRADIENT_COLORS,
  GAME_GRADIENTS,
} from "@repo/common/constants/gradients";
import { GameType, GameTypeEnum } from "@repo/common/validations/game";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import ScreenHeader from "@/components/common/screen-header";
import {
  CreateRoomCard,
  JoinRoomCard,
  OrDivider,
  AvailableRoomsList,
} from "@/components/lobby";
import { MODE_GRADIENT_LOCATIONS } from "@/utils/constants";

const GAME_TYPE_MAP: Record<string, GameType> = {
  ludo: GameTypeEnum.LUDO,
  chess: GameTypeEnum.CHESS,
  uno: GameTypeEnum.UNO,
  matiks: GameTypeEnum.MATIKS,
};

const MultiplayerLobby = () => {
  const router = useRouter();
  const params = useGlobalSearchParams<{ gameId: string }>();

  const gameType: GameType = GAME_TYPE_MAP[params.gameId] ?? GameTypeEnum.LUDO;
  const gradientColors =
    GAME_GRADIENTS[params.gameId] ?? DEFAULT_GRADIENT_COLORS;

  const handleEnterRoom = (roomId: string) => {
    router.push({
      pathname: "/games/[gameId]/waiting/[roomId]",
      params: { gameId: params.gameId, roomId },
    });
  };

  return (
    <BottomSheetLayout
      gradientColors={gradientColors}
      gradientLocations={MODE_GRADIENT_LOCATIONS}
      header={<ScreenHeader title={params.gameId} subtitle="Multiplayer" />}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 95,
        gap: 12,
      }}
    >
      {/* 1. Create Room Card (calls API & enters room) */}
      <CreateRoomCard
        gameType={gameType}
        onCreateSuccess={(room) => handleEnterRoom(room.roomId)}
      />

      {/* 2. OR Separator */}
      <OrDivider />

      {/* 3. Join Room by Code Card (takes input & validates via API) */}
      <JoinRoomCard onJoinSuccess={(room) => handleEnterRoom(room.roomId)} />

      {/* 4. Live Available Rooms List */}
      <AvailableRoomsList
        gameType={gameType}
        onJoinRoom={(roomId) => handleEnterRoom(roomId)}
      />
    </BottomSheetLayout>
  );
};

export default MultiplayerLobby;
