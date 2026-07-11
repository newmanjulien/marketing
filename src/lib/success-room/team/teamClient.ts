import { uploadSuccessRoomFile } from '../api/uploads';
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

  const result = await uploadSuccessRoomFile({
    roomSlug,
    file: photoFile,
    purpose: {
      type: 'team-member-photo',
      name,
      role
    }
  });

  if (result.type !== 'team-member-photo') {
    throw new Error('Team member upload returned an unexpected result.');
  }

  return result.member;
};
