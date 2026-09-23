import { GameEvent } from "./types";

export type EventCallback<T = any> = (event: GameEvent<string, T>) => void;

/**
 * Lightweight, zero-dependency event bus.
 * Fully compatible with React Native and browser runtimes without polyfills.
 */
export class EventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to a specific event type, or '*' for all events.
   * Returns an unsubscribe function.
   */
  public on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => this.off(eventType, callback);
  }

  /**
   * Subscribe to an event once.
   */
  public once(eventType: string, callback: EventCallback): () => void {
    const wrapper: EventCallback = (event) => {
      this.off(eventType, wrapper);
      callback(event);
    };
    return this.on(eventType, wrapper);
  }

  /**
   * Remove a listener.
   */
  public off(eventType: string, callback: EventCallback): void {
    const set = this.listeners.get(eventType);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all subscribed listeners.
   */
  public emit<T = any>(eventType: string, payload: T): GameEvent<string, T> {
    const event: GameEvent<string, T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    // Notify specific event listeners
    const specificListeners = this.listeners.get(eventType);
    if (specificListeners) {
      for (const listener of specificListeners) {
        listener(event);
      }
    }

    // Notify wildcard '*' listeners
    const wildcardListeners = this.listeners.get("*");
    if (wildcardListeners) {
      for (const listener of wildcardListeners) {
        listener(event);
      }
    }

    return event;
  }

  /**
   * Remove all listeners.
   */
  public removeAllListeners(): void {
    this.listeners.clear();
  }
}
