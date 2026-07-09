import { streamProtectedSuccessRoomFile } from '$lib/success-room/server/fileResponse.server';
import { getProtectedSuccessRoomTeamMemberPhoto } from '$lib/success-room/server/convexQueries.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch, params }) => {
  return streamProtectedSuccessRoomFile({
    cookies,
    fetch,
    roomSlug: params.roomSlug,
    resolveFile: (accessToken) =>
      getProtectedSuccessRoomTeamMemberPhoto(params.roomSlug, accessToken, params.teamMemberId),
  });
};
