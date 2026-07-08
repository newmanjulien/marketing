import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  successRoomGlobalFiles: defineTable({
    key: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_storage_id", ["storageId"]),

  successRooms: defineTable({
    slug: v.string(),
    prospectName: v.string(),
    description: v.string(),

    passwordHash: v.string(),
    passwordUpdatedAt: v.number(),

    archived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  successRoomResources: defineTable({
    roomId: v.id("successRooms"),
    slug: v.string(),
    kind: v.union(
      v.literal("deck"),
      v.literal("audio"),
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
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_slug", ["roomId", "slug"]),

  successRoomStates: defineTable({
    roomId: v.id("successRooms"),

    questions: v.record(v.string(), v.string()),

    plan: v.optional(
      v.object({
        checkedTaskIds: v.array(v.string()),
        dateOverrides: v.record(v.string(), v.string()),
      }),
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_room", ["roomId"]),

  successRoomTeamMembers: defineTable({
    roomId: v.id("successRooms"),
    name: v.string(),
    role: v.string(),
    email: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_active_created_at", ["roomId", "active", "createdAt"]),

  successRoomEditableTextStates: defineTable({
    roomId: v.id("successRooms"),
    resourceId: v.id("successRoomResources"),
    content: v.string(),
    dataSources: v.array(v.string()),
    attachmentFileId: v.optional(v.id("successRoomFiles")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_resource", ["roomId", "resourceId"]),

  successRoomFiles: defineTable({
    roomId: v.id("successRooms"),

    purpose: v.union(
      v.literal("primary-resource-file"),
      v.literal("editable-attachment"),
    ),

    resourceId: v.id("successRoomResources"),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),

    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_resource", ["roomId", "resourceId"])
    .index("by_room_resource_purpose", ["roomId", "resourceId", "purpose"])
    .index("by_storage_id", ["storageId"]),
});
