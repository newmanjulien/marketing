import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

const seedResource = v.object({
  slug: v.string(),
  kind: v.union(
    v.literal("downloadable-file"),
    v.literal("mutual-success-plan"),
    v.literal("editable-text"),
  ),
  title: v.string(),
  actionLabel: v.string(),
  description: v.optional(v.string()),
  sortOrder: v.number(),
  editorRows: v.optional(v.number()),
  initialText: v.optional(v.string()),
});

const fileInput = v.object({
  storageId: v.id("_storage"),
  filename: v.string(),
  contentType: v.string(),
  byteSize: v.number(),
});

const globalFileKey = v.literal("julien-newman-photo");
const julienPhotoGlobalFileKey = "julien-newman-photo";

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

const getStateByRoomId = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
) =>
  await ctx.db
    .query("successRoomStates")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .unique();

const getActiveGlobalFile = async (ctx: QueryCtx | MutationCtx, key: string) => {
  const files = await ctx.db
    .query("successRoomGlobalFiles")
    .withIndex("by_key", (q) => q.eq("key", key))
    .collect();

  return files.find((file) => file.active) ?? null;
};

const getActiveResourceBySlug = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  resourceSlug: string,
) => {
  const resource = await ctx.db
    .query("successRoomResources")
    .withIndex("by_room_slug", (q) => q.eq("roomId", roomId).eq("slug", resourceSlug))
    .unique();

  return resource?.active ? resource : null;
};

const getActiveResourceFile = async (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  resourceId: Id<"successRoomResources">,
  purpose: "primary-resource-file" | "editable-attachment",
) => {
  const files = await ctx.db
    .query("successRoomFiles")
    .withIndex("by_room_resource_purpose", (q) =>
      q.eq("roomId", roomId).eq("resourceId", resourceId).eq("purpose", purpose),
    )
    .collect();

  return files.find((file) => file.active) ?? null;
};

const fileSummary = (file: Doc<"successRoomFiles">) => ({
  fileId: file._id,
  filename: file.filename,
  contentType: file.contentType,
  byteSize: file.byteSize,
});

const globalFileSummary = (file: Doc<"successRoomGlobalFiles">) => ({
  globalFileId: file._id,
  key: file.key,
  filename: file.filename,
  contentType: file.contentType,
  byteSize: file.byteSize,
});

const resourceSummary = (resource: Doc<"successRoomResources">) => ({
  resourceId: resource._id,
  slug: resource.slug,
  kind: resource.kind,
  title: resource.title,
  actionLabel: resource.actionLabel,
  description: resource.description,
  sortOrder: resource.sortOrder,
  editorRows: resource.editorRows,
  initialText: resource.initialText,
});

const visitorTeamMemberSummary = (member: Doc<"successRoomTeamMembers">) => ({
  id: member._id,
  name: member.name,
  role: member.role,
  ...(member.email ? { email: member.email } : {}),
});

const lockedRoom = (room: Doc<"successRooms">) => ({
  slug: room.slug,
  prospectName: room.prospectName,
  description: room.description,
});

const buildStatePatch = (
  state: Doc<"successRoomStates">,
  update: {
    questions?: Record<string, string>;
    plan?: {
      checkedTaskIds: string[];
      dateOverrides: Record<string, string>;
    };
    updatedAt: number;
  },
) => ({
  roomId: state.roomId,
  questions: update.questions ?? state.questions,
  ...(update.plan ?? state.plan
    ? {
        plan: update.plan ?? state.plan,
      }
    : {}),
  createdAt: state.createdAt,
  updatedAt: update.updatedAt,
});

