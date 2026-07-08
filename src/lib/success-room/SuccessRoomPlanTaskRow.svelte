<script lang="ts">
  import SuccessRoomCheckbox from './SuccessRoomCheckbox.svelte';
  import type { MutualSuccessPlanTask } from './successRoomMutualSuccessPlan';

  let {
    task,
    taskId,
    checked,
    displayDateLabel,
    textClass,
    dateClass,
    onCheckedChange,
    onOpenTeam,
    onOpenDatePicker
  }: {
    task: MutualSuccessPlanTask;
    taskId: string;
    checked: boolean;
    displayDateLabel: string;
    textClass: string;
    dateClass: string;
    onCheckedChange: (checked: boolean) => void;
    onOpenTeam: () => void;
    onOpenDatePicker: () => void;
  } = $props();

  const taskItemClasses = 'min-w-0';
  const taskRowClasses =
    'grid min-w-0 grid-cols-[13px_minmax(0,1fr)_20px_52px] items-start gap-[10px] text-[13px] leading-[1.4] tracking-normal sm:gap-[14px] sm:text-[14px]';
  const taskCheckboxCellClasses = 'flex h-[20px] items-center';
  const taskLabelClasses = 'min-w-0 cursor-pointer';
  const taskTitleClasses = 'block min-w-0';
  const taskAssigneeCellClasses = 'flex h-[20px] w-full items-center justify-center';
  const taskDateCellClasses = 'flex h-[20px] w-full items-center justify-end';
  const taskDateButtonClasses =
    'cursor-pointer whitespace-nowrap rounded-[5px] border-0 bg-transparent p-0 font-body text-[13px] font-book leading-[1.4] tracking-normal transition-colors duration-150 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-900/20 sm:text-[14px]';
  const taskAssigneeImageClasses = 'h-[20px] w-[20px] shrink-0 rounded-full object-cover';
  const taskEmptyAssigneeClasses =
    'flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-stone-200/70 bg-white text-[11px] font-medium leading-none text-stone-400';
  const taskAssigneeButtonClasses =
    'flex h-[20px] w-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-900/20';
  const checkboxClasses = 'h-[13px] w-[13px] flex-none opacity-100';
</script>

<li class={taskItemClasses}>
  <div class={[taskRowClasses, textClass, 'font-book']}>
    <span class={taskCheckboxCellClasses}>
      <SuccessRoomCheckbox
        id={taskId}
        class={checkboxClasses}
        {checked}
        onCheckedChange={onCheckedChange}
      />
    </span>

    <label for={taskId} class={taskLabelClasses}>
      <span class={taskTitleClasses}>{task.title}</span>
    </label>

    <span class={taskAssigneeCellClasses}>
      <button
        type="button"
        class={taskAssigneeButtonClasses}
        aria-label="View team members"
        onclick={onOpenTeam}
      >
        {#if task.assigneeImageHref}
          <img
            src={task.assigneeImageHref}
            alt=""
            class={taskAssigneeImageClasses}
            loading="lazy"
            decoding="async"
          />
        {:else}
          <span class={taskEmptyAssigneeClasses} aria-label="Unassigned">?</span>
        {/if}
      </button>
    </span>

    <span class={taskDateCellClasses}>
      <button
        type="button"
        class={[taskDateButtonClasses, dateClass]}
        aria-label={`Change date for ${task.title}`}
        onclick={onOpenDatePicker}
      >
        {displayDateLabel}
      </button>
    </span>
  </div>
</li>
