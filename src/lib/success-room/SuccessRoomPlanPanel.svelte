<script lang="ts">
  import { MinusIcon, PlusIcon } from 'phosphor-svelte';
  import { cubicOut } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';
  import SuccessRoomCheckbox from './SuccessRoomCheckbox.svelte';
  import { mutualSuccessPlanItems, type MutualSuccessPlanItem } from './successRoomMutualSuccessPlan';
  import type { SuccessRoomMutualSuccessPlanResource } from './successRoomTypes';

  let {
    resource
  }: {
    resource: SuccessRoomMutualSuccessPlanResource;
  } = $props();

  let openItemId = $state<string | null>(null);
  let checkedTaskIds = $state(new Set<string>());

  const accordionListClasses = 'grid w-full gap-[14px]';
  const accordionItemClasses =
    'box-border rounded-[10px] border px-[18px] py-[12px] sm:px-[20px] sm:py-[14px]';
  const accordionTriggerClasses =
    'grid w-full min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-[18px] border-0 bg-transparent p-0 text-left text-inherit focus-visible:rounded-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-stone-900/20 sm:gap-x-[22px]';
  const accordionTitleClasses =
    'col-start-1 row-start-1 block min-w-0 text-[15px] font-normal leading-[1.2] tracking-normal sm:text-[16px]';
  const accordionDescriptionClasses =
    'col-start-1 row-start-2 mt-[8px] block min-w-0 cursor-pointer text-[13px] leading-[1.4] tracking-normal sm:text-[14px]';
  const accordionToggleIconClasses =
    'col-start-2 row-start-1 shrink-0 self-center transition-colors duration-150';
  const accordionTaskListClasses = 'mt-[16px] grid gap-[14px]';
  const accordionTaskItemClasses = 'min-w-0';
  const accordionTaskLabelClasses =
    'flex cursor-pointer items-start gap-[11px] text-[13px] leading-[1.4] tracking-normal sm:text-[14px]';
  const accordionTaskContentClasses =
    'grid w-full min-w-0 grid-cols-[minmax(0,1fr)_20px_max-content] items-start gap-[10px] sm:gap-[14px]';
  const accordionTaskTitleClasses = 'min-w-0';
  const accordionTaskDateClasses = 'whitespace-nowrap';
  const accordionTaskAssigneeImageClasses =
    'h-[20px] w-[20px] shrink-0 rounded-full object-cover';
  const accordionTaskEmptyAssigneeClasses =
    'flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-[11px] font-medium leading-none text-stone-400';
  const accordionCheckboxClasses =
    'mt-[3px] h-[13px] w-[13px] flex-none opacity-100';

  const accordionCardVariants = {
    default: {
      item: 'border-stone-200 bg-white text-stone-900',
      title: 'text-stone-900',
      description: 'text-stone-500',
      toggleIcon: 'text-stone-400',
      taskLabel: 'text-stone-500',
      taskDate: 'text-stone-400'
    },
    muted: {
      item: 'border-stone-100 bg-stone-50 text-stone-500',
      title: 'text-stone-600',
      description: 'text-stone-400',
      toggleIcon: 'text-stone-300',
      taskLabel: 'text-stone-400',
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

  const getAccordionCardVariant = (item: MutualSuccessPlanItem) => {
    const variantKey: AccordionCardVariantKey = item.variant ?? 'default';

    return accordionCardVariants[variantKey];
  };

  const setTaskChecked = (taskId: string, checked: boolean) => {
    const nextCheckedTaskIds = new Set(checkedTaskIds);

    if (checked) {
      nextCheckedTaskIds.add(taskId);
    } else {
      nextCheckedTaskIds.delete(taskId);
    }

    checkedTaskIds = nextCheckedTaskIds;
  };
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
            <li class={accordionTaskItemClasses}>
              <label class={[accordionTaskLabelClasses, cardVariant.taskLabel, 'font-book']}>
                <SuccessRoomCheckbox
                  id={taskId}
                  class={accordionCheckboxClasses}
                  checked={checkedTaskIds.has(taskId)}
                  onCheckedChange={(checked) => setTaskChecked(taskId, checked)}
                />
                <span class={accordionTaskContentClasses}>
                  <span class={accordionTaskTitleClasses}>{task.title}</span>
                  {#if task.assigneeImageHref}
                    <img
                      src={task.assigneeImageHref}
                      alt=""
                      class={accordionTaskAssigneeImageClasses}
                      loading="lazy"
                      decoding="async"
                    />
                  {:else}
                    <span class={accordionTaskEmptyAssigneeClasses} aria-label="Unassigned">?</span>
                  {/if}
                  <span class={[accordionTaskDateClasses, cardVariant.taskDate]}>{task.date}</span>
                </span>
              </label>
            </li>
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>
