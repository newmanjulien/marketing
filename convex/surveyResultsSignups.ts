import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, type MutationCtx } from "./_generated/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 60 * 60 * 1000;
const maximumRequestsPerWindow = 5;
const cleanupBatchSize = 100;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const assertSignupAccess = (signupSecret: string) => {
  const expectedSecret = process.env.SURVEY_SIGNUP_SECRET;

  if (!expectedSecret || signupSecret !== expectedSecret) {
    throw new ConvexError("Survey results signup access denied");
  }
};

const consumeRateLimit = async (ctx: MutationCtx, clientKey: string, now: number) => {
  const rateLimit = await ctx.db
    .query("surveyResultsSignupRateLimits")
    .withIndex("by_client_key", (query) => query.eq("clientKey", clientKey))
    .unique();

  if (!rateLimit || rateLimit.windowStartedAt + rateLimitWindowMs <= now) {
    const replacement = {
      windowStartedAt: now,
      requestCount: 1,
      expiresAt: now + rateLimitWindowMs,
    };

    if (rateLimit) {
      await ctx.db.patch(rateLimit._id, replacement);
    } else {
      await ctx.db.insert("surveyResultsSignupRateLimits", {
        clientKey,
        ...replacement,
      });
    }

    return true;
  }

  if (rateLimit.requestCount >= maximumRequestsPerWindow) {
    return false;
  }

  await ctx.db.patch(rateLimit._id, {
    requestCount: rateLimit.requestCount + 1,
  });

  return true;
};

export const register = mutation({
  args: {
    email: v.string(),
    clientKey: v.string(),
    signupSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertSignupAccess(args.signupSecret);

    const email = normalizeEmail(args.email);

    if (!emailPattern.test(email)) {
      throw new Error("A valid email address is required");
    }

    const submittedAt = Date.now();

    if (!(await consumeRateLimit(ctx, args.clientKey, submittedAt))) {
      return { status: "rate-limited" as const };
    }

    const existingSignup = await ctx.db
      .query("surveyResultsSignups")
      .withIndex("by_email", (query) => query.eq("email", email))
      .unique();

    if (existingSignup) {
      await ctx.db.patch(existingSignup._id, { lastSubmittedAt: submittedAt });
      return {
        status: "registered" as const,
        signupId: existingSignup._id,
        created: false,
      };
    }

    const signupId = await ctx.db.insert("surveyResultsSignups", {
      email,
      createdAt: submittedAt,
      lastSubmittedAt: submittedAt,
    });

    return { status: "registered" as const, signupId, created: true };
  },
});

export const deleteExpiredRateLimits = internalMutation({
  args: {
    cutoff: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.cutoff ?? Date.now();
    const expiredRateLimits = await ctx.db
      .query("surveyResultsSignupRateLimits")
      .withIndex("by_expires_at", (query) => query.lt("expiresAt", cutoff))
      .take(cleanupBatchSize);

    for (const rateLimit of expiredRateLimits) {
      await ctx.db.delete(rateLimit._id);
    }

    if (expiredRateLimits.length === cleanupBatchSize) {
      await ctx.scheduler.runAfter(0, internal.surveyResultsSignups.deleteExpiredRateLimits, {
        cutoff,
      });
    }

    return { deletedRateLimits: expiredRateLimits.length };
  },
});
