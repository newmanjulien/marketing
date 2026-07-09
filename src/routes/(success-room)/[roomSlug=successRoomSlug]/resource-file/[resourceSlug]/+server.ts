import { error } from '@sveltejs/kit';
import { streamProtectedSuccessRoomFile } from '$lib/success-room/server/fileResponse.server';
import { getProtectedSuccessRoomResourceFile } from '$lib/success-room/server/convexQueries.server';
import { isSuccessRoomAssetResourceSlug } from '$lib/success-room/domain/config';
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
