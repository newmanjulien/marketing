"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { hashPassword, verifyPassword } from "./model/passwords";

export type LoginResult =
  | { sessionToken: string }
  | { failure: "invalid-password" | "locked" };

export const login = action({
  args: {
    slug: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<LoginResult> => {
    const roomLogin = await ctx.runQuery(internal.sessions.getRoomLogin, { slug: args.slug });

    if (!roomLogin) {
      return { failure: "invalid-password" };
    }

    // The throttle only shapes the failure message: the correct password must
    // always work, otherwise anyone who knows the room URL could lock the
    // legitimate prospect out by hammering wrong passwords.
    if (!(await verifyPassword(args.password, roomLogin.passwordHash))) {
      const { locked } = await ctx.runMutation(internal.sessions.recordFailedLogin, {
        roomId: roomLogin.roomId,
      });

      return { failure: locked ? "locked" : "invalid-password" };
    }

    const sessionToken = await ctx.runMutation(internal.sessions.createSession, {
      roomId: roomLogin.roomId,
    });

    return { sessionToken };
  },
});

// Used by the seed scripts (npx convex run auth:hashPassword) so scrypt has a
// single implementation.
export const hashRoomPassword = internalAction({
  args: { password: v.string() },
  handler: (_ctx, args) => hashPassword(args.password),
});
