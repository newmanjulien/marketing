import { error } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import {
  clearSuccessRoomAccessToken,
  getSuccessRoomAccessToken,
} from './access.server';

type ProtectedSuccessRoomFile = {
  url: string;
  filename: string;
  contentType: string;
};

type StreamProtectedSuccessRoomFileArgs = {
  cookies: Cookies;
  fetch: typeof globalThis.fetch;
  roomSlug: string;
  resolveFile: (accessToken: string) => Promise<ProtectedSuccessRoomFile | null>;
};

export const streamProtectedSuccessRoomFile = async ({
  cookies,
  fetch,
  roomSlug,
  resolveFile,
}: StreamProtectedSuccessRoomFileArgs) => {
  const accessToken = getSuccessRoomAccessToken(cookies, roomSlug);

  if (!accessToken) {
    error(401, 'Success room access required');
  }

  const file = await resolveFile(accessToken).catch(() => {
    clearSuccessRoomAccessToken(cookies, roomSlug);
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
