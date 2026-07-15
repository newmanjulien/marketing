<script lang="ts">
  import { MinusIcon, PlusIcon } from 'phosphor-svelte';
  import PlanTaskRow from './PlanTaskRow.svelte';
  import { resolveTaskDisplayDate } from './planDates';
  import { mutualSuccessPlanClose, mutualSuccessPlanOpen } from './planTransitions';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanAccordion,
    SuccessRoomPlanState,
    SuccessRoomTeamMember
  } from '../domain/types';

  let {
    resource,
    team,
    planAccordions,
    plan,
    openAccordionKey,
    onOpenAccordion,
    onTaskCheckedChange,
    onOpenAssigneePicker,
    onOpenDatePicker
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    team: SuccessRoomTeamMember[];
    planAccordions: SuccessRoomPlanAccordion[];
    plan: SuccessRoomPlanState;
    openAccordionKey: string | null;
    onOpenAccordion: (accordionKey: string) => void;
    onTaskCheckedChange: (taskKey: string, checked: boolean) => void;
    onOpenAssigneePicker: (taskKey: string) => void;
    onOpenDatePicker: (taskKey: string, selectedDate: Date | null) => void;
  } = $props();

  let checkedTaskKeys = $derived(new Set(plan.checkedTaskKeys));

  const accordionListClasses = 'grid w-full gap-[14px]';
  const accordionItemClasses =
    'box-border rounded-[16px] border px-[18px] py-[12px] shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] sm:px-[20px] sm:py-[14px]';
  const accordionTriggerClasses =
    'grid w-full min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-[18px] border-0 bg-transparent p-0 text-left text-inherit focus-visible:rounded-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-stone-900/20 sm:gap-x-[22px]';
  const accordionTitleClasses =
    'col-start-1 row-start-1 block min-w-0 text-[15px] font-normal leading-[1.2] tracking-normal sm:text-[16px]';
  const accordionDescriptionClasses =
    'col-start-1 row-start-2 mt-[8px] block min-w-0 cursor-pointer text-[13px] leading-[1.4] tracking-normal sm:text-[14px]';
  const accordionToggleIconClasses =
    'col-start-2 row-start-1 shrink-0 self-center transition-colors duration-150';
  const accordionTaskListClasses = 'mt-[16px] grid gap-[14px]';

  const accordionCardVariants = {
    default: {
      item: 'border-stone-200/70 bg-white text-stone-900',
      title: 'text-stone-900',
      description: 'text-stone-500',
      toggleIcon: 'text-stone-400',
      taskText: 'text-stone-500',
      taskDate: 'text-stone-400'
    },
    muted: {
      item: 'border-stone-200/70 bg-stone-50 text-stone-500',
      title: 'text-stone-600',
      description: 'text-stone-400',
      toggleIcon: 'text-stone-300',
      taskText: 'text-stone-400',
      taskDate: 'text-stone-300'
    }
  } as const;

  const getAssignedTeamMember = (taskKey: string) => {
    const memberKey = plan.assigneeKeyByTaskKey[taskKey];

    return memberKey ? team.find((member) => member.key === memberKey) : undefined;
  };
</script>

<ul class={accordionListClasses} aria-label={`${resource.title} content`}>
  {#each planAccordions as item (item.key)}
    {@const isOpen = openAccordionKey === item.key}
    {@const ToggleIcon = isOpen ? MinusIcon : PlusIcon}
    {@const cardVariant = accordionCardVariants[item.variant]}
    <li class={[accordionItemClasses, cardVariant.item]}>
      <button
        type="button"
        class={accordionTriggerClasses}
        aria-expanded={isOpen}
        aria-controls={`${item.key}-tasks`}
        onclick={() => onOpenAccordion(item.key)}
      >
        <span class={[accordionTitleClasses, cardVariant.title]}>
          {item.title}
        </span>
        <span class={[accordionToggleIconClasses, cardVariant.toggleIcon]} aria-hidden="true">
          <ToggleIcon size={15} weight="bold" />
        </span>
        {#if !isOpen}
          <span class={[accordionDescriptionClasses, cardVariant.description, 'font-book']}>
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
            {@const displayDate = resolveTaskDisplayDate({
              dateOverridesByTaskKey: plan.dateOverridesByTaskKey,
              taskKey,
              fallbackDateLabel: task.date
            })}
            {@const assignedTeamMember = getAssignedTeamMember(taskKey)}
            <PlanTaskRow
              {task}
              bind:checked={
                () => checkedTaskKeys.has(taskKey),
                (checked) => onTaskCheckedChange(taskKey, checked)
              }
              {assignedTeamMember}
              {displayDate}
              textClass={cardVariant.taskText}
              dateClass={cardVariant.taskDate}
              onOpenAssignee={() => onOpenAssigneePicker(taskKey)}
              onOpenDatePicker={() => onOpenDatePicker(taskKey, displayDate)}
            />
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>
