export type SuccessRoomPlanState = {
  lastOpenedAccordionKey: string | null;
  checkedTaskKeys: string[];
  dateOverridesByTaskKey: Record<string, string>;
  assigneeKeyByTaskKey: Record<string, string>;
};

export type SuccessRoomPlanAction =
  | {
      type: 'open-accordion';
      accordionKey: string;
    }
  | {
      type: 'set-task-checked';
      taskKey: string;
      checked: boolean;
    }
  | {
      type: 'set-task-assignee';
      taskKey: string;
      memberKey: string | null;
    }
  | {
      type: 'set-task-date';
      taskKey: string;
      date: string;
    };

export const applySuccessRoomPlanAction = (
  plan: SuccessRoomPlanState,
  action: SuccessRoomPlanAction,
): SuccessRoomPlanState => {
  switch (action.type) {
    case 'open-accordion':
      return {
        ...plan,
        lastOpenedAccordionKey: action.accordionKey,
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