const upsertEditableTextState = async (
  ctx: MutationCtx,
  args: {
    roomId: Id<"successRooms">;
    resourceId: Id<"successRoomResources">;
    content: string;
    dataSources: string[];
    attachmentFileId?: Id<"successRoomFiles">;
  },
) => {
  const now = Date.now();
  const existingState = await ctx.db
    .query("successRoomEditableTextStates")
    .withIndex("by_room_resource", (q) =>
      q.eq("roomId", args.roomId).eq("resourceId", args.resourceId),
    )
    .unique();
  const attachmentFileId = args.attachmentFileId ?? existingState?.attachmentFileId;

  if (attachmentFileId) {
    const attachmentFile = await ctx.db.get(attachmentFileId);

    if (
      !attachmentFile ||
      attachmentFile.roomId !== args.roomId ||
      attachmentFile.resourceId !== args.resourceId ||
      attachmentFile.purpose !== "editable-attachment" ||
      !attachmentFile.active
    ) {
      throw new ConvexError("Editable attachment file is invalid");
    }
  }

  const nextState = {
    roomId: args.roomId,
    resourceId: args.resourceId,
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

    const existingRoom = await getRoomBySlug(ctx, args.slug);

    if (existingRoom) {
      throw new ConvexError("Success room already exists");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const generateGlobalSeedUploadUrl = mutation({
  args: {
    seedSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    return await ctx.storage.generateUploadUrl();
  },
});

export const seedGlobalFile = mutation({
  args: {
    seedSecret: v.string(),
    key: globalFileKey,
    file: fileInput,
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    const now = Date.now();
    const existing = await ctx.db
      .query("successRoomGlobalFiles")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .collect();

    await Promise.all(
      existing
        .filter((file) => file.active)
        .map((file) =>
          ctx.db.patch(file._id, {
            active: false,
            updatedAt: now,
          }),
        ),
    );

    const globalFileId = await ctx.db.insert("successRoomGlobalFiles", {
      key: args.key,
      storageId: args.file.storageId,
      filename: args.file.filename,
      contentType: args.file.contentType,
      byteSize: args.file.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return {
      globalFileId,
      filename: args.file.filename,
      contentType: args.file.contentType,
      byteSize: args.file.byteSize,
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

    const state = await getStateByRoomId(ctx, room._id);
    const resources = await ctx.db
      .query("successRoomResources")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    const activeResources = resources
      .filter((resource) => resource.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const editableStates = await ctx.db
      .query("successRoomEditableTextStates")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    const visitorTeamMembers = await ctx.db
      .query("successRoomTeamMembers")
      .withIndex("by_room_active_created_at", (q) =>
        q.eq("roomId", room._id).eq("active", true),
      )
      .collect();
    const julienPhoto = await getActiveGlobalFile(ctx, julienPhotoGlobalFileKey);

    if (!state) {
      throw new ConvexError("Success room state not found");
    }

    if (!julienPhoto) {
      throw new ConvexError("Julien photo global file is not seeded");
    }

    const editableStateByResourceId = new Map(
      editableStates.map((editableState) => [editableState.resourceId, editableState]),
    );
    const editableTexts: Record<
      string,
      {
        content: string;
        dataSources: string[];
        attachment?: ReturnType<typeof fileSummary>;
      }
    > = {};

    for (const resource of activeResources) {
      if (resource.kind !== "editable-text") {
        continue;
      }

      const editableState = editableStateByResourceId.get(resource._id);
      const attachment =
        editableState?.attachmentFileId !== undefined
          ? await ctx.db.get(editableState.attachmentFileId)
          : null;

      editableTexts[resource.slug] = {
        content: editableState?.content ?? resource.initialText ?? "",
        dataSources: editableState?.dataSources ?? [],
        ...(attachment?.active ? { attachment: fileSummary(attachment) } : {}),
      };
    }

    return {
      room: {
        ...lockedRoom(room),
        resources: activeResources.map(resourceSummary),
        team: [
          {
            id: "julien-newman",
            name: "Julien Newman",
            role: "Founder",
            photo: globalFileSummary(julienPhoto),
          },
          ...visitorTeamMembers.map(visitorTeamMemberSummary),
        ],
      },
      state: {
        questions: state.questions,
        plan: state.plan,
        editableTexts,
      },
    };
  },
});

export const getResourceFileForDownload = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const resource = await getActiveResourceBySlug(ctx, room._id, args.resourceSlug);

    if (
      !resource ||
      !["deck", "audio", "downloadable-file"].includes(resource.kind)
    ) {
      return null;
    }

    const file = await getActiveResourceFile(
      ctx,
      room._id,
      resource._id,
      "primary-resource-file",
    );

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

export const getGlobalFileForDownload = query({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    key: globalFileKey,
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const file = await getActiveGlobalFile(ctx, args.key);

    if (!file) {
      return null;
    }

    const url = await ctx.storage.getUrl(file.storageId);

    return url
      ? {
          ...globalFileSummary(file),
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
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const name = args.name.trim();
    const role = args.role.trim();
    const email = args.email?.trim();

    if (!name || !role) {
      throw new ConvexError("Team member name and role are required");
    }

    const now = Date.now();
    const memberId = await ctx.db.insert("successRoomTeamMembers", {
      roomId: room._id,
      name,
      role,
      ...(email ? { email } : {}),
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: memberId,
      name,
      role,
      ...(email ? { email } : {}),
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

    const state = await getStateByRoomId(ctx, room._id);

    if (!state) {
      throw new ConvexError("Success room state not found");
    }

    await ctx.db.replace(
      state._id,
      buildStatePatch(state, {
        questions: args.questions,
        updatedAt: Date.now(),
      }),
    );
  },
});

export const patchPlan = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    plan: v.object({
      checkedTaskIds: v.optional(v.array(v.string())),
      dateOverrides: v.optional(v.record(v.string(), v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const state = await getStateByRoomId(ctx, room._id);

    if (!state) {
      throw new ConvexError("Success room state not found");
    }

    const existingPlan = state.plan ?? {
      checkedTaskIds: [],
      dateOverrides: {},
    };

    await ctx.db.replace(
      state._id,
      buildStatePatch(state, {
        plan: {
          checkedTaskIds: args.plan.checkedTaskIds ?? existingPlan.checkedTaskIds,
          dateOverrides: args.plan.dateOverrides ?? existingPlan.dateOverrides,
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
    resourceSlug: v.string(),
    content: v.string(),
    dataSources: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const resource = await getActiveResourceBySlug(ctx, room._id, args.resourceSlug);

    if (!resource || resource.kind !== "editable-text") {
      throw new ConvexError("Editable text resource not found");
    }

    await upsertEditableTextState(ctx, {
      roomId: room._id,
      resourceId: resource._id,
      content: args.content,
      dataSources: args.dataSources,
    });
  },
});

export const registerEditableAttachment = mutation({
  args: {
    slug: v.string(),
    accessToken: v.string(),
    resourceSlug: v.string(),
    file: fileInput,
    content: v.string(),
    dataSources: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const resource = await getActiveResourceBySlug(ctx, room._id, args.resourceSlug);

    if (!resource || resource.kind !== "editable-text") {
      throw new ConvexError("Editable text resource not found");
    }

    const now = Date.now();
    const existingFiles = await ctx.db
      .query("successRoomFiles")
      .withIndex("by_room_resource_purpose", (q) =>
        q.eq("roomId", room._id).eq("resourceId", resource._id).eq("purpose", "editable-attachment"),
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

    const fileId = await ctx.db.insert("successRoomFiles", {
      roomId: room._id,
      resourceId: resource._id,
      purpose: "editable-attachment",
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
      resourceId: resource._id,
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
    resourceSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ensureRoom(ctx, args.slug);

    await assertAccess(room, args.accessToken);

    const resource = await getActiveResourceBySlug(ctx, room._id, args.resourceSlug);

    if (!resource || resource.kind !== "editable-text") {
      throw new ConvexError("Editable text resource not found");
    }

    const editableState = await ctx.db
      .query("successRoomEditableTextStates")
      .withIndex("by_room_resource", (q) =>
        q.eq("roomId", room._id).eq("resourceId", resource._id),
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
        attachmentFile.resourceId !== resource._id ||
        attachmentFile.purpose !== "editable-attachment"
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
      resourceId: editableState.resourceId,
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
    description: v.string(),
    password: v.string(),
    deck: fileInput,
    audio: fileInput,
    optionalResources: v.array(seedResource),
  },
  handler: async (ctx, args) => {
    assertSeedAccess(args.seedSecret);

    const existingRoom = await getRoomBySlug(ctx, args.slug);

    if (existingRoom) {
      throw new ConvexError("Success room already exists");
    }

    const julienPhoto = await getActiveGlobalFile(ctx, julienPhotoGlobalFileKey);

    if (!julienPhoto) {
      throw new ConvexError("Julien photo global file is not seeded");
    }

    const now = Date.now();
    const roomId = await ctx.db.insert("successRooms", {
      slug: args.slug,
      prospectName: args.prospectName,
      description: args.description,
      passwordHash: await hashPassword(args.password),
      passwordUpdatedAt: now,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    const insertResource = async (resource: {
      slug: string;
      kind: "deck" | "audio" | "downloadable-file" | "mutual-success-plan" | "editable-text";
      title: string;
      actionLabel: string;
      description?: string;
      sortOrder: number;
      editorRows?: number;
      initialText?: string;
    }) =>
      await ctx.db.insert("successRoomResources", {
        roomId,
        slug: resource.slug,
        kind: resource.kind,
        title: resource.title,
        actionLabel: resource.actionLabel,
        description: resource.description,
        sortOrder: resource.sortOrder,
        editorRows: resource.editorRows,
        initialText: resource.initialText,
        active: true,
        createdAt: now,
        updatedAt: now,
      });

    const deckResourceId = await insertResource({
      slug: "deck",
      kind: "deck",
      title: "Sales deck",
      actionLabel: "Download the custom sales deck",
      sortOrder: 0,
    });
    const audioResourceId = await insertResource({
      slug: "audio",
      kind: "audio",
      title: "Audio summary",
      actionLabel: "Download the audio summary",
      sortOrder: 1,
    });

    for (const resource of args.optionalResources) {
      await insertResource(resource);
    }

    const deckId = await ctx.db.insert("successRoomFiles", {
      roomId,
      resourceId: deckResourceId,
      purpose: "primary-resource-file",
      storageId: args.deck.storageId,
      filename: args.deck.filename,
      contentType: args.deck.contentType,
      byteSize: args.deck.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const audioId = await ctx.db.insert("successRoomFiles", {
      roomId,
      resourceId: audioResourceId,
      purpose: "primary-resource-file",
      storageId: args.audio.storageId,
      filename: args.audio.filename,
      contentType: args.audio.contentType,
      byteSize: args.audio.byteSize,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("successRoomStates", {
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
