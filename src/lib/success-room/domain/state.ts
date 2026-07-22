import type { SuccessRoomBenefitsState } from '$shared/successRoomBenefits';
import type {
  SuccessRoomKickoffMeeting,
  SuccessRoomKickoffScheduleState
} from '$shared/successRoomKickoffSchedule';
import type { SuccessRoomPlanState } from '$shared/successRoomPlan';
import type { SuccessRoomEditableTextState } from './types';

export const cloneBenefits = (benefits: SuccessRoomBenefitsState): SuccessRoomBenefitsState => ({
  selectedCardKeys: [...benefits.selectedCardKeys],
  selectedCustomBenefit: benefits.selectedCustomBenefit,
  painPointsByBenefitKey: { ...benefits.painPointsByBenefitKey },
  goalsByBenefitKey: { ...benefits.goalsByBenefitKey }
});

export const clonePlan = (plan: SuccessRoomPlanState): SuccessRoomPlanState => ({
  openAccordionKey: plan.openAccordionKey,
  checkedTaskKeys: [...plan.checkedTaskKeys],
  dateOverridesByTaskKey: { ...plan.dateOverridesByTaskKey },
  assigneeKeyByTaskKey: { ...plan.assigneeKeyByTaskKey }
});

export const cloneEditableTextState = (
  editableState: SuccessRoomEditableTextState,
): SuccessRoomEditableTextState => ({
  content: editableState.content,
  dataSources: [...editableState.dataSources],
  success: { ...editableState.success },
  attachment: editableState.attachment
});

export const cloneKickoffScheduleState = (
  schedule: SuccessRoomKickoffScheduleState,
): SuccessRoomKickoffScheduleState => ({
  rows: schedule.rows.map((row) => ({
    key: row.key,
    cells: Object.fromEntries(
      Object.entries(row.cells).map(([columnKey, meeting]): [string, SuccessRoomKickoffMeeting] => [
        columnKey,
        {
          ...meeting,
          attendeeKeys: [...meeting.attendeeKeys],
          agenda: [...meeting.agenda]
        }
      ])
    )
  }))
});
