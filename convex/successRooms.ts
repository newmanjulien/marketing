import { ConvexError, v, type Infer } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { parseSuccessRoomSlug } from "../shared/successRoomSlugs";
import { maxCustomBenefitLength } from "../shared/successRoomBenefits";
import { maxSuccessRoomDocumentRequestDescriptionLength } from "../shared/successRoomDocumentRequests";
import { applySuccessRoomPlanAction } from "../shared/successRoomPlan";
import {
  audioResourceDefinition,
  audioResourceKey,
  deckResourceDefinition,
  deckResourceKey,
  initialFormatResourceDefinition,
  initialFormatResourceKey,
  kickoffScheduleColumns,
  kickoffScheduleResourceDefinition,
  kickoffScheduleResourceKey,
  kickoffScheduleRowKeys,
  mutualSuccessPlanResourceDefinition,
  mutualSuccessPlanResourceKey,
  successRoomDescription,
  successRoomResourceDefinitions,
} from "../shared/successRoomResources";

type SuccessRoom = Doc<"successRooms">;
type SuccessRoomFile = Doc<"successRoomFiles">;
type SuccessRoomResourceKey = SuccessRoom["enabledResourceKeys"][number];
type AssetSuccessRoomResourceKey = Extract<
  SuccessRoomResourceKey,
  typeof deckResourceKey | typeof audioResourceKey
>;
type FileKind = SuccessRoomFile["kind"];
type RoomState = SuccessRoom["state"];
type BenefitsState = RoomState["benefits"];
type PlanState = RoomState["plan"];
type EditableTextState = RoomState["editableText"];
type KickoffScheduleState = RoomState["kickoffSchedule"];
type TeamMember = SuccessRoom["teamMembers"][number];

const maxBenefitCards = 10;
const maxPainPoints = 3;
const maxPlanAccordions = 10;
const maxPlanTasksPerAccordion = 10;
const kickoffScheduleColumnKeys = new Set<string>(
  kickoffScheduleColumns.map((column) => column.key),
);
const baseResourceKeys = [deckResourceKey, audioResourceKey] as const;
const allResourceKeys: SuccessRoomResourceKey[] = successRoomResourceDefinitions.map(
  ({ slug }) => slug,
);

const optionalResourceKey = v.union(
  v.literal(mutualSuccessPlanResourceKey),
  v.literal(initialFormatResourceKey),
  v.literal(kickoffScheduleResourceKey),
);
type OptionalSuccessRoomResourceKey = Infer<typeof optionalResourceKey>;
const assetResourceKey = v.union(v.literal(deckResourceKey), v.literal(audioResourceKey));
const editableTextResourceKey = v.literal(initialFormatResourceKey);
const kickoffScheduleResourceSlug = v.literal(kickoffScheduleResourceKey);

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
type SeedBenefitCard = Infer<typeof seedBenefitCard>;
type SeedPlanAccordion = Infer<typeof seedPlanAccordion>;

const fileInput = v.object({
  storageId: v.id("_storage"),
  filename: v.string(),
  contentType: v.string(),
  byteSize: v.number(),
});

const planAction = v.union(
  v.object({
    type: v.literal("open-accordion"),
    accordionKey: v.string(),
  }),
  v.object({
    type: v.literal("set-task-checked"),
    taskKey: v.string(),
    checked: v.boolean(),
  }),
  v.object({
    type: v.literal("set-task-assignee"),
    taskKey: v.string(),
    memberKey: v.union(v.string(), v.null()),
  }),
  v.object({
    type: v.literal("set-task-date"),
    taskKey: v.string(),
    date: v.string(),
  }),
);

const kickoffScheduleSnapshot = v.object({
  rows: v.array(
    v.object({
      key: v.string(),
      sortOrder: v.number(),
      cells: v.record(v.string(), v.string()),
    }),
  ),
});

const documentRequestNotificationStatus = v.union(
  v.literal("sent"),
  v.literal("failed"),
);

const benefitsPatch = v.object({
  selectedCardKeys: v.optional(v.array(v.string())),
  selectedCustomBenefit: v.optional(v.union(v.string(), v.null())),
  painPoints: v.optional(v.array(v.string())),
});

