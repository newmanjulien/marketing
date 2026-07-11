import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const successRoomResourceKey = v.union(
  v.literal("deck"),
  v.literal("audio"),
  v.literal("mutual-success-plan"),
  v.literal("initial-format"),
  v.literal("kickoff-schedule"),
);

const timestampedEditableItem = {
  active: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
};

export default defineSchema({
  successRooms: defineTable({
    slug: v.string(),
    prospectName: v.string(),
    enabledResourceKeys: v.array(successRoomResourceKey),

    passwordHash: v.string(),
    passwordUpdatedAt: v.number(),

    benefitCards: v.array(
      v.object({
        key: v.string(),
        title: v.string(),
        description: v.string(),
        sortOrder: v.number(),
        ...timestampedEditableItem,
      }),
    ),
    planAccordions: v.array(
      v.object({
        key: v.string(),
        title: v.string(),
        description: v.string(),
        variant: v.union(v.literal("default"), v.literal("muted")),
        sortOrder: v.number(),
        tasks: v.array(
          v.object({
            key: v.string(),
            title: v.string(),
            dateLabel: v.string(),
          }),
        ),
        ...timestampedEditableItem,
      }),
    ),
    teamMembers: v.array(
      v.object({
        key: v.string(),
        name: v.string(),
        role: v.string(),
        photoFileKey: v.optional(v.string()),
        ...timestampedEditableItem,
      }),
    ),
    state: v.object({
      benefits: v.object({
        selectedCardKeys: v.array(v.string()),
        selectedCustomBenefit: v.union(v.string(), v.null()),
        painPoints: v.array(v.string()),
      }),
      plan: v.object({
        lastOpenedAccordionKey: v.union(v.string(), v.null()),
        checkedTaskKeys: v.array(v.string()),
        dateOverridesByTaskKey: v.record(v.string(), v.string()),
        assigneeKeyByTaskKey: v.record(v.string(), v.string()),
      }),
      editableText: v.object({
        content: v.string(),
        dataSources: v.array(v.string()),
        attachmentFileKey: v.optional(v.string()),
      }),
      kickoffSchedule: v.object({
        rows: v.array(
          v.object({
            key: v.string(),
            sortOrder: v.number(),
            cells: v.record(v.string(), v.string()),
          }),
        ),
      }),
    }),

    archived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  successRoomFiles: defineTable({
    roomId: v.id("successRooms"),
    key: v.string(),
    kind: v.union(
      v.literal("deck"),
      v.literal("audio"),
      v.literal("team-member-photo"),
      v.literal("editable-attachment"),
    ),
    resourceKey: v.optional(v.string()),
    ownerKey: v.optional(v.string()),

    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),

    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_key", ["roomId", "key"])
    .index("by_room_kind_active", ["roomId", "kind", "active"])
    .index("by_storage_id", ["storageId"]),

  successRoomDocumentRequests: defineTable({
    roomId: v.id("successRooms"),
    description: v.string(),
    notificationStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    notificationAttemptedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_room_created_at", ["roomId", "createdAt"]),
});
