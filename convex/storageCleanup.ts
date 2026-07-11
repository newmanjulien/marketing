import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const orphanLifetimeMs = 24 * 60 * 60 * 1000;
const cleanupPageSize = 100;

export const deleteExpiredUploadIntents = internalMutation({
  args: {
    cutoff: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.cutoff ?? Date.now();
    const expiredIntents = await ctx.db
      .query("successRoomUploadIntents")
      .withIndex("by_expires_at", (query) => query.lt("expiresAt", cutoff))
      .take(cleanupPageSize);

    for (const uploadIntent of expiredIntents) {
      await ctx.db.delete(uploadIntent._id);
    }

    if (expiredIntents.length === cleanupPageSize) {
      await ctx.scheduler.runAfter(0, internal.storageCleanup.deleteExpiredUploadIntents, {
        cutoff,
      });
    }

    return { deletedIntents: expiredIntents.length };
  },
});

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
    let deletedFiles = 0;

    // All durable storage in this app is represented by successRoomFiles.
    for (const storedFile of orphanCandidates) {
      const claimedFile = await ctx.db
        .query("successRoomFiles")
        .withIndex("by_storage_id", (query) => query.eq("storageId", storedFile._id))
        .first();

      if (!claimedFile) {
        await ctx.storage.delete(storedFile._id);
        deletedFiles += 1;
      }
    }

    const reachedCutoff = orphanCandidates.length < storagePage.page.length;
    const complete = storagePage.isDone || reachedCutoff;

    if (!complete) {
      await ctx.scheduler.runAfter(0, internal.storageCleanup.deleteOrphanedStorage, {
        cursor: storagePage.continueCursor,
        cutoff,
      });
    }

    return { deletedFiles, complete };
  },
});
