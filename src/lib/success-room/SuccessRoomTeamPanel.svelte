<script lang="ts">
  import SuccessRoomAddTeamMemberModal from './SuccessRoomAddTeamMemberModal.svelte';
  import SuccessRoomTeamGallery from './SuccessRoomTeamGallery.svelte';
  import type {
    SuccessRoomLinkedTeamMemberPhotoMetadata,
    SuccessRoomTeamMember,
    SuccessRoomTeamMemberPhotoMetadata
  } from './successRoomTypes';

  type AddedTeamMember = {
    id: string;
    name: string;
    role: string;
    photo?: SuccessRoomTeamMemberPhotoMetadata;
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
    photoFile: File;
  }) => {
    if (!member.photoFile.type.startsWith('image/')) {
      throw new Error('Team member photo must be an image.');
    }

    const uploadUrlResponse = await fetch(`/success-room/${roomSlug}/api/upload-url`, {
      method: 'POST'
    });

    if (!uploadUrlResponse.ok) {
      throw new Error('Team member photo could not be uploaded.');
    }

    const { uploadUrl }: { uploadUrl: string } = await uploadUrlResponse.json();
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'content-type': member.photoFile.type
      },
      body: member.photoFile
    });

    if (!uploadResponse.ok) {
      throw new Error('Team member photo could not be uploaded.');
    }

    const { storageId }: { storageId: string } = await uploadResponse.json();
    const response = await fetch(`/success-room/${roomSlug}/api/team-members`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: member.name,
        role: member.role,
        photo: {
          storageId,
          filename: member.photoFile.name,
          contentType: member.photoFile.type,
          byteSize: member.photoFile.size
        }
      })
    });

    if (!response.ok) {
      throw new Error('Team member could not be added.');
    }

    const { member: createdMember }: { member: AddedTeamMember } = await response.json();

    optimisticTeamMembers = [
      ...optimisticTeamMembers,
      {
        id: createdMember.id,
        name: createdMember.name,
        role: createdMember.role,
        imageHref: `/success-room/${roomSlug}/team-member-photo/${createdMember.id}`,
        ...(createdMember.photo
          ? {
              photo: {
                ...createdMember.photo,
                href: `/success-room/${roomSlug}/team-member-photo/${createdMember.id}`
              } satisfies SuccessRoomLinkedTeamMemberPhotoMetadata
            }
          : {})
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
