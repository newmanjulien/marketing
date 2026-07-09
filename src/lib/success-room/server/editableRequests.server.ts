import { error } from '@sveltejs/kit';
import { isSuccessRoomEditableTextResourceSlug } from '$lib/success-room/domain/config';
import type { SuccessRoomEditableTextResourceSlug } from '$lib/success-room/domain/config';
import type { Id } from '../../../../convex/_generated/dataModel';

type EditableTextStatePayload = {
  content: string;
  dataSources: string[];
};

type EditableAttachmentFilePayload = {
  storageId: Id<'_storage'>;
  filename: string;
  contentType: string;
  byteSize: number;
};

const invalidEditableTextPayload = (): never => error(400, 'Editable text payload is invalid');

const parseRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    invalidEditableTextPayload();
  }

  return value as Record<string, unknown>;
};

const parseResourceSlug = (value: unknown): SuccessRoomEditableTextResourceSlug => {
  if (typeof value !== 'string' || !isSuccessRoomEditableTextResourceSlug(value)) {
    invalidEditableTextPayload();
  }

  return value as SuccessRoomEditableTextResourceSlug;
};

const parseString = (value: unknown): string => {
  if (typeof value !== 'string') {
    invalidEditableTextPayload();
  }

  return value as string;
};

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    invalidEditableTextPayload();
  }

  return value as string[];
};

const parseEditableTextState = (value: unknown): EditableTextStatePayload => {
  const state = parseRecord(value);

  return {
    content: parseString(state.content),
    dataSources: parseStringArray(state.dataSources)
  };
};

const parseEditableAttachmentFile = (value: unknown): EditableAttachmentFilePayload => {
  const file = parseRecord(value);

  return {
    storageId: parseString(file.storageId) as Id<'_storage'>,
    filename: parseString(file.filename),
    contentType: parseString(file.contentType),
    byteSize: typeof file.byteSize === 'number' ? file.byteSize : invalidEditableTextPayload()
  };
};

export const parseEditableTextRequest = (value: unknown) => {
  const body = parseRecord(value);

  return {
    resourceSlug: parseResourceSlug(body.resourceSlug),
    state: parseEditableTextState(body.state)
  };
};

export const parseEditableAttachmentRequest = (value: unknown) => {
  const body = parseRecord(value);

  return {
    resourceSlug: parseResourceSlug(body.resourceSlug),
    file: parseEditableAttachmentFile(body.file),
    state: parseEditableTextState(body.state)
  };
};

export const parseEditableAttachmentRemovalRequest = (value: unknown) => {
  const body = parseRecord(value);

  return {
    resourceSlug: parseResourceSlug(body.resourceSlug)
  };
};