const emptyBenefitsState = (): BenefitsState => ({
  selectedCardKeys: [],
  selectedCustomBenefit: null,
  painPoints: [],
});

const emptyPlanState = (): PlanState => ({
  lastOpenedAccordionKey: null,
  checkedTaskKeys: [],
  dateOverridesByTaskKey: {},
  assigneeKeyByTaskKey: {},
});

const emptyEditableTextState = (): EditableTextState => ({
  content: "",
  dataSources: [],
});

const emptyKickoffScheduleState = (): KickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key, index) => ({
    key,
    sortOrder: index,
    cells: {},
  })),
});

const emptyRoomState = (): RoomState => ({
  benefits: emptyBenefitsState(),
  plan: emptyPlanState(),
  editableText: emptyEditableTextState(),
  kickoffSchedule: emptyKickoffScheduleState(),
});

const hashPassword = async (password: string) => {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getAccessToken = async (room: SuccessRoom) =>
  await hashPassword(`${room.slug}:${room.passwordHash}:${room.passwordUpdatedAt}:success-room`);

const assertAccess = async (room: SuccessRoom, accessToken: string) => {
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

const assertNotEmpty = (items: unknown[], label: string) => {
  if (items.length === 0) {
    throw new ConvexError(`${label} must include at least one item`);
  }
};

const assertUniqueKeys = (items: Array<{ key: string }>, label: string) => {
  const keys = new Set<string>();

  for (const item of items) {
    if (keys.has(item.key)) {
      throw new ConvexError(`${label} keys must be unique`);
    }

    keys.add(item.key);
  }
};

const normalizeSlug = (slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    throw new ConvexError("Success room slug is invalid");
  }

  return parsedSlug;
};

const hasResource = (room: SuccessRoom, resourceKey: SuccessRoomResourceKey) =>
  room.enabledResourceKeys.includes(resourceKey);

const assertResourceEnabled = (room: SuccessRoom, resourceKey: SuccessRoomResourceKey) => {
  if (!hasResource(room, resourceKey)) {
    throw new ConvexError("Success room resource is not enabled");
  }
};

const roomBySlug = async (ctx: QueryCtx | MutationCtx, slug: string) =>
  await ctx.db
    .query("successRooms")
    .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(slug)))
    .unique();

const requireRoom = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const room = await roomBySlug(ctx, slug);

  if (!room || room.archived) {
    throw new ConvexError("Success room not found");
  }

  return room;
};

const requireAuthorizedRoom = async (
  ctx: QueryCtx | MutationCtx,
  slug: string,
  accessToken: string,
) => {
  const room = await requireRoom(ctx, slug);

  await assertAccess(room, accessToken);
  return room;
};

const createKey = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

const sortActiveItems = <Item extends { active: boolean; sortOrder: number }>(items: Item[]) =>
  items.filter((item) => item.active).sort((left, right) => left.sortOrder - right.sortOrder);

const sortActiveTeamMembers = (members: TeamMember[]) =>
  members
    .filter((member) => member.active)
    .sort((left, right) => left.createdAt - right.createdAt);

const uniqueItems = <Item>(items: Item[]) => [...new Set(items)];

