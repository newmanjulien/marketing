import type { SuccessRoomPlanState } from "./successRoomPlan";
import { kickoffScheduleRowKeys } from "./successRoomResources";

type DefaultEditableTextState = {
  content: string;
  dataSources: string[];
};

type DefaultKickoffScheduleState = {
  rows: Array<{
    key: string;
    sortOrder: number;
    cells: Record<string, string>;
  }>;
};

export const createDefaultPlanState = (
  openAccordionKey: string | null = null,
): SuccessRoomPlanState => ({
  openAccordionKey,
  checkedTaskKeys: [],
  dateOverridesByTaskKey: {},
  assigneeKeyByTaskKey: {},
});

export const createDefaultEditableTextState = (): DefaultEditableTextState => ({
  content: "",
  dataSources: [],
});

export const createDefaultKickoffScheduleState = (): DefaultKickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key, index) => ({
    key,
    sortOrder: index,
    cells: {},
  })),
});
