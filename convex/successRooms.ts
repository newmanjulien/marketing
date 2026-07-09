import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { parseSuccessRoomSlug } from "../shared/successRoomSlugs";
import {
  kickoffScheduleColumns,
  kickoffScheduleResourceKey,
  kickoffScheduleRowKeys
} from "../shared/successRoomResources";

const maxBenefitCards = 10;
const maxPainPoints = 3;
const maxPlanAccordions = 10;
const maxPlanTasksPerAccordion = 10;
const deckResourceKey = "deck";
const audioResourceKey = "audio";
const mutualSuccessPlanResourceKey = "mutual-success-plan";
const initialFormatResourceKey = "initial-format";
const kickoffScheduleColumnKeys = kickoffScheduleColumns.map((column) => column.key);
const baseResourceKeys = [deckResourceKey, audioResourceKey] as const;
const allResourceKeys = [
  deckResourceKey,
  audioResourceKey,
  mutualSuccessPlanResourceKey,
  initialFormatResourceKey,
  kickoffScheduleResourceKey,
] as const;

const assetResourceKey = v.union(v.literal(deckResourceKey), v.literal(audioResourceKey));
const optionalResourceKey = v.union(
  v.literal(mutualSuccessPlanResourceKey),
  v.literal(initialFormatResourceKey),
  v.literal(kickoffScheduleResourceKey),
);
const editableTextResourceKey = v.literal(initialFormatResourceKey);
const kickoffScheduleResourceSlug = v.literal(kickoffScheduleResourceKey);

type SuccessRoomResourceKey = (typeof allResourceKeys)[number];
type OptionalSuccessRoomResourceKey =
  | typeof mutualSuccessPlanResourceKey
  | typeof initialFormatResourceKey
  | typeof kickoffScheduleResourceKey;

const successRoomTableNames = [
  "successRoomBenefitCards",
  "successRoomPlanAccordions",
  "successRoomStates",
  "successRoomTeamMembers",
  "successRoomTeamMemberPhotos",
  "successRoomResourceStates",
  "successRoomResourceFiles",
  "successRoomEditableAttachmentFiles",
  "successRooms",
] as const;

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
  checkedTaskIds: v.array(v.string()),
  dateOverrides: v.record(v.string(), v.string()),
  taskAssigneeMemberIds: v.record(v.string(), v.id("successRoomTeamMembers")),
});

const kickoffScheduleSnapshot = v.object({
  rows: v.array(
    v.object({
      key: v.string(),
      sortOrder: v.number(),
      cells: v.record(v.string(), v.string()),
    }),
  ),
});

const benefitsPatch = v.object({
  selectedCardIds: v.optional(v.array(v.string())),
  painPoints: v.optional(v.array(v.string())),
});

type PlanState = {
  checkedTaskIds: string[];
  dateOverrides: Record<string, string>;
  taskAssigneeMemberIds: Record<string, Id<"successRoomTeamMembers">>;
};

type BenefitsState = {
  selectedCardIds: string[];
  painPoints: string[];
};

type RoomState = {
  benefits: BenefitsState;
  plan: PlanState;
};

type RoomStatePatch = {
  benefits?: Partial<BenefitsState>;
  plan?: PlanState;
};

type KickoffScheduleRow = {
  key: string;
  sortOrder: number;
  cells: Record<string, string>;
};

type KickoffScheduleState = {
  rows: KickoffScheduleRow[];
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
  checkedTaskIds: [],
  dateOverrides: {},
  taskAssigneeMemberIds: {},
});

const emptyBenefitsState = (): BenefitsState => ({
  selectedCardIds: [],
  painPoints: [],
});

const emptyRoomState = (): RoomState => ({
  benefits: emptyBenefitsState(),
  plan: emptyPlanState(),
});

const emptyKickoffScheduleState = (): KickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key, index) => ({
    key,
    sortOrder: index,
    cells: {},
  })),
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

const uniqueStrings = (items: string[]) => [...new Set(items)];

