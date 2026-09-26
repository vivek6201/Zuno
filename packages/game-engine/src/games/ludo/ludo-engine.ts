import { GameManager } from "../../core/game-manager";
import { ActionResult, GameStatus, TurnDirection } from "../../core/types";
import {
  calculateNewStepCount,
  findCapturedTokens,
  getGlobalTileIndex,
  getMovableTokens,
  getTokenZone,
} from "./board-utils";
import { LUDO_COLORS, STEP_BASE, TOKENS_PER_PLAYER } from "./constants";
import {
  LudoAction,
  LudoActionType,
  LudoColor,
  LudoConfig,
  LudoGameEvent,
  LudoGameState,
  LudoPlayer,
  LudoToken,
  LudoTurnPhase,
  TokenZone,
} from "./types";

export class LudoGameManager extends GameManager<LudoGameState, LudoAction, LudoPlayer> {
  private readonly ludoConfig: Required<Pick<LudoConfig, "finishOnFirstWinner" | "autoMoveSingleToken">>;

  constructor(config: LudoConfig) {
    super(config);
    this.ludoConfig = {
      finishOnFirstWinner: config.finishOnFirstWinner ?? true,
      autoMoveSingleToken: config.autoMoveSingleToken ?? false,
    };
  }

  // ─── 1. INITIAL STATE ─────────────────────────────────────────────────────────

