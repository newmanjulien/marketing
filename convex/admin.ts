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
  createKey,
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
      enabledResourceSlugs: [deckResourceSlug, audioResourceSlug],
      benefitCards: args.benefitCards,
      planAccordions: [],
      teamMembers: [
        // Members can only be added from inside the room, so every room starts
        // with a host whose last name is the day-one password (convex/auth.ts).
        { key: createKey("team-member"), name: "Julien Newman", role: "Founder" },
      ],
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

    if (args.resourceSlug !== mutualSuccessPlanResourceSlug) {
      await ctx.db.patch(room._id, { enabledResourceSlugs });
      return { enabledResourceSlugs };
    }

    // The plan section is seeded from the script's CSV, replacing any existing
    // plan content and progress.
    const planAccordions = args.planAccordions ?? [];
    assertValidSeedPlanAccordions(planAccordions);

    await ctx.db.patch(room._id, {
      enabledResourceSlugs,
      planAccordions,
      state: {
        ...room.state,
        // Open the first accordion by default; null would mean all closed.
        plan: createDefaultPlanState(planAccordions[0]?.key ?? null),
      },
    });

    return { enabledResourceSlugs };
  },
});

export const nukeSuccessRoomData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const storageFiles = await ctx.db.system.query("_storage").collect();

    await Promise.all(storageFiles.map((file) => ctx.storage.delete(file._id)));

    const deletedRows: Record<string, number> = {};

    for (const table of [
      "successRoomFiles",
      "successRoomSessions",
      "successRoomDocumentRequests",
      "successRooms",
    ] as const) {
      const rows = await ctx.db.query(table).collect();

      await Promise.all(rows.map((row) => ctx.db.delete(row._id)));

      deletedRows[table] = rows.length;
    }

    return {
      deletedStorageFiles: storageFiles.length,
      deletedRows,
    };
  },
});
