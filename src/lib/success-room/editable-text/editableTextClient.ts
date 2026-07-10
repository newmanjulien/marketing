import {
  deleteSuccessRoomApi,
  postSuccessRoomApi,
  uploadSuccessRoomFile
} from '../api/client';
import type { SuccessRoomEditableTextResourceSlug } from '../domain/config';
import type { SuccessRoomLinkedFileMetadata } from '../domain/types';

export const uploadEditableTextAttachment = async ({
  roomSlug,
  resourceSlug,
  file
}: {
  roomSlug: string;
  resourceSlug: SuccessRoomEditableTextResourceSlug;
  file: File;
}) => {
  const uploadedFile = await uploadSuccessRoomFile(roomSlug, file);

  if (!uploadedFile) {
    return null;
  }

  const attachmentResponse = await postSuccessRoomApi(
    roomSlug,
    'editable-attachment',
    {
      resourceSlug,
      file: uploadedFile
    }
  );

  if (!attachmentResponse.ok) {
    return null;
  }

  const { attachment }: { attachment: SuccessRoomLinkedFileMetadata } =
    await attachmentResponse.json();

  return attachment;
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

  return response.ok;
};
