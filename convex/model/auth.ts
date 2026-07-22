import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import {
  successRoomAccessDeniedCode,
  successRoomSessionLifetimeMs,
} from "../../shared/successRoomAccess";

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const generateSessionToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Only the token's hash is stored; the raw token goes to the client once.
export const createRoomSession = async (ctx: MutationCtx, roomId: Id<"successRooms">) => {
  const sessionToken = generateSessionToken();

  await ctx.db.insert("successRoomSessions", {
    roomId,
    tokenHash: await sha256Hex(sessionToken),
    expiresAt: Date.now() + successRoomSessionLifetimeMs,
  });

  return sessionToken;
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
