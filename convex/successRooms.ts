import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { parseSuccessRoomSlug } from "../shared/successRoomSlugs";

const maxBenefitCards = 10;
const maxPlanAccordions = 10;
const maxPlanTasksPerAccordion = 10;
const deckResourceKey = "deck";
const audioResourceKey = "audio";
const mutualSuccessPlanResourceKey = "mutual-success-plan";
const initialFormatResourceKey = "initial-format";
const baseResourceKeys = [deckResourceKey, audioResourceKey] as const;
const allResourceKeys = [
  deckResourceKey,
  audioResourceKey,
  mutualSuccessPlanResourceKey,
  initialFormatResourceKey,
] as const;

const assetResourceKey = v.union(v.literal(deckResourceKey), v.literal(audioResourceKey));
const optionalResourceKey = v.union(
  v.literal(mutualSuccessPlanResourceKey),
  v.literal(initialFormatResourceKey),
);
const editableTextResourceKey = v.literal(initialFormatResourceKey);

type SuccessRoomResourceKey = (typeof allResourceKeys)[number];
type OptionalSuccessRoomResourceKey = typeof mutualSuccessPlanResourceKey | typeof initialFormatResourceKey;

const seedBenefitCard = v.object({
  key: v.string(),
  title: v.string(),
  description: v.string(),
  sortOrder: v.number(),
});

const seedPlanTask = v.object({
  key: v.string(),
  title: v.string(),
  dateLabel: v.string(),
});

const seedPlanAccordion = v.object({
  key: v.string(),
  title: v.string(),
  description: v.string(),
  variant: v.union(v.literal("default"), v.literal("muted")),
  sortOrder: v.number(),
  tasks: v.array(seedPlanTask),
});

const fileInput = v.object({
  storageId: v.id("_storage"),
  filename: v.string(),
  contentType: v.string(),
  byteSize: v.number(),
});

const planSnapshot = v.object({
  selectedBenefitIds: v.array(v.string()),
  checkedTaskIds: v.array(v.string()),
  dateOverrides: v.record(v.string(), v.string()),
  taskAssigneeMemberIds: v.record(v.string(), v.id("successRoomTeamMembers")),
});

type PlanState = {
  selectedBenefitIds: string[];
  checkedTaskIds: string[];
  dateOverrides: Record<string, string>;
  taskAssigneeMemberIds: Record<string, Id<"successRoomTeamMembers">>;
};

type SeedBenefitCard = {
  key: string;
  title: string;
  description: string;
  sortOrder: number;
};

type SeedPlanAccordion = {
  key: string;
  title: string;
  description: string;
  variant: "default" | "muted";
  sortOrder: number;
  tasks: Array<{
    key: string;
    title: string;
    dateLabel: string;
  }>;
};

const emptyPlanState = (): PlanState => ({
  selectedBenefitIds: [],
  checkedTaskIds: [],
  dateOverrides: {},
  taskAssigneeMemberIds: {},
});

const hashPassword = async (password: string) => {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getAccessToken = async (room: Doc<"successRooms">) =>
  await hashPassword(`${room.slug}:${room.passwordHash}:${room.passwordUpdatedAt}:success-room`);

const assertAccess = async (room: Doc<"successRooms">, accessToken: string) => {
  if (accessToken !== (await getAccessToken(room))) {
    throw new ConvexError("Success room access denied");
  }
};

const assertSeedAccess = (seedSecret: string) => {
  const expectedSeedSecret = process.env.SUCCESS_ROOM_SEED_SECRET;

  if (!expectedSeedSecret || seedSecret !== expectedSeedSecret) {
    throw new ConvexError("Success room seed access denied");
  }
};

const assertMaxLength = (items: unknown[], maxLength: number, label: string) => {
  if (items.length > maxLength) {
    throw new ConvexError(`${label} must include ${maxLength} items or fewer`);
  }
};

const normalizeAdminSuccessRoomSlug = (slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    throw new ConvexError("Success room slug is reserved or invalid");
  }

  return parsedSlug;
};