const normalizeAdminSuccessRoomSlug = (slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    throw new ConvexError("Success room slug is reserved or invalid");
  }

  return parsedSlug;
};

const normalizeNewSuccessRoomSlug = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const normalizedSlug = normalizeAdminSuccessRoomSlug(slug);
  const existingRoom = await getRoomBySlug(ctx, normalizedSlug);

  if (existingRoom) {
    throw new ConvexError("Success room slug already exists");
  }

  return normalizedSlug;
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

const getRoomStateByRoomId = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
) =>
  await ctx.db
    .query("successRoomStates")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .unique();

const getResourceStateByRoomResource = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  resourceKey: string,
) =>
  await ctx.db
    .query("successRoomResourceStates")
    .withIndex("by_room_resource_key", (q) =>
      q.eq("roomId", roomId).eq("resourceKey", resourceKey),
    )
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

const activeSortedRows = <Row extends { active: boolean; sortOrder: number }>(
  rows: Row[],
  limit?: number,
) => {
  const sortedRows = rows
    .filter((row) => row.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return limit === undefined ? sortedRows : sortedRows.slice(0, limit);
};

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

const teamMemberSummary = (
  member: Doc<"successRoomTeamMembers">,
  photo?: Doc<"successRoomTeamMemberPhotos">,
) => ({
  id: member._id,
  name: member.name,
  role: member.role,
  ...(photo ? { photo: teamMemberPhotoSummary(photo) } : {}),
});

const replaceBenefitCards = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  cards: SeedBenefitCard[],
  now: number,
) => {
  const existingCards = await ctx.db
    .query("successRoomBenefitCards")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  for (const existingCard of existingCards) {
    await ctx.db.delete(existingCard._id);
  }

  for (const card of cards) {
    await ctx.db.insert("successRoomBenefitCards", {
      roomId,
      key: card.key,
      title: card.title,
      description: card.description,
      sortOrder: card.sortOrder,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }
};

const replacePlanAccordions = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  accordions: SeedPlanAccordion[],
  now: number,
) => {
  const existingAccordions = await ctx.db
    .query("successRoomPlanAccordions")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  for (const existingAccordion of existingAccordions) {
    await ctx.db.delete(existingAccordion._id);
  }

  for (const accordion of accordions) {
    await ctx.db.insert("successRoomPlanAccordions", {
      roomId,
      key: accordion.key,
      title: accordion.title,
      description: accordion.description,
      variant: accordion.variant,
      sortOrder: accordion.sortOrder,
      tasks: accordion.tasks,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }
};

const upsertRoomState = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  updates: RoomStatePatch,
) => {
  const state = await getRoomStateByRoomId(ctx, roomId);
  const now = Date.now();
  const existingBenefits = state?.benefits ?? emptyBenefitsState();
  const nextState = {
    roomId,
    benefits: {
      selectedCardIds:
        updates.benefits?.selectedCardIds ?? existingBenefits.selectedCardIds,
      painPoints: updates.benefits?.painPoints ?? existingBenefits.painPoints,
    },
    plan: updates.plan ?? state?.plan ?? emptyPlanState(),
    createdAt: state?.createdAt ?? now,
    updatedAt: now,
  };

  if (state) {
    await ctx.db.replace(state._id, nextState);
  } else {
    await ctx.db.insert("successRoomStates", nextState);
  }
};

const resetPlanState = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
) => await upsertRoomState(ctx, roomId, { plan: emptyPlanState() });

const replaceMutualSuccessPlanPlan = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  planAccordions: SeedPlanAccordion[],
  now: number,
) => {
  await replacePlanAccordions(ctx, roomId, planAccordions, now);
  await resetPlanState(ctx, roomId);
};

const sanitizeKickoffScheduleState = (
  schedule: KickoffScheduleState,
): KickoffScheduleState => {
  const inputRowsByKey = new Map(schedule.rows.map((row) => [row.key, row]));

  return {
    rows: kickoffScheduleRowKeys.map((key, index) => {
      const inputRow = inputRowsByKey.get(key);
      const cells = Object.fromEntries(
        kickoffScheduleColumnKeys.map((columnKey) => [
          columnKey,
          inputRow?.cells[columnKey] ?? "",
        ]),
      );

      return {
        key,
        sortOrder: index,
        cells,
      };
    }),
  };
};

