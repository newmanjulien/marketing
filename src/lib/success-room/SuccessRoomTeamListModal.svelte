<script lang="ts">
  import ModalShell from '$lib/ui/ModalShell.svelte';
  import type { SuccessRoomTeamMember } from './successRoomTypes';

  let {
    open,
    team,
    onClose
  }: {
    open: boolean;
    team: SuccessRoomTeamMember[];
    onClose: () => void;
  } = $props();
</script>

<ModalShell {open} title="Team" onClose={onClose}>
  <ul class="grid gap-[14px]" aria-label="Team members">
    {#each team as member (member.id)}
      <li class="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-[12px]">
        <img
          src={member.imageHref}
          alt=""
          class="h-[44px] w-[44px] rounded-full object-cover grayscale"
          loading="lazy"
          decoding="async"
        />

        <div class="min-w-0">
          <h3 class="m-0 truncate text-[14px] font-normal leading-[1.15] tracking-normal text-stone-900">
            {member.name}
          </h3>
          <p class="mt-[5px] truncate text-[13px] font-book leading-[1.2] tracking-normal text-stone-500">
            {member.role}
          </p>
        </div>
      </li>
    {/each}
  </ul>
</ModalShell>
