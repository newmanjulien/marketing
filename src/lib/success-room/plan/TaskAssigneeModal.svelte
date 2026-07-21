<script lang="ts">
  import ModalShell from '$lib/success-room/ui/ModalShell.svelte';
  import type { SuccessRoomTeamMember } from '../domain/types';

  let {
    open,
    team,
    selectedMemberKey,
    onSelectMemberKey,
    onClose
  }: {
    open: boolean;
    team: SuccessRoomTeamMember[];
    selectedMemberKey?: string;
    onSelectMemberKey: (memberKey: string | null) => void;
    onClose: () => void;
  } = $props();

  const selectMember = (memberKey: string | null) => {
    onSelectMemberKey(memberKey);
    onClose();
  };
</script>

<ModalShell {open} title="Assign task" onClose={onClose}>
  {#if team.length === 0}
    <p class="m-0 text-[14px] font-book leading-[1.4] tracking-normal text-stone-500">
      No team members yet.
    </p>
  {:else}
    <div class="grid gap-[16px]">
      <ul class="grid gap-[10px]" aria-label="Task assignees">
        {#each team as member (member.key)}
          {@const selected = selectedMemberKey === member.key}
          <li>
            <button
              type="button"
              class={[
                'grid w-full min-w-0 cursor-pointer grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-[12px] rounded-[8px] border bg-white px-[10px] py-[9px] text-left text-inherit transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20',
                selected ? 'border-stone-400' : 'border-stone-200 hover:border-stone-300'
              ]}
              aria-pressed={selected}
              onclick={() => selectMember(member.key)}
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
                <span class="block truncate text-[14px] font-normal leading-[1.15] tracking-normal text-stone-900">
                  {member.name}
                </span>
                <span class="mt-[5px] block truncate text-[13px] font-book leading-[1.2] tracking-normal text-stone-500">
                  {member.role}
                </span>
              </span>

              {#if selected}
                <span class="text-[12px] font-book leading-none tracking-normal text-stone-500">
                  Selected
                </span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>

      {#if selectedMemberKey}
        <button
          type="button"
          class="h-[36px] justify-self-start rounded-[8px] border border-stone-200 bg-white px-[13px] font-body text-[13px] font-book leading-none tracking-normal text-stone-600 transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20"
          onclick={() => selectMember(null)}
        >
          Clear assignment
        </button>
      {/if}
    </div>
  {/if}
</ModalShell>
