import { UseLudoGameProps, UseLudoGameReturn } from "./types";
import { useLudoLocal } from "./useLudoLocal";
import { useLudoOnline } from "./useLudoOnline";

export * from "./types";
export * from "./useLudoLocal";
export * from "./useLudoOnline";

/**
 * Unified Ludo game hook that switches between Local (pass-and-play)
 * and Online (multiplayer) game modes while maintaining a consistent interface.
 */
export const useLudoGame = ({
  roomId,
  mode = "multiplayer",
  localPlayerCount = 4,
  playerCount,
}: UseLudoGameProps): UseLudoGameReturn => {
  const isLocal = mode === "local" || roomId === "local";
  const count = playerCount ?? localPlayerCount;

  const localGame = useLudoLocal({
    roomId,
    playerCount: count,
    enabled: isLocal,
  });

  const onlineGame = useLudoOnline({
    roomId,
    enabled: !isLocal,
  });

  return isLocal ? localGame : onlineGame;
};

export default useLudoGame;
