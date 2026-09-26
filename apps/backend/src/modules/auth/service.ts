import AuthRepository, { hashToken } from "./repository"
import UserService from "../users/service";
import { type NewUser } from "@repo/db";
import { catchError } from "@/utils/catch-error";
import { AppError } from "@/errors";
import { RedisClient } from "@repo/common/redis";
import { type SessionContext } from "@/utils/session-context";
import bcrypt from "bcryptjs";

const redis = new RedisClient(process.env.REDIS_URL ?? "redis://localhost:6379");
const SALT_ROUNDS = 10;
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export default class AuthService {
    private authRepository: AuthRepository
    private userService: UserService

    constructor() {
        this.authRepository = new AuthRepository();
        this.userService = new UserService();
    }

    public async register(data: NewUser, ctx: SessionContext): Promise<{ token: string; expiresAt: Date }> {
        // 1. Hash password if provided
        const hashedPassword = data.password
            ? await bcrypt.hash(data.password, SALT_ROUNDS)
            : undefined;

        // 2. Create user in DB
        const [userErr, user] = await catchError(
            this.userService.register({ ...data, password: hashedPassword })
        );

        if (userErr || !user) {
            if (userErr instanceof AppError) {
                throw userErr;
            }
            throw new AppError("Failed to register user", 500, { detail: (userErr as any)?.message });
        }

        // 3. Create session in DB (generates & stores JWT)
        const [sessionErr, session] = await catchError(
            this.authRepository.createSession(user, ctx)
        );

        if (sessionErr || !session) {
            if (sessionErr instanceof AppError) {
                throw sessionErr;
            }
            throw new AppError("Failed to create session", 500, { detail: (sessionErr as any)?.message });
        }

        // 4. Cache session in Redis by hashed token
        const cacheKey = redis.key("session", hashToken(session.token));
        await redis.set(cacheKey, { userId: user.id }, SESSION_TTL);

        return session;
    }

    public async login(email: string, password: string, ctx: SessionContext): Promise<{ token: string; expiresAt: Date }> {
        // 1. Fetch user
        const [userErr, user] = await catchError(this.userService.getByEmail(email));

        if (userErr || !user) {
            throw new AppError("Invalid email or password", 401);
        }

        // 2. Verify password
        if (!user.password) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        // 3. Create session in DB
        const [sessionErr, session] = await catchError(
            this.authRepository.createSession(user, ctx)
        );

        if (sessionErr || !session) {
            throw new AppError("Failed to create session", 500);
        }

        // 4. Cache session in Redis by hashed token
        const cacheKey = redis.key("session", hashToken(session.token));
        await redis.set(cacheKey, { userId: user.id }, SESSION_TTL);

        return session;
    }

    public async logout(token: string): Promise<void> {
        const [err] = await catchError(
            this.authRepository.revokeSessionByToken(token)
        );

        if (err) {
            throw new AppError("Failed to logout", 500);
        }

        // Clear only this session from Redis cache
        const cacheKey = redis.key("session", hashToken(token));
        await redis.delete(cacheKey);
    }

    public async logoutAll(userId: string): Promise<void> {
        // 1. Fetch active sessions before revoking to get their hashed tokens for Redis
        const [, activeSessions] = await catchError(
            this.authRepository.findActiveSessionsByUserId(userId)
        );

        // 2. Revoke all user sessions in DB
        const [err] = await catchError(
            this.authRepository.revokeAllUserSessions(userId)
        );

        if (err) {
            throw new AppError("Failed to logout all sessions", 500);
        }

        // 3. Clear all active sessions from Redis cache (s.token in DB is already the hashedToken)
        if (activeSessions && activeSessions.length > 0) {
            const keys = activeSessions.map(s => redis.key("session", s.token));
            await redis.delete(...keys);
        }
    }

    public async getAllSessions(userId: string, currentToken?: string) {
        const [err, sessions] = await catchError(
            this.authRepository.findActiveSessionsByUserId(userId)
        );

        if (err || !sessions) {
            throw new AppError("Failed to retrieve sessions", 500);
        }

        const currentTokenHash = currentToken ? hashToken(currentToken) : null;

        return sessions.map((session) => ({
            id: session.id,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            deviceType: session.deviceType,
            location: session.location,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
            isCurrent: currentTokenHash ? session.token === currentTokenHash : false,
        }));
    }
}
