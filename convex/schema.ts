import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { successRoomResourceSlugValidator } from "../shared/successRoomResources";
import { successRoomPlanStateValidator } from "../shared/successRoomPlan";
import { successRoomBenefitsStateValidator } from "../shared/successRoomBenefits";
import { successRoomEditableTextContentValidator } from "../shared/successRoomEditableText";
import { successRoomKickoffScheduleStateValidator } from "../shared/successRoomKickoffSchedule";

export const benefitCardValidator = v.object({
  key: v.string(),
  title: v.string(),
  description: v.string(),
});

export const planAccordionValidator = v.object({
  key: v.string(),
  title: v.string(),
  description: v.string(),
  variant: v.union(v.literal("default"), v.literal("muted"), v.literal("highlighted")),
  tasks: v.array(
    v.object({
      key: v.string(),
      title: v.string(),
    }),
  ),
});

export const teamMemberValidator = v.object({
  key: v.string(),
  name: v.string(),
  role: v.string(),
  photoFileId: v.optional(v.id("successRoomFiles")),
});

export const fileKindValidator = v.union(
  v.literal("deck"),
  v.literal("audio"),
  v.literal("team-member-photo"),
  v.literal("editable-attachment"),
);

export const storedFileValidator = v.object({
  storageId: v.id("_storage"),
  filename: v.string(),
  contentType: v.string(),
  byteSize: v.number(),
});

export default defineSchema({
  successRooms: defineTable({
    slug: v.string(),
    prospectName: v.string(),
    enabledResourceSlugs: v.array(successRoomResourceSlugValidator),
    benefitCards: v.array(benefitCardValidator),
    planAccordions: v.array(planAccordionValidator),
    teamMembers: v.array(teamMemberValidator),
    state: v.object({
      benefits: successRoomBenefitsStateValidator,
      plan: successRoomPlanStateValidator,
      editableText: v.object({
        ...successRoomEditableTextContentValidator.fields,
        attachmentFileId: v.optional(v.id("successRoomFiles")),
      }),
      kickoffSchedule: successRoomKickoffScheduleStateValidator,
    }),
  }).index("by_slug", ["slug"]),

  successRoomFiles: defineTable({
    roomId: v.id("successRooms"),
    kind: fileKindValidator,
    ...storedFileValidator.fields,
  })
    .index("by_room", ["roomId"])
    .index("by_room_kind", ["roomId", "kind"])
    .index("by_storage_id", ["storageId"]),

  successRoomSessions: defineTable({
    roomId: v.id("successRooms"),
    tokenHash: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_expires_at", ["expiresAt"]),

  successRoomDocumentRequests: defineTable({
    roomId: v.id("successRooms"),
    description: v.string(),
    notificationStatus: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
  }).index("by_room", ["roomId"]),
});
