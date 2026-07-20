import { v, type Infer } from 'convex/values';
import type { SuccessRoomPlanState } from './successRoomPlan';
import { kickoffScheduleRowKeys } from './successRoomResources';

export const successRoomBenefitsStateValidator = v.object({
  selectedCardKeys: v.array(v.string()),
  selectedCustomBenefit: v.union(v.string(), v.null()),
  painPointsByBenefitKey: v.record(v.string(), v.string()),
  goalsByBenefitKey: v.record(v.string(), v.string()),
});

// What the prospect edits; the backend stores this plus the attachment link.
export const successRoomEditableTextContentValidator = v.object({
  content: v.string(),
  dataSources: v.array(v.string()),
  success: v.object({
    revenueGrowth: v.string(),
    audience: v.string(),
    workflow: v.string(),
  }),
});

export const successRoomKickoffScheduleStateValidator = v.object({
  rows: v.array(
    v.object({
      key: v.string(),
      sortOrder: v.number(),
      cells: v.record(v.string(), v.string()),
    }),
  ),
});

export type SuccessRoomBenefitsState = Infer<typeof successRoomBenefitsStateValidator>;
export type SuccessRoomEditableTextContent = Infer<typeof successRoomEditableTextContentValidator>;
export type SuccessRoomKickoffScheduleState = Infer<
  typeof successRoomKickoffScheduleStateValidator
>;

export const createDefaultPlanState = (
  openAccordionKey: string | null = null,
): SuccessRoomPlanState => ({
  openAccordionKey,
  checkedTaskKeys: [],
  dateOverridesByTaskKey: {},
  assigneeKeyByTaskKey: {},
});

export const createDefaultBenefitsState = (): SuccessRoomBenefitsState => ({
  selectedCardKeys: [],
  selectedCustomBenefit: null,
  painPointsByBenefitKey: {},
  goalsByBenefitKey: {},
});

export const createDefaultEditableTextContent = (): SuccessRoomEditableTextContent => ({
  content: '',
  dataSources: [],
  success: {
    revenueGrowth: '',
    audience: '',
    workflow: '',
  },
});

export const createDefaultKickoffScheduleState = (): SuccessRoomKickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key, index) => ({
    key,
    sortOrder: index,
    cells: {},
  })),
});
