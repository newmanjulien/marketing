import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomKickoffScheduleResourceSlug
} from './config';
import type {
  SuccessRoomBenefitsPatch,
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanAction
} from './types';

export type SuccessRoomUploadedFileInput = {
  storageId: Id<'_storage'>;
  filename: string;
  contentType: string;
  byteSize: number;
};

export type SuccessRoomPostApiBodyByOperation = {
  benefits: {
    benefits: SuccessRoomBenefitsPatch;
  };
  plan: {
    action: SuccessRoomPlanAction;
  };
  'editable-text': {
    resourceSlug: SuccessRoomEditableTextResourceSlug;
    editableText: Pick<SuccessRoomEditableTextState, 'content' | 'dataSources'>;
  };
  'editable-attachment': {
    resourceSlug: SuccessRoomEditableTextResourceSlug;
    file: SuccessRoomUploadedFileInput;
  };
  'kickoff-schedule': {
    resourceSlug: SuccessRoomKickoffScheduleResourceSlug;
    kickoffSchedule: SuccessRoomKickoffScheduleState;
  };
  'team-members': {
    name: string;
    role: string;
    photo: SuccessRoomUploadedFileInput;
  };
  'upload-url': undefined;
};

export type SuccessRoomDeleteApiBodyByOperation = {
  'editable-attachment': {
    resourceSlug: SuccessRoomEditableTextResourceSlug;
  };
};

export type SuccessRoomPostApiOperation = keyof SuccessRoomPostApiBodyByOperation;
export type SuccessRoomDeleteApiOperation = keyof SuccessRoomDeleteApiBodyByOperation;

export type SuccessRoomPostApiBody<Operation extends SuccessRoomPostApiOperation> =
  SuccessRoomPostApiBodyByOperation[Operation];

export type SuccessRoomDeleteApiBody<Operation extends SuccessRoomDeleteApiOperation> =
  SuccessRoomDeleteApiBodyByOperation[Operation];