const normalizeEnabledResourceKeys = (room: Doc<"successRooms">): SuccessRoomResourceKey[] => [
  ...new Set<SuccessRoomResourceKey>([
    ...baseResourceKeys,
    ...room.enabledResourceKeys.filter((key) => allResourceKeys.includes(key)),
  ]),
];

const isResourceEnabled = (
  room: Doc<"successRooms">,
  resourceKey: SuccessRoomResourceKey,
) => normalizeEnabledResourceKeys(room).includes(resourceKey);

const assertResourceEnabled = (
  room: Doc<"successRooms">,
  resourceKey: SuccessRoomResourceKey,
) => {
  if (!isResourceEnabled(room, resourceKey)) {
    throw new ConvexError("Success room resource not found");
  }
};

const deleteByRoomId = async (
  ctx: MutationCtx,
  table:
    | "successRoomBenefitCards"
    | "successRoomPlanAccordions"
    | "successRoomVisitorStates"
    | "successRoomTeamMembers"
    | "successRoomTeamMemberPhotos"
    | "successRoomEditableTextStates"
    | "successRoomResourceFiles"
    | "successRoomEditableAttachmentFiles",
  roomId: Id<"successRooms">,
) => {
  const rows = await ctx.db
    .query(table)
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  await Promise.all(rows.map((row) => ctx.db.delete(row._id)));
};

const deleteExistingRoom = async (
  ctx: MutationCtx,
  room: Doc<"successRooms">,
) => {
  await Promise.all([
    deleteByRoomId(ctx, "successRoomBenefitCards", room._id),
    deleteByRoomId(ctx, "successRoomPlanAccordions", room._id),
    deleteByRoomId(ctx, "successRoomVisitorStates", room._id),
    deleteByRoomId(ctx, "successRoomTeamMemberPhotos", room._id),
    deleteByRoomId(ctx, "successRoomTeamMembers", room._id),
    deleteByRoomId(ctx, "successRoomEditableTextStates", room._id),
    deleteByRoomId(ctx, "successRoomResourceFiles", room._id),
    deleteByRoomId(ctx, "successRoomEditableAttachmentFiles", room._id),
  ]);

  await ctx.db.delete(room._id);
};

async function getRoomBySlug(ctx: QueryCtx | MutationCtx, slug: string) {
  return await ctx.db
    .query("successRooms")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

const ensureRoom = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const room = await getRoomBySlug(ctx, slug);

  if (!room || room.archived) {
    throw new ConvexError("Success room not found");
  }

  return room;
};

const getVisitorStateByRoomId = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
) =>
  await ctx.db
    .query("successRoomVisitorStates")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .unique();

const getActiveResourceFile = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  resourceKey: string,
) => {
  const files = await ctx.db
    .query("successRoomResourceFiles")
    .withIndex("by_room_resource_key", (q) =>
      q.eq("roomId", roomId).eq("resourceKey", resourceKey),
    )
    .collect();

  return files.find((file) => file.active) ?? null;
};

const getActiveEditableAttachmentFile = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  resourceKey: string,
) => {
  const files = await ctx.db
    .query("successRoomEditableAttachmentFiles")
    .withIndex("by_room_resource_key", (q) =>
      q.eq("roomId", roomId).eq("resourceKey", resourceKey),
    )
    .collect();

  return files.find((file) => file.active) ?? null;
};

const getActiveTeamMemberPhoto = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  teamMemberId: Id<"successRoomTeamMembers">,
) => {
  const files = await ctx.db
    .query("successRoomTeamMemberPhotos")
    .withIndex("by_room_team_member", (q) =>
      q.eq("roomId", roomId).eq("teamMemberId", teamMemberId),
    )
    .collect();

  return files.find((file) => file.active) ?? null;
};

const fileSummary = (
  file: Doc<"successRoomResourceFiles"> | Doc<"successRoomEditableAttachmentFiles">,
) => ({
  fileId: file._id,
  filename: file.filename,
  contentType: file.contentType,
  byteSize: file.byteSize,
});

