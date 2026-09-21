import { type Request } from "express";
import { createHash } from "crypto";

export interface SessionContext {
    ipAddress: string | null;
    userAgent: string | null;
    deviceType: "mobile" | "tablet" | "desktop" | null;
    location: string | null;
    fingerprint: string | null;
}

/**
 * Extracts session metadata from an Express request.
 * - ipAddress:   X-Forwarded-For (proxy) or req.ip
 * - userAgent:   User-Agent header
 * - deviceType:  coarse device category parsed from User-Agent
 * - location:    X-Vercel-IP-City / CF-IPCountry / similar CDN headers (optional)
 * - fingerprint: SHA-256 of (ip + userAgent + accept-language) for passive device tracking
 */
export function extractSessionContext(req: Request): SessionContext {
    // ── IP ───────────────────────────────────────────────────────────────────
    const forwarded = req.headers["x-forwarded-for"];
    const ipAddress = (
        (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim()
        ?? req.ip
        ?? null
    );

    // ── User-Agent ───────────────────────────────────────────────────────────
    const userAgent = req.headers["user-agent"] ?? null;

    // ── Device type (no extra package needed) ────────────────────────────────
    let deviceType: SessionContext["deviceType"] = null;
    if (userAgent) {
        const ua = userAgent.toLowerCase();
        if (/mobile|android.*mobile|iphone|ipod|blackberry|windows phone/.test(ua)) {
            deviceType = "mobile";
        } else if (/tablet|ipad|android(?!.*mobile)/.test(ua)) {
            deviceType = "tablet";
        } else {
            deviceType = "desktop";
        }
    }

    // ── Location ─────────────────────────────────────────────────────────────
    // Populated by CDN/proxy headers; null in local dev.
    const location = (
        (req.headers["x-vercel-ip-city"] as string | undefined)        // Vercel
        ?? (req.headers["cf-ipcountry"] as string | undefined)          // Cloudflare
        ?? (req.headers["x-country-code"] as string | undefined)        // Generic
        ?? null
    );

    // ── Fingerprint ──────────────────────────────────────────────────────────
    const fingerprint = (() => {
        const parts = [
            ipAddress ?? "",
            userAgent ?? "",
            req.headers["accept-language"] ?? "",
            req.headers["accept-encoding"] ?? "",
        ].join("|");
        return createHash("sha256").update(parts).digest("hex");
    })();

    return { ipAddress, userAgent, deviceType, location, fingerprint };
}
