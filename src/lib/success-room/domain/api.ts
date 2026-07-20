import type { api } from '../../../../convex/_generated/api';
import type { FunctionArgs, FunctionReference } from 'convex/server';
import type { SuccessRoomLinkedFileMetadata, SuccessRoomTeamMember } from './types';

// The SvelteKit API routes add the session token from the cookie; the client
// sends everything else the Convex mutation expects.
type MutationBody<Mutation extends FunctionReference<'mutation', 'public'>> = Omit<
  FunctionArgs<Mutation>,
  'sessionToken'
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

export type SuccessRoomAutosaveApiBodyByOperation = {
  benefits: MutationBody<typeof api.rooms.patchBenefits>;
  plan: MutationBody<typeof api.rooms.applyPlanAction>;
  'editable-text': MutationBody<typeof api.rooms.patchEditableText>;
  'kickoff-schedule': MutationBody<typeof api.rooms.replaceKickoffSchedule>;
};

export type SuccessRoomPostApiBodyByOperation = SuccessRoomAutosaveApiBodyByOperation & {
  'upload-url': Record<string, never>;
  'claim-upload': MutationBody<typeof api.rooms.claimUpload>;
};

export type SuccessRoomDeleteApiOperation = 'editable-attachment';

export type SuccessRoomUploadPurpose =
  SuccessRoomPostApiBodyByOperation['claim-upload']['purpose'];

export type SuccessRoomAutosaveApiOperation = keyof SuccessRoomAutosaveApiBodyByOperation;
export type SuccessRoomPostApiOperation = keyof SuccessRoomPostApiBodyByOperation;

export type SuccessRoomPostApiBody<Operation extends SuccessRoomPostApiOperation> =
  SuccessRoomPostApiBodyByOperation[Operation];
