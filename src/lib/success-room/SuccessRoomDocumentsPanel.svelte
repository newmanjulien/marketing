<script lang="ts">
  import SuccessRoomResourceCard from './SuccessRoomResourceCard.svelte';
  import type { SuccessRoom } from './successRoomTypes';

  let { room }: { room: SuccessRoom } = $props();
</script>

<nav
  class="grid grid-cols-1 gap-x-[32px] gap-y-[38px] sm:grid-cols-2"
  aria-label={`${room.prospectName} success room resources`}
>
  {#each room.resources as resource (resource.slug)}
    <SuccessRoomResourceCard {room} {resource} />
  {/each}
</nav>