const teamMemberPhotoSummary = (photo: Doc<"successRoomTeamMemberPhotos">) => ({
  photoId: photo._id,
  filename: photo.filename,
  contentType: photo.contentType,
  byteSize: photo.byteSize,
});

const benefitCardSummary = (card: Doc<"successRoomBenefitCards">) => ({
  id: card.key,
  title: card.title,
  description: card.description,
});

const planAccordionSummary = (accordion: Doc<"successRoomPlanAccordions">) => ({
  id: accordion.key,
  title: accordion.title,
  description: accordion.description,
  variant: accordion.variant,
  tasks: accordion.tasks.slice(0, maxPlanTasksPerAccordion).map((task) => ({
    id: task.key,
    title: task.title,
    date: task.dateLabel,
  })),
});

const visitorTeamMemberSummary = (
  member: Doc<"successRoomTeamMembers">,
  photo?: Doc<"successRoomTeamMemberPhotos">,
) => ({
  id: member._id,
  name: member.name,
  role: member.role,
  ...(photo ? { photo: teamMemberPhotoSummary(photo) } : {}),
});

const upsertBenefitCards = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  cards: SeedBenefitCard[],
  now: number,
) => {
  for (const card of cards) {
    const existingCard = await ctx.db
      .query("successRoomBenefitCards")
      .withIndex("by_room_key", (q) => q.eq("roomId", roomId).eq("key", card.key))
      .unique();
    const nextCard = {
      roomId,
      key: card.key,
      title: card.title,
      description: card.description,
      sortOrder: card.sortOrder,
      active: true,
      createdAt: existingCard?.createdAt ?? now,
      updatedAt: now,
    };

    if (existingCard) {
      await ctx.db.replace(existingCard._id, nextCard);
    } else {
      await ctx.db.insert("successRoomBenefitCards", nextCard);
    }
  }
};

const upsertPlanAccordions = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  accordions: SeedPlanAccordion[],
  now: number,
) => {
  for (const accordion of accordions) {
    const existingAccordion = await ctx.db
      .query("successRoomPlanAccordions")
      .withIndex("by_room_key", (q) => q.eq("roomId", roomId).eq("key", accordion.key))
      .unique();
    const nextAccordion = {
      roomId,
      key: accordion.key,
      title: accordion.title,
      description: accordion.description,
      variant: accordion.variant,
      sortOrder: accordion.sortOrder,
      tasks: accordion.tasks,
      active: true,
      createdAt: existingAccordion?.createdAt ?? now,
      updatedAt: now,
    };

    if (existingAccordion) {
      await ctx.db.replace(existingAccordion._id, nextAccordion);
    } else {
      await ctx.db.insert("successRoomPlanAccordions", nextAccordion);
    }
  }
};

const buildVisitorStatePatch = (
  state: Doc<"successRoomVisitorStates">,
  update: {
    questions?: Record<string, string>;
    plan?: PlanState;
    updatedAt: number;
  },
) => ({
  roomId: state.roomId,
  questions: update.questions ?? state.questions,
  ...((update.plan ?? state.plan) ? { plan: update.plan ?? state.plan } : {}),
  createdAt: state.createdAt,
  updatedAt: update.updatedAt,
});

const initializePlanState = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  now: number,
) => {
  const state = await getVisitorStateByRoomId(ctx, roomId);

  if (!state || state.plan) {
    return;
  }

  await ctx.db.replace(
    state._id,
    buildVisitorStatePatch(state, {
      plan: emptyPlanState(),
      updatedAt: now,
    }),
  );
};

const lockedRoom = (room: Doc<"successRooms">) => ({
  slug: room.slug,
  prospectName: room.prospectName,
  enabledResourceKeys: normalizeEnabledResourceKeys(room),
});

