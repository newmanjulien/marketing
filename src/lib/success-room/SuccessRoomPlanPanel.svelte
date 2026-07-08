<script lang="ts">
  import { MinusIcon, PlusIcon } from 'phosphor-svelte';
  import { cubicOut } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';
  import SuccessRoomDatePickerModal from './SuccessRoomDatePickerModal.svelte';
  import SuccessRoomPlanTaskRow from './SuccessRoomPlanTaskRow.svelte';
  import SuccessRoomTeamListModal from './SuccessRoomTeamListModal.svelte';
  import { mutualSuccessPlanItems, type MutualSuccessPlanItem } from './successRoomMutualSuccessPlan';
  import { formatTaskDateLabel, parseTaskDateLabel } from './successRoomTaskDates';
  import type {
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanPatch,
    SuccessRoomPlanState,
    SuccessRoomTeamMember
  } from './successRoomTypes';

  type DatePickerContext = {
    taskId: string;
    selectedDate: Date;
  };

  let {
    resource,
    team,
    plan,
    onPlanChange
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
    team: SuccessRoomTeamMember[];
    plan: SuccessRoomPlanState;
    onPlanChange: (patch: SuccessRoomPlanPatch) => void;
  } = $props();

  let openItemId = $state<string | null>(null);
  let teamListModalOpen = $state(false);
  let datePickerContext = $state<DatePickerContext | null>(null);
  let checkedTaskIds = $derived(new Set(plan.checkedTaskIds));
  let taskDateOverrides = $derived(plan.dateOverrides);

  const fallbackDatePickerDate = new Date();
  const accordionListClasses = 'grid w-full gap-[14px]';
  const accordionItemClasses =
    'box-border rounded-[10px] border px-[18px] py-[12px] shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] sm:px-[20px] sm:py-[14px]';
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

  type AccordionCardVariantKey = NonNullable<MutualSuccessPlanItem['variant']> | 'default';

  const accordionMotion = {
    openDurationMs: 360,
    closeDurationMs: 200,
    panelMarginTopPx: 16,
    openOvershoot: 0.018,
    openSettleStart: 0.84
  } as const;

  const prefersReducedMotion = (node: Element) =>
    node.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

  const getAccordionOpenProgress = (t: number) => {
    if (t < accordionMotion.openSettleStart) {
      return (
        cubicOut(t / accordionMotion.openSettleStart) * (1 + accordionMotion.openOvershoot)
      );
    }

    const settleProgress =
      (t - accordionMotion.openSettleStart) / (1 - accordionMotion.openSettleStart);

    return 1 + accordionMotion.openOvershoot * (1 - cubicOut(settleProgress));
  };

  const mutualSuccessPlanOpen = (node: Element): TransitionConfig => {
    const height = node.scrollHeight;
    const reducedMotion = prefersReducedMotion(node);

    return {
      duration: reducedMotion ? 1 : accordionMotion.openDurationMs,
      css: (t) => {
        const progress = reducedMotion ? t : getAccordionOpenProgress(t);

        return `
          height: ${height * progress}px;
          margin-top: ${accordionMotion.panelMarginTopPx * Math.min(progress, 1)}px;
          overflow: hidden;
        `;
      }
    };
  };

  const mutualSuccessPlanClose = (node: Element): TransitionConfig => {
    const height = node.scrollHeight;
    const reducedMotion = prefersReducedMotion(node);

    return {
      duration: reducedMotion ? 1 : accordionMotion.closeDurationMs,
      easing: cubicOut,
      css: (t) => `
        height: ${height * t}px;
        margin-top: ${accordionMotion.panelMarginTopPx * t}px;
        overflow: hidden;
      `
    };
  };

  const toggleItem = (itemId: string) => {
    openItemId = openItemId === itemId ? null : itemId;
  };

  const getTaskId = (itemId: string, taskIndex: number) => `${itemId}-task-${taskIndex}`;

  const parseIsoDate = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  };

  const formatIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getTaskDisplayDate = (taskId: string, dateLabel: string) =>
    taskDateOverrides[taskId] ? parseIsoDate(taskDateOverrides[taskId]) : parseTaskDateLabel(dateLabel);

  const getAccordionCardVariant = (item: MutualSuccessPlanItem) => {
    const variantKey: AccordionCardVariantKey = item.variant ?? 'default';

    return accordionCardVariants[variantKey];
  };

  const getTaskWithRoomAssignee = (task: MutualSuccessPlanItem['tasks'][number]) => ({
    ...task,
    assigneeImageHref:
      task.assigneeImageHref === '/julien.png'
        ? (team.find((member) => member.id === 'julien-newman')?.imageHref ?? task.assigneeImageHref)
        : task.assigneeImageHref
  });

  const setTaskChecked = (taskId: string, checked: boolean) => {
    const nextCheckedTaskIds = new Set(plan.checkedTaskIds);

    if (checked) {
      nextCheckedTaskIds.add(taskId);
    } else {
      nextCheckedTaskIds.delete(taskId);
    }

    onPlanChange({
      checkedTaskIds: Array.from(nextCheckedTaskIds)
    });
  };

  const openTeamListModal = () => {
    teamListModalOpen = true;
  };

  const openDatePickerModal = (taskId: string, dateLabel: string) => {
    datePickerContext = {
      taskId,
      selectedDate: getTaskDisplayDate(taskId, dateLabel)
    };
  };

  const closeDatePickerModal = () => {
    datePickerContext = null;
  };

  const selectTaskDate = (date: Date) => {
    if (!datePickerContext) {
      return;
    }

    onPlanChange({
      dateOverrides: {
        ...plan.dateOverrides,
        [datePickerContext.taskId]: formatIsoDate(date)
      }
    });
  };

  const selectedDatePickerDate = $derived(datePickerContext?.selectedDate ?? fallbackDatePickerDate);
