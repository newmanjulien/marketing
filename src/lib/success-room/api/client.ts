import type {
  SuccessRoomDeleteApiBody,
  SuccessRoomDeleteApiOperation,
  SuccessRoomPostApiBody,
  SuccessRoomPostApiOperation,
  SuccessRoomUploadedFileInput
} from '../domain/api';
import { getSuccessRoomApiPath } from '../domain/urls';

const requestSuccessRoomApi = (
  method: 'POST' | 'DELETE',
  roomSlug: string,
  operation: SuccessRoomPostApiOperation | SuccessRoomDeleteApiOperation,
  body?: unknown
) =>
  fetch(getSuccessRoomApiPath(roomSlug, operation), {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
        })
  });

export const postSuccessRoomApi = <
  Operation extends Exclude<SuccessRoomPostApiOperation, 'upload-url'>
>(
  roomSlug: string,
  operation: Operation,
  body: SuccessRoomPostApiBody<Operation>
) => requestSuccessRoomApi('POST', roomSlug, operation, body);

export const deleteSuccessRoomApi = <Operation extends SuccessRoomDeleteApiOperation>(
  roomSlug: string,
  operation: Operation,
  body: SuccessRoomDeleteApiBody<Operation>
) => requestSuccessRoomApi('DELETE', roomSlug, operation, body);

export const uploadSuccessRoomFile = async (
  roomSlug: string,
  file: File,
  contentType = file.type || 'application/octet-stream'
): Promise<SuccessRoomUploadedFileInput | null> => {
  const uploadUrlResponse = await requestSuccessRoomApi('POST', roomSlug, 'upload-url');

  if (!uploadUrlResponse.ok) {
    return null;
  }

  const { uploadUrl }: { uploadUrl: string } = await uploadUrlResponse.json();
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'content-type': contentType },
    body: file
  });

  if (!uploadResponse.ok) {
    return null;
  }

  const { storageId }: { storageId: SuccessRoomUploadedFileInput['storageId'] } =
    await uploadResponse.json();

  return {
    storageId,
    filename: file.name,
    contentType,
    byteSize: file.size
  };
};
