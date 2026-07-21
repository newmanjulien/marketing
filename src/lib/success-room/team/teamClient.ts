import type { api } from '$convex/_generated/api';
import type { FunctionReturnType } from 'convex/server';
import { postSuccessRoomApi } from '../api/client';
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

  const storageId = await uploadSuccessRoomFile({ roomSlug, file: photoFile });
  const response = await postSuccessRoomApi(roomSlug, 'team-member', {
    storageId,
    filename: photoFile.name,
    name,
    role
  });

  if (!response.ok) {
    throw new Error('Team member could not be created.');
  }

  return (await response.json()) as FunctionReturnType<typeof api.rooms.createTeamMember>;
};