const sanitizeSeedBenefitCards = (cards: SeedBenefitCard[], now: number) => {
  assertNotEmpty(cards, "Benefit cards");
  assertMaxLength(cards, maxBenefitCards, "Benefit cards");
  assertUniqueKeys(cards, "Benefit card");

  return cards
    .map((card) => ({
      key: card.key,
      title: card.title,
      description: card.description,
      sortOrder: card.sortOrder,
      active: true,
      createdAt: now,
      updatedAt: now,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

const sanitizeSeedPlanAccordions = (accordions: SeedPlanAccordion[], now: number) => {
  assertNotEmpty(accordions, "Plan accordions");
  assertMaxLength(accordions, maxPlanAccordions, "Plan accordions");
  assertUniqueKeys(accordions, "Plan accordion");

  const taskKeys = new Set<string>();

  return accordions
    .map((accordion) => {
      assertMaxLength(accordion.tasks, maxPlanTasksPerAccordion, "Plan accordion tasks");

      for (const task of accordion.tasks) {
        if (taskKeys.has(task.key)) {
          throw new ConvexError("Plan task keys must be unique");
        }

        taskKeys.add(task.key);
      }

      return {
        key: accordion.key,
        title: accordion.title,
        description: accordion.description,
        variant: accordion.variant,
        sortOrder: accordion.sortOrder,
        tasks: accordion.tasks,
        active: true,
        createdAt: now,
        updatedAt: now,
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

const activeBenefitKeys = (room: SuccessRoom) =>
  new Set(sortActiveItems(room.benefitCards).map((card) => card.key));

const activePlanTaskKeys = (room: SuccessRoom) =>
  new Set(
    sortActiveItems(room.planAccordions).flatMap((accordion) =>
      accordion.tasks.map((task) => task.key),
    ),
  );

const activePlanAccordionKeys = (room: SuccessRoom) =>
  new Set(sortActiveItems(room.planAccordions).map((accordion) => accordion.key));

const activeTeamMemberKeys = (room: SuccessRoom) =>
  new Set(sortActiveTeamMembers(room.teamMembers).map((member) => member.key));

const sanitizeBenefitsState = (room: SuccessRoom, state: BenefitsState): BenefitsState => {
  const validCardKeys = activeBenefitKeys(room);
  const selectedCustomBenefit = state.selectedCustomBenefit?.trim() || null;

  if (selectedCustomBenefit && selectedCustomBenefit.length > maxCustomBenefitLength) {
    throw new ConvexError(
      `Custom benefit must include ${maxCustomBenefitLength} characters or fewer`,
    );
  }

  return {
    selectedCardKeys: uniqueItems(state.selectedCardKeys).filter((id) => validCardKeys.has(id)),
    selectedCustomBenefit,
    painPoints: state.painPoints
      .map((painPoint) => painPoint.trim())
      .filter(Boolean)
      .slice(0, maxPainPoints),
  };
};

const sanitizeDocumentRequestDescription = (value: string) => {
  const description = value.trim();

  if (!description) {
    throw new ConvexError("Document request description is required");
  }

  if (description.length > maxSuccessRoomDocumentRequestDescriptionLength) {
    throw new ConvexError(
      `Document request description must include ${maxSuccessRoomDocumentRequestDescriptionLength} characters or fewer`,
    );
  }

  return description;
};

const sanitizePlanState = (
  room: SuccessRoom,
  state: PlanState,
): PlanState => {
  const validAccordionKeys = activePlanAccordionKeys(room);
  const validTaskKeys = activePlanTaskKeys(room);
  const validMemberKeys = activeTeamMemberKeys(room);
  const lastOpenedAccordionKey = state.lastOpenedAccordionKey;

  return {
    lastOpenedAccordionKey:
      lastOpenedAccordionKey && validAccordionKeys.has(lastOpenedAccordionKey)
        ? lastOpenedAccordionKey
        : null,
    checkedTaskKeys: uniqueItems(state.checkedTaskKeys).filter((key) => validTaskKeys.has(key)),
    dateOverridesByTaskKey: Object.fromEntries(
      Object.entries(state.dateOverridesByTaskKey).filter(([taskKey]) => validTaskKeys.has(taskKey)),
    ),
    assigneeKeyByTaskKey: Object.fromEntries(
      Object.entries(state.assigneeKeyByTaskKey).filter(
        ([taskKey, memberKey]) => validTaskKeys.has(taskKey) && validMemberKeys.has(memberKey),
      ),
    ),
  };
};

const sanitizeKickoffScheduleState = (state: KickoffScheduleState): KickoffScheduleState => ({
  rows: state.rows
    .map((row) => ({
      key: row.key,
      sortOrder: row.sortOrder,
      cells: Object.fromEntries(
        Object.entries(row.cells).filter(([columnKey]) =>
          kickoffScheduleColumnKeys.has(columnKey),
        ),
      ),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder),
});

const patchRoomState = async (ctx: MutationCtx, room: SuccessRoom, state: RoomState) => {
  await ctx.db.patch(room._id, {
    state,
    updatedAt: Date.now(),
  });
};

const insertFile = async (
  ctx: MutationCtx,
  {
    roomId,
    kind,
    resourceKey,
    ownerKey,
    file,
    key = createKey(kind),
    now,
  }: {
    roomId: Id<"successRooms">;
    kind: FileKind;
    resourceKey?: string;
    ownerKey?: string;
    file: Infer<typeof fileInput>;
    key?: string;
    now: number;
  },
) =>
  await ctx.db.insert("successRoomFiles", {
    roomId,
    key,
    kind,
    resourceKey,
    ownerKey,
    storageId: file.storageId,
    filename: file.filename,
    contentType: file.contentType,
    byteSize: file.byteSize,
    active: true,
    createdAt: now,
    updatedAt: now,
  });

const activeFilesByKind = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  kind: FileKind,
) =>
  await ctx.db
    .query("successRoomFiles")
    .withIndex("by_room_kind_active", (q) =>
      q.eq("roomId", roomId).eq("kind", kind).eq("active", true),
    )
    .collect();

const activeFileByKind = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  kind: AssetSuccessRoomResourceKey,
) => (await activeFilesByKind(ctx, roomId, kind))[0] ?? null;

const fileByKey = async (ctx: QueryCtx | MutationCtx, roomId: Id<"successRooms">, key: string) =>
  await ctx.db
    .query("successRoomFiles")
    .withIndex("by_room_key", (q) => q.eq("roomId", roomId).eq("key", key))
    .unique();

const activeFileByKey = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  key?: string,
) => {
  if (!key) {
    return null;
  }

  const file = await fileByKey(ctx, roomId, key);
  return file?.active ? file : null;
};

const deactivateFile = async (ctx: MutationCtx, file: SuccessRoomFile) => {
  await ctx.db.patch(file._id, {
    active: false,
    updatedAt: Date.now(),
  });
};

const deactivateActiveFiles = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  predicate: (file: SuccessRoomFile) => boolean,
) => {
  for (const file of await ctx.db
    .query("successRoomFiles")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect()) {
    if (file.active && predicate(file)) {
      await deactivateFile(ctx, file);
    }
  }
};

const linkedFileSummary = async (ctx: QueryCtx | MutationCtx, file: SuccessRoomFile) => {
  const url = await ctx.storage.getUrl(file.storageId);

  if (!url) {
    throw new ConvexError("Success room file is unavailable");
  }

  return {
    fileId: file.key,
    filename: file.filename,
    contentType: file.contentType,
    byteSize: file.byteSize,
    url,
  };
};

const linkedTeamMemberPhotoSummary = async (ctx: QueryCtx | MutationCtx, file: SuccessRoomFile) => {
  const summary = await linkedFileSummary(ctx, file);

  return {
    photoId: summary.fileId,
    filename: summary.filename,
    contentType: summary.contentType,
    byteSize: summary.byteSize,
    url: summary.url,
  };
};

const baseRoom = (room: SuccessRoom) => ({
  slug: room.slug,
  prospectName: room.prospectName,
  description: successRoomDescription,
});

const benefitCardSummary = (card: SuccessRoom["benefitCards"][number]) => ({
  key: card.key,
  title: card.title,
  description: card.description,
});

const planAccordionSummary = (accordion: SuccessRoom["planAccordions"][number]) => ({
  key: accordion.key,
  title: accordion.title,
  description: accordion.description,
  variant: accordion.variant,
  tasks: accordion.tasks.map((task) => ({
    key: task.key,
    title: task.title,
    date: task.dateLabel,
  })),
});

const teamMemberSummary = async (
  ctx: QueryCtx | MutationCtx,
  room: SuccessRoom,
  member: TeamMember,
) => {
  const photo = await activeFileByKey(ctx, room._id, member.photoFileKey);
  const linkedPhoto = photo ? await linkedTeamMemberPhotoSummary(ctx, photo) : null;

  return {
    key: member.key,
    name: member.name,
    role: member.role,
    imageHref: linkedPhoto?.url ?? "",
    ...(linkedPhoto
      ? {
          photo: {
            photoId: linkedPhoto.photoId,
            filename: linkedPhoto.filename,
            contentType: linkedPhoto.contentType,
            byteSize: linkedPhoto.byteSize,
            href: linkedPhoto.url,
          },
        }
      : {}),
  };
};

const activeTeamSummaries = async (ctx: QueryCtx | MutationCtx, room: SuccessRoom) =>
  await Promise.all(
    sortActiveTeamMembers(room.teamMembers).map((member) => teamMemberSummary(ctx, room, member)),
  );

const assetResourceSummary = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceKey: AssetSuccessRoomResourceKey,
) => {
  const file = await activeFileByKind(ctx, room._id, resourceKey);

  if (!file) {
    return null;
  }

  const definition =
    resourceKey === deckResourceKey ? deckResourceDefinition : audioResourceDefinition;

  return {
    ...definition,
    delivery: { type: "asset" as const },
  };
};

const assetResourceResolution = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceKey: AssetSuccessRoomResourceKey,
) => {
  if (!hasResource(room, resourceKey)) {
    return { status: "missing" as const };
  }

  const file = await activeFileByKind(ctx, room._id, resourceKey);

  if (!file) {
    return { status: "missing" as const };
  }

  const href = await ctx.storage.getUrl(file.storageId);

  if (!href) {
    return { status: "missing" as const };
  }

  return {
    status: "available" as const,
    href,
  };
};

const routedResourceSummary = (resourceKey: OptionalSuccessRoomResourceKey) => {
  if (resourceKey === mutualSuccessPlanResourceKey) {
    return {
      ...mutualSuccessPlanResourceDefinition,
      delivery: { type: "route" as const },
    };
  }

  if (resourceKey === initialFormatResourceKey) {
    return {
      ...initialFormatResourceDefinition,
      delivery: { type: "route" as const },
    };
  }

  return {
    ...kickoffScheduleResourceDefinition,
    delivery: { type: "route" as const },
  };
};

const landingResource = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceKey: SuccessRoomResourceKey,
) => {
  if (!hasResource(room, resourceKey)) {
    return null;
  }

  if (resourceKey === deckResourceKey || resourceKey === audioResourceKey) {
    return await assetResourceSummary(ctx, room, resourceKey);
  }

  return routedResourceSummary(resourceKey);
};

const landingResources = async (ctx: QueryCtx, room: SuccessRoom) => {
  const resources = await Promise.all(
    successRoomResourceDefinitions.map((resource) =>
      landingResource(ctx, room, resource.slug as SuccessRoomResourceKey),
    ),
  );

  return resources.filter((resource) => resource !== null);
};

const publicLandingPayload = async (ctx: QueryCtx, room: SuccessRoom) => ({
  locked: false as const,
  room: {
    ...baseRoom(room),
    benefitCards: sortActiveItems(room.benefitCards).map(benefitCardSummary),
    team: await activeTeamSummaries(ctx, room),
    resources: await landingResources(ctx, room),
  },
  state: {
    benefits: sanitizeBenefitsState(room, room.state.benefits),
  },
});

const publicResourcePayload = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceSlug: OptionalSuccessRoomResourceKey,
) => {
  assertResourceEnabled(room, resourceSlug);

  const basePayload = {
    locked: false as const,
    room: baseRoom(room),
  };

  if (resourceSlug === mutualSuccessPlanResourceKey) {
    const plan = sanitizePlanState(room, room.state.plan);

    return {
      ...basePayload,
      resource: {
        ...mutualSuccessPlanResourceDefinition,
        catalog: {
          planAccordions: sortActiveItems(room.planAccordions).map(planAccordionSummary),
          team: await activeTeamSummaries(ctx, room),
        },
        delivery: { type: "route" as const },
      },
      state: {
        kind: mutualSuccessPlanResourceKey as typeof mutualSuccessPlanResourceKey,
        plan: {
          lastOpenedAccordionKey: plan.lastOpenedAccordionKey,
          checkedTaskKeys: plan.checkedTaskKeys,
          dateOverridesByTaskKey: plan.dateOverridesByTaskKey,
          assigneeKeyByTaskKey: plan.assigneeKeyByTaskKey,
        },
      },
    };
  }

  if (resourceSlug === initialFormatResourceKey) {
    const attachment = await activeFileByKey(
      ctx,
      room._id,
      room.state.editableText.attachmentFileKey,
    );
    const linkedAttachment = attachment ? await linkedFileSummary(ctx, attachment) : null;

    return {
      ...basePayload,
      resource: {
        ...initialFormatResourceDefinition,
        delivery: { type: "route" as const },
      },
      state: {
        kind: "editable-text" as const,
        editableText: {
          content: room.state.editableText.content,
          dataSources: room.state.editableText.dataSources,
          ...(linkedAttachment
            ? {
                attachment: {
                  fileId: linkedAttachment.fileId,
                  filename: linkedAttachment.filename,
                  contentType: linkedAttachment.contentType,
                  byteSize: linkedAttachment.byteSize,
                  href: linkedAttachment.url,
                },
              }
            : {}),
        },
      },
    };
  }

  return {
    ...basePayload,
    resource: {
      ...kickoffScheduleResourceDefinition,
      delivery: { type: "route" as const },
    },
    state: {
      kind: "kickoff-schedule" as const,
      kickoffSchedule: sanitizeKickoffScheduleState(room.state.kickoffSchedule),
    },
  };
};

export const generateUploadUrl = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedRoom(ctx, args.slug, args.accessToken);

    return await ctx.storage.generateUploadUrl();
  },
});

