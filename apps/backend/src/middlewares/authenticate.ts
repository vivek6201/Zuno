import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RedisClient } from "@repo/common/redis";
import UserService from "@/modules/users/service";
import { UnauthorizedError } from "@/errors";

import AuthRepository, { hashToken } from "@/modules/auth/repository";

const redis = new RedisClient(process.env.REDIS_URL ?? "redis://localhost:6379");
const JWT_SECRET = process.env.JWT_SECRET ?? "changeme-secret";
const userService = new UserService();
const authRepository = new AuthRepository();

interface JwtPayload {
    sub: string;
    email: string;
    iat: number;
    exp: number;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
        // 1. Extract Bearer token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedError("Missing or malformed authorization header");
        }

        const token = authHeader.slice(7); // strip "Bearer "

        // 2. Verify JWT signature & expiry
        let payload: JwtPayload;
        try {
            payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch {
            throw new UnauthorizedError("Invalid or expired token");
        }

        // 3. Check session in Redis using hashed token — fast path, avoids hitting the DB
        const hashedToken = hashToken(token);
        const cacheKey = redis.key("session", hashedToken);
        const cached = await redis.get<{ userId: string }>(cacheKey);

        let userId = cached?.userId;

        if (!cached) {
            // Fallback to DB (queries by hashed token) in case Redis restarted or key expired
            const session = await authRepository.findSessionByToken(token);
            if (!session || session.isRevoked || new Date(session.expiresAt) < new Date()) {
                throw new UnauthorizedError("Session not found or expired");
            }
            userId = session.userId;
            // Re-populate Redis cache
            await redis.set(cacheKey, { userId }, 7 * 24 * 60 * 60);
        }

        if (!userId) {
            throw new UnauthorizedError("Session not found or expired");
        }

        // 4. Load user and attach to request
        const user = await userService.getById(userId);
        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        next(err);
    }
}
