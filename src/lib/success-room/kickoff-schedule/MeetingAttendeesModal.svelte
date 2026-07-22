<script lang="ts">
  import ModalShell from '../ui/ModalShell.svelte';
  import type { SuccessRoomTeamMember } from '../domain/types';

  let {
    open,
    team,
    attendeeKeys,
    onToggleMember,
    onClose
  }: {
    open: boolean;
    team: SuccessRoomTeamMember[];
    attendeeKeys: string[];
    onToggleMember: (memberKey: string) => void;
    onClose: () => void;
  } = $props();
</script>

<ModalShell {open} title="Add attendees" {onClose}>
  {#if team.length === 0}
    <p class="m-0 text-[14px] font-book leading-[1.4] text-stone-500">
      No team members yet.
    </p>
  {:else}
    <ul class="grid gap-[10px]" aria-label="Meeting attendees">
      {#each team as member (member.key)}
        {@const selected = attendeeKeys.includes(member.key)}
        <li>
          <button
            type="button"
            class={[
              'grid w-full min-w-0 cursor-pointer grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-[12px] rounded-[8px] border bg-white px-[10px] py-[9px] text-left text-inherit transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20',
              selected ? 'border-stone-400' : 'border-stone-200 hover:border-stone-300'
            ]}
            aria-pressed={selected}
            onclick={() => onToggleMember(member.key)}
          >
            {#if member.imageHref}
              <img
                src={member.imageHref}
                alt=""
                class="h-[36px] w-[36px] rounded-full object-cover grayscale"
                loading="lazy"
                decoding="async"
              />
            {:else}
              <span
                class="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-stone-200/70 text-[14px] font-normal text-stone-600"
                aria-hidden="true"
              >
                {member.name.slice(0, 1)}
              </span>
            {/if}

            <span class="min-w-0">
              <span class="block truncate text-[14px] font-normal leading-[1.15] text-stone-900">
                {member.name}
              </span>
              <span class="mt-[5px] block truncate text-[13px] font-book leading-[1.2] text-stone-500">
                {member.role}
              </span>
            </span>

            {#if selected}
              <span class="text-[12px] font-book leading-none text-stone-500">
                Attending
              </span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</ModalShell>
