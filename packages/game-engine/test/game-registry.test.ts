import { describe, expect, it } from "bun:test";
import {
  createGameEngine,
  GAME_METADATA_MAP,
  GameStatus,
  GameType,
  Ludo,
} from "../src";

describe("Multi-Game Factory and Metadata", () => {
  it("provides valid metadata for all supported GameTypes", () => {
    for (const type of Object.values(GameType)) {
      const meta = GAME_METADATA_MAP[type];
      expect(meta).toBeDefined();
      expect(meta.type).toBe(type);
      expect(meta.minPlayers).toBeGreaterThanOrEqual(2);
      expect(meta.maxPlayers).toBeGreaterThanOrEqual(meta.minPlayers);
    }
  });

  it("instantiates LudoGameManager with custom config", () => {
    const engine = createGameEngine(GameType.LUDO, "ludo-room-1", {
      finishOnFirstWinner: true,
      autoMoveSingleToken: false,
    });

    expect(engine).toBeInstanceOf(Ludo.LudoGameManager);
    expect(engine.getState().status).toBe(GameStatus.LOBBY);

    engine.addPlayer({
      id: "p1",
      name: "Alice",
      color: Ludo.LudoColor.RED,
      tokens: [],
      rank: null,
      isReady: true,
      isBot: false,
      isDisconnected: false,
    });

    engine.addPlayer({
      id: "p2",
      name: "Bob",
      color: Ludo.LudoColor.GREEN,
      tokens: [],
      rank: null,
      isReady: true,
      isBot: false,
      isDisconnected: false,
    });

    const startResult = engine.start(2);
    expect(startResult.success).toBe(true);
    expect(engine.getState().status).toBe(GameStatus.IN_PROGRESS);
  });

  it("instantiates Chess, Uno, and Matiks engines dynamically", () => {
    const chess = createGameEngine(GameType.CHESS, "chess-room-1", {
      timeControlSeconds: 300,
    });
    expect(chess.getState().status).toBe(GameStatus.LOBBY);

    const uno = createGameEngine(GameType.UNO, "uno-room-1", {
      drawToMatch: true,
    });
    expect(uno.getState().status).toBe(GameStatus.LOBBY);

    const matiks = createGameEngine(GameType.MATIKS, "matiks-room-1", {
      targetScore: 50,
    });
    expect(matiks.getState().status).toBe(GameStatus.LOBBY);
  });
});
