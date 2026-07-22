import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { successRoomResourceNotEnabledCode } from "../../shared/successRoomAccess";
import {
  customBenefitKey,
  maxCustomBenefitLength,
  type SuccessRoomBenefitsState,
} from "../../shared/successRoomBenefits";
import { parseSuccessRoomSlug } from "../../shared/successRoomSlugs";
import type { SuccessRoomResourceSlug } from "../../shared/successRoomResources";
import {
  kickoffMeetingAgendaSlotCount,
  kickoffScheduleColumns,
  kickoffScheduleRowKeys,
  type SuccessRoomKickoffMeeting,
  type SuccessRoomKickoffScheduleState,
} from "../../shared/successRoomKickoffSchedule";
import { isValidPlanTaskDate } from "../../shared/successRoomPlan";
import type { SuccessRoomPlanState } from "../../shared/successRoomPlan";

export type SuccessRoom = Doc<"successRooms">;
export type TeamMember = SuccessRoom["teamMembers"][number];

export const maxBenefitCards = 10;
export const maxPlanAccordions = 10;
export const maxPlanTasksPerAccordion = 10;

export const createKey = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

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
  if (new Set(items.map((item) => item.key)).size !== items.length) {
    throw new ConvexError(`${label} keys must be unique`);
  }
};

export const normalizeSlug = (slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    throw new ConvexError("Success room slug is invalid");
  }

  return parsedSlug;
};

// A malformed slug is treated as a miss: no room can exist under it.
export const roomBySlug = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const parsedSlug = parseSuccessRoomSlug(slug);

  if (!parsedSlug) {
    return null;
  }

  return ctx.db
    .query("successRooms")
    .withIndex("by_slug", (q) => q.eq("slug", parsedSlug))
    .unique();
};

export const requireRoomBySlug = async (ctx: QueryCtx | MutationCtx, slug: string) => {
  const room = await roomBySlug(ctx, slug);

  if (!room) {
    throw new ConvexError("Success room not found");
  }

  return room;
};

export const hasResource = (room: SuccessRoom, resourceSlug: SuccessRoomResourceSlug) =>
  room.enabledResourceSlugs.includes(resourceSlug);

export const assertResourceEnabled = (
  room: SuccessRoom,
  resourceSlug: SuccessRoomResourceSlug,
) => {
  if (!hasResource(room, resourceSlug)) {
    throw new ConvexError(successRoomResourceNotEnabledCode);
  }
};

type SeedBenefitCard = SuccessRoom["benefitCards"][number];
type SeedPlanAccordion = SuccessRoom["planAccordions"][number];

export const assertValidSeedBenefitCards = (cards: SeedBenefitCard[]) => {
  assertNotEmpty(cards, "Benefit cards");
  assertMaxLength(cards, maxBenefitCards, "Benefit cards");
  assertUniqueKeys(cards, "Benefit card");
};

export const assertValidSeedPlanAccordions = (accordions: SeedPlanAccordion[]) => {
  assertNotEmpty(accordions, "Plan accordions");
  assertMaxLength(accordions, maxPlanAccordions, "Plan accordions");
  assertUniqueKeys(accordions, "Plan accordion");

  for (const accordion of accordions) {
    assertMaxLength(accordion.tasks, maxPlanTasksPerAccordion, "Plan accordion tasks");
  }

  assertUniqueKeys(
    accordions.flatMap((accordion) => accordion.tasks),
    "Plan task",
  );
};

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
  const validCardKeys = new Set(room.benefitCards.map((card) => card.key));
  const selectedCustomBenefit = state.selectedCustomBenefit?.trim() || null;

  if (selectedCustomBenefit && selectedCustomBenefit.length > maxCustomBenefitLength) {
    throw new ConvexError(
      `Custom benefit must include ${maxCustomBenefitLength} characters or fewer`,
    );
  }

  const selectedCardKeys = [...new Set(state.selectedCardKeys)].filter((key) =>
    validCardKeys.has(key),
  );
  const allowedBenefitKeys = new Set([...validCardKeys, customBenefitKey]);

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
  const validAccordionKeys = new Set(room.planAccordions.map((accordion) => accordion.key));
  const validTaskKeys = new Set(
    room.planAccordions.flatMap((accordion) => accordion.tasks.map((task) => task.key)),
  );
  const validMemberKeys = new Set(room.teamMembers.map((member) => member.key));

  return {
    openAccordionKey:
      state.openAccordionKey && validAccordionKeys.has(state.openAccordionKey)
        ? state.openAccordionKey
        : null,
    checkedTaskKeys: [...new Set(state.checkedTaskKeys)].filter((key) => validTaskKeys.has(key)),
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

// Rows are rebuilt from the canonical row keys (order fixed, unknown rows
// dropped, missing rows restored empty); cells are whitelisted against the
// canonical columns; attendees against the room's current team. Applied on
// both read and write, like the plan.
export const sanitizeKickoffScheduleState = (
  room: SuccessRoom,
  state: SuccessRoomKickoffScheduleState,
): SuccessRoomKickoffScheduleState => {
  const validColumnKeys = new Set<string>(kickoffScheduleColumns.map((column) => column.key));
  const validMemberKeys = new Set(room.teamMembers.map((member) => member.key));

  const sanitizeMeeting = (meeting: SuccessRoomKickoffMeeting) => ({
    title: meeting.title.trim(),
    attendeeKeys: [...new Set(meeting.attendeeKeys)].filter((key) => validMemberKeys.has(key)),
    agenda: Array.from({ length: kickoffMeetingAgendaSlotCount }, (_, index) =>
      (meeting.agenda[index] ?? "").trim(),
    ),
  });

  return {
    rows: kickoffScheduleRowKeys.map((rowKey) => {
      const cells = state.rows.find((row) => row.key === rowKey)?.cells ?? {};

      return {
        key: rowKey,
        cells: Object.fromEntries(
          Object.entries(cells)
            .filter(([columnKey]) => validColumnKeys.has(columnKey))
            .map(([columnKey, meeting]) => [columnKey, sanitizeMeeting(meeting)] as const),
        ),
      };
    }),
  };
};