export const generateSeedUploadUrl = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    normalizeSlug(args.slug);

    return await ctx.storage.generateUploadUrl();
  },
});

export const validateNewSuccessRoomSlug = query({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    const slug = normalizeSlug(args.slug);
    const existingRoom = await roomBySlug(ctx, slug);

    if (existingRoom) {
      throw new ConvexError("Success room slug already exists");
    }

    return { slug };
  },
});

export const verifyPassword = mutation({
  args: {
    slug: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await requireRoom(ctx, args.slug);
    const passwordHash = await hashPassword(args.password);

    return passwordHash === room.passwordHash ? await getAccessToken(room) : null;
  },
});

export const getPublicRoom = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await roomBySlug(ctx, args.slug);

    if (!room || room.archived) {
      return null;
    }

    return baseRoom(room);
  },
});

export const getLandingPage = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);

    return await publicLandingPayload(ctx, room);
  },
});

export const getBasePage = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);

    return {
      locked: false as const,
      room: baseRoom(room),
    };
  },
});

export const resolveAssetResource = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: assetResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);

    return await assetResourceResolution(ctx, room, args.resourceSlug);
  },
});

export const getRoutedResourcePage = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: optionalResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);

    return await publicResourcePayload(ctx, room, args.resourceSlug);
  },
});

