import type { QueryCtx } from "../_generated/server";
import {
  audioResourceDefinition,
  audioResourceKey,
  deckResourceDefinition,
  deckResourceKey,
  initialFormatResourceDefinition,
  initialFormatResourceKey,
  kickoffScheduleResourceDefinition,
  kickoffScheduleResourceKey,
  mutualSuccessPlanResourceDefinition,
  mutualSuccessPlanResourceKey,
  successRoomDescription,
  successRoomResourceDefinitions,
  type AssetSuccessRoomResourceKey,
  type RoutedSuccessRoomResourceKey,
  type SuccessRoomResourceKey,
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

const routeDelivery = { type: "route" } as const;

const routedResourceDefinitions = {
  [mutualSuccessPlanResourceKey]: mutualSuccessPlanResourceDefinition,
  [initialFormatResourceKey]: initialFormatResourceDefinition,
  [kickoffScheduleResourceKey]: kickoffScheduleResourceDefinition,
} as const;

const routedResourceSummary = (resourceKey: RoutedSuccessRoomResourceKey) => ({
  ...routedResourceDefinitions[resourceKey],
  delivery: routeDelivery,
});

const assetResourceSummary = async (
  ctx: QueryCtx,
  room: SuccessRoom,
  resourceKey: AssetSuccessRoomResourceKey,
) => {
  const file = await fileByRoomKind(ctx, room._id, resourceKey);

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
    successRoomResourceDefinitions.map((resource) => landingResource(ctx, room, resource.slug)),
  );

  return resources.filter((resource) => resource !== null);
};

export const publicLandingPayload = async (ctx: QueryCtx, room: SuccessRoom) => ({
  locked: false as const,
  room: {
    ...baseRoom(room),
    benefitCards: room.benefitCards.map(benefitCardSummary),
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
  resourceKey: AssetSuccessRoomResourceKey,
) => {
  if (!hasResource(room, resourceKey)) {
    return { status: "missing" as const };
  }

  const file = await fileByRoomKind(ctx, room._id, resourceKey);
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
  resourceSlug: RoutedSuccessRoomResourceKey,
) => {
  assertResourceEnabled(room, resourceSlug);

  const basePayload = {
    locked: false as const,
    room: baseRoom(room),
  };

  if (resourceSlug === mutualSuccessPlanResourceKey) {
    return {
      ...basePayload,
      resource: {
        ...mutualSuccessPlanResourceDefinition,
        catalog: {
          planAccordions: room.planAccordions.map(planAccordionSummary),
          team: await teamSummaries(ctx, room),
        },
        delivery: routeDelivery,
      },
      state: {
        kind: mutualSuccessPlanResourceKey as typeof mutualSuccessPlanResourceKey,
        plan: sanitizePlanState(room, room.state.plan),
      },
    };
  }

  if (resourceSlug === initialFormatResourceKey) {
    const { attachmentFileId, ...editableText } = room.state.editableText;
    const attachment = attachmentFileId ? await ctx.db.get(attachmentFileId) : null;

    return {
      ...basePayload,
      resource: {
        ...initialFormatResourceDefinition,
        delivery: routeDelivery,
      },
      state: {
        kind: "editable-text" as const,
        editableText: {
          ...editableText,
          ...(attachment ? { attachment: await linkedFileSummary(ctx, attachment) } : {}),
        },
      },
    };
  }

  if (resourceSlug === kickoffScheduleResourceKey) {
    return {
      ...basePayload,
      resource: {
        ...kickoffScheduleResourceDefinition,
        delivery: routeDelivery,
      },
      state: {
        kind: "kickoff-schedule" as const,
        kickoffSchedule: sanitizeKickoffScheduleState(room.state.kickoffSchedule),
      },
    };
  }

  return resourceSlug satisfies never;
};
