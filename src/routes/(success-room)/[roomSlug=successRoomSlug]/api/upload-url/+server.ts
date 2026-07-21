import { json } from '@sveltejs/kit';
import { api } from '$convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { handleSuccessRoomApiRequest } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (event) =>
  handleSuccessRoomApiRequest(event, async ({ sessionToken }) =>
    json(await convex.mutation(api.rooms.createUploadUrl, { sessionToken }))
  );
