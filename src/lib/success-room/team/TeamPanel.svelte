<script lang="ts">
  import AddTeamMemberModal from './AddTeamMemberModal.svelte';
  import TeamGallery from './TeamGallery.svelte';
  import type { TeamMemberInput } from './teamClient';
  import type { SuccessRoomTeamMember } from '../domain/types';

  let {
    team,
    onAddTeamMember
  }: {
    team: SuccessRoomTeamMember[];
    onAddTeamMember: (member: TeamMemberInput) => Promise<void>;
  } = $props();

  let addTeamMemberModalOpen = $state(false);
</script>

<div class="grid gap-[24px]">
  <p
    class="max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]"
  >
    Meet the people supporting this evaluation, including team members from Overbase and your team
  </p>

  <TeamGallery
    {team}
    onAddTeamMember={() => {
      addTeamMemberModalOpen = true;
    }}
  />
</div>

<AddTeamMemberModal
  open={addTeamMemberModalOpen}
  onClose={() => {
    addTeamMemberModalOpen = false;
  }}
  {onAddTeamMember}
/>
