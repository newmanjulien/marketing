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
  selectedBenefitIds: [],
  checkedTaskIds: [],
  dateOverrides: {},
  taskAssigneeMemberIds: {}
});

export const clonePlan = (plan: SuccessRoomPlanState): SuccessRoomPlanState => ({
  selectedBenefitIds: [...plan.selectedBenefitIds],
  checkedTaskIds: [...plan.checkedTaskIds],
  dateOverrides: {
    ...plan.dateOverrides
  },
  taskAssigneeMemberIds: {
    ...plan.taskAssigneeMemberIds
  }
});

export const cloneEditableTextState = (
  editableState: SuccessRoomEditableTextState,
): SuccessRoomEditableTextState => ({
  content: editableState.content,
  dataSources: [...editableState.dataSources],
  ...(editableState.attachment ? { attachment: editableState.attachment } : {})
});

export const cloneEditableTexts = (
  editableTexts: Record<string, SuccessRoomEditableTextState>,
) =>
  Object.fromEntries(
    Object.entries(editableTexts).map(([resourceSlug, editableState]) => [
      resourceSlug,
      cloneEditableTextState(editableState)
    ])
  );

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

export const cloneKickoffSchedules = (
  kickoffSchedules: Record<string, SuccessRoomKickoffScheduleState>,
) =>
  Object.fromEntries(
    Object.entries(kickoffSchedules).map(([resourceSlug, schedule]) => [
      resourceSlug,
      cloneKickoffScheduleState(schedule)
    ])
  );
