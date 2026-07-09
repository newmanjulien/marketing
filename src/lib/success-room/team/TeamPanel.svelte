<script lang="ts">
  import AddTeamMemberModal from './AddTeamMemberModal.svelte';
  import TeamGallery from './TeamGallery.svelte';
  import { createTeamMember } from './teamClient';
  import type { SuccessRoomTeamMember } from '../domain/types';

  let {
    roomSlug,
    team
  }: {
    roomSlug: string;
    team: SuccessRoomTeamMember[];
  } = $props();

  let optimisticRoomSlug = $state('');
  let optimisticTeamMembers = $state<SuccessRoomTeamMember[]>([]);
  let addTeamMemberModalOpen = $state(false);

  let localTeam = $derived.by(() => {
    const serverTeamMemberIds = new Set(team.map((member) => member.id));

    return [
      ...team,
      ...optimisticTeamMembers.filter((member) => !serverTeamMemberIds.has(member.id))
    ];
  });

  $effect(() => {
    if (optimisticRoomSlug !== roomSlug) {
      optimisticRoomSlug = roomSlug;
      optimisticTeamMembers = [];
    }
  });

  const addTeamMember = async (member: {
    name: string;
    role: string;
    photoFile: File;
  }) => {
    const createdMember = await createTeamMember({
      roomSlug,
      ...member
    });

    optimisticTeamMembers = [...optimisticTeamMembers, createdMember];
  };
</script>

<div class="grid gap-[24px]">
  <p
    class="max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]"
  >
    Meet the people supporting this evaluation, including the team members helping align the proof
    of concept, answer technical questions, and keep next steps moving as the work progresses.
  </p>

  <TeamGallery
    team={localTeam}
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
  onAddTeamMember={addTeamMember}
/>
