import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const orphanLifetimeMs = 24 * 60 * 60 * 1000;
const cleanupPageSize = 100;

export const deleteExpiredSessions = internalMutation({
  args: {
    cutoff: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.cutoff ?? Date.now();
    const expiredSessions = await ctx.db
      .query("successRoomSessions")
      .withIndex("by_expires_at", (query) => query.lt("expiresAt", cutoff))
      .take(cleanupPageSize);

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    if (expiredSessions.length === cleanupPageSize) {
      await ctx.scheduler.runAfter(0, internal.cleanup.deleteExpiredSessions, { cutoff });
    }
  },
});

// Uploads that were never claimed have no successRoomFiles row; sweep their
// blobs once they are older than a day so in-flight uploads are never touched.
export const deleteOrphanedStorage = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    cutoff: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.cutoff ?? Date.now() - orphanLifetimeMs;
    const storagePage = await ctx.db.system
      .query("_storage")
      .order("asc")
      .paginate({
        cursor: args.cursor ?? null,
        numItems: cleanupPageSize,
      });
    const orphanCandidates = storagePage.page.filter(
      (storedFile) => storedFile._creationTime < cutoff,
    );

    for (const storedFile of orphanCandidates) {
      const claimedFile = await ctx.db
        .query("successRoomFiles")
        .withIndex("by_storage_id", (query) => query.eq("storageId", storedFile._id))
        .first();

      if (!claimedFile) {
        await ctx.storage.delete(storedFile._id);
      }
    }

    const reachedCutoff = orphanCandidates.length < storagePage.page.length;
    const complete = storagePage.isDone || reachedCutoff;

    if (!complete) {
      await ctx.scheduler.runAfter(0, internal.cleanup.deleteOrphanedStorage, {
        cursor: storagePage.continueCursor,
        cutoff,
      });
    }
  },
});