const initializeKickoffScheduleState = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  now: number,
) => {
  const state = await getResourceStateByRoomResource(ctx, roomId, kickoffScheduleResourceKey);

  if (state) {
    return;
  }

  await ctx.db.insert("successRoomResourceStates", {
    roomId,
    resourceKey: kickoffScheduleResourceKey,
    state: {
      kind: "kickoff-schedule",
      ...emptyKickoffScheduleState(),
    },
    createdAt: now,
    updatedAt: now,
  });
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
  planState: PlanState,
) => {
  return {
    checkedTaskIds: planState.checkedTaskIds,
    dateOverrides: planState.dateOverrides,
    taskAssigneeMemberIds: await sanitizeTaskAssignees(
      ctx,
      roomId,
      planState.taskAssigneeMemberIds,
    ),
  };
};

const getMutualSuccessPlanStateForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
  roomState: Doc<"successRoomStates"> | null,
) => {
  if (!isResourceEnabled(room, mutualSuccessPlanResourceKey)) {
    return undefined;
  }

  return {
    plan: await getPlanForBundle(ctx, room._id, roomState?.plan ?? emptyPlanState()),
  };
};

const getBenefitCardsForBundle = async (
  ctx: QueryCtx,
  roomId: Id<"successRooms">,
) => {
  const benefitCards = await ctx.db
    .query("successRoomBenefitCards")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  return activeSortedRows(benefitCards, maxBenefitCards).map(benefitCardSummary);
};

const sanitizeSelectedBenefitCardIds = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  selectedCardIds: string[],
) => {
  const benefitCards = await ctx.db
    .query("successRoomBenefitCards")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
  const activeCardIds = new Set(
    benefitCards.filter((card) => card.active).map((card) => card.key),
  );

  return uniqueStrings(selectedCardIds).filter((cardId) => activeCardIds.has(cardId));
};

const sanitizePainPoints = (painPoints: string[]) => {
  assertMaxLength(painPoints, maxPainPoints, "Pain points");

  return painPoints;
};

const getMutualSuccessPlanCatalogForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
) => {
  if (!isResourceEnabled(room, mutualSuccessPlanResourceKey)) {
    return {
      planAccordions: [],
    };
  }

  const planAccordions = await ctx.db
    .query("successRoomPlanAccordions")
    .withIndex("by_room", (q) => q.eq("roomId", room._id))
    .collect();

  return {
    planAccordions: activeSortedRows(planAccordions, maxPlanAccordions).map(planAccordionSummary),
  };
};

const getRoomStateForBundle = (
  roomState: Doc<"successRoomStates"> | null,
) => {
  return {
    benefits: roomState?.benefits ?? emptyBenefitsState(),
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

  const resourceState = await getResourceStateByRoomResource(
    ctx,
    room._id,
    initialFormatResourceKey,
  );

  if (resourceState?.state.kind === "editable-text") {
    const editableState = resourceState.state;
    const attachment =
      editableState.attachmentFileId !== undefined
        ? await ctx.db.get(editableState.attachmentFileId)
        : null;
    const activeAttachment =
      attachment &&
      attachment.roomId === room._id &&
      attachment.resourceKey === resourceState.resourceKey &&
      attachment.active
        ? attachment
        : null;

    editableTexts[initialFormatResourceKey] = {
      content: editableState.content,
      dataSources: editableState.dataSources,
      ...(activeAttachment ? { attachment: fileSummary(activeAttachment) } : {}),
    };
  }

  return editableTexts;
};

const getKickoffSchedulesForBundle = async (
  ctx: QueryCtx,
  room: Doc<"successRooms">,
) => {
  const kickoffSchedules: Record<string, KickoffScheduleState> = {};

  if (!isResourceEnabled(room, kickoffScheduleResourceKey)) {
    return kickoffSchedules;
  }

  const resourceState = await getResourceStateByRoomResource(
    ctx,
    room._id,
    kickoffScheduleResourceKey,
  );

  kickoffSchedules[kickoffScheduleResourceKey] =
    resourceState?.state.kind === "kickoff-schedule"
      ? sanitizeKickoffScheduleState(resourceState.state)
      : emptyKickoffScheduleState();

  return kickoffSchedules;
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
  const existingState = await getResourceStateByRoomResource(ctx, args.roomId, args.resourceKey);
  const existingEditableState =
    existingState?.state.kind === "editable-text" ? existingState.state : null;
  const attachmentFileId = args.attachmentFileId ?? existingEditableState?.attachmentFileId;

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
    state: {
      kind: "editable-text" as const,
      content: args.content,
      dataSources: args.dataSources,
      ...(attachmentFileId ? { attachmentFileId } : {}),
    },
    createdAt: existingState?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingState) {
    await ctx.db.replace(existingState._id, nextState);
  } else {
    await ctx.db.insert("successRoomResourceStates", nextState);
  }
};