export const createDocumentRequest = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    const description = sanitizeDocumentRequestDescription(args.description);
    const now = Date.now();
    const requestId = await ctx.db.insert("successRoomDocumentRequests", {
      roomId: room._id,
      description,
      notificationStatus: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return {
      requestId,
      description,
      room: {
        roomId: room._id,
        slug: room.slug,
        prospectName: room.prospectName,
      },
      createdAt: now,
    };
  },
});

export const markDocumentRequestNotification = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    requestId: v.id("successRoomDocumentRequests"),
    notificationStatus: documentRequestNotificationStatus,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    const documentRequest = await ctx.db.get(args.requestId);

    if (!documentRequest || documentRequest.roomId !== room._id) {
      throw new ConvexError("Document request not found");
    }

    if (
      documentRequest.notificationStatus !== "pending" &&
      documentRequest.notificationStatus !== args.notificationStatus
    ) {
      throw new ConvexError("Document request notification status is already final");
    }

    if (
      documentRequest.notificationStatus === args.notificationStatus &&
      documentRequest.notificationAttemptedAt !== undefined
    ) {
      return {
        notificationStatus: documentRequest.notificationStatus,
        notificationAttemptedAt: documentRequest.notificationAttemptedAt,
      };
    }

    const now = Date.now();
    await ctx.db.patch(documentRequest._id, {
      notificationStatus: args.notificationStatus,
      notificationAttemptedAt: now,
      updatedAt: now,
    });

    return {
      notificationStatus: args.notificationStatus,
      notificationAttemptedAt: now,
    };
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
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    const name = args.name.trim();
    const role = args.role.trim();

    if (!name || !role) {
      throw new ConvexError("Team member name and role are required");
    }

    if (!args.photo.contentType.startsWith("image/")) {
      throw new ConvexError("Team member photo must be an image");
    }

    const now = Date.now();
    const memberKey = createKey("team-member");
    const photoFileKey = createKey("team-member-photo");
    await insertFile(ctx, {
      roomId: room._id,
      kind: "team-member-photo",
      ownerKey: memberKey,
      key: photoFileKey,
      file: args.photo,
      now,
    });

    const member: TeamMember = {
      key: memberKey,
      name,
      role,
      photoFileKey,
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    await ctx.db.patch(room._id, {
      teamMembers: [...room.teamMembers, member],
      updatedAt: now,
    });

    return await teamMemberSummary(ctx, room, member);
  },
});

