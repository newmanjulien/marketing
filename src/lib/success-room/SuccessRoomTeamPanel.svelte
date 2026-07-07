<script lang="ts">
  import SuccessRoomTeamGallery from './SuccessRoomTeamGallery.svelte';
  import type { SuccessRoomTeamMember } from './successRoomTypes';

  let { team }: { team: SuccessRoomTeamMember[] } = $props();
</script>

<div class="grid gap-[24px]">
  <p
    class="max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]"
  >
    Meet the people supporting this evaluation, including the team members helping align the proof
    of concept, answer technical questions, and keep next steps moving as the work progresses.
  </p>

  <SuccessRoomTeamGallery {team} />
</div>
