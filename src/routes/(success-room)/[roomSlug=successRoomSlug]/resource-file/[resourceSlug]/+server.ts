import { error } from '@sveltejs/kit';
import { streamProtectedSuccessRoomFile } from '$lib/server/successRoomFileResponse';
import { getProtectedSuccessRoomResourceFile } from '$lib/server/successRoomConvex';
import { isSuccessRoomAssetResourceSlug } from '$lib/success-room/successRoomConfig';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch, params }) => {
  const resourceSlug = params.resourceSlug;

  if (!isSuccessRoomAssetResourceSlug(resourceSlug)) {
    error(404, 'Success room resource not found');
  }

  return streamProtectedSuccessRoomFile({
    cookies,
    fetch,
    roomSlug: params.roomSlug,
    resolveFile: (accessToken) =>
      getProtectedSuccessRoomResourceFile(params.roomSlug, accessToken, {
        resourceSlug,
      }),
  });
};
