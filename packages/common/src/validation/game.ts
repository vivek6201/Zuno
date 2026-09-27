import { z } from "zod";

export const GameTypeEnum = {
  LUDO: "LUDO",
  CHESS: "CHESS",
  UNO: "UNO",
  MATIKS: "MATIKS",
} as const;
export const gameTypeSchema = z.enum(GameTypeEnum);
export type GameType = z.infer<typeof gameTypeSchema>;

// ─── GAME CONFIG SCHEMAS ───────────────────────────────────────────────────────

/**
 * Ludo Game Configuration
 */
export const ludoConfigSchema = z.object({
  finishOnFirstWinner: z.boolean().default(false),
  autoMoveSingleToken: z.boolean().default(true),
  seed: z.number().int().optional(),
});

/**
 * Chess Game Configuration
 */
export const chessConfigSchema = z.object({
  timeControlSeconds: z.number().int().positive("timeControlSeconds must be positive").default(600),
  incrementSeconds: z.number().int().min(0, "incrementSeconds cannot be negative").default(0),
  seed: z.number().int().optional(),
});

/**
 * Uno Game Configuration
 */
export const unoConfigSchema = z.object({
  drawToMatch: z.boolean().default(false),
  forcePlay: z.boolean().default(true),
  seed: z.number().int().optional(),
});

/**
 * Matiks Game Configuration
 */
export const matiksConfigSchema = z.object({
  targetScore: z.number().int().positive("targetScore must be positive").default(100),
  timeLimitSeconds: z.number().int().positive("timeLimitSeconds must be positive").default(60),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("EASY"),
  seed: z.number().int().optional(),
});

// ─── CREATE ROOM SCHEMAS ───────────────────────────────────────────────────────

export const createLudoRoomSchema = z.object({
  gameType: z.literal(GameTypeEnum.LUDO),
  maxPlayers: z
    .number()
    .int()
    .min(2, "Ludo requires at least 2 players")
    .max(4, "Ludo allows at most 4 players")
    .default(4),
  gameConfig: ludoConfigSchema,
});

export const createChessRoomSchema = z.object({
  gameType: z.literal(GameTypeEnum.CHESS),
  maxPlayers: z.literal(2, {
    error: "Chess must have exactly 2 players",
  }).default(2),
  gameConfig: chessConfigSchema,
});

export const createUnoRoomSchema = z.object({
  gameType: z.literal(GameTypeEnum.UNO),
  maxPlayers: z
    .number()
    .int()
    .min(2, "Uno requires at least 2 players")
    .max(10, "Uno allows at most 10 players")
    .default(4),
  gameConfig: unoConfigSchema,
});

export const createMatiksRoomSchema = z.object({
  gameType: z.literal(GameTypeEnum.MATIKS),
  maxPlayers: z
    .number()
    .int()
    .min(2, "Matiks requires at least 2 players")
    .max(4, "Matiks allows at most 4 players")
    .default(4),
  gameConfig: matiksConfigSchema,
});

const baseCreateRoomSchema = z.discriminatedUnion("gameType", [
  createLudoRoomSchema,
  createChessRoomSchema,
  createUnoRoomSchema,
  createMatiksRoomSchema,
]);

/**
 * Unified Room Creation Schema.
 * Preprocesses input so missing gameType defaults to LUDO.
 * Validates maxPlayers and gameConfig tailored to the selected game.
 */
export const createRoomSchema = z.preprocess((val: any) => {
  if (typeof val === "object" && val !== null) {
    return {
      gameConfig: {},
      ...val,
      gameType: val.gameType ?? GameTypeEnum.LUDO,
    };
  }
  return val;
}, baseCreateRoomSchema);

// ─── QUERY & PARAMS SCHEMAS ────────────────────────────────────────────────────

/**
 * Query schema for listing rooms with optional gameType filter
 */
export const listRoomsQuerySchema = z.object({
  gameType: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    gameTypeSchema.optional()
  ),
});

/**
 * Path parameter schema for roomId routes
 */
export const getRoomParamsSchema = z.object({
  roomId: z.string().min(1, "roomId parameter is required"),
});

// ─── INFERRED TYPES ────────────────────────────────────────────────────────────

export type LudoConfigInput = z.infer<typeof ludoConfigSchema>;
export type ChessConfigInput = z.infer<typeof chessConfigSchema>;
export type UnoConfigInput = z.infer<typeof unoConfigSchema>;
export type MatiksConfigInput = z.infer<typeof matiksConfigSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type ListRoomsQueryInput = z.infer<typeof listRoomsQuerySchema>;
export type GetRoomParamsInput = z.infer<typeof getRoomParamsSchema>;
