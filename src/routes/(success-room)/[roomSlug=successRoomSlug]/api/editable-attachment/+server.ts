import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { getSuccessRoomEditableAttachmentHref } from '$lib/success-room/server/convexQueries.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import {
  parseEditableAttachmentRemovalRequest,
  parseEditableAttachmentRequest
} from '$lib/success-room/server/editableRequests.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const { file, resourceSlug, state } = parseEditableAttachmentRequest(await request.json());

  const attachment = await convex.mutation(api.successRooms.registerEditableAttachment, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug,
    file,
    content: state.content,
    dataSources: state.dataSources,
  });

  return json({
    ok: true,
    attachment: {
      ...attachment,
      href: getSuccessRoomEditableAttachmentHref(params.roomSlug, resourceSlug),
    },
  });
};

export const DELETE: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const { resourceSlug } = parseEditableAttachmentRemovalRequest(await request.json());

  await convex.mutation(api.successRooms.removeEditableAttachment, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug,
  });

  return json({ ok: true });
};
