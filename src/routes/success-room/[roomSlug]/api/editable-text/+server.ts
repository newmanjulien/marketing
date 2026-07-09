import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import { parseEditableTextRequest } from '$lib/server/successRoomEditableRequests';
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