export const patchBenefits = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    benefits: benefitsPatch,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    const selectedCustomBenefit =
      args.benefits.selectedCustomBenefit === undefined
        ? room.state.benefits.selectedCustomBenefit
        : args.benefits.selectedCustomBenefit;
    const nextBenefits = sanitizeBenefitsState(room, {
      selectedCardKeys: args.benefits.selectedCardKeys ?? room.state.benefits.selectedCardKeys,
      selectedCustomBenefit,
      painPoints: args.benefits.painPoints ?? room.state.benefits.painPoints,
    });

    await patchRoomState(ctx, room, {
      ...room.state,
      benefits: nextBenefits,
    });
  },
});

export const applyPlanAction = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    action: planAction,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    assertResourceEnabled(room, mutualSuccessPlanResourceKey);
    const nextPlan = applySuccessRoomPlanAction(room.state.plan, args.action);

    await patchRoomState(ctx, room, {
      ...room.state,
      plan: sanitizePlanState(room, nextPlan),
    });
  },
});

export const patchEditableText = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
    editableText: v.object({
      content: v.string(),
      dataSources: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    await patchRoomState(ctx, room, {
      ...room.state,
      editableText: {
        content: args.editableText.content,
        dataSources: args.editableText.dataSources,
        attachmentFileKey: room.state.editableText.attachmentFileKey,
      },
    });
  },
});

