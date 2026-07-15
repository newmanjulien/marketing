<script lang="ts">
  import DatePickerModal from './DatePickerModal.svelte';
  import PlanAccordionList from './PlanAccordionList.svelte';
  import TaskAssigneeModal from './TaskAssigneeModal.svelte';
  import { formatIsoDate, resolveTaskDisplayDate } from './planDates';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAccordion,
    SuccessRoomPlanAction,
    SuccessRoomPlanState,
    SuccessRoomTeamMember
  } from '../domain/types';

  type DatePickerContext = {
    taskKey: string;
    selectedDate: Date | null;
  };

  let {
    resource,
    team,
    planAccordions,
    plan,
    onPlanAction
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    team: SuccessRoomTeamMember[];
    planAccordions: SuccessRoomPlanAccordion[];
    plan: SuccessRoomPlanState;
    onPlanAction: (action: SuccessRoomPlanAction) => void;
  } = $props();

  let assigneePickerTaskKey = $state<string | null>(null);
  let datePickerContext = $state<DatePickerContext | null>(null);
  let openAccordionKey = $derived(plan.openAccordionKey);

  const fallbackDatePickerDate = new Date();

  const openAccordion = (accordionKey: string) => {
    // Toggle: clicking the open accordion closes it (null = all closed).
    onPlanAction({
      type: 'set-open-accordion',
      accordionKey: accordionKey === openAccordionKey ? null : accordionKey
    });
  };

  const setTaskChecked = (taskKey: string, checked: boolean) => {
    onPlanAction({ type: 'set-task-checked', taskKey, checked });
  };

  const openAssigneePickerModal = (taskKey: string) => {
    assigneePickerTaskKey = taskKey;
  };

  const closeAssigneePickerModal = () => {
    assigneePickerTaskKey = null;
  };

  const selectTaskAssignee = (memberKey: string | null) => {
    if (assigneePickerTaskKey === null) {
      return;
    }

    onPlanAction({
      type: 'set-task-assignee',
      taskKey: assigneePickerTaskKey,
      memberKey
    });
  };

  const openDatePickerModal = (taskKey: string, dateLabel?: string) => {
    datePickerContext = {
      taskKey,
      selectedDate: resolveTaskDisplayDate({
        dateOverridesByTaskKey: plan.dateOverridesByTaskKey,
        taskKey,
        fallbackDateLabel: dateLabel
      })
    };
  };

  const closeDatePickerModal = () => {
    datePickerContext = null;
  };

  const selectTaskDate = (date: Date) => {
    if (!datePickerContext) {
      return;
    }

    onPlanAction({
      type: 'set-task-date',
      taskKey: datePickerContext.taskKey,
      date: formatIsoDate(date)
    });
  };

  const selectedDatePickerDate = $derived(datePickerContext?.selectedDate ?? fallbackDatePickerDate);
  const selectedAssigneeMemberKey = $derived(
    assigneePickerTaskKey === null
      ? undefined
      : plan.assigneeKeyByTaskKey[assigneePickerTaskKey]
  );
</script>

<PlanAccordionList
  {resource}
  {team}
  {planAccordions}
  {plan}
  {openAccordionKey}
  onOpenAccordion={openAccordion}
  onTaskCheckedChange={setTaskChecked}
  onOpenAssigneePicker={openAssigneePickerModal}
  onOpenDatePicker={openDatePickerModal}
/>

<TaskAssigneeModal
  open={assigneePickerTaskKey !== null}
  {team}
  selectedMemberKey={selectedAssigneeMemberKey}
  onSelectMemberKey={selectTaskAssignee}
  onClose={closeAssigneePickerModal}
/>

<DatePickerModal
  open={datePickerContext !== null}
  selectedDate={selectedDatePickerDate}
  onSelectDate={selectTaskDate}
  onClose={closeDatePickerModal}
/>