const sanitizeTaskAssignees = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  assignments: Record<string, Id<"successRoomTeamMembers">>,
) => {
  const entries = await Promise.all(
    Object.entries(assignments).map(async ([taskId, memberId]) => {
      const member = await ctx.db.get(memberId);

      return member && member.roomId === roomId && member.active
        ? ([taskId, memberId] as const)
        : null;
    }),
  );

  return Object.fromEntries(entries.filter((entry) => entry !== null));
};

const getPlanForBundle = async (
  ctx: QueryCtx,
  roomId: Id<"successRooms">,
  statePlan: Doc<"successRoomVisitorStates">["plan"],
) => {
  if (!statePlan) {
    return emptyPlanState();
  }

  return {
    selectedBenefitIds: statePlan.selectedBenefitIds,
    checkedTaskIds: statePlan.checkedTaskIds,
    dateOverrides: statePlan.dateOverrides,
    taskAssigneeMemberIds: await sanitizeTaskAssignees(
      ctx,
      roomId,
      statePlan.taskAssigneeMemberIds,
    ),
  };
};

const getMutualSuccessPlanStateForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
  statePlan: Doc<"successRoomVisitorStates">["plan"],
) => {
  if (!isResourceEnabled(room, mutualSuccessPlanResourceKey)) {
    return undefined;
  }

  return {
    plan: await getPlanForBundle(ctx, room._id, statePlan),
  };
};

const getMutualSuccessPlanCatalogForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
) => {
  if (!isResourceEnabled(room, mutualSuccessPlanResourceKey)) {
    return {
      benefitCards: [],
      planAccordions: [],
    };
  }

  const benefitCards = await ctx.db
    .query("successRoomBenefitCards")
    .withIndex("by_room", (q) => q.eq("roomId", room._id))
    .collect();
  const planAccordions = await ctx.db
    .query("successRoomPlanAccordions")
    .withIndex("by_room", (q) => q.eq("roomId", room._id))
    .collect();

  return {
    benefitCards: benefitCards
      .filter((card) => card.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, maxBenefitCards)
      .map(benefitCardSummary),
    planAccordions: planAccordions
      .filter((accordion) => accordion.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, maxPlanAccordions)
      .map(planAccordionSummary),
  };
};

const getEditableTextsForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
) => {
  const editableTexts: Record<
    string,
    {
      content: string;
      dataSources: string[];
      attachment?: ReturnType<typeof fileSummary>;
    }
  > = {};

  if (!isResourceEnabled(room, initialFormatResourceKey)) {
    return editableTexts;
  }

  const editableStates = await ctx.db
    .query("successRoomEditableTextStates")
    .withIndex("by_room", (q) => q.eq("roomId", room._id))
    .collect();

  for (const editableState of editableStates) {
    const attachment =
      editableState.attachmentFileId !== undefined
        ? await ctx.db.get(editableState.attachmentFileId)
        : null;
    const activeAttachment =
      attachment &&
      attachment.roomId === room._id &&
      attachment.resourceKey === editableState.resourceKey &&
      attachment.active
        ? attachment
        : null;

    editableTexts[editableState.resourceKey] = {
      content: editableState.content,
      dataSources: editableState.dataSources,
      ...(activeAttachment ? { attachment: fileSummary(activeAttachment) } : {}),
    };
  }

  return editableTexts;
};

const upsertEditableTextState = async (
  ctx: MutationCtx,
  args: {
    roomId: Id<"successRooms">;
    resourceKey: string;
    content: string;
    dataSources: string[];
    attachmentFileId?: Id<"successRoomEditableAttachmentFiles">;
  },
) => {
  const now = Date.now();
  const existingState = await ctx.db
    .query("successRoomEditableTextStates")
    .withIndex("by_room_resource_key", (q) =>
      q.eq("roomId", args.roomId).eq("resourceKey", args.resourceKey),
    )
    .unique();
  const attachmentFileId = args.attachmentFileId ?? existingState?.attachmentFileId;

  if (attachmentFileId) {
    const attachmentFile = await ctx.db.get(attachmentFileId);

    if (
      !attachmentFile ||
      attachmentFile.roomId !== args.roomId ||
      attachmentFile.resourceKey !== args.resourceKey ||
      !attachmentFile.active
    ) {
      throw new ConvexError("Editable attachment file is invalid");
    }
  }

  const nextState = {
    roomId: args.roomId,
    resourceKey: args.resourceKey,
    content: args.content,
    dataSources: args.dataSources,
    ...(attachmentFileId ? { attachmentFileId } : {}),
    createdAt: existingState?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingState) {
    await ctx.db.replace(existingState._id, nextState);
  } else {
    await ctx.db.insert("successRoomEditableTextStates", nextState);
  }
};

