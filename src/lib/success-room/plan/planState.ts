import type { SuccessRoomPlanState, SuccessRoomPlanUpdate } from '../domain/types';
import { formatIsoDate } from './planDates';

export const getPlanTaskId = (itemId: string, taskId: string) => `${itemId}:${taskId}`;

export const createCheckedTaskUpdate = (
  plan: SuccessRoomPlanState,
  taskId: string,
  checked: boolean,
): SuccessRoomPlanUpdate => {
  const nextCheckedTaskIds = new Set(plan.checkedTaskIds);

  if (checked) {
    nextCheckedTaskIds.add(taskId);
  } else {
    nextCheckedTaskIds.delete(taskId);
  }

  return {
    checkedTaskIds: Array.from(nextCheckedTaskIds)
  };
};

export const createTaskAssigneeUpdate = (
  plan: SuccessRoomPlanState,
  taskId: string,
  memberId: string | null,
): SuccessRoomPlanUpdate => {
  const nextTaskAssigneeMemberIds = { ...plan.taskAssigneeMemberIds };

  if (memberId) {
    nextTaskAssigneeMemberIds[taskId] = memberId;
  } else {
    delete nextTaskAssigneeMemberIds[taskId];
  }

  return {
    taskAssigneeMemberIds: nextTaskAssigneeMemberIds
  };
};

export const createTaskDateUpdate = (
  plan: SuccessRoomPlanState,
  taskId: string,
  date: Date,
): SuccessRoomPlanUpdate => ({
  dateOverrides: {
    ...plan.dateOverrides,
    [taskId]: formatIsoDate(date)
  }
});
