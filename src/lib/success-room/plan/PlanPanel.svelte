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
    taskKey: string;
    selectedDate: Date;
  };

  type AssigneePickerContext = {
    taskKey: string;
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
  let assigneeKeyByTaskKey = $derived(plan.assigneeKeyByTaskKey);

  const fallbackDatePickerDate = new Date();

  const toggleItem = (itemId: string) => {
    openItemId = openItemId === itemId ? null : itemId;
  };

  const setTaskChecked = (taskKey: string, checked: boolean) => {
    onPlanChange(createCheckedTaskUpdate(plan, taskKey, checked));
  };

  const openAssigneePickerModal = (taskKey: string) => {
    assigneePickerContext = {
      taskKey
    };
  };

  const closeAssigneePickerModal = () => {
    assigneePickerContext = null;
  };

  const selectTaskAssignee = (memberKey: string | null) => {
    if (!assigneePickerContext) {
      return;
    }

    onPlanChange(createTaskAssigneeUpdate(plan, assigneePickerContext.taskKey, memberKey));
  };

  const openDatePickerModal = (taskKey: string, dateLabel: string) => {
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

    onPlanChange(createTaskDateUpdate(plan, datePickerContext.taskKey, date));
  };

  const selectedDatePickerDate = $derived(datePickerContext?.selectedDate ?? fallbackDatePickerDate);
  const selectedAssigneeMemberKey = $derived(
    assigneePickerContext
      ? assigneeKeyByTaskKey[assigneePickerContext.taskKey]
      : undefined
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
