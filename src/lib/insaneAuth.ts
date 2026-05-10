import crypto from "crypto";

export const INSANE_COOKIE_NAME = "insane_admin";
const COOKIE_VALUE = "admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function getSecret(): string {
    const secret = process.env.INSANE_COOKIE_SECRET;
    if (!secret) throw new Error("INSANE_COOKIE_SECRET is not set");
    return secret;
}

function sign(value: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function buildAdminCookie(): string {
    const secret = getSecret();
    const sig = sign(COOKIE_VALUE, secret);
    const value = `${COOKIE_VALUE}.${sig}`;
    return `${INSANE_COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}; Secure`;
}

export function clearAdminCookie(): string {
    return `${INSANE_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

export function isAdminCookieValid(cookieHeader: string | null): boolean {
    if (!cookieHeader) return false;
    const match = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${INSANE_COOKIE_NAME}=`));
    if (!match) return false;
    const raw = match.slice(INSANE_COOKIE_NAME.length + 1);
    const dot = raw.lastIndexOf(".");
    if (dot < 0) return false;
    const value = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    if (value !== COOKIE_VALUE) return false;
    let secret: string;
    try {
        secret = getSecret();
    } catch {
        return false;
    }
    const expected = sign(value, secret);
    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
