<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import type { SuccessRoomPlanTask, SuccessRoomTeamMember } from '../domain/types';

  let {
    task,
    taskKey,
    checked = $bindable(false),
    assignedTeamMember,
    displayDateLabel,
    textClass,
    dateClass,
    onOpenAssignee,
    onOpenDatePicker
  }: {
    task: SuccessRoomPlanTask;
    taskKey: string;
    checked: boolean;
    assignedTeamMember?: SuccessRoomTeamMember;
    displayDateLabel: string;
    textClass: string;
    dateClass: string;
    onOpenAssignee: () => void;
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
  const checkboxId = $derived(`plan-task-${taskKey}`);
</script>

<li class={taskItemClasses}>
  <div class={[taskRowClasses, textClass, 'font-book']}>
    <span class={taskCheckboxCellClasses}>
      <Checkbox
        id={checkboxId}
        class={checkboxClasses}
        bind:checked
      />
    </span>

    <label for={checkboxId} class={taskLabelClasses}>
      <span class={taskTitleClasses}>{task.title}</span>
    </label>

    <span class={taskAssigneeCellClasses}>
      <button
        type="button"
        class={taskAssigneeButtonClasses}
        aria-label={`${assignedTeamMember ? 'Change' : 'Assign'} owner for ${task.title}`}
        onclick={onOpenAssignee}
      >
        {#if assignedTeamMember?.imageHref}
          <img
            src={assignedTeamMember.imageHref}
            alt=""
            title={assignedTeamMember.name}
            class={taskAssigneeImageClasses}
            loading="lazy"
            decoding="async"
          />
        {:else if assignedTeamMember}
          <span class={taskEmptyAssigneeClasses} title={assignedTeamMember.name} aria-label={assignedTeamMember.name}>
            {assignedTeamMember.name.slice(0, 1)}
          </span>
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
