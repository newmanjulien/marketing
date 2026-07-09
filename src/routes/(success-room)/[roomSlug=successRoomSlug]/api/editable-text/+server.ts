import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import { parseEditableTextRequest } from '$lib/success-room/server/editableRequests.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const { resourceSlug, state } = parseEditableTextRequest(await request.json());

  await convex.mutation(api.successRooms.patchEditableText, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug,
    content: state.content,
    dataSources: state.dataSources,
  });

  return json({ ok: true });
};
