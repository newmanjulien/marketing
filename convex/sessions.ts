import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { generateSessionToken, sha256Hex } from "./model/auth";
import { successRoomSessionLifetimeMs } from "../shared/successRoomAccess";
import { parseSuccessRoomSlug } from "../shared/successRoomSlugs";

// Internal support for the login action in convex/auth.ts.

// After this many consecutive failures within the window, wrong-password
// attempts report "locked" instead of "invalid-password". Message-only: the
// correct password always works (see the comment in convex/auth.ts).
const maxFailedLogins = 10;
const loginLockoutWindowMs = 15 * 60 * 1000;

export const getRoomLogin = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = parseSuccessRoomSlug(args.slug);

    if (!slug) {
      return null;
    }

    const room = await ctx.db
      .query("successRooms")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!room) {
      return null;
    }

    return {
      roomId: room._id,
      passwordHash: room.passwordHash,
    };
  },
});

export const recordFailedLogin = internalMutation({
  args: { roomId: v.id("successRooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);

    if (!room) {
      return { locked: false };
    }

    const now = Date.now();
    // Failures outside the lockout window start a fresh count.
    const activeThrottle =
      room.loginThrottle && now - room.loginThrottle.lastFailedAt < loginLockoutWindowMs
        ? room.loginThrottle
        : undefined;
    const loginThrottle = {
      failedCount: (activeThrottle?.failedCount ?? 0) + 1,
      lastFailedAt: now,
    };

    await ctx.db.patch(args.roomId, { loginThrottle });

    return { locked: loginThrottle.failedCount >= maxFailedLogins };
  },
});

export const createSession = internalMutation({
  args: { roomId: v.id("successRooms") },
  handler: async (ctx, args) => {
    const sessionToken = generateSessionToken();

    await ctx.db.insert("successRoomSessions", {
      roomId: args.roomId,
      tokenHash: await sha256Hex(sessionToken),
      expiresAt: Date.now() + successRoomSessionLifetimeMs,
    });
    await ctx.db.patch(args.roomId, { loginThrottle: undefined });

    return sessionToken;
  },
});
