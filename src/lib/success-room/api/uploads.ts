import { postSuccessRoomApi } from './client';
import type {
  SuccessRoomUploadCapability,
  SuccessRoomUploadPurpose,
  SuccessRoomUploadResult
} from '../domain/api';
import {
  maxSuccessRoomUploadByteSize,
  maxSuccessRoomUploadSizeLabel,
  successRoomUploadIntentHeader
} from '../../../../shared/successRoomUploads';

const createUploadIntent = async (
  roomSlug: string,
  filename: string,
  purpose: SuccessRoomUploadPurpose
): Promise<SuccessRoomUploadCapability> => {
  const response = await postSuccessRoomApi(roomSlug, 'upload-intent', {
    filename,
    purpose
  });

  if (!response.ok) {
    throw new Error('Upload could not be prepared.');
  }

  return (await response.json()) as SuccessRoomUploadCapability;
};

const uploadFile = async (capability: SuccessRoomUploadCapability, file: File) => {
  const response = await fetch(capability.uploadUrl, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${capability.uploadToken}`,
      'content-type': file.type || 'application/octet-stream',
      [successRoomUploadIntentHeader]: capability.uploadIntentId
    },
    body: file
  });

  if (!response.ok) {
    throw new Error('File could not be uploaded.');
  }

  return (await response.json()) as SuccessRoomUploadResult;
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

  const capability = await createUploadIntent(roomSlug, file.name, purpose);
  const result = await uploadFile(capability, file);

  if (result.type !== purpose.type) {
    throw new Error('Upload returned an unexpected result.');
  }

  return result;
};
