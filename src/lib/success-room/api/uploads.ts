import type { api } from '$convex/_generated/api';
import type { Id } from '$convex/_generated/dataModel';
import type { FunctionReturnType } from 'convex/server';
import { postSuccessRoomApi } from './client';
import {
  maxSuccessRoomUploadByteSize,
  maxSuccessRoomUploadSizeLabel
} from '$shared/successRoomUploads';

const createUploadUrl = async (roomSlug: string) => {
  const response = await postSuccessRoomApi(roomSlug, 'upload-url', {});

  if (!response.ok) {
    throw new Error('Upload could not be prepared.');
  }

  const { uploadUrl } = (await response.json()) as FunctionReturnType<
    typeof api.rooms.createUploadUrl
  >;
  return uploadUrl;
};

const uploadToStorage = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file
  });

  if (!response.ok) {
    throw new Error('File could not be uploaded.');
  }

  const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
  return storageId;
};

// Puts the file into Convex storage; callers claim the returned storage id
// through their own feature endpoint.
export const uploadSuccessRoomFile = async ({
  roomSlug,
  file
}: {
  roomSlug: string;
  file: File;
}) => {
  if (file.size === 0) {
    throw new Error('Files must not be empty.');
  }

  if (file.size > maxSuccessRoomUploadByteSize) {
    throw new Error(`Files must be ${maxSuccessRoomUploadSizeLabel} or smaller.`);
  }

  const uploadUrl = await createUploadUrl(roomSlug);

  return uploadToStorage(uploadUrl, file);
};