const upsertKickoffScheduleState = async (
  ctx: MutationCtx,
  args: {
    roomId: Id<"successRooms">;
    schedule: KickoffScheduleState;
  },
) => {
  const now = Date.now();
  const existingState = await getResourceStateByRoomResource(
    ctx,
    args.roomId,
    kickoffScheduleResourceKey,
  );
  const nextState = {
    roomId: args.roomId,
    resourceKey: kickoffScheduleResourceKey,
    state: {
      kind: "kickoff-schedule" as const,
      ...sanitizeKickoffScheduleState(args.schedule),
    },
    createdAt: existingState?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingState) {
    await ctx.db.replace(existingState._id, nextState);
  } else {
    await ctx.db.insert("successRoomResourceStates", nextState);
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

export const validateNewSuccessRoomSlug = query({
  args: {
    slug: v.string(),
    seedSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    const slug = await normalizeNewSuccessRoomSlug(ctx, args.slug);

    return {
      slug,
    };
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

    const roomState = await getRoomStateByRoomId(ctx, room._id);
    const roomStateSummary = getRoomStateForBundle(roomState);
    const mutualSuccessPlanState = await getMutualSuccessPlanStateForBundle(
      ctx,
      room,
      roomState,
    );
    const mutualSuccessPlanCatalog = await getMutualSuccessPlanCatalogForBundle(ctx, room);
    const benefitCards = await getBenefitCardsForBundle(ctx, room._id);
    const editableTexts = await getEditableTextsForBundle(ctx, room);
    const kickoffSchedules = await getKickoffSchedulesForBundle(ctx, room);
    const teamMembers = await ctx.db
      .query("successRoomTeamMembers")
      .withIndex("by_room_active_created_at", (q) =>
        q.eq("roomId", room._id).eq("active", true),
      )
      .collect();
    const teamMemberPhotos = await ctx.db
      .query("successRoomTeamMemberPhotos")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    const teamMemberPhotoByMemberId = new Map(
      teamMemberPhotos
        .filter((photo) => photo.active)
        .map((photo) => [photo.teamMemberId, photo]),
    );

    return {
      room: {
        ...lockedRoom(room),
        team: teamMembers.map((member) =>
          teamMemberSummary(member, teamMemberPhotoByMemberId.get(member._id)),
        ),
        benefitCards,
        mutualSuccessPlanCatalog,
      },
      state: {
        benefits: roomStateSummary.benefits,
        ...(mutualSuccessPlanState ? { mutualSuccessPlan: mutualSuccessPlanState } : {}),
        editableTexts,
        kickoffSchedules,
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

export const patchBenefits = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    benefits: benefitsPatch,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    if (
      args.benefits.selectedCardIds === undefined &&
      args.benefits.painPoints === undefined
    ) {
      throw new ConvexError("Benefits update is required");
    }

    await upsertRoomState(ctx, room._id, {
      benefits: {
        ...(args.benefits.selectedCardIds !== undefined
          ? {
              selectedCardIds: await sanitizeSelectedBenefitCardIds(
                ctx,
                room._id,
                args.benefits.selectedCardIds,
              ),
            }
          : {}),
        ...(args.benefits.painPoints !== undefined
          ? { painPoints: sanitizePainPoints(args.benefits.painPoints) }
          : {}),
      },
    });
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

    const taskAssigneeMemberIds = await sanitizeTaskAssignees(
      ctx,
      room._id,
      args.plan.taskAssigneeMemberIds,
    );

    await upsertRoomState(ctx, room._id, {
      plan: {
        checkedTaskIds: args.plan.checkedTaskIds,
        dateOverrides: args.plan.dateOverrides,
        taskAssigneeMemberIds,
      },
    });
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

export const replaceKickoffSchedule = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: kickoffScheduleResourceSlug,
    schedule: kickoffScheduleSnapshot,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    await upsertKickoffScheduleState(ctx, {
      roomId: room._id,
      schedule: args.schedule,
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

    const editableState = await getResourceStateByRoomResource(
      ctx,
      room._id,
      args.resourceSlug,
    );

    if (!editableState || editableState.state.kind !== "editable-text") {
      return;
    }

    if (editableState.state.attachmentFileId) {
      const attachmentFile = await ctx.db.get(editableState.state.attachmentFileId);

      if (
        !attachmentFile ||
        attachmentFile.roomId !== room._id ||
        attachmentFile.resourceKey !== args.resourceSlug
      ) {
        throw new ConvexError("Editable attachment file is invalid");
      }

      await ctx.db.patch(editableState.state.attachmentFileId, {
        active: false,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.replace(editableState._id, {
      roomId: editableState.roomId,
      resourceKey: editableState.resourceKey,
      state: {
        kind: "editable-text",
        content: editableState.state.content,
        dataSources: editableState.state.dataSources,
      },
      createdAt: editableState.createdAt,
      updatedAt: Date.now(),
    });
  },
});

export const createSuccessRoom = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    prospectName: v.string(),
    password: v.string(),
    deck: fileInput,
    audio: fileInput,
    benefitCards: v.array(seedBenefitCard),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    const slug = await normalizeNewSuccessRoomSlug(ctx, args.slug);

    if (args.benefitCards.length === 0) {
      throw new ConvexError("Benefit cards are required");
    }

    assertMaxLength(args.benefitCards, maxBenefitCards, "Benefit cards");

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
    await replaceBenefitCards(ctx, roomId, args.benefitCards, now);
    await ctx.db.insert("successRoomStates", {
      roomId,
      ...emptyRoomState(),
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

    return {
      roomId,
      deckId,
      audioId,
    };
  },
});

export const nukeSuccessRoomData = mutation({
  args: {
    seedSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    const storageFiles = await ctx.db.system.query("_storage").collect();

    for (const file of storageFiles) {
      await ctx.storage.delete(file._id);
    }

    const deletedRows: Record<string, number> = {};

    for (const tableName of successRoomTableNames) {
      const rows = await ctx.db.query(tableName).collect();

      deletedRows[tableName] = rows.length;

      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    return {
      deletedStorageFiles: storageFiles.length,
      deletedRows,
    };
  },
});

export const enableSuccessRoomSections = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    resourceKeys: v.array(optionalResourceKey),
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
      if (args.planAccordions.length === 0) {
        throw new ConvexError("Mutual success plan content is required");
      }

      assertMaxLength(args.planAccordions, maxPlanAccordions, "Plan accordions");

      for (const accordion of args.planAccordions) {
        assertMaxLength(
          accordion.tasks,
          maxPlanTasksPerAccordion,
          `Plan accordion "${accordion.key}" tasks`,
        );
      }

      await replaceMutualSuccessPlanPlan(
        ctx,
        room._id,
        args.planAccordions,
        now,
      );
    }

    if (requestedResourceKeys.includes(kickoffScheduleResourceKey)) {
      await initializeKickoffScheduleState(ctx, room._id, now);
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
