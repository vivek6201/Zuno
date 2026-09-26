import db, { and, eq, gt, sessionsTable, type User } from "@repo/db";
import { catchError } from "@/utils/catch-error";
import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "@/errors";
import { type SessionContext } from "@/utils/session-context";
import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme-secret";
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export default class AuthRepository {

    private generateToken(payload: Record<string, unknown>): { token: string; expiresAt: Date } {
        const options: SignOptions = {
            expiresIn: JWT_EXPIRY_SECONDS,
            algorithm: "HS256",
        };

        const token = jwt.sign(payload, JWT_SECRET, options);
        const expiresAt = new Date(Date.now() + JWT_EXPIRY_SECONDS * 1000);

        return { token, expiresAt };
    }

    public async createSession(user: User, ctx: SessionContext): Promise<{ token: string; expiresAt: Date } | null> {
        const { token, expiresAt } = this.generateToken({ sub: user.id, email: user.email });
        const hashedToken = hashToken(token);

        const [err, rows] = await catchError(
            db.insert(sessionsTable).values({
                userId: user.id,
                token: hashedToken,
                expiresAt,
                ipAddress: ctx.ipAddress,
                userAgent: ctx.userAgent,
                deviceType: ctx.deviceType,
                location: ctx.location,
                fingerprint: ctx.fingerprint,
            }).returning()
        );

        if (err || !rows?.length) {
            console.error("Failed to create session:", err);
            return null;
        }

        // Return the unhashed token to the user/client
        return { token, expiresAt };
    }

    public async findSessionByToken(token: string) {
        const hashedToken = hashToken(token);
        const rows = await db.select().from(sessionsTable).where(eq(sessionsTable.token, hashedToken));
        return rows[0] ?? null;
    }

    public async revokeSessionByToken(token: string) {
        const hashedToken = hashToken(token);
        return db.update(sessionsTable)
            .set({ isRevoked: true })
            .where(eq(sessionsTable.token, hashedToken))
            .returning();
    }

    public async findActiveSessionsByUserId(userId: string) {
        return db.select()
            .from(sessionsTable)
            .where(
                and(
                    eq(sessionsTable.userId, userId),
                    eq(sessionsTable.isRevoked, false),
                    gt(sessionsTable.expiresAt, new Date())
                )
            );
    }

    public async revokeAllUserSessions(userId: string) {
        return db.update(sessionsTable)
            .set({ isRevoked: true })
            .where(eq(sessionsTable.userId, userId))
            .returning();
    }

    public async revokeSession(user: User, userId: string) {
        const [err, session] = await catchError(this.revokeAllUserSessions(userId));

        if (err) {
            throw new AppError("Failed to revoke session");
        }
        
        return session;
    }
}
