import { getSuccessRoomApiPath } from '../domain/urls';
import type { SuccessRoomEditableTextState, SuccessRoomLinkedFileMetadata } from '../domain/types';

export const uploadEditableTextAttachment = async ({
  roomSlug,
  resourceSlug,
  file,
  state
}: {
  roomSlug: string;
  resourceSlug: string;
  file: File;
  state: SuccessRoomEditableTextState;
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

  const { storageId }: { storageId: string } = await uploadResponse.json();
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
      },
      state
    })
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
  resourceSlug: string;
}) => {
  await fetch(getSuccessRoomApiPath(roomSlug, 'editable-attachment'), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      resourceSlug
    })
  });
};
