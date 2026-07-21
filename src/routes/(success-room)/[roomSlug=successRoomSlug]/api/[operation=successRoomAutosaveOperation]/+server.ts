import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { handleSuccessRoomApiRequest } from '$lib/success-room/server/access.server';
import type {
  SuccessRoomAutosaveApiMutationByOperation,
  SuccessRoomAutosaveApiOperation,
  SuccessRoomPostApiBody
} from '$lib/success-room/domain/api';
import type { RequestHandler } from './$types';

const mutationsByOperation: SuccessRoomAutosaveApiMutationByOperation = {
  benefits: api.rooms.patchBenefits,
  plan: api.rooms.applyPlanAction,
  'editable-text': api.rooms.patchEditableText,
  'kickoff-schedule': api.rooms.replaceKickoffSchedule
};

export const POST: RequestHandler = (event) =>
  handleSuccessRoomApiRequest<SuccessRoomPostApiBody<SuccessRoomAutosaveApiOperation>>(
    event,
    async ({ sessionToken, body }) => {
      await convex.mutation(mutationsByOperation[event.params.operation], {
        ...body,
        sessionToken
      });

      return json({ ok: true });
    }
  );