export const replaceKickoffSchedule = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: kickoffScheduleResourceSlug,
    kickoffSchedule: kickoffScheduleSnapshot,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    await patchRoomState(ctx, room, {
      ...room.state,
      kickoffSchedule: sanitizeKickoffScheduleState(args.kickoffSchedule),
    });
  },
});

export const registerEditableAttachment = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
    file: fileInput,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    await deactivateActiveFiles(
      ctx,
      room._id,
      (file) => file.kind === "editable-attachment" && file.resourceKey === args.resourceSlug,
    );

    const now = Date.now();
    const fileKey = createKey("editable-attachment");
    await insertFile(ctx, {
      roomId: room._id,
      kind: "editable-attachment",
      resourceKey: args.resourceSlug,
      key: fileKey,
      file: args.file,
      now,
    });

    await patchRoomState(ctx, room, {
      ...room.state,
      editableText: {
        ...room.state.editableText,
        attachmentFileKey: fileKey,
      },
    });

    const file = await activeFileByKey(ctx, room._id, fileKey);

    if (!file) {
      throw new ConvexError("Success room attachment could not be saved");
    }

    return await linkedFileSummary(ctx, file);
  },
});

export const removeEditableAttachment = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: editableTextResourceKey,
  },
  handler: async (ctx, args) => {
    const room = await requireAuthorizedRoom(ctx, args.slug, args.accessToken);
    assertResourceEnabled(room, args.resourceSlug);

    const file = await activeFileByKey(ctx, room._id, room.state.editableText.attachmentFileKey);

    if (file && file.kind === "editable-attachment" && file.resourceKey === args.resourceSlug) {
      await deactivateFile(ctx, file);
    }

    const { attachmentFileKey: _attachmentFileKey, ...editableText } = room.state.editableText;

    await patchRoomState(ctx, room, {
      ...room.state,
      editableText,
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

    const slug = normalizeSlug(args.slug);
    const existingRoom = await roomBySlug(ctx, slug);

    if (existingRoom) {
      throw new ConvexError("Success room slug already exists");
    }

    const now = Date.now();
    const roomId = await ctx.db.insert("successRooms", {
      slug,
      prospectName: args.prospectName,
      enabledResourceKeys: [...baseResourceKeys],
      passwordHash: await hashPassword(args.password),
      passwordUpdatedAt: now,
      benefitCards: sanitizeSeedBenefitCards(args.benefitCards, now),
      planAccordions: [],
      teamMembers: [],
      state: emptyRoomState(),
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    await insertFile(ctx, {
      roomId,
      kind: "deck",
      resourceKey: deckResourceKey,
      key: deckResourceKey,
      file: args.deck,
      now,
    });
    await insertFile(ctx, {
      roomId,
      kind: "audio",
      resourceKey: audioResourceKey,
      key: audioResourceKey,
      file: args.audio,
      now,
    });

    return { slug, roomId };
  },
});

export const replaceSuccessRoomBenefitCards = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    benefitCards: v.array(seedBenefitCard),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    const room = await requireRoom(ctx, args.slug);
    const now = Date.now();

    await ctx.db.patch(room._id, {
      benefitCards: sanitizeSeedBenefitCards(args.benefitCards, now),
      updatedAt: now,
    });
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

    const successRoomFiles = await ctx.db.query("successRoomFiles").collect();

    for (const file of successRoomFiles) {
      await ctx.db.delete(file._id);
    }

    const successRoomDocumentRequests = await ctx.db
      .query("successRoomDocumentRequests")
      .collect();

    for (const documentRequest of successRoomDocumentRequests) {
      await ctx.db.delete(documentRequest._id);
    }

    const rooms = await ctx.db.query("successRooms").collect();

    for (const room of rooms) {
      await ctx.db.delete(room._id);
    }

    return {
      deletedStorageFiles: storageFiles.length,
      deletedRows: {
        successRoomDocumentRequests: successRoomDocumentRequests.length,
        successRoomFiles: successRoomFiles.length,
        successRooms: rooms.length,
      },
    };
  },
});

