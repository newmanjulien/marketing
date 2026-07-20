import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { successRoomResourceNotEnabledCode } from "../../shared/successRoomAccess";
import {
  customBenefitPainPointKey,
  maxCustomBenefitLength,
} from "../../shared/successRoomBenefits";
import { parseSuccessRoomSlug } from "../../shared/successRoomSlugs";
import { kickoffScheduleColumns } from "../../shared/successRoomResources";
import type { SuccessRoomResourceKey } from "../../shared/successRoomResources";
import type {
  SuccessRoomBenefitsState,
  SuccessRoomKickoffScheduleState,
} from "../../shared/successRoomState";
import { isValidPlanTaskDate } from "../../shared/successRoomPlan";
import type { SuccessRoomPlanState } from "../../shared/successRoomPlan";

export type SuccessRoom = Doc<"successRooms">;
export type TeamMember = SuccessRoom["teamMembers"][number];

export const maxBenefitCards = 10;
export const maxPlanAccordions = 10;
export const maxPlanTasksPerAccordion = 10;

const kickoffScheduleColumnKeys = new Set<string>(
  kickoffScheduleColumns.map((column) => column.key),
);

export const createKey = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

export const uniqueItems = <Item>(items: Item[]) => [...new Set(items)];

export const assertMaxLength = (items: unknown[], maxLength: number, label: string) => {
  if (items.length > maxLength) {
    throw new ConvexError(`${label} must include ${maxLength} items or fewer`);
  }
};

export const assertNotEmpty = (items: unknown[], label: string) => {
  if (items.length === 0) {
    throw new ConvexError(`${label} must include at least one item`);
  }
};

export const assertUniqueKeys = (items: Array<{ key: string }>, label: string) => {
  const keys = new Set<string>();

  for (const item of items) {
    if (keys.has(item.key)) {
      throw new ConvexError(`${label} keys must be unique`);
    }

    keys.add(item.key);
  }
};

export const normalizeSlug = (slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    throw new ConvexError("Success room slug is invalid");
  }

  return parsedSlug;
};

export const roomBySlug = async (ctx: QueryCtx | MutationCtx, slug: string) =>
  await ctx.db
    .query("successRooms")
    .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(slug)))
    .unique();

export const requireRoomBySlug = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const room = await roomBySlug(ctx, slug);

  if (!room) {
    throw new ConvexError("Success room not found");
  }

  return room;
};

export const hasResource = (room: SuccessRoom, resourceKey: SuccessRoomResourceKey) =>
  room.enabledResourceKeys.includes(resourceKey);

export const assertResourceEnabled = (
  room: SuccessRoom,
  resourceKey: SuccessRoomResourceKey,
) => {
  if (!hasResource(room, resourceKey)) {
    throw new ConvexError(successRoomResourceNotEnabledCode);
  }
};

type SeedBenefitCard = SuccessRoom["benefitCards"][number];
type SeedPlanAccordion = SuccessRoom["planAccordions"][number];

export const sanitizeSeedBenefitCards = (cards: SeedBenefitCard[]) => {
  assertNotEmpty(cards, "Benefit cards");
  assertMaxLength(cards, maxBenefitCards, "Benefit cards");
  assertUniqueKeys(cards, "Benefit card");

  return [...cards].sort((left, right) => left.sortOrder - right.sortOrder);
};

export const sanitizeSeedPlanAccordions = (accordions: SeedPlanAccordion[]) => {
  assertNotEmpty(accordions, "Plan accordions");
  assertMaxLength(accordions, maxPlanAccordions, "Plan accordions");
  assertUniqueKeys(accordions, "Plan accordion");

  const taskKeys = new Set<string>();

  for (const accordion of accordions) {
    assertMaxLength(accordion.tasks, maxPlanTasksPerAccordion, "Plan accordion tasks");

    for (const task of accordion.tasks) {
      if (taskKeys.has(task.key)) {
        throw new ConvexError("Plan task keys must be unique");
      }

      taskKeys.add(task.key);
    }
  }

  return [...accordions].sort((left, right) => left.sortOrder - right.sortOrder);
};

