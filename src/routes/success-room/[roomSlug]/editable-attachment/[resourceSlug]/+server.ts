import { streamProtectedSuccessRoomFile } from '$lib/server/successRoomFileResponse';
import { getProtectedSuccessRoomEditableAttachmentFile } from '$lib/server/successRoomConvex';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch, params }) => {
  return streamProtectedSuccessRoomFile({
    cookies,
    fetch,
    roomSlug: params.roomSlug,
    resolveFile: (accessToken) =>
      getProtectedSuccessRoomEditableAttachmentFile(params.roomSlug, accessToken, {
        resourceSlug: params.resourceSlug,
      }),
  });
};
