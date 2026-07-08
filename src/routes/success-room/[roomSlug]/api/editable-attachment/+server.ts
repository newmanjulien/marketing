import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex, getSuccessRoomEditableAttachmentHref } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();
  const attachment = await convex.mutation(api.successRooms.registerEditableAttachment, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug: body.resourceSlug,
    file: body.file,
    content: body.state?.content ?? '',
    dataSources: body.state?.dataSources ?? [],
  });

  return json({
    ok: true,
    attachment: {
      ...attachment,
      href: getSuccessRoomEditableAttachmentHref(params.roomSlug, body.resourceSlug),
    },
  });
};

export const DELETE: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();

  await convex.mutation(api.successRooms.removeEditableAttachment, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug: body.resourceSlug,
  });

  return json({ ok: true });
};
