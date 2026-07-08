import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();

  await convex.mutation(api.successRooms.patchQuestions, {
    slug: params.roomSlug,
    accessToken,
    questions: body.questions ?? {},
  });

  return json({ ok: true });
};
