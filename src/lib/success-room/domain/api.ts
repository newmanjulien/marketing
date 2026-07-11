import type { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { FunctionArgs, FunctionReference } from 'convex/server';
import type { SuccessRoomLinkedFileMetadata, SuccessRoomTeamMember } from './types';

type MutationBody<Mutation extends FunctionReference<'mutation', 'public'>> = Omit<
  FunctionArgs<Mutation>,
  'slug' | 'accessToken'
>;

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
  benefits: MutationBody<typeof api.successRooms.patchBenefits>;
  plan: MutationBody<typeof api.successRooms.applyPlanAction>;
  'editable-text': MutationBody<typeof api.successRooms.patchEditableText>;
  'kickoff-schedule': MutationBody<typeof api.successRooms.replaceKickoffSchedule>;
};

export type SuccessRoomPostApiBodyByOperation = SuccessRoomAutosaveApiBodyByOperation & {
  'upload-intent': MutationBody<typeof api.successRooms.createUploadIntent>;
};

export type SuccessRoomDeleteApiBodyByOperation = {
  'editable-attachment': MutationBody<typeof api.successRooms.removeEditableAttachment>;
};

export type SuccessRoomUploadPurpose =
  SuccessRoomPostApiBodyByOperation['upload-intent']['purpose'];

export type SuccessRoomAutosaveApiOperation = keyof SuccessRoomAutosaveApiBodyByOperation;
export type SuccessRoomPostApiOperation = keyof SuccessRoomPostApiBodyByOperation;
export type SuccessRoomDeleteApiOperation = keyof SuccessRoomDeleteApiBodyByOperation;

export type SuccessRoomPostApiBody<Operation extends SuccessRoomPostApiOperation> =
  SuccessRoomPostApiBodyByOperation[Operation];

export type SuccessRoomDeleteApiBody<Operation extends SuccessRoomDeleteApiOperation> =
  SuccessRoomDeleteApiBodyByOperation[Operation];
