<script lang="ts">
  import SuccessRoomAddTeamMemberModal from './SuccessRoomAddTeamMemberModal.svelte';
  import SuccessRoomTeamGallery from './SuccessRoomTeamGallery.svelte';
  import type { SuccessRoomTeamMember } from './successRoomTypes';

  type AddedTeamMember = {
    id: string;
    name: string;
    role: string;
    email?: string;
  };

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
    email?: string;
  }) => {
    const response = await fetch(`/success-room/${roomSlug}/api/team-members`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(member)
    });

    if (!response.ok) {
      throw new Error('Team member could not be added.');
    }

    const { member: createdMember }: { member: AddedTeamMember } = await response.json();

    optimisticTeamMembers = [
      ...optimisticTeamMembers,
      {
        ...createdMember,
        imageHref: ''
      }
    ];
  };
</script>

<div class="grid gap-[24px]">
  <p
    class="max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]"
  >
    Meet the people supporting this evaluation, including the team members helping align the proof
    of concept, answer technical questions, and keep next steps moving as the work progresses.
  </p>

  <SuccessRoomTeamGallery
    team={localTeam}
    onAddTeamMember={() => {
      addTeamMemberModalOpen = true;
    }}
  />
</div>

<SuccessRoomAddTeamMemberModal
  open={addTeamMemberModalOpen}
  onClose={() => {
    addTeamMemberModalOpen = false;
  }}
  onAddTeamMember={addTeamMember}
/>
