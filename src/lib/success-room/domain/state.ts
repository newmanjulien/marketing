import type {
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanState
} from './types';
import {
  kickoffScheduleColumns,
  kickoffScheduleRowKeys
} from '../../../../shared/successRoomResources';

export const getDefaultPlanState = (): SuccessRoomPlanState => ({
  lastOpenedAccordionKey: null,
  checkedTaskKeys: [],
  dateOverridesByTaskKey: {},
  assigneeKeyByTaskKey: {}
});

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

export const getDefaultEditableTextState = (): SuccessRoomEditableTextState => ({
  content: '',
  dataSources: []
});

export const getDefaultKickoffScheduleState = (): SuccessRoomKickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key, index) => ({
    key,
    sortOrder: index,
    cells: {}
  }))
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
