import {
  AudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import { Asset } from "expo-asset";
import * as Haptics from "expo-haptics";

const SOUND_ASSETS = {
  "dice-roll": require("@assets/sounds/dice-roll.wav"),
  "piece-step": require("@assets/sounds/piece-step.wav"),
  "piece-capture": require("@assets/sounds/piece-capture.wav"),
  "safe-square": require("@assets/sounds/safe-square.wav"),
  "home-entry": require("@assets/sounds/home-entry.wav"),
  "victory": require("@assets/sounds/victory.wav"),
} as const;

export type SoundKey = keyof typeof SOUND_ASSETS;

class LudoSoundManager {
  private isSoundEnabled = true;
  private players: Map<SoundKey, AudioPlayer> = new Map();
  private isAudioModeConfigured = false;
  private lastPlayTime: Map<SoundKey, number> = new Map();

  constructor() {
    this.initAudioMode();
    this.preloadSounds();
  }

  private async initAudioMode() {
    if (this.isAudioModeConfigured) return;
    try {
      // Configure audio session to play in silent mode on iOS and mix with other audio
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: "mixWithOthers",
        allowsRecording: false,
        shouldPlayInBackground: false,
      });
      this.isAudioModeConfigured = true;
    } catch {
      // Audio mode fallback
    }
  }

  private async preloadSounds() {
    try {
      // Ensure all local sound assets are unpacked and available on device storage
      await Promise.allSettled(
        Object.values(SOUND_ASSETS).map((src) => Asset.loadAsync(src)),
      );

      for (const [key, source] of Object.entries(SOUND_ASSETS)) {
        try {
          const player = createAudioPlayer(source, {
            keepAudioSessionActive: true,
          });
          this.players.set(key as SoundKey, player);
        } catch {
          // Fallback to on-demand instantiation
        }
      }
    } catch {
      // Fallback
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  private async playSound(key: SoundKey, volume = 1.0) {
    if (!this.isSoundEnabled) return;

    // Throttle identical rapid triggers within 80ms to prevent double-audio
    const now = Date.now();
    const prev = this.lastPlayTime.get(key) || 0;
    if (now - prev < 80) return;
    this.lastPlayTime.set(key, now);

    try {
      if (!this.isAudioModeConfigured) {
        await this.initAudioMode();
      }

      let player = this.players.get(key);
      if (!player) {
        const source = SOUND_ASSETS[key];
        if (!source) return;
        player = createAudioPlayer(source, {
          keepAudioSessionActive: true,
        });
        this.players.set(key, player);
      }

      player.volume = volume;

      // Rewind to beginning if player was already playing or played
      if (player.currentTime > 0) {
        try {
          await player.seekTo(0);
        } catch {
          // If seek fails, proceed to play
        }
      }

      player.play();
    } catch {
      // Graceful error fallback
    }
  }

  /**
   * Sound and haptic feedback when dice is rolling.
   */
  public async playDiceRoll() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignored
    }
    await this.playSound("dice-roll", 1.0);
  }

  /**
   * Sound and haptic feedback for each hop of a piece.
   */
  public async playPieceStep() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignored
    }
    await this.playSound("piece-step", 0.9);
  }

  /**
   * Impact sound and heavy haptic feedback when capturing an opponent piece.
   */
  public async playPieceCapture() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Ignored
    }
    await this.playSound("piece-capture", 1.0);
  }

  /**
   * Chime when landing on a safe star tile.
   */
  public async playSafeSquare() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignored
    }
    await this.playSound("safe-square", 0.9);
  }

  /**
   * Fanfare chime when a token enters center HOME.
   */
  public async playHomeEntry() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignored
    }
    await this.playSound("home-entry", 1.0);
  }

  /**
   * Bonus turn alert.
   */
  public async playBonusTurn() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignored
    }
    await this.playSound("safe-square", 0.9);
  }

  /**
   * Match victory celebration.
   */
  public async playVictory() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignored
    }
    await this.playSound("victory", 1.0);
  }

  public async unloadAll() {
    for (const player of this.players.values()) {
      try {
        player.remove();
      } catch {
        // Ignored
      }
    }
    this.players.clear();
  }
}

export const ludoSound = new LudoSoundManager();
export default ludoSound;
