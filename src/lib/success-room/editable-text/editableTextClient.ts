import { deleteSuccessRoomApi } from '../api/client';
import { uploadSuccessRoomFile } from '../api/uploads';

export const uploadEditableTextAttachment = async ({
  roomSlug,
  file
}: {
  roomSlug: string;
  file: File;
}) => {
  const result = await uploadSuccessRoomFile({
    roomSlug,
    file,
    purpose: { type: 'editable-attachment' }
  });

  if (result.type !== 'editable-attachment') {
    throw new Error('Attachment upload returned an unexpected result.');
  }

  return result.attachment;
};

export const deleteEditableTextAttachment = async ({ roomSlug }: { roomSlug: string }) => {
  const response = await deleteSuccessRoomApi(roomSlug, 'editable-attachment');

  if (!response.ok) {
    throw new Error('Attachment could not be removed.');
  }
};
