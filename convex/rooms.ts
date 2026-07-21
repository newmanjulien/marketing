import { ConvexError, v } from "convex/values";
import { partial } from "convex-helpers/validators";
import { internal } from "./_generated/api";
import { internalMutation, query } from "./_generated/server";
import { roomMutation, roomQuery } from "./functions";
import {
  successRoomAssetResourceSlugValidator,
  initialFormatResourceSlug,
  kickoffScheduleResourceSlug,
  mutualSuccessPlanResourceSlug,
  successRoomRoutedResourceSlugValidator,
} from "../shared/successRoomResources";
import { successRoomBenefitsStateValidator } from "../shared/successRoomBenefits";
import { successRoomEditableTextContentValidator } from "../shared/successRoomEditableText";
import { successRoomKickoffScheduleStateValidator } from "../shared/successRoomKickoffSchedule";
import { successRoomPlanActionValidator, applySuccessRoomPlanAction } from "../shared/successRoomPlan";
import { maxSuccessRoomDocumentRequestDescriptionLength } from "../shared/successRoomDocumentRequests";
import {
  assertResourceEnabled,
  roomBySlug,
  sanitizeBenefitsState,
  sanitizeKickoffScheduleState,
  sanitizePlanState,
} from "./model/rooms";
import {
  acceptUploadedBlob,
  addTeamMember,
  deleteFile,
  linkedFileSummary,
  teamMemberSummary,
} from "./model/files";
import {
  assetResourceResolution,
  baseRoom,
  publicLandingPayload,
  publicResourcePayload,
} from "./model/payloads";

const uploadPurposeValidator = v.union(
  v.object({
    type: v.literal("editable-attachment"),
  }),
  v.object({
    type: v.literal("team-member-photo"),
    name: v.string(),
    role: v.string(),
  }),
);

// The password gate shows the room name before the prospect unlocks it.
export const getPublicRoom = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await roomBySlug(ctx, args.slug);

    return room ? baseRoom(room) : null;
  },
});

export const getLandingPage = roomQuery({
  args: {},
  handler: async (ctx) => await publicLandingPayload(ctx, ctx.room),
});

export const getBasePage = roomQuery({
  args: {},
  handler: async (ctx) => ({
    locked: false as const,
    room: baseRoom(ctx.room),
  }),
});

export const resolveAssetResource = roomQuery({
  args: {
    resourceSlug: successRoomAssetResourceSlugValidator,
  },
  handler: async (ctx, args) => await assetResourceResolution(ctx, ctx.room, args.resourceSlug),
});

export const getRoutedResourcePage = roomQuery({
  args: {
    resourceSlug: successRoomRoutedResourceSlugValidator,
  },
  handler: async (ctx, args) => await publicResourcePayload(ctx, ctx.room, args.resourceSlug),
});

export const patchBenefits = roomMutation({
  args: {
    benefits: v.object(partial(successRoomBenefitsStateValidator.fields)),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        benefits: sanitizeBenefitsState(ctx.room, {
          ...ctx.room.state.benefits,
          ...args.benefits,
        }),
      },
    });
  },
});

export const applyPlanAction = roomMutation({
  args: {
    action: successRoomPlanActionValidator,
  },
  handler: async (ctx, args) => {
    assertResourceEnabled(ctx.room, mutualSuccessPlanResourceSlug);
    const nextPlan = applySuccessRoomPlanAction(ctx.room.state.plan, args.action);

    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        plan: sanitizePlanState(ctx.room, nextPlan),
      },
    });
  },
});

export const patchEditableText = roomMutation({
  args: {
    editableText: successRoomEditableTextContentValidator,
  },
  handler: async (ctx, args) => {
    assertResourceEnabled(ctx.room, initialFormatResourceSlug);

    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        editableText: {
          ...args.editableText,
          attachmentFileId: ctx.room.state.editableText.attachmentFileId,
        },
      },
    });
  },
});

export const replaceKickoffSchedule = roomMutation({
  args: {
    kickoffSchedule: successRoomKickoffScheduleStateValidator,
  },
  handler: async (ctx, args) => {
    assertResourceEnabled(ctx.room, kickoffScheduleResourceSlug);

    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        kickoffSchedule: sanitizeKickoffScheduleState(args.kickoffSchedule),
      },
    });
  },
});

export const createUploadUrl = roomMutation({
  args: {},
  handler: async (ctx) => ({
    uploadUrl: await ctx.storage.generateUploadUrl(),
  }),
});

export const claimUpload = roomMutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    purpose: uploadPurposeValidator,
  },
  handler: async (ctx, args) => {
    if (args.purpose.type === "team-member-photo") {
      const name = args.purpose.name.trim();
      const role = args.purpose.role.trim();

      if (!name || !role) {
        throw new ConvexError("Team member name and role are required");
      }

      const photoFileId = await acceptUploadedBlob(ctx, ctx.room._id, {
        storageId: args.storageId,
        filename: args.filename,
        kind: "team-member-photo",
        requiredContentTypePrefix: "image/",
      });
      const member = await addTeamMember(ctx, ctx.room, { name, role, photoFileId });

      return {
        type: "team-member-photo" as const,
        member: await teamMemberSummary(ctx, member),
      };
    }

    assertResourceEnabled(ctx.room, initialFormatResourceSlug);

    const attachmentFileId = await acceptUploadedBlob(ctx, ctx.room._id, {
      storageId: args.storageId,
      filename: args.filename,
      kind: "editable-attachment",
    });
    const previousAttachmentFileId = ctx.room.state.editableText.attachmentFileId;

    if (previousAttachmentFileId) {
      await deleteFile(ctx, previousAttachmentFileId);
    }

    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        editableText: {
          ...ctx.room.state.editableText,
          attachmentFileId,
        },
      },
    });

    const attachment = await ctx.db.get(attachmentFileId);

    if (!attachment) {
      throw new ConvexError("Success room attachment could not be saved");
    }

    return {
      type: "editable-attachment" as const,
      attachment: await linkedFileSummary(ctx, attachment),
    };
  },
});

export const removeEditableAttachment = roomMutation({
  args: {},
  handler: async (ctx) => {
    assertResourceEnabled(ctx.room, initialFormatResourceSlug);

    const { attachmentFileId, ...editableText } = ctx.room.state.editableText;

    if (attachmentFileId) {
      await deleteFile(ctx, attachmentFileId);
    }

    await ctx.db.patch(ctx.room._id, {
      state: {
        ...ctx.room.state,
        editableText,
      },
    });
  },
});

export const createDocumentRequest = roomMutation({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const description = args.description.trim();

    if (!description) {
      throw new ConvexError("Document request description is required");
    }

    if (description.length > maxSuccessRoomDocumentRequestDescriptionLength) {
      throw new ConvexError(
        `Document request description must include ${maxSuccessRoomDocumentRequestDescriptionLength} characters or fewer`,
      );
    }

    const requestId = await ctx.db.insert("successRoomDocumentRequests", {
      roomId: ctx.room._id,
      description,
      notificationStatus: "pending",
    });

    await ctx.scheduler.runAfter(0, internal.email.sendDocumentRequestNotification, {
      requestId,
      slug: ctx.room.slug,
      prospectName: ctx.room.prospectName,
      description,
      submittedAt: Date.now(),
    });
  },
});

export const markDocumentRequestNotification = internalMutation({
  args: {
    requestId: v.id("successRoomDocumentRequests"),
    notificationStatus: v.union(v.literal("sent"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, {
      notificationStatus: args.notificationStatus,
    });
  },
});
