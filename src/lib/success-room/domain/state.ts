import type {
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanState
} from './types';

export const clonePlan = (plan: SuccessRoomPlanState): SuccessRoomPlanState => ({
  openAccordionKey: plan.openAccordionKey,
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
  success: { ...editableState.success },
  ...(editableState.attachment ? { attachment: editableState.attachment } : {})
});

export const cloneKickoffScheduleState = (
  schedule: SuccessRoomKickoffScheduleState,
): SuccessRoomKickoffScheduleState => ({
  rows: schedule.rows.map((row) => ({
    key: row.key,
    cells: { ...row.cells }
  }))
});