export const generateUploadUrl = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    return await ctx.storage.generateUploadUrl();
  },
});

export const generateSeedUploadUrl = mutation({
  args: {
    slug: v.string(),
    seedSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    normalizeAdminSuccessRoomSlug(args.slug);

    return await ctx.storage.generateUploadUrl();
  },
});

export const verifyPassword = mutation({
  args: {
    slug: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await getRoomBySlug(ctx, args.slug);

    if (!room || room.archived) {
      return false;
    }

    if (room.passwordHash !== (await hashPassword(args.password))) {
      return null;
    }

    return await getAccessToken(room);
  },
});

export const getPublicRoom = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await getRoomBySlug(ctx, args.slug);

    return room && !room.archived ? lockedRoom(room) : null;
  },
});

export const getRoomBundle = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const state = await getVisitorStateByRoomId(ctx, room._id);

    if (!state) {
      throw new ConvexError("Success room visitor state not found");
    }

    const mutualSuccessPlanState = await getMutualSuccessPlanStateForBundle(ctx, room, state.plan);
    const mutualSuccessPlanCatalog = await getMutualSuccessPlanCatalogForBundle(ctx, room);
    const editableTexts = await getEditableTextsForBundle(ctx, room);
    const visitorTeamMembers = await ctx.db
      .query("successRoomTeamMembers")
      .withIndex("by_room_active_created_at", (q) =>
        q.eq("roomId", room._id).eq("active", true),
      )
      .collect();
    const visitorTeamMemberPhotos = await ctx.db
      .query("successRoomTeamMemberPhotos")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    const visitorTeamMemberPhotoByMemberId = new Map(
      visitorTeamMemberPhotos
        .filter((photo) => photo.active)
        .map((photo) => [photo.teamMemberId, photo]),
    );

    return {
      room: {
        ...lockedRoom(room),
        team: visitorTeamMembers.map((member) =>
          visitorTeamMemberSummary(member, visitorTeamMemberPhotoByMemberId.get(member._id)),
        ),
        mutualSuccessPlanCatalog,
      },
      state: {
        questions: state.questions,
        ...(mutualSuccessPlanState ? { mutualSuccessPlan: mutualSuccessPlanState } : {}),
        editableTexts,
      },
    };
  },
});

export const getResourceFileForDownload = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: assetResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    const file = await getActiveResourceFile(ctx, room._id, args.resourceSlug);

    if (!file) {
      return null;
    }

    const url = await ctx.storage.getUrl(file.storageId);

    return url
      ? {
          ...fileSummary(file),
          url,
        }
      : null;
  },
});

export const getEditableAttachmentForDownload = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    const file = await getActiveEditableAttachmentFile(ctx, room._id, args.resourceSlug);

    if (!file) {
      return null;
    }

    const url = await ctx.storage.getUrl(file.storageId);

    return url
      ? {
          ...fileSummary(file),
          url,
        }
      : null;
  },
});

export const getTeamMemberPhotoForDownload = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    teamMemberId: v.id("successRoomTeamMembers"),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const teamMember = await ctx.db.get(args.teamMemberId);

    if (!teamMember || teamMember.roomId !== room._id || !teamMember.active) {
      return null;
    }

    const photo = await getActiveTeamMemberPhoto(ctx, room._id, teamMember._id);

    if (!photo) {
      return null;
    }

    const url = await ctx.storage.getUrl(photo.storageId);

    return url
      ? {
          ...teamMemberPhotoSummary(photo),
          url,
        }
      : null;
  },
});

