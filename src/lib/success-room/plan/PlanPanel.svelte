<script lang="ts">
  import DatePickerModal from './DatePickerModal.svelte';
  import PlanAccordionList from './PlanAccordionList.svelte';
  import TaskAssigneeModal from './TaskAssigneeModal.svelte';
  import { resolveTaskDisplayDate } from './planDates';
  import {
    createCheckedTaskUpdate,
    createTaskAssigneeUpdate,
    createTaskDateUpdate
  } from './planState';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAccordion,
    SuccessRoomPlanState,
    SuccessRoomPlanUpdate,
    SuccessRoomTeamMember
  } from '../domain/types';

  type DatePickerContext = {
    taskId: string;
    selectedDate: Date;
  };

  type AssigneePickerContext = {
    taskId: string;
  };

  let {
    resource,
    team,
    planAccordions,
    plan,
    onPlanChange
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    team: SuccessRoomTeamMember[];
    planAccordions: SuccessRoomPlanAccordion[];
    plan: SuccessRoomPlanState;
    onPlanChange: (update: SuccessRoomPlanUpdate) => void;
  } = $props();

  let openItemId = $state<string | null>(null);
  let assigneePickerContext = $state<AssigneePickerContext | null>(null);
  let datePickerContext = $state<DatePickerContext | null>(null);
  let taskAssigneeMemberIds = $derived(plan.taskAssigneeMemberIds);

  const fallbackDatePickerDate = new Date();

  const toggleItem = (itemId: string) => {
    openItemId = openItemId === itemId ? null : itemId;
  };

  const setTaskChecked = (taskId: string, checked: boolean) => {
    onPlanChange(createCheckedTaskUpdate(plan, taskId, checked));
  };

  const openAssigneePickerModal = (taskId: string) => {
    assigneePickerContext = {
      taskId
    };
  };

  const closeAssigneePickerModal = () => {
    assigneePickerContext = null;
  };

  const selectTaskAssignee = (memberId: string | null) => {
    if (!assigneePickerContext) {
      return;
    }

    onPlanChange(createTaskAssigneeUpdate(plan, assigneePickerContext.taskId, memberId));
  };

  const openDatePickerModal = (taskId: string, dateLabel: string) => {
    datePickerContext = {
      taskId,
      selectedDate: resolveTaskDisplayDate({
        dateOverrides: plan.dateOverrides,
        taskId,
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

    onPlanChange(createTaskDateUpdate(plan, datePickerContext.taskId, date));
  };

  const selectedDatePickerDate = $derived(datePickerContext?.selectedDate ?? fallbackDatePickerDate);
  const selectedAssigneeMemberId = $derived(
    assigneePickerContext ? taskAssigneeMemberIds[assigneePickerContext.taskId] : undefined
  );
</script>

<PlanAccordionList
  {resource}
  {team}
  {planAccordions}
  {plan}
  {openItemId}
  onToggleItem={toggleItem}
  onTaskCheckedChange={setTaskChecked}
  onOpenAssigneePicker={openAssigneePickerModal}
  onOpenDatePicker={openDatePickerModal}
/>

<TaskAssigneeModal
  open={assigneePickerContext !== null}
  {team}
  selectedMemberId={selectedAssigneeMemberId}
  onSelectMember={selectTaskAssignee}
  onClose={closeAssigneePickerModal}
/>

<DatePickerModal
  open={datePickerContext !== null}
  selectedDate={selectedDatePickerDate}
  onSelectDate={selectTaskDate}
  onClose={closeDatePickerModal}
/>