const benefitKeys = (room: SuccessRoom) => new Set(room.benefitCards.map((card) => card.key));

const planAccordionKeys = (room: SuccessRoom) =>
  new Set(room.planAccordions.map((accordion) => accordion.key));

const planTaskKeys = (room: SuccessRoom) =>
  new Set(room.planAccordions.flatMap((accordion) => accordion.tasks.map((task) => task.key)));

const teamMemberKeys = (room: SuccessRoom) =>
  new Set(room.teamMembers.map((member) => member.key));

const sanitizeTextByBenefitKey = (
  textByBenefitKey: Record<string, string>,
  allowedBenefitKeys: Set<string>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(textByBenefitKey)
      .filter(([benefitKey]) => allowedBenefitKeys.has(benefitKey))
      .map(([benefitKey, text]) => [benefitKey, text.trim()])
      .filter(([, text]) => text.length > 0),
  );

// Saved state can reference keys that no longer exist after the room's catalog
// is reseeded, so state is sanitized against the current catalog on both read
// and write. Text keyed by valid-but-unselected benefits is deliberately kept:
// partial patches commit in any order (selection and text are saved under
// separate queue keys), and reselecting a benefit restores its text.
export const sanitizeBenefitsState = (
  room: SuccessRoom,
  state: SuccessRoomBenefitsState,
): SuccessRoomBenefitsState => {
  const validCardKeys = benefitKeys(room);
  const selectedCustomBenefit = state.selectedCustomBenefit?.trim() || null;

  if (selectedCustomBenefit && selectedCustomBenefit.length > maxCustomBenefitLength) {
    throw new ConvexError(
      `Custom benefit must include ${maxCustomBenefitLength} characters or fewer`,
    );
  }

  const selectedCardKeys = uniqueItems(state.selectedCardKeys).filter((key) =>
    validCardKeys.has(key),
  );
  const allowedBenefitKeys = new Set([...validCardKeys, customBenefitPainPointKey]);

  return {
    selectedCardKeys,
    selectedCustomBenefit,
    painPointsByBenefitKey: sanitizeTextByBenefitKey(
      state.painPointsByBenefitKey,
      allowedBenefitKeys,
    ),
    goalsByBenefitKey: sanitizeTextByBenefitKey(state.goalsByBenefitKey, allowedBenefitKeys),
  };
};

export const sanitizePlanState = (
  room: SuccessRoom,
  state: SuccessRoomPlanState,
): SuccessRoomPlanState => {
  const validAccordionKeys = planAccordionKeys(room);
  const validTaskKeys = planTaskKeys(room);
  const validMemberKeys = teamMemberKeys(room);
  const openAccordionKey = state.openAccordionKey;

  return {
    openAccordionKey:
      openAccordionKey && validAccordionKeys.has(openAccordionKey) ? openAccordionKey : null,
    checkedTaskKeys: uniqueItems(state.checkedTaskKeys).filter((key) => validTaskKeys.has(key)),
    dateOverridesByTaskKey: Object.fromEntries(
      Object.entries(state.dateOverridesByTaskKey).filter(
        ([taskKey, date]) => validTaskKeys.has(taskKey) && isValidPlanTaskDate(date),
      ),
    ),
    assigneeKeyByTaskKey: Object.fromEntries(
      Object.entries(state.assigneeKeyByTaskKey).filter(
        ([taskKey, memberKey]) => validTaskKeys.has(taskKey) && validMemberKeys.has(memberKey),
      ),
    ),
  };
};

export const sanitizeKickoffScheduleState = (
  state: SuccessRoomKickoffScheduleState,
): SuccessRoomKickoffScheduleState => ({
  rows: state.rows
    .map((row) => ({
      key: row.key,
      sortOrder: row.sortOrder,
      cells: Object.fromEntries(
        Object.entries(row.cells).filter(([columnKey]) => kickoffScheduleColumnKeys.has(columnKey)),
      ),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder),
});

export const patchRoomState = async (
  ctx: MutationCtx,
  room: SuccessRoom,
  state: SuccessRoom["state"],
) => {
  await ctx.db.patch(room._id, { state });
};