  protected initGameState(gameId: string): LudoGameState {
    return {
      gameId,
      status: GameStatus.LOBBY,
      players: [],
      currentTurnPlayerId: null,
      turnIndex: 0,
      turnDirection: TurnDirection.CLOCKWISE,
      winnerPlayerIds: [],
      phase: LudoTurnPhase.AWAITING_DICE_ROLL,
      currentDice: null,
      consecutiveSixes: 0,
      movableTokenIds: [],
      hasBonusTurn: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // ─── 2. GAME START HOOK ───────────────────────────────────────────────────────

  protected override onGameStart(): void {
    // 1. Assign colors & create 4 tokens for each player
    this.state.players.forEach((player, playerIdx) => {
      // If color was not already set, assign from standard rotation
      if (!player.color) {
        player.color = LUDO_COLORS[playerIdx % LUDO_COLORS.length]!;
      }

      player.tokens = this.createInitialTokens(player.color);
      player.rank = null;
    });

    // 2. Initial turn state
    this.state.phase = LudoTurnPhase.AWAITING_DICE_ROLL;
    this.state.currentDice = null;
    this.state.consecutiveSixes = 0;
    this.state.movableTokenIds = [];
    this.state.hasBonusTurn = false;
  }

  /**
   * Helper to create 4 initial tokens in BASE for a given color.
   */
  private createInitialTokens(color: LudoColor): LudoToken[] {
    const tokens: LudoToken[] = [];
    for (let i = 0; i < TOKENS_PER_PLAYER; i++) {
      tokens.push({
        id: `${color}_${i}`,
        color,
        index: i,
        stepCount: STEP_BASE,
        zone: TokenZone.BASE,
        globalPosition: null,
      });
    }
    return tokens;
  }

  // ─── 3. ACTION VALIDATION ─────────────────────────────────────────────────────

  protected validateAction(action: LudoAction): ActionResult {
    switch (action.type) {
      case LudoActionType.ROLL_DICE: {
        // Can only roll if awaiting dice roll
        if (this.state.phase !== LudoTurnPhase.AWAITING_DICE_ROLL) {
          return {
            success: false,
            error: "Cannot roll dice: you must move a token first.",
          };
        }
        return { success: true };
      }

      case LudoActionType.MOVE_TOKEN: {
        // Can only move if awaiting token move
        if (this.state.phase !== LudoTurnPhase.AWAITING_TOKEN_MOVE) {
          return {
            success: false,
            error: "Cannot move token: you must roll the dice first.",
          };
        }

        // Must select a token from the legally movable tokens list
        const { tokenId } = action.payload;
        if (!this.state.movableTokenIds.includes(tokenId)) {
          return {
            success: false,
            error: `Token ${tokenId} cannot be legally moved with dice roll ${this.state.currentDice}.`,
          };
        }

        return { success: true };
      }

      default:
        return { success: false, error: "Unknown action type." };
    }
  }

  // ─── 4. APPLY ACTION ──────────────────────────────────────────────────────────

  protected applyAction(action: LudoAction): void {
    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) return;

    if (action.type === LudoActionType.ROLL_DICE) {
      this.handleRollDice(currentPlayer);
    } else if (action.type === LudoActionType.MOVE_TOKEN) {
      this.handleMoveToken(currentPlayer, action.payload.tokenId);
    }
  }

  /**
   * Phase 1: Executes dice roll and computes legal moves.
   */
  private handleRollDice(player: LudoPlayer): void {
    const dice = this.prng.rollDice(6);
    this.state.currentDice = dice;

    this.emitEvent(LudoGameEvent.DICE_ROLLED, {
      playerId: player.id,
      color: player.color,
      dice,
    });

    // Handle 6s streak
    if (dice === 6) {
      this.state.consecutiveSixes++;

      // Three 6s rule: Penalty! Void turn immediately
      if (this.state.consecutiveSixes === 3) {
        this.emitEvent(LudoGameEvent.THREE_SIXES_PENALTY, {
          playerId: player.id,
          color: player.color,
        });

        this.resetTurnAndAdvance();
        return;
      }
    } else {
      this.state.consecutiveSixes = 0;
    }

    // Determine legally movable tokens
    const movable = getMovableTokens(player, dice);
    this.state.movableTokenIds = movable.map((t) => t.id);

    // If no moves are possible, turn ends automatically!
    if (this.state.movableTokenIds.length === 0) {
      this.emitEvent(LudoGameEvent.NO_LEGAL_MOVES, {
        playerId: player.id,
        color: player.color,
        dice,
      });

      this.resetTurnAndAdvance();
      return;
    }

    // Transition to Phase 2
    this.state.phase = LudoTurnPhase.AWAITING_TOKEN_MOVE;

    // Optional QoL: Auto-move if only 1 token is movable
    if (this.ludoConfig.autoMoveSingleToken && this.state.movableTokenIds.length === 1) {
      this.handleMoveToken(player, this.state.movableTokenIds[0]!);
    }
  }

  /**
   * Phase 2: Moves the chosen token and checks for captures / home arrivals.
   */
  private handleMoveToken(player: LudoPlayer, tokenId: string): void {
    const token = player.tokens.find((t) => t.id === tokenId);
    if (!token || this.state.currentDice === null) return;

    const dice = this.state.currentDice;
    const oldStep = token.stepCount;
    const newStep = calculateNewStepCount(token, dice);

    // 1. Update token coordinates
    token.stepCount = newStep;
    token.zone = getTokenZone(newStep);
    token.globalPosition = getGlobalTileIndex(player.color, newStep);

    this.emitEvent(LudoGameEvent.TOKEN_MOVED, {
      playerId: player.id,
      tokenId: token.id,
      color: player.color,
      fromStep: oldStep,
      toStep: newStep,
      zone: token.zone,
      globalPosition: token.globalPosition,
    });

    // 2. Bonus Turn Condition A: Did piece reach HOME?
    if (token.zone === TokenZone.HOME) {
      this.emitEvent(LudoGameEvent.TOKEN_REACHED_HOME, {
        playerId: player.id,
        tokenId: token.id,
        color: player.color,
      });
      this.state.hasBonusTurn = true;
    }

    // 3. Bonus Turn Condition B: Did piece capture opponent token(s)?
    // Supports multi-token capture if opponents stacked pieces on non-safe square
    const capturedList = findCapturedTokens(token, token.globalPosition, this.state.players);
    for (const captured of capturedList) {
      captured.stepCount = STEP_BASE;
      captured.zone = TokenZone.BASE;
      captured.globalPosition = null;

      this.emitEvent(LudoGameEvent.PIECE_CAPTURED, {
        capturedByPlayerId: player.id,
        capturedTokenId: captured.id,
        capturedColor: captured.color,
        atPosition: token.globalPosition,
      });

      this.state.hasBonusTurn = true;
    }

    // 4. Bonus Turn Condition C: Did player roll a 6?
    if (dice === 6) {
      this.state.hasBonusTurn = true;
    }

    // 5. Check if active player finished all their tokens (in multi-rank mode)
    const isAllHome = player.tokens.every((t) => t.zone === TokenZone.HOME);
    if (isAllHome && !this.ludoConfig.finishOnFirstWinner) {
      // In multi-rank mode, when a player finishes all tokens, their turn is done
      this.resetTurnAndAdvance();
      return;
    }

    // 6. Turn Transition Resolution
    if (this.state.hasBonusTurn) {
      this.emitEvent(LudoGameEvent.BONUS_TURN_AWARDED, {
        playerId: player.id,
        color: player.color,
      });

      // Keep turn with same player, reset for next roll
      this.state.hasBonusTurn = false;
      this.state.currentDice = null;
      this.state.movableTokenIds = [];
      this.state.phase = LudoTurnPhase.AWAITING_DICE_ROLL;
    } else {
      this.resetTurnAndAdvance();
    }
  }

  /**
   * Resets turn parameters and advances turn to the next player.
   */
  private resetTurnAndAdvance(): void {
    this.state.consecutiveSixes = 0;
    this.state.currentDice = null;
    this.state.movableTokenIds = [];
    this.state.hasBonusTurn = false;
    this.state.phase = LudoTurnPhase.AWAITING_DICE_ROLL;
    this.nextTurn();
  }

  // ─── 5. WIN CONDITION ─────────────────────────────────────────────────────────

  protected checkWinCondition(): string[] | null {
    // 1. Check for any players who just finished all 4 tokens
    for (const player of this.state.players) {
      const allHome = player.tokens.every((t) => t.zone === TokenZone.HOME);
      if (allHome && player.rank === null) {
        this.state.winnerPlayerIds.push(player.id);
        player.rank = this.state.winnerPlayerIds.length;

        // If winner-takes-all, end game immediately on 1st place
        if (this.ludoConfig.finishOnFirstWinner) {
          return this.state.winnerPlayerIds;
        }

        // In multi-rank mode: check if game has concluded for remaining players
        const remaining = this.state.players.filter((p) => p.rank === null);
        if (remaining.length <= 1) {
          // The last remaining player gets the final rank
          if (remaining.length === 1) {
            const lastPlayer = remaining[0]!;
            this.state.winnerPlayerIds.push(lastPlayer.id);
            lastPlayer.rank = this.state.winnerPlayerIds.length;
          }
          return this.state.winnerPlayerIds;
        }

        // Update active players in TurnManager to exclude the finished player
        this.turnManager.setPlayers(remaining.map((p) => p.id));
      }
    }

    if (this.ludoConfig.finishOnFirstWinner && this.state.winnerPlayerIds.length > 0) {
      return this.state.winnerPlayerIds;
    }

    const remaining = this.state.players.filter((p) => p.rank === null);
    if (!this.ludoConfig.finishOnFirstWinner && remaining.length <= 1) {
      return this.state.winnerPlayerIds;
    }

    return null;
  }

  // ─── 6. HELPER GETTERS ────────────────────────────────────────────────────────

  /**
   * Returns the player whose turn it currently is.
   */
  public getCurrentPlayer(): LudoPlayer | null {
    if (!this.state.currentTurnPlayerId) return null;
    return this.state.players.find((p) => p.id === this.state.currentTurnPlayerId) ?? null;
  }
}

export default LudoGameManager;
