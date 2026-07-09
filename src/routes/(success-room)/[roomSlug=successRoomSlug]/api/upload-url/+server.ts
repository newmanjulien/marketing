import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const uploadUrl = await convex.mutation(api.successRooms.generateUploadUrl, {
    slug: params.roomSlug,
    accessToken,
  });

  return json({ uploadUrl });
};
