import { deleteSuccessRoomApi } from '../api/client';
import { uploadSuccessRoomFile } from '../api/uploads';
import type { SuccessRoomEditableTextResourceSlug } from '../domain/config';

export const uploadEditableTextAttachment = async ({
  roomSlug,
  resourceSlug,
  file
}: {
  roomSlug: string;
  resourceSlug: SuccessRoomEditableTextResourceSlug;
  file: File;
}) => {
  const result = await uploadSuccessRoomFile({
    roomSlug,
    file,
    purpose: {
      type: 'editable-attachment',
      resourceSlug
    }
  });

  if (result.type !== 'editable-attachment') {
    throw new Error('Attachment upload returned an unexpected result.');
  }

  return result.attachment;
};

export const deleteEditableTextAttachment = async ({
  roomSlug,
  resourceSlug
}: {
  roomSlug: string;
  resourceSlug: SuccessRoomEditableTextResourceSlug;
}) => {
  const response = await deleteSuccessRoomApi(
    roomSlug,
    'editable-attachment',
    {
      resourceSlug
    }
  );

  if (!response.ok) {
    throw new Error('Attachment could not be removed.');
  }
};
