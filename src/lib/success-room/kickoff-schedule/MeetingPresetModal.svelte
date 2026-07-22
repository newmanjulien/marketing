<script lang="ts">
  import type { SuccessRoomKickoffMeeting } from '$shared/successRoomKickoffSchedule';
  import ModalShell from '../ui/ModalShell.svelte';
  import {
    createKickoffMeeting,
    createKickoffMeetingFromPreset,
    kickoffMeetingPresets
  } from './meetings';

  let {
    open,
    onCreate,
    onClose
  }: {
    open: boolean;
    onCreate: (meeting: SuccessRoomKickoffMeeting) => void;
    onClose: () => void;
  } = $props();

  const optionClasses =
    'grid w-full min-w-0 cursor-pointer gap-[5px] rounded-[8px] border border-stone-200 bg-white px-[12px] py-[10px] text-left text-inherit transition-colors duration-150 hover:border-stone-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';
</script>

<ModalShell {open} title="Add a meeting" {onClose}>
  <ul class="grid gap-[10px]" aria-label="Meeting types">
    <li>
      <button
        type="button"
        class={optionClasses}
        onclick={() => onCreate(createKickoffMeeting(''))}
      >
        <span class="block text-[14px] font-normal leading-[1.15] text-stone-900">
          Blank meeting
        </span>
        <span class="block text-[13px] font-book leading-[1.4] text-stone-500">
          Start from an empty agenda
        </span>
      </button>
    </li>

    {#each kickoffMeetingPresets as preset (preset.key)}
      <li>
        <button
          type="button"
          class={optionClasses}
          onclick={() => onCreate(createKickoffMeetingFromPreset(preset))}
        >
          <span class="block text-[14px] font-normal leading-[1.15] text-stone-900">
            {preset.title}
          </span>
          <span class="block text-[13px] font-book leading-[1.4] text-stone-500">
            {preset.agenda.join(' · ')}
          </span>
        </button>
      </li>
    {/each}
  </ul>
</ModalShell>
