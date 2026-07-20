import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/convexClient.server';
import { handleSuccessRoomApiRequest } from '$lib/success-room/server/access.server';
import type { SuccessRoomPostApiBody } from '$lib/success-room/domain/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (event) =>
  handleSuccessRoomApiRequest<SuccessRoomPostApiBody<'claim-upload'>>(
    event,
    async ({ sessionToken, body }) =>
      json(await convex.mutation(api.rooms.claimUpload, { ...body, sessionToken }))
  );
