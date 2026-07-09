import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex, getSuccessRoomEditableAttachmentHref } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import {
  parseEditableAttachmentRemovalRequest,
  parseEditableAttachmentRequest
} from '$lib/server/successRoomEditableRequests';
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
