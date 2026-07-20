import { v } from "convex/values";
import { customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { authenticateRoomSession } from "./model/auth";

// Every prospect-facing function authenticates through these wrappers: the
// session token resolves to its room, and handlers receive ctx.room.
export const roomQuery = customQuery(query, {
  args: { sessionToken: v.string() },
  input: async (ctx, { sessionToken }) => ({
    ctx: { room: await authenticateRoomSession(ctx, sessionToken) },
    args: {},
  }),
});

export const roomMutation = customMutation(mutation, {
  args: { sessionToken: v.string() },
  input: async (ctx, { sessionToken }) => ({
    ctx: { room: await authenticateRoomSession(ctx, sessionToken) },
    args: {},
  }),
});
