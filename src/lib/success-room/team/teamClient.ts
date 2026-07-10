import { postSuccessRoomApi, uploadSuccessRoomFile } from '../api/client';
import type { SuccessRoomTeamMember } from '../domain/types';

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

  const photo = await uploadSuccessRoomFile(roomSlug, photoFile);

  if (!photo) {
    throw new Error('Team member photo could not be uploaded.');
  }

  const response = await postSuccessRoomApi(
    roomSlug,
    'team-members',
    {
      name,
      role,
      photo
    }
  );

  if (!response.ok) {
    throw new Error('Team member could not be added.');
  }

  const { member }: { member: SuccessRoomTeamMember } = await response.json();

  return member;
};
