import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { handleSuccessRoomApiRequest } from '$lib/success-room/server/access.server';
import type { SuccessRoomPostApiBody } from '$lib/success-room/domain/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (event) =>
  handleSuccessRoomApiRequest<SuccessRoomPostApiBody<'editable-attachment'>>(
    event,
    async ({ sessionToken, body }) =>
      json(await convex.mutation(api.rooms.claimEditableAttachment, { ...body, sessionToken }))
  );

export const DELETE: RequestHandler = (event) =>
  handleSuccessRoomApiRequest(event, async ({ sessionToken }) => {
    await convex.mutation(api.rooms.removeEditableAttachment, { sessionToken });

    return json({ ok: true });
  });
