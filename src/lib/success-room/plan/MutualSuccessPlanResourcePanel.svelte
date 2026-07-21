<script lang="ts">
  import DatePickerModal from './DatePickerModal.svelte';
  import PlanAccordionList from './PlanAccordionList.svelte';
  import TaskAssigneeModal from './TaskAssigneeModal.svelte';
  import { formatIsoDate } from './planDates';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAction,
    SuccessRoomPlanState
  } from '../domain/types';

  type DatePickerContext = {
    taskKey: string;
    selectedDate: Date;
  };

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';

  let {
    resource,
    plan,
    onPlanAction
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    plan: SuccessRoomPlanState;
    onPlanAction: (action: SuccessRoomPlanAction) => void;
  } = $props();

  let assigneePickerTaskKey = $state<string | null>(null);
  let datePickerContext = $state<DatePickerContext | null>(null);

  const openAccordion = (accordionKey: string) => {
    // Toggle: clicking the open accordion closes it (null = all closed).
    onPlanAction({
      type: 'set-open-accordion',
      accordionKey: accordionKey === plan.openAccordionKey ? null : accordionKey
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

  const openDatePickerModal = (taskKey: string, selectedDate: Date | null) => {
    datePickerContext = { taskKey, selectedDate: selectedDate ?? new Date() };
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

  const selectedAssigneeMemberKey = $derived(
    assigneePickerTaskKey === null
      ? undefined
      : plan.assigneeKeyByTaskKey[assigneePickerTaskKey]
  );
</script>

<div class={[panelContentClasses, 'mt-[34px]']}>
  <p class={panelDescriptionClasses}>
    Customize the step-by-step plan for starting to generate revenue together
  </p>

  <PlanAccordionList
    {resource}
    {plan}
    onOpenAccordion={openAccordion}
    onTaskCheckedChange={setTaskChecked}
    onOpenAssigneePicker={openAssigneePickerModal}
    onOpenDatePicker={openDatePickerModal}
  />

  <TaskAssigneeModal
    open={assigneePickerTaskKey !== null}
    team={resource.catalog.team}
    selectedMemberKey={selectedAssigneeMemberKey}
    onSelectMemberKey={selectTaskAssignee}
    onClose={closeAssigneePickerModal}
  />

  <DatePickerModal
    open={datePickerContext !== null}
    selectedDate={datePickerContext?.selectedDate ?? new Date()}
    onSelectDate={selectTaskDate}
    onClose={closeDatePickerModal}
  />
</div>
