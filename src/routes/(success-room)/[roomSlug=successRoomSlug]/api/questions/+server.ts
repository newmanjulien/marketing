import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();

  await convex.mutation(api.successRooms.patchQuestionAnswers, {
    slug: params.roomSlug,
    accessToken,
    answers: body.answers ?? {},
  });

  return json({ ok: true });
};
