import type { api } from '../../../../convex/_generated/api';
import type { FunctionArgs, FunctionReference } from 'convex/server';

// The SvelteKit API routes add the session token from the cookie; the client
// sends everything else the Convex mutation expects.
type MutationBody<Mutation extends FunctionReference<'mutation', 'public'>> = Omit<
  FunctionArgs<Mutation>,
  'sessionToken'
>;

export type SuccessRoomAutosaveApiMutationByOperation = {
  benefits: typeof api.rooms.patchBenefits;
  plan: typeof api.rooms.applyPlanAction;
  'editable-text': typeof api.rooms.patchEditableText;
  'kickoff-schedule': typeof api.rooms.replaceKickoffSchedule;
};

export type SuccessRoomAutosaveApiBodyByOperation = {
  [Operation in keyof SuccessRoomAutosaveApiMutationByOperation]: MutationBody<
    SuccessRoomAutosaveApiMutationByOperation[Operation]
  >;
};

export type SuccessRoomPostApiBodyByOperation = SuccessRoomAutosaveApiBodyByOperation & {
  'upload-url': Record<string, never>;
  'editable-attachment': MutationBody<typeof api.rooms.claimEditableAttachment>;
  'team-member': MutationBody<typeof api.rooms.createTeamMember>;
};

export type SuccessRoomDeleteApiOperation = 'editable-attachment';

export type SuccessRoomAutosaveApiOperation = keyof SuccessRoomAutosaveApiBodyByOperation;
export type SuccessRoomPostApiOperation = keyof SuccessRoomPostApiBodyByOperation;

const autosaveApiOperations: Record<SuccessRoomAutosaveApiOperation, null> = {
  benefits: null,
  plan: null,
  'editable-text': null,
  'kickoff-schedule': null
};

export const isSuccessRoomAutosaveApiOperation = (
  operation: string
): operation is SuccessRoomAutosaveApiOperation => Object.hasOwn(autosaveApiOperations, operation);

export type SuccessRoomPostApiBody<Operation extends SuccessRoomPostApiOperation> =
  SuccessRoomPostApiBodyByOperation[Operation];
