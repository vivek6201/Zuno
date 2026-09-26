import { RoomParticipant } from "@/modules/game/room";
import GameManager, { BaseAction, BaseGameState, BasePlayer, GameType } from "@repo/game-engine";

/**
 * Interface that every game module handler must implement.
 * Encapsulates game-specific player allocation, payload creation,
 * engine instantiation, and action formatting.
 */
export default interface IGameHandler<
  TPlayer extends BasePlayer = any,
  TState extends BaseGameState<any> = any,
  TAction extends BaseAction = any
> {
  readonly gameType: GameType;

  /**
   * Assigns player color, side or slot-specific identity when joining a room.
   */
  assignPlayerColor(slotIndex: number, currentParticipants: RoomParticipant[]): string | undefined;

  /**
   * Converts a generic RoomParticipant into the specific game engine's Player representation.
   */
  createEnginePlayer(participant: RoomParticipant): TPlayer;

  /**
   * Instantiates the authoritative game engine for this game type with config.
   */
  createEngine(roomId: string, gameConfig: Record<string, any>): GameManager<TState, TAction, TPlayer>;

  /**
   * Optional hook to intercept, validate or augment actions before engine dispatch.
   */
  beforeDispatch?(action: BaseAction, participant: RoomParticipant): TAction;
}