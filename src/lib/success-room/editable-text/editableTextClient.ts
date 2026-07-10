import { getSuccessRoomApiPath } from '../domain/urls';
import type {
  SuccessRoomDeleteApiBody,
  SuccessRoomPostApiBody,
  SuccessRoomUploadedFileInput
} from '../domain/api';
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
  const contentType = file.type || 'application/octet-stream';
  const uploadUrlResponse = await fetch(getSuccessRoomApiPath(roomSlug, 'upload-url'), {
    method: 'POST'
  });

  if (!uploadUrlResponse.ok) {
    return null;
  }

  const { uploadUrl }: { uploadUrl: string } = await uploadUrlResponse.json();
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'content-type': contentType
    },
    body: file
  });

  if (!uploadResponse.ok) {
    return null;
  }

  const { storageId }: { storageId: SuccessRoomUploadedFileInput['storageId'] } =
    await uploadResponse.json();
  const attachmentResponse = await fetch(getSuccessRoomApiPath(roomSlug, 'editable-attachment'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      resourceSlug,
      file: {
        storageId,
        filename: file.name,
        contentType,
        byteSize: file.size
      }
    } satisfies SuccessRoomPostApiBody<'editable-attachment'>)
  });

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
  await fetch(getSuccessRoomApiPath(roomSlug, 'editable-attachment'), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      resourceSlug
    } satisfies SuccessRoomDeleteApiBody<'editable-attachment'>)
  });
};
