import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomKickoffScheduleResourceSlug
} from './config';
import type {
  SuccessRoomBenefitsPatch,
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomLinkedFileMetadata,
  SuccessRoomPlanAction,
  SuccessRoomTeamMember
} from './types';

export type SuccessRoomUploadPurpose =
  | {
      type: 'editable-attachment';
      resourceSlug: SuccessRoomEditableTextResourceSlug;
    }
  | {
      type: 'team-member-photo';
      name: string;
      role: string;
    };

export type SuccessRoomUploadResult =
  | {
      type: 'editable-attachment';
      attachment: SuccessRoomLinkedFileMetadata;
    }
  | {
      type: 'team-member-photo';
      member: SuccessRoomTeamMember;
    };

export type SuccessRoomUploadCapability = {
  uploadIntentId: Id<'successRoomUploadIntents'>;
  uploadToken: string;
  uploadUrl: string;
};

export type SuccessRoomAutosaveApiBodyByOperation = {
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
  'kickoff-schedule': {
    resourceSlug: SuccessRoomKickoffScheduleResourceSlug;
    kickoffSchedule: SuccessRoomKickoffScheduleState;
  };
};

export type SuccessRoomPostApiBodyByOperation = SuccessRoomAutosaveApiBodyByOperation & {
  'upload-intent': {
    filename: string;
    purpose: SuccessRoomUploadPurpose;
  };
};

export type SuccessRoomDeleteApiBodyByOperation = {
  'editable-attachment': {
    resourceSlug: SuccessRoomEditableTextResourceSlug;
  };
};

export type SuccessRoomAutosaveApiOperation = keyof SuccessRoomAutosaveApiBodyByOperation;
export type SuccessRoomPostApiOperation = keyof SuccessRoomPostApiBodyByOperation;
export type SuccessRoomDeleteApiOperation = keyof SuccessRoomDeleteApiBodyByOperation;

export type SuccessRoomPostApiBody<Operation extends SuccessRoomPostApiOperation> =
  SuccessRoomPostApiBodyByOperation[Operation];

export type SuccessRoomDeleteApiBody<Operation extends SuccessRoomDeleteApiOperation> =
  SuccessRoomDeleteApiBodyByOperation[Operation];
