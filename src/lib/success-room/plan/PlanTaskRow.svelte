<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import { formatTaskDateLabel } from './planDates';
  import type { SuccessRoomPlanTask, SuccessRoomTeamMember } from '../domain/types';

  let {
    task,
    checked = $bindable(),
    assignedTeamMember,
    displayDate,
    textClass,
    dateClass,
    onOpenAssignee,
    onOpenDatePicker
  }: {
    task: SuccessRoomPlanTask;
    checked: boolean;
    assignedTeamMember?: SuccessRoomTeamMember;
    displayDate: Date | null;
    textClass: string;
    dateClass: string;
    onOpenAssignee: () => void;
    onOpenDatePicker: () => void;
  } = $props();

  const emptyAssigneeClasses =
    'flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-[11px] font-medium leading-none text-stone-400';
  const checkboxId = $derived(`plan-task-${task.key}`);
</script>

<li class="min-w-0">
  <div
    class={[
      'grid min-w-0 grid-cols-[14px_minmax(0,1fr)_20px_52px] items-start gap-[10px] text-[13px] font-book leading-[1.4] tracking-normal sm:gap-[14px] sm:text-[14px]',
      textClass
    ]}
  >
    <span class="flex h-[20px] items-center">
      <Checkbox
        id={checkboxId}
        class="h-[14px] w-[14px] flex-none opacity-100"
        bind:checked
      />
    </span>

    <label for={checkboxId} class="min-w-0 cursor-pointer">
      <span class="block min-w-0">{task.title}</span>
    </label>

    <span class="flex h-[20px] w-full items-center justify-center">
      <button
        type="button"
        class="flex h-[20px] w-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-900/20"
        aria-label={`${assignedTeamMember ? 'Change' : 'Assign'} owner for ${task.title}`}
        onclick={onOpenAssignee}
      >
        {#if assignedTeamMember?.imageHref}
          <img
            src={assignedTeamMember.imageHref}
            alt=""
            title={assignedTeamMember.name}
            class="h-[20px] w-[20px] shrink-0 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        {:else if assignedTeamMember}
          <span class={emptyAssigneeClasses} title={assignedTeamMember.name} aria-label={assignedTeamMember.name}>
            {assignedTeamMember.name.slice(0, 1)}
          </span>
        {:else}
          <span class={emptyAssigneeClasses} aria-label="Unassigned">?</span>
        {/if}
      </button>
    </span>

    <span class="flex h-[20px] w-full items-center justify-end">
      <button
        type="button"
        class={[
          'cursor-pointer whitespace-nowrap rounded-[5px] border-0 bg-transparent p-0 font-body text-[13px] font-book leading-[1.4] tracking-normal transition-colors duration-150 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-stone-900/20 sm:text-[14px]',
          displayDate ? dateClass : 'italic text-stone-400'
        ]}
        aria-label={`${displayDate ? 'Change' : 'Set'} date for ${task.title}`}
        onclick={onOpenDatePicker}
      >
        {displayDate ? formatTaskDateLabel(displayDate) : 'Set date'}
      </button>
    </span>
  </div>
</li>
