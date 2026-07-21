import type { QueryCtx } from "../_generated/server";
import {
  audioResourceDefinition,
  deckResourceDefinition,
  deckResourceSlug,
  initialFormatResourceDefinition,
  initialFormatResourceSlug,
  isSuccessRoomAssetResourceSlug,
  kickoffScheduleResourceDefinition,
  kickoffScheduleResourceSlug,
  mutualSuccessPlanResourceDefinition,
  mutualSuccessPlanResourceSlug,
  successRoomDescription,
  successRoomResourceDefinitions,
  type SuccessRoomAssetResourceSlug,
  type SuccessRoomRoutedResourceSlug,
  type SuccessRoomResourceSlug,
} from "../../shared/successRoomResources";
import {
  assertResourceEnabled,
  hasResource,
  sanitizeBenefitsState,
  sanitizeKickoffScheduleState,
  sanitizePlanState,
  type SuccessRoom,
} from "./rooms";
import { fileByRoomKind, linkedFileSummary, teamSummaries } from "./files";

export const baseRoom = (room: SuccessRoom) => ({
  slug: room.slug,
  prospectName: room.prospectName,
  description: successRoomDescription,
});

const routedResourceDefinitions = {
  [mutualSuccessPlanResourceSlug]: mutualSuccessPlanResourceDefinition,
  [initialFormatResourceSlug]: initialFormatResourceDefinition,
  [kickoffScheduleResourceSlug]: kickoffScheduleResourceDefinition,
} as const;

const assetResourceSummary = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceSlug: SuccessRoomAssetResourceSlug,
) => {
  const file = await fileByRoomKind(ctx, room._id, resourceSlug);

  if (!file) {
    return null;
  }

  return resourceSlug === deckResourceSlug ? deckResourceDefinition : audioResourceDefinition;
};

const landingResource = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceSlug: SuccessRoomResourceSlug,
) => {
  if (!hasResource(room, resourceSlug)) {
    return null;
  }

  if (isSuccessRoomAssetResourceSlug(resourceSlug)) {
    return assetResourceSummary(ctx, room, resourceSlug);
  }

  return routedResourceDefinitions[resourceSlug];
};

const landingResources = async (ctx: QueryCtx, room: SuccessRoom) => {
  const resources = await Promise.all(
    successRoomResourceDefinitions.map((resource) => landingResource(ctx, room, resource.slug)),
  );

  return resources.filter((resource) => resource !== null);
};

export const publicLandingPayload = async (ctx: QueryCtx, room: SuccessRoom) => ({
  locked: false as const,
  room: {
    ...baseRoom(room),
    benefitCards: room.benefitCards,
    team: await teamSummaries(ctx, room),
    resources: await landingResources(ctx, room),
  },
  state: {
    benefits: sanitizeBenefitsState(room, room.state.benefits),
  },
});

export const assetResourceResolution = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceSlug: SuccessRoomAssetResourceSlug,
) => {
  const file = hasResource(room, resourceSlug)
    ? await fileByRoomKind(ctx, room._id, resourceSlug)
    : null;
  const href = file ? await ctx.storage.getUrl(file.storageId) : null;

  if (!href) {
    return { status: "missing" as const };
  }

  return {
    status: "available" as const,
    href,
  };
};

export const publicResourcePayload = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceSlug: SuccessRoomRoutedResourceSlug,
) => {
  assertResourceEnabled(room, resourceSlug);

  const basePayload = {
    locked: false as const,
    room: baseRoom(room),
  };

  if (resourceSlug === mutualSuccessPlanResourceSlug) {
    return {
      ...basePayload,
      resource: {
        ...mutualSuccessPlanResourceDefinition,
        catalog: {
          planAccordions: room.planAccordions,
          team: await teamSummaries(ctx, room),
        },
      },
      state: {
        kind: "mutual-success-plan" as const,
        plan: sanitizePlanState(room, room.state.plan),
      },
    };
  }

  if (resourceSlug === initialFormatResourceSlug) {
    const { attachmentFileId, ...editableText } = room.state.editableText;
    const attachment = attachmentFileId ? await ctx.db.get(attachmentFileId) : null;

    return {
      ...basePayload,
      resource: initialFormatResourceDefinition,
      state: {
        kind: "editable-text" as const,
        editableText: {
          ...editableText,
          attachment: attachment ? await linkedFileSummary(ctx, attachment) : null,
        },
      },
    };
  }

  if (resourceSlug === kickoffScheduleResourceSlug) {
    return {
      ...basePayload,
      resource: kickoffScheduleResourceDefinition,
      state: {
        kind: "kickoff-schedule" as const,
        kickoffSchedule: sanitizeKickoffScheduleState(room.state.kickoffSchedule),
      },
    };
  }

  return resourceSlug satisfies never;
};
