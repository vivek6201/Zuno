/**
 * Deterministic Pseudo-Random Number Generator (PRNG) using the Mulberry32 algorithm.
 * 
 * Why this is needed:
 * Standard `Math.random()` is non-deterministic and can't be seeded.
 * With PRNG:
 * 1. Online: Server and clients can agree on random events or server can replay moves.
 * 2. Offline: Enables saving games and resuming with exact predictable state, test reproducibility.
 * 3. Anti-cheat: Move history can be re-simulated from seed + actions to verify integrity.
 */
export class PRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed?: number) {
    this.initialSeed = seed !== undefined ? seed : Math.floor(Math.random() * 2147483647);
    this.state = this.initialSeed;
  }

  /**
   * Generates a pseudo-random floating-point number between 0 (inclusive) and 1 (exclusive).
   */
  public next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a random integer between min and max (inclusive).
   */
  public nextInt(min: number, max: number): number {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(this.next() * (high - low + 1)) + low;
  }

  /**
   * Simulates rolling a dice (default 6 sides, returning 1 to 6).
   */
  public rollDice(sides = 6): number {
    return this.nextInt(1, sides);
  }

  /**
   * In-place Fisher-Yates array shuffle using the seeded PRNG.
   */
  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const temp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = temp;
    }
    return copy;
  }

  /**
   * Pick a random element from an array.
   */
  public pickOne<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error("Cannot pick from an empty array");
    }
    const index = this.nextInt(0, array.length - 1);
    return array[index]!;
  }

  /**
   * Export the current state of the PRNG for serialization.
   */
  public exportState(): { seed: number; state: number } {
    return {
      seed: this.initialSeed,
      state: this.state,
    };
  }

  /**
   * Restore the PRNG to a previous state.
   */
  public importState(snapshot: { seed: number; state: number }): void {
    this.state = snapshot.state;
  }
}
