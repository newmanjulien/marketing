import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { benefitCardValidator, planAccordionValidator, storedFileValidator } from "./schema";
import {
  audioResourceSlug,
  deckResourceSlug,
  mutualSuccessPlanResourceSlug,
  successRoomResourceSlugs,
  successRoomRoutedResourceSlugValidator,
} from "../shared/successRoomResources";
import { createDefaultPlanState } from "../shared/successRoomPlan";
import { createDefaultBenefitsState } from "../shared/successRoomBenefits";
import { createDefaultEditableTextContent } from "../shared/successRoomEditableText";
import { createDefaultKickoffScheduleState } from "../shared/successRoomKickoffSchedule";
import {
  assertValidSeedBenefitCards,
  assertValidSeedPlanAccordions,
  normalizeSlug,
  requireRoomBySlug,
  roomBySlug,
} from "./model/rooms";

// Seed and maintenance API for the scripts in scripts/success-room. Internal
// functions only: they run through `npx convex run`, never from the browser.

export const validateNewSuccessRoomSlug = internalQuery({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);

    if (await roomBySlug(ctx, slug)) {
      throw new ConvexError("Success room slug already exists");
    }

    return { slug };
  },
});

export const generateUploadUrl = internalMutation({
  args: {},
  handler: (ctx) => ctx.storage.generateUploadUrl(),
});

export const createSuccessRoom = internalMutation({
  args: {
    slug: v.string(),
    prospectName: v.string(),
    passwordHash: v.string(),
    deck: storedFileValidator,
    audio: storedFileValidator,
    benefitCards: v.array(benefitCardValidator),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);

    if (await roomBySlug(ctx, slug)) {
      throw new ConvexError("Success room slug already exists");
    }

    assertValidSeedBenefitCards(args.benefitCards);

    const roomId = await ctx.db.insert("successRooms", {
      slug,
      prospectName: args.prospectName,
      passwordHash: args.passwordHash,
      enabledResourceSlugs: [deckResourceSlug, audioResourceSlug],
      benefitCards: args.benefitCards,
      planAccordions: [],
      teamMembers: [],
      state: {
        benefits: createDefaultBenefitsState(),
        plan: createDefaultPlanState(),
        editableText: createDefaultEditableTextContent(),
        kickoffSchedule: createDefaultKickoffScheduleState(),
      },
    });

    await ctx.db.insert("successRoomFiles", { roomId, kind: "deck", ...args.deck });
    await ctx.db.insert("successRoomFiles", { roomId, kind: "audio", ...args.audio });

    return { slug, roomId };
  },
});

export const replaceSuccessRoomBenefitCards = internalMutation({
  args: {
    slug: v.string(),
    benefitCards: v.array(benefitCardValidator),
  },
  handler: async (ctx, args) => {
    const room = await requireRoomBySlug(ctx, args.slug);

    assertValidSeedBenefitCards(args.benefitCards);

    await ctx.db.patch(room._id, {
      benefitCards: args.benefitCards,
    });
  },
});

export const enableSuccessRoomSection = internalMutation({
  args: {
    slug: v.string(),
    resourceSlug: successRoomRoutedResourceSlugValidator,
    planAccordions: v.optional(v.array(planAccordionValidator)),
  },
  handler: async (ctx, args) => {
    const room = await requireRoomBySlug(ctx, args.slug);
    const enabled = new Set([...room.enabledResourceSlugs, args.resourceSlug]);
    const enabledResourceSlugs = successRoomResourceSlugs.filter((slug) => enabled.has(slug));
    const nextState = { ...room.state };
    let planAccordions = room.planAccordions;

    // The plan section is seeded from the script's CSV, replacing any existing
    // plan content and progress.
    if (args.resourceSlug === mutualSuccessPlanResourceSlug) {
      planAccordions = args.planAccordions ?? [];
      assertValidSeedPlanAccordions(planAccordions);
      // Open the first accordion by default; null would mean all closed.
      nextState.plan = createDefaultPlanState(planAccordions[0]?.key ?? null);
    }

    await ctx.db.patch(room._id, {
      enabledResourceSlugs,
      planAccordions,
      state: nextState,
    });

    return { enabledResourceSlugs };
  },
});

export const nukeSuccessRoomData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const storageFiles = await ctx.db.system.query("_storage").collect();

    for (const file of storageFiles) {
      await ctx.storage.delete(file._id);
    }

    const deletedRows: Record<string, number> = {};

    for (const table of [
      "successRoomFiles",
      "successRoomSessions",
      "successRoomDocumentRequests",
      "successRooms",
    ] as const) {
      const rows = await ctx.db.query(table).collect();

      for (const row of rows) {
        await ctx.db.delete(row._id);
      }

      deletedRows[table] = rows.length;
    }

    return {
      deletedStorageFiles: storageFiles.length,
      deletedRows,
    };
  },
});
