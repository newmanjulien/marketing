import { error, json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();
  const photo = body.photo;

  if (
    !photo ||
    typeof photo.storageId !== 'string' ||
    typeof photo.filename !== 'string' ||
    typeof photo.contentType !== 'string' ||
    typeof photo.byteSize !== 'number'
  ) {
    error(400, 'Team member photo is required');
  }

  const member = await convex.mutation(api.successRooms.addTeamMember, {
    slug: params.roomSlug,
    accessToken,
    name: typeof body.name === 'string' ? body.name : '',
    role: typeof body.role === 'string' ? body.role : '',
    photo,
  });

  return json({ member });
};
