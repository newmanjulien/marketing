import { getSuccessRoomApiPath, getSuccessRoomTeamMemberPhotoPath } from '../domain/urls';
import type {
  SuccessRoomLinkedTeamMemberPhotoMetadata,
  SuccessRoomTeamMember,
  SuccessRoomTeamMemberPhotoMetadata
} from '../domain/types';

type AddedTeamMember = {
  id: string;
  name: string;
  role: string;
  photo?: SuccessRoomTeamMemberPhotoMetadata;
};

export type TeamMemberInput = {
  name: string;
  role: string;
  photoFile: File;
};

export const createTeamMember = async ({
  roomSlug,
  name,
  role,
  photoFile
}: TeamMemberInput & {
  roomSlug: string;
}): Promise<SuccessRoomTeamMember> => {
  if (!photoFile.type.startsWith('image/')) {
    throw new Error('Team member photo must be an image.');
  }

  const uploadUrlResponse = await fetch(getSuccessRoomApiPath(roomSlug, 'upload-url'), {
    method: 'POST'
  });

  if (!uploadUrlResponse.ok) {
    throw new Error('Team member photo could not be uploaded.');
  }

  const { uploadUrl }: { uploadUrl: string } = await uploadUrlResponse.json();
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'content-type': photoFile.type
    },
    body: photoFile
  });

  if (!uploadResponse.ok) {
    throw new Error('Team member photo could not be uploaded.');
  }

  const { storageId }: { storageId: string } = await uploadResponse.json();
  const response = await fetch(getSuccessRoomApiPath(roomSlug, 'team-members'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name,
      role,
      photo: {
        storageId,
        filename: photoFile.name,
        contentType: photoFile.type,
        byteSize: photoFile.size
      }
    })
  });

  if (!response.ok) {
    throw new Error('Team member could not be added.');
  }

  const { member }: { member: AddedTeamMember } = await response.json();
  const photoHref = getSuccessRoomTeamMemberPhotoPath(roomSlug, member.id);

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    imageHref: photoHref,
    ...(member.photo
      ? {
          photo: {
            ...member.photo,
            href: photoHref
          } satisfies SuccessRoomLinkedTeamMemberPhotoMetadata
        }
      : {})
  };
};
