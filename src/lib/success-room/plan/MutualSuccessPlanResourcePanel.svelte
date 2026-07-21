<script lang="ts">
  import { MinusIcon, PlusIcon } from 'phosphor-svelte';
  import DatePickerModal from './DatePickerModal.svelte';
  import PlanTaskRow from './PlanTaskRow.svelte';
  import TaskAssigneeModal from './TaskAssigneeModal.svelte';
  import { formatIsoDate, parseIsoDate } from './planDates';
  import { mutualSuccessPlanClose, mutualSuccessPlanOpen } from './planTransitions';
  import type {
    SuccessRoomPlanAction,
    SuccessRoomPlanState
  } from '$shared/successRoomPlan';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAccordion
  } from '../domain/types';

  type DatePickerContext = {
    taskKey: string;
    selectedDate: Date;
  };

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

  const checkedTaskKeys = $derived(new Set(plan.checkedTaskKeys));

  const selectedAssigneeMemberKey = $derived(
    assigneePickerTaskKey === null
      ? undefined
      : plan.assigneeKeyByTaskKey[assigneePickerTaskKey]
  );

  const toggleAccordion = (accordionKey: string) => {
    // Clicking the open accordion closes it (null = all closed).
    onPlanAction({
      type: 'set-open-accordion',
      accordionKey: accordionKey === plan.openAccordionKey ? null : accordionKey
    });
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

  const isAccordionOffTrack = (accordion: SuccessRoomPlanAccordion) => {
    const startOfTodayMs = new Date().setHours(0, 0, 0, 0);

    return accordion.tasks.some((task) => {
      if (checkedTaskKeys.has(task.key)) return false;

      const iso = plan.dateOverridesByTaskKey[task.key];

      return iso !== undefined && parseIsoDate(iso).getTime() < startOfTodayMs;
    });
  };

  const getAssignedTeamMember = (taskKey: string) =>
    resource.catalog.team.find((member) => member.key === plan.assigneeKeyByTaskKey[taskKey]);

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';

  const accordionListClasses = 'grid w-full gap-[14px]';
  const accordionItemClasses =
    'box-border rounded-[16px] border px-[18px] py-[12px] shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-[border-color,box-shadow] duration-200 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] sm:px-[20px] sm:py-[14px]';
  const accordionTriggerClasses =
    'grid w-full min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-[18px] border-0 bg-transparent p-0 text-left text-inherit focus-visible:rounded-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-stone-900/20 sm:gap-x-[22px]';
  const accordionTitleClasses =
    'col-start-1 row-start-1 flex min-w-0 items-center gap-[8px] text-[15px] font-normal leading-[1.2] tracking-normal sm:text-[16px]';
  const accordionDescriptionClasses =
    'col-start-1 row-start-2 mt-[8px] block min-w-0 cursor-pointer text-[13px] font-book leading-[1.4] tracking-normal sm:text-[14px]';
  const accordionToggleIconClasses =
    'col-start-2 row-start-1 shrink-0 self-center transition-colors duration-150';
  const accordionTaskListClasses = 'mt-[16px] grid gap-[14px]';

  const accordionCardVariants = {
    default: {
      item: 'border-stone-200 bg-white text-stone-900 hover:border-stone-300',
      title: 'text-stone-900',
      description: 'text-stone-500',
      toggleIcon: 'text-stone-400',
      taskText: 'text-stone-500',
      taskDate: 'text-stone-400'
    },
    muted: {
      item: 'border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-300',
      title: 'text-stone-600',
      description: 'text-stone-400',
      toggleIcon: 'text-stone-300',
      taskText: 'text-stone-400',
      taskDate: 'text-stone-300'
    },
    highlighted: {
      item: 'border-yellow-200/70 bg-yellow-50/80 text-yellow-900 hover:border-yellow-300/50',
      title: 'text-stone-900',
      description: 'text-stone-500',
      toggleIcon: 'text-stone-400',
      taskText: 'text-stone-500',
      taskDate: 'text-stone-400'
    }
  } as const;
</script>

<div class={[panelContentClasses, 'mt-[34px]']}>
  <p class={panelDescriptionClasses}>
    Customize the step-by-step plan for starting to generate revenue together
  </p>

  <ul class={accordionListClasses} aria-label={`${resource.title} content`}>
    {#each resource.catalog.planAccordions as item (item.key)}
      {@const isOpen = plan.openAccordionKey === item.key}
      {@const ToggleIcon = isOpen ? MinusIcon : PlusIcon}
      {@const cardVariant = accordionCardVariants[item.variant]}
      {@const offTrack = isAccordionOffTrack(item)}
      <li class={[accordionItemClasses, cardVariant.item]}>
        <button
          type="button"
          class={accordionTriggerClasses}
          aria-expanded={isOpen}
          aria-controls={`${item.key}-tasks`}
          onclick={() => toggleAccordion(item.key)}
        >
          <span class={[accordionTitleClasses, cardVariant.title]}>
            {#if offTrack}
              <span
                class="h-[7px] w-[7px] shrink-0 rounded-full bg-red-500"
                role="img"
                aria-label="Off track"
              ></span>
            {/if}
            {item.title}
          </span>
          <span class={[accordionToggleIconClasses, cardVariant.toggleIcon]} aria-hidden="true">
            <ToggleIcon size={15} weight="bold" />
          </span>
          {#if !isOpen}
            <span class={[accordionDescriptionClasses, cardVariant.description]}>
              {item.description}
            </span>
          {/if}
        </button>

        {#if isOpen}
          <ul
            id={`${item.key}-tasks`}
            class={accordionTaskListClasses}
            aria-label={`${item.title} tasks`}
            in:mutualSuccessPlanOpen
            out:mutualSuccessPlanClose
          >
            {#each item.tasks as task (task.key)}
              {@const taskKey = task.key}
              {@const iso = plan.dateOverridesByTaskKey[taskKey]}
              {@const displayDate = iso ? parseIsoDate(iso) : null}
              {@const assignedTeamMember = getAssignedTeamMember(taskKey)}
              <PlanTaskRow
                {task}
                bind:checked={
                  () => checkedTaskKeys.has(taskKey),
                  (checked) => onPlanAction({ type: 'set-task-checked', taskKey, checked })
                }
                {assignedTeamMember}
                {displayDate}
                textClass={cardVariant.taskText}
                dateClass={cardVariant.taskDate}
                onOpenAssignee={() => (assigneePickerTaskKey = taskKey)}
                onOpenDatePicker={() =>
                  (datePickerContext = { taskKey, selectedDate: displayDate ?? new Date() })}
              />
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>

  <TaskAssigneeModal
    open={assigneePickerTaskKey !== null}
    team={resource.catalog.team}
    selectedMemberKey={selectedAssigneeMemberKey}
    onSelectMemberKey={selectTaskAssignee}
    onClose={() => (assigneePickerTaskKey = null)}
  />

  <DatePickerModal
    open={datePickerContext !== null}
    selectedDate={datePickerContext?.selectedDate ?? new Date()}
    onSelectDate={selectTaskDate}
    onClose={() => (datePickerContext = null)}
  />
</div>
