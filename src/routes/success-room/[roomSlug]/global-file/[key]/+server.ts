import { error } from '@sveltejs/kit';
import {
  clearSuccessRoomAccessToken,
  getProtectedSuccessRoomGlobalFile,
  getSuccessRoomAccessToken,
} from '$lib/server/successRoomConvex';
import type { RequestHandler } from './$types';

const globalFileKeys = new Set(['julien-newman-photo']);

export const GET: RequestHandler = async ({ cookies, fetch, params }) => {
  if (!globalFileKeys.has(params.key)) {
    error(404, 'File not found');
  }

  const accessToken = getSuccessRoomAccessToken(cookies, params.roomSlug);

  if (!accessToken) {
    error(401, 'Success room access required');
  }

  const file = await getProtectedSuccessRoomGlobalFile(
    params.roomSlug,
    accessToken,
    params.key as 'julien-newman-photo',
  ).catch(() => {
    clearSuccessRoomAccessToken(cookies, params.roomSlug);
    return null;
  });

  if (!file) {
    error(404, 'File not found');
  }

  const response = await fetch(file.url);

  if (!response.ok || !response.body) {
    error(502, 'File could not be loaded');
  }

  const headers = new Headers();

  headers.set('content-type', file.contentType);
  headers.set('content-disposition', `inline; filename="${file.filename.replaceAll('"', '')}"`);

  return new Response(response.body, {
    status: 200,
    headers,
  });
};
