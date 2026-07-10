<script lang="ts">
  import DatePickerModal from './DatePickerModal.svelte';
  import PlanAccordionList from './PlanAccordionList.svelte';
  import TaskAssigneeModal from './TaskAssigneeModal.svelte';
  import { resolveTaskDisplayDate } from './planDates';
  import {
    createOpenAccordionAction,
    createTaskAssigneeAction,
    createTaskCheckedAction,
    createTaskDateAction
  } from './planState';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAccordion,
    SuccessRoomPlanAction,
    SuccessRoomPlanState,
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
    onPlanAction
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    team: SuccessRoomTeamMember[];
    planAccordions: SuccessRoomPlanAccordion[];
    plan: SuccessRoomPlanState;
    onPlanAction: (action: SuccessRoomPlanAction) => void;
  } = $props();

  let assigneePickerContext = $state<AssigneePickerContext | null>(null);
  let datePickerContext = $state<DatePickerContext | null>(null);
  let assigneeKeyByTaskKey = $derived(plan.assigneeKeyByTaskKey);
  let openAccordionKey = $derived(
    plan.lastOpenedAccordionKey &&
      planAccordions.some((accordion) => accordion.key === plan.lastOpenedAccordionKey)
      ? plan.lastOpenedAccordionKey
      : (planAccordions[0]?.key ?? null)
  );

  const fallbackDatePickerDate = new Date();

  const openAccordion = (accordionKey: string) => {
    if (accordionKey === openAccordionKey) {
      return;
    }

    onPlanAction(createOpenAccordionAction(accordionKey));
  };

  const setTaskChecked = (taskKey: string, checked: boolean) => {
    onPlanAction(createTaskCheckedAction(taskKey, checked));
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

    onPlanAction(createTaskAssigneeAction(assigneePickerContext.taskKey, memberKey));
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

    onPlanAction(createTaskDateAction(datePickerContext.taskKey, date));
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
  {openAccordionKey}
  onOpenAccordion={openAccordion}
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