</script>

<ul class={accordionListClasses} aria-label={`${resource.title} content`}>
  {#each mutualSuccessPlanItems as item (item.id)}
    {@const isOpen = openItemId === item.id}
    {@const ToggleIcon = isOpen ? MinusIcon : PlusIcon}
    {@const cardVariant = getAccordionCardVariant(item)}
    <li class={[accordionItemClasses, cardVariant.item]}>
      <button
        type="button"
        class={accordionTriggerClasses}
        aria-expanded={isOpen}
        aria-controls={`${item.id}-tasks`}
        onclick={() => toggleItem(item.id)}
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
          id={`${item.id}-tasks`}
          class={accordionTaskListClasses}
          aria-label={`${item.title} tasks`}
          in:mutualSuccessPlanOpen
          out:mutualSuccessPlanClose
        >
          {#each item.tasks as task, taskIndex (task.title)}
            {@const taskId = getTaskId(item.id, taskIndex)}
            {@const displayDate = getTaskDisplayDate(taskId, task.date)}
            {@const displayTask = getTaskWithRoomAssignee(task)}
            <SuccessRoomPlanTaskRow
              task={displayTask}
              {taskId}
              checked={checkedTaskIds.has(taskId)}
              displayDateLabel={formatTaskDateLabel(displayDate)}
              textClass={cardVariant.taskText}
              dateClass={cardVariant.taskDate}
              onCheckedChange={(checked) => setTaskChecked(taskId, checked)}
              onOpenTeam={openTeamListModal}
              onOpenDatePicker={() => openDatePickerModal(taskId, task.date)}
            />
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>

<SuccessRoomTeamListModal
  open={teamListModalOpen}
  {team}
  onClose={() => (teamListModalOpen = false)}
/>

<SuccessRoomDatePickerModal
  open={datePickerContext !== null}
  selectedDate={selectedDatePickerDate}
  onSelectDate={selectTaskDate}
  onClose={closeDatePickerModal}
/>
