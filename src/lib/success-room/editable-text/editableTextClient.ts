import type { api } from '../../../../convex/_generated/api';
import type { FunctionReturnType } from 'convex/server';
import { deleteSuccessRoomApi, postSuccessRoomApi } from '../api/client';
import { uploadSuccessRoomFile } from '../api/uploads';
import type { SuccessRoomLinkedFileMetadata } from '../domain/types';

export const uploadEditableTextAttachment = async ({
  roomSlug,
  file
}: {
  roomSlug: string;
  file: File;
}): Promise<SuccessRoomLinkedFileMetadata> => {
  const storageId = await uploadSuccessRoomFile({ roomSlug, file });
  const response = await postSuccessRoomApi(roomSlug, 'editable-attachment', {
    storageId,
    filename: file.name
  });

  if (!response.ok) {
    throw new Error('Attachment could not be uploaded.');
  }

  return (await response.json()) as FunctionReturnType<
    typeof api.rooms.claimEditableAttachment
  >;
};

export const deleteEditableTextAttachment = async ({ roomSlug }: { roomSlug: string }) => {
  const response = await deleteSuccessRoomApi(roomSlug, 'editable-attachment');

  if (!response.ok) {
    throw new Error('Attachment could not be removed.');
  }
};
