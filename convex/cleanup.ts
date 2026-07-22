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
      .withIndex("by_expires_at", (q) => q.lt("expiresAt", cutoff))
      .take(cleanupPageSize);

    await Promise.all(expiredSessions.map((session) => ctx.db.delete(session._id)));

    if (expiredSessions.length === cleanupPageSize) {
      await ctx.scheduler.runAfter(0, internal.cleanup.deleteExpiredSessions, { cutoff });
    }
  },
});

// Uploads that were never claimed have no successRoomFiles row; sweep their
// blobs once they are older than a day so in-flight uploads are never touched.
export const deleteOrphanedStorage = internalMutation({
  args: {
    cursor: v.optional(v.string()),
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
        .withIndex("by_storage_id", (q) => q.eq("storageId", storedFile._id))
        .first();

      if (!claimedFile) {
        await ctx.storage.delete(storedFile._id);
      }
    }

    // Pages are ordered by creation time, so once a page contains a file newer
    // than the cutoff every later page is newer too.
    const reachedCutoff = storagePage.page.some(
      (storedFile) => storedFile._creationTime >= cutoff,
    );

    if (!storagePage.isDone && !reachedCutoff) {
      await ctx.scheduler.runAfter(0, internal.cleanup.deleteOrphanedStorage, {
        cursor: storagePage.continueCursor,
        cutoff,
      });
    }
  },
});
