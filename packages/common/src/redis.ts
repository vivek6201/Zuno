import Redis from "ioredis";

export class RedisClient {
    private client: Redis;

    constructor(url: string) {
        this.client = new Redis(url, {
            lazyConnect: true,
            maxRetriesPerRequest: 3,
        });
    }

    // ─── Key Generation ────────────────────────────────────────────────────────

    /**
     * Build a namespaced cache key.
     * @example key("session", "user", "abc123") → "session:user:abc123"
     */
    public key(...parts: string[]): string {
        return parts.join(":");
    }

    // ─── Core Operations ────────────────────────────────────────────────────────

    /**
     * Store a value. Pass `ttlSeconds` to set an expiry.
     */
    public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const serialized = JSON.stringify(value);
        if (ttlSeconds !== undefined) {
            await this.client.set(key, serialized, "EX", ttlSeconds);
        } else {
            await this.client.set(key, serialized);
        }
    }

    /**
     * Retrieve a value, automatically deserializing JSON.
     * Returns `null` if the key doesn't exist.
     */
    public async get<T>(key: string): Promise<T | null> {
        const raw = await this.client.get(key);
        if (raw === null) return null;
        return JSON.parse(raw) as T;
    }

    /**
     * Delete one or more keys.
     * Returns the number of keys removed.
     */
    public async delete(...keys: string[]): Promise<number> {
        return this.client.del(...keys);
    }

    /**
     * Check whether a key exists.
     */
    public async exists(key: string): Promise<boolean> {
        const count = await this.client.exists(key);
        return count > 0;
    }

    /**
     * Set a new TTL (in seconds) on an existing key.
     * Returns false if the key doesn't exist.
     */
    public async expire(key: string, ttlSeconds: number): Promise<boolean> {
        const result = await this.client.expire(key, ttlSeconds);
        return result === 1;
    }

    /**
     * Returns the remaining TTL of a key in seconds.
     * -1 = no expiry, -2 = key doesn't exist.
     */
    public async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }

    // ─── Lifecycle ──────────────────────────────────────────────────────────────

    public async ping(): Promise<string> {
        return this.client.ping();
    }

    public async disconnect(): Promise<void> {
        await this.client.quit();
    }
}