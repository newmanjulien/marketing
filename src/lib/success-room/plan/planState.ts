import type { SuccessRoomPlanState, SuccessRoomPlanUpdate } from '../domain/types';
import { formatIsoDate } from './planDates';

export const createCheckedTaskUpdate = (
  plan: SuccessRoomPlanState,
  taskKey: string,
  checked: boolean,
): SuccessRoomPlanUpdate => {
  const nextCheckedTaskKeys = new Set(plan.checkedTaskKeys);

  if (checked) {
    nextCheckedTaskKeys.add(taskKey);
  } else {
    nextCheckedTaskKeys.delete(taskKey);
  }

  return {
    checkedTaskKeys: Array.from(nextCheckedTaskKeys)
  };
};

export const createTaskAssigneeUpdate = (
  plan: SuccessRoomPlanState,
  taskKey: string,
  memberKey: string | null,
): SuccessRoomPlanUpdate => {
  const nextAssigneeKeyByTaskKey = { ...plan.assigneeKeyByTaskKey };

  if (memberKey) {
    nextAssigneeKeyByTaskKey[taskKey] = memberKey;
  } else {
    delete nextAssigneeKeyByTaskKey[taskKey];
  }

  return {
    assigneeKeyByTaskKey: nextAssigneeKeyByTaskKey
  };
};

export const createTaskDateUpdate = (
  plan: SuccessRoomPlanState,
  taskKey: string,
  date: Date,
): SuccessRoomPlanUpdate => ({
  dateOverridesByTaskKey: {
    ...plan.dateOverridesByTaskKey,
    [taskKey]: formatIsoDate(date)
  }
});
