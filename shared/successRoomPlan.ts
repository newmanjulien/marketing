import { v, type Infer } from 'convex/values';

export const successRoomPlanStateValidator = v.object({
  // The one open accordion, or null when they are all closed.
  openAccordionKey: v.union(v.string(), v.null()),
  checkedTaskKeys: v.array(v.string()),
  dateOverridesByTaskKey: v.record(v.string(), v.string()),
  assigneeKeyByTaskKey: v.record(v.string(), v.string()),
});

export const successRoomPlanActionValidator = v.union(
  v.object({
    type: v.literal('set-open-accordion'),
    accordionKey: v.union(v.string(), v.null()),
  }),
  v.object({
    type: v.literal('set-task-checked'),
    taskKey: v.string(),
    checked: v.boolean(),
  }),
  v.object({
    type: v.literal('set-task-assignee'),
    taskKey: v.string(),
    memberKey: v.union(v.string(), v.null()),
  }),
  v.object({
    type: v.literal('set-task-date'),
    taskKey: v.string(),
    date: v.string(),
  }),
);

export type SuccessRoomPlanState = Infer<typeof successRoomPlanStateValidator>;
export type SuccessRoomPlanAction = Infer<typeof successRoomPlanActionValidator>;

export const createDefaultPlanState = (
  openAccordionKey: string | null = null,
): SuccessRoomPlanState => ({
  openAccordionKey,
  checkedTaskKeys: [],
  dateOverridesByTaskKey: {},
  assigneeKeyByTaskKey: {},
});

const planTaskDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

// Task date overrides are stored as strict YYYY-MM-DD calendar dates. Writes
// must be validated against this because readers parse stored overrides
// unconditionally.
export const isValidPlanTaskDate = (value: string) => {
  const match = planTaskDatePattern.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);

  return date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day;
};

export const applySuccessRoomPlanAction = (
  plan: SuccessRoomPlanState,
  action: SuccessRoomPlanAction,
): SuccessRoomPlanState => {
  switch (action.type) {
    case 'set-open-accordion':
      return {
        ...plan,
        openAccordionKey: action.accordionKey,
      };
    case 'set-task-checked': {
      const checkedTaskKeys = new Set(plan.checkedTaskKeys);

      if (action.checked) {
        checkedTaskKeys.add(action.taskKey);
      } else {
        checkedTaskKeys.delete(action.taskKey);
      }

      return {
        ...plan,
        checkedTaskKeys: Array.from(checkedTaskKeys),
      };
    }
    case 'set-task-assignee': {
      const assigneeKeyByTaskKey = { ...plan.assigneeKeyByTaskKey };

      if (action.memberKey !== null) {
        assigneeKeyByTaskKey[action.taskKey] = action.memberKey;
      } else {
        delete assigneeKeyByTaskKey[action.taskKey];
      }

      return {
        ...plan,
        assigneeKeyByTaskKey,
      };
    }
    case 'set-task-date':
      return {
        ...plan,
        dateOverridesByTaskKey: {
          ...plan.dateOverridesByTaskKey,
          [action.taskKey]: action.date,
        },
      };
  }
};
