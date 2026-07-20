import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { benefitCardValidator, planAccordionValidator, storedFileValidator } from "./schema";
import {
  audioResourceKey,
  deckResourceKey,
  kickoffScheduleResourceKey,
  mutualSuccessPlanResourceKey,
  routedSuccessRoomResourceKeyValidator,
  successRoomResourceDefinitions,
  type RoutedSuccessRoomResourceKey,
  type SuccessRoomResourceKey,
} from "../shared/successRoomResources";
import {
  createDefaultBenefitsState,
  createDefaultEditableTextContent,
  createDefaultKickoffScheduleState,
  createDefaultPlanState,
} from "../shared/successRoomState";
import {
  assertNotEmpty,
  normalizeSlug,
  requireRoomBySlug,
  roomBySlug,
  sanitizeSeedBenefitCards,
  sanitizeSeedPlanAccordions,
} from "./model/rooms";

// Seed and maintenance API for the scripts in scripts/success-room. Internal
// functions only: they run through `npx convex run`, never from the browser.

const allResourceKeys: SuccessRoomResourceKey[] = successRoomResourceDefinitions.map(
  ({ slug }) => slug,
);

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
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
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

    const roomId = await ctx.db.insert("successRooms", {
      slug,
      prospectName: args.prospectName,
      passwordHash: args.passwordHash,
      enabledResourceKeys: [deckResourceKey, audioResourceKey],
      benefitCards: sanitizeSeedBenefitCards(args.benefitCards),
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

    await ctx.db.patch(room._id, {
      benefitCards: sanitizeSeedBenefitCards(args.benefitCards),
    });
  },
});

export const enableSuccessRoomSections = internalMutation({
  args: {
    slug: v.string(),
    resourceKeys: v.array(routedSuccessRoomResourceKeyValidator),
    planAccordions: v.optional(v.array(planAccordionValidator)),
  },
  handler: async (ctx, args) => {
    assertNotEmpty(args.resourceKeys, "Success room sections");

    const room = await requireRoomBySlug(ctx, args.slug);
    const requestedResourceKeys = [
      ...new Set<RoutedSuccessRoomResourceKey>(args.resourceKeys),
    ];
    const enabledResourceKeys = Array.from(
      new Set<SuccessRoomResourceKey>([...room.enabledResourceKeys, ...requestedResourceKeys]),
    ).sort((left, right) => allResourceKeys.indexOf(left) - allResourceKeys.indexOf(right));
    const nextState = { ...room.state };
    let planAccordions = room.planAccordions;

    if (requestedResourceKeys.includes(mutualSuccessPlanResourceKey)) {
      planAccordions = sanitizeSeedPlanAccordions(args.planAccordions ?? []);
      // Open the first accordion by default; null would mean all closed.
      nextState.plan = createDefaultPlanState(planAccordions[0]?.key ?? null);
    }

    if (requestedResourceKeys.includes(kickoffScheduleResourceKey)) {
      nextState.kickoffSchedule = createDefaultKickoffScheduleState();
    }

    await ctx.db.patch(room._id, {
      enabledResourceKeys,
      planAccordions,
      state: nextState,
    });

    return { enabledResourceKeys };
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