export const addTeamMember = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    name: v.string(),
    role: v.string(),
    photo: fileInput,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const name = args.name.trim();
    const role = args.role.trim();

    if (!name || !role) {
      throw new ConvexError("Team member name and role are required");
    }

    if (!args.photo.contentType.startsWith("image/")) {
      throw new ConvexError("Team member photo must be an image");
    }

    const now = Date.now();
    const memberId = await ctx.db.insert("successRoomTeamMembers", {
      roomId: room._id,
      name,
      role,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const photoId = await ctx.db.insert("successRoomTeamMemberPhotos", {
      roomId: room._id,
      teamMemberId: memberId,
      storageId: args.photo.storageId,
      filename: args.photo.filename,
      contentType: args.photo.contentType,
      byteSize: args.photo.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    const photo = await ctx.db.get(photoId);

    return {
      id: memberId,
      name,
      role,
      ...(photo ? { photo: teamMemberPhotoSummary(photo) } : {}),
    };
  },
});

export const patchQuestions = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    questions: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const state = await getVisitorStateByRoomId(ctx, room._id);

    if (!state) {
      throw new ConvexError("Success room visitor state not found");
    }

    await ctx.db.replace(
      state._id,
      buildVisitorStatePatch(state, {
        questions: args.questions,
        updatedAt: Date.now(),
      }),
    );
  },
});

export const replacePlan = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    plan: planSnapshot,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, mutualSuccessPlanResourceKey);

    const state = await getVisitorStateByRoomId(ctx, room._id);

    if (!state) {
      throw new ConvexError("Success room visitor state not found");
    }

    const taskAssigneeMemberIds = await sanitizeTaskAssignees(
      ctx,
      room._id,
      args.plan.taskAssigneeMemberIds,
    );

    await ctx.db.replace(
      state._id,
      buildVisitorStatePatch(state, {
        plan: {
          selectedBenefitIds: args.plan.selectedBenefitIds,
          checkedTaskIds: args.plan.checkedTaskIds,
          dateOverrides: args.plan.dateOverrides,
          taskAssigneeMemberIds,
        },
        updatedAt: Date.now(),
      }),
    );
  },
});

export const patchEditableText = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
    content: v.string(),
    dataSources: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    await upsertEditableTextState(ctx, {
      roomId: room._id,
      resourceKey: args.resourceSlug,
      content: args.content,
      dataSources: args.dataSources,
    });
  },
});

export const registerEditableAttachment = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
    file: fileInput,
    content: v.string(),
    dataSources: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    const now = Date.now();
    const existingFiles = await ctx.db
      .query("successRoomEditableAttachmentFiles")
      .withIndex("by_room_resource_key", (q) =>
        q.eq("roomId", room._id).eq("resourceKey", args.resourceSlug),
      )
      .collect();

    await Promise.all(
      existingFiles
        .filter((file) => file.active)
        .map((file) =>
          ctx.db.patch(file._id, {
            active: false,
            updatedAt: now,
          }),
        ),
    );

    const fileId = await ctx.db.insert("successRoomEditableAttachmentFiles", {
      roomId: room._id,
      resourceKey: args.resourceSlug,
      storageId: args.file.storageId,
      filename: args.file.filename,
      contentType: args.file.contentType,
      byteSize: args.file.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await upsertEditableTextState(ctx, {
      roomId: room._id,
      resourceKey: args.resourceSlug,
      content: args.content,
      dataSources: args.dataSources,
      attachmentFileId: fileId,
    });

    return {
      fileId,
      filename: args.file.filename,
      contentType: args.file.contentType,
      byteSize: args.file.byteSize,
    };
  },
});

