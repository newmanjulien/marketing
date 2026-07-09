import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const uploadUrl = await convex.mutation(api.successRooms.generateUploadUrl, {
    slug: params.roomSlug,
    accessToken,
  });

  return json({ uploadUrl });
};
