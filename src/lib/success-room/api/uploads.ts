import type { Id } from '../../../../convex/_generated/dataModel';
import { postSuccessRoomApi } from './client';
import type { SuccessRoomUploadPurpose, SuccessRoomUploadResult } from '../domain/api';
import {
  maxSuccessRoomUploadByteSize,
  maxSuccessRoomUploadSizeLabel
} from '../../../../shared/successRoomUploads';

const createUploadUrl = async (roomSlug: string) => {
  const response = await postSuccessRoomApi(roomSlug, 'upload-url', {});

  if (!response.ok) {
    throw new Error('Upload could not be prepared.');
  }

  const { uploadUrl } = (await response.json()) as { uploadUrl: string };
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

export const uploadSuccessRoomFile = async ({
  roomSlug,
  file,
  purpose
}: {
  roomSlug: string;
  file: File;
  purpose: SuccessRoomUploadPurpose;
}): Promise<SuccessRoomUploadResult> => {
  if (file.size === 0) {
    throw new Error('Files must not be empty.');
  }

  if (file.size > maxSuccessRoomUploadByteSize) {
    throw new Error(`Files must be ${maxSuccessRoomUploadSizeLabel} or smaller.`);
  }

  const uploadUrl = await createUploadUrl(roomSlug);
  const storageId = await uploadToStorage(uploadUrl, file);
  const claimResponse = await postSuccessRoomApi(roomSlug, 'claim-upload', {
    storageId,
    filename: file.name,
    purpose
  });

  if (!claimResponse.ok) {
    throw new Error('File could not be uploaded.');
  }

  const result = (await claimResponse.json()) as SuccessRoomUploadResult;

  if (result.type !== purpose.type) {
    throw new Error('Upload returned an unexpected result.');
  }

  return result;
};
