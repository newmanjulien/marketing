import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import { successRoomAccessDeniedCode } from "../../shared/successRoomAccess";

// After this many consecutive failures, logins are refused until the window
// since the last failure has passed.
export const maxFailedLogins = 10;
export const loginLockoutWindowMs = 15 * 60 * 1000;

export const isLoginLocked = (
  throttle: { failedCount: number; lastFailedAt: number } | undefined,
  now: number,
) =>
  throttle !== undefined &&
  throttle.failedCount >= maxFailedLogins &&
  now - throttle.lastFailedAt < loginLockoutWindowMs;

export const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const generateSessionToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const authenticateRoomSession = async (ctx: QueryCtx, sessionToken: string) => {
  const tokenHash = await sha256Hex(sessionToken);
  const session = await ctx.db
    .query("successRoomSessions")
    .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.expiresAt <= Date.now()) {
    throw new ConvexError(successRoomAccessDeniedCode);
  }

  const room = await ctx.db.get(session.roomId);

  if (!room) {
    throw new ConvexError(successRoomAccessDeniedCode);
  }

  return room;
};
