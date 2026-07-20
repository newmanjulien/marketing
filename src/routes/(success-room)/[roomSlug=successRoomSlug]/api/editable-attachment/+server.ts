import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/convexClient.server';
import { handleSuccessRoomApiRequest } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = (event) =>
  handleSuccessRoomApiRequest(event, async ({ sessionToken }) => {
    await convex.mutation(api.rooms.removeEditableAttachment, { sessionToken });

    return json({ ok: true });
  });
