import type {
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanState
} from './types';
import { kickoffScheduleColumns } from '../../../../shared/successRoomResources';

export const clonePlan = (plan: SuccessRoomPlanState): SuccessRoomPlanState => ({
  lastOpenedAccordionKey: plan.lastOpenedAccordionKey,
  checkedTaskKeys: [...plan.checkedTaskKeys],
  dateOverridesByTaskKey: {
    ...plan.dateOverridesByTaskKey
  },
  assigneeKeyByTaskKey: {
    ...plan.assigneeKeyByTaskKey
  }
});

export const cloneEditableTextState = (
  editableState: SuccessRoomEditableTextState,
): SuccessRoomEditableTextState => ({
  content: editableState.content,
  dataSources: [...editableState.dataSources],
  ...(editableState.attachment ? { attachment: editableState.attachment } : {})
});

export const cloneKickoffScheduleState = (
  schedule: SuccessRoomKickoffScheduleState,
): SuccessRoomKickoffScheduleState => ({
  rows: schedule.rows.map((row) => ({
    key: row.key,
    sortOrder: row.sortOrder,
    cells: Object.fromEntries(
      kickoffScheduleColumns.map((column) => [
        column.key,
        row.cells[column.key] ?? ''
      ])
    )
  }))
});
