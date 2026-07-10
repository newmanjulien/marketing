import type { SuccessRoomPlanAction } from '../domain/types';
import { formatIsoDate } from './planDates';

export const createOpenAccordionAction = (
  accordionKey: string,
): SuccessRoomPlanAction => ({
  type: 'open-accordion',
  accordionKey
});

export const createTaskCheckedAction = (
  taskKey: string,
  checked: boolean,
): SuccessRoomPlanAction => ({
  type: 'set-task-checked',
  taskKey,
  checked
});

export const createTaskAssigneeAction = (
  taskKey: string,
  memberKey: string | null,
): SuccessRoomPlanAction => ({
  type: 'set-task-assignee',
  taskKey,
  memberKey
});

export const createTaskDateAction = (
  taskKey: string,
  date: Date,
): SuccessRoomPlanAction => ({
  type: 'set-task-date',
  taskKey,
  date: formatIsoDate(date)
});