export const removeEditableAttachment = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    const editableState = await ctx.db
      .query("successRoomEditableTextStates")
      .withIndex("by_room_resource_key", (q) =>
        q.eq("roomId", room._id).eq("resourceKey", args.resourceSlug),
      )
      .unique();

    if (!editableState) {
      return;
    }

    if (editableState.attachmentFileId) {
      const attachmentFile = await ctx.db.get(editableState.attachmentFileId);

      if (
        !attachmentFile ||
        attachmentFile.roomId !== room._id ||
        attachmentFile.resourceKey !== args.resourceSlug
      ) {
        throw new ConvexError("Editable attachment file is invalid");
      }

      await ctx.db.patch(editableState.attachmentFileId, {
        active: false,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.replace(editableState._id, {
      roomId: editableState.roomId,
      resourceKey: editableState.resourceKey,
      content: editableState.content,
      dataSources: editableState.dataSources,
      createdAt: editableState.createdAt,
      updatedAt: Date.now(),
    });
  },
});

export const seedSuccessRoom = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    prospectName: v.string(),
    password: v.string(),
    deck: fileInput,
    audio: fileInput,
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    const slug = normalizeAdminSuccessRoomSlug(args.slug);

    const existingRoom = await getRoomBySlug(ctx, slug);

    if (existingRoom) {
      await deleteExistingRoom(ctx, existingRoom);
    }

    const now = Date.now();
    const roomId = await ctx.db.insert("successRooms", {
      slug,
      prospectName: args.prospectName,
      enabledResourceKeys: [...baseResourceKeys],
      passwordHash: await hashPassword(args.password),
      passwordUpdatedAt: now,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    const deckId = await ctx.db.insert("successRoomResourceFiles", {
      roomId,
      resourceKey: deckResourceKey,
      storageId: args.deck.storageId,
      filename: args.deck.filename,
      contentType: args.deck.contentType,
      byteSize: args.deck.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const audioId = await ctx.db.insert("successRoomResourceFiles", {
      roomId,
      resourceKey: audioResourceKey,
      storageId: args.audio.storageId,
      filename: args.audio.filename,
      contentType: args.audio.contentType,
      byteSize: args.audio.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("successRoomVisitorStates", {
      roomId,
      questions: {},
      createdAt: now,
      updatedAt: now,
    });

    return {
      roomId,
      deckId,
      audioId,
    };
  },
});

export const enableSuccessRoomSections = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    resourceKeys: v.array(optionalResourceKey),
    benefitCards: v.array(seedBenefitCard),
    planAccordions: v.array(seedPlanAccordion),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    const slug = normalizeAdminSuccessRoomSlug(args.slug);

    if (args.resourceKeys.length === 0) {
      throw new ConvexError("At least one success room section is required");
    }

    const requestedResourceKeys = [...new Set<OptionalSuccessRoomResourceKey>(args.resourceKeys)];
    const room = await ensureRoom(ctx, slug);
    const now = Date.now();

    if (requestedResourceKeys.includes(mutualSuccessPlanResourceKey)) {
      if (args.benefitCards.length === 0 || args.planAccordions.length === 0) {
        throw new ConvexError("Mutual success plan content is required");
      }

      assertMaxLength(args.benefitCards, maxBenefitCards, "Benefit cards");
      assertMaxLength(args.planAccordions, maxPlanAccordions, "Plan accordions");

      for (const accordion of args.planAccordions) {
        assertMaxLength(
          accordion.tasks,
          maxPlanTasksPerAccordion,
          `Plan accordion "${accordion.key}" tasks`,
        );
      }

      await upsertBenefitCards(ctx, room._id, args.benefitCards, now);
      await upsertPlanAccordions(ctx, room._id, args.planAccordions, now);
      await initializePlanState(ctx, room._id, now);
    }

    const enabledResourceKeys = [
      ...new Set<SuccessRoomResourceKey>([
        ...normalizeEnabledResourceKeys(room),
        ...requestedResourceKeys,
      ]),
    ];

    await ctx.db.patch(room._id, {
      enabledResourceKeys,
      updatedAt: now,
    });

    return {
      enabledResourceKeys,
    };
  },
});