export const enableSuccessRoomSections = mutation({
  args: {
    seedSecret: v.string(),
    slug: v.string(),
    resourceKeys: v.array(optionalResourceKey),
    planAccordions: v.optional(v.array(seedPlanAccordion)),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);
    assertNotEmpty(args.resourceKeys, "Success room sections");

    const room = await requireRoom(ctx, args.slug);
    const now = Date.now();
    const requestedResourceKeys = [...new Set<OptionalSuccessRoomResourceKey>(args.resourceKeys)];
    const enabledResourceKeys = Array.from(
      new Set<SuccessRoomResourceKey>([...room.enabledResourceKeys, ...requestedResourceKeys]),
    ).sort((left, right) => allResourceKeys.indexOf(left) - allResourceKeys.indexOf(right));
    const nextState: RoomState = {
      ...room.state,
    };
    let planAccordions = room.planAccordions;

    if (requestedResourceKeys.includes(mutualSuccessPlanResourceKey)) {
      planAccordions = sanitizeSeedPlanAccordions(args.planAccordions ?? [], now);
      nextState.plan = emptyPlanState();
    }

    if (requestedResourceKeys.includes(kickoffScheduleResourceKey)) {
      nextState.kickoffSchedule = emptyKickoffScheduleState();
    }

    if (requestedResourceKeys.includes(initialFormatResourceKey)) {
      nextState.editableText = room.state.editableText ?? emptyEditableTextState();
    }

    await ctx.db.patch(room._id, {
      enabledResourceKeys,
      planAccordions,
      state: nextState,
      updatedAt: now,
    });

    return { enabledResourceKeys };
  },
});
