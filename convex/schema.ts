import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  successRooms: defineTable({
    slug: v.string(),
    prospectName: v.string(),
    enabledResourceKeys: v.array(
      v.union(
        v.literal("deck"),
        v.literal("audio"),
        v.literal("mutual-success-plan"),
        v.literal("initial-format"),
        v.literal("kickoff-schedule"),
      ),
    ),

    passwordHash: v.string(),
    passwordUpdatedAt: v.number(),

    archived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  successRoomBenefitCards: defineTable({
    roomId: v.id("successRooms"),
    key: v.string(),
    title: v.string(),
    description: v.string(),
    sortOrder: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_key", ["roomId", "key"]),

  successRoomPlanAccordions: defineTable({
    roomId: v.id("successRooms"),
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
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_key", ["roomId", "key"]),

  successRoomStates: defineTable({
    roomId: v.id("successRooms"),
    benefits: v.object({
      selectedCardIds: v.array(v.string()),
      painPoints: v.array(v.string()),
    }),
    plan: v.object({
      checkedTaskIds: v.array(v.string()),
      dateOverrides: v.record(v.string(), v.string()),
      taskAssigneeMemberIds: v.record(v.string(), v.id("successRoomTeamMembers")),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_room", ["roomId"]),

  successRoomTeamMembers: defineTable({
    roomId: v.id("successRooms"),
    name: v.string(),
    role: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_active_created_at", ["roomId", "active", "createdAt"]),

  successRoomTeamMemberPhotos: defineTable({
    roomId: v.id("successRooms"),
    teamMemberId: v.id("successRoomTeamMembers"),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_team_member", ["roomId", "teamMemberId"])
    .index("by_storage_id", ["storageId"]),

  successRoomResourceStates: defineTable({
    roomId: v.id("successRooms"),
    resourceKey: v.string(),
    state: v.union(
      v.object({
        kind: v.literal("editable-text"),
        content: v.string(),
        dataSources: v.array(v.string()),
        attachmentFileId: v.optional(v.id("successRoomEditableAttachmentFiles")),
      }),
      v.object({
        kind: v.literal("kickoff-schedule"),
        rows: v.array(
          v.object({
            key: v.string(),
            sortOrder: v.number(),
            cells: v.record(v.string(), v.string()),
          }),
        ),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_resource_key", ["roomId", "resourceKey"]),

  successRoomResourceFiles: defineTable({
    roomId: v.id("successRooms"),
    resourceKey: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),

    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_resource_key", ["roomId", "resourceKey"])
    .index("by_storage_id", ["storageId"]),

  successRoomEditableAttachmentFiles: defineTable({
    roomId: v.id("successRooms"),
    resourceKey: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    byteSize: v.number(),

    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_resource_key", ["roomId", "resourceKey"])
    .index("by_storage_id", ["storageId"]),
});
