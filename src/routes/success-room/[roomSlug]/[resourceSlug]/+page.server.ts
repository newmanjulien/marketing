import { error, fail, redirect } from '@sveltejs/kit';
import {
  clearSuccessRoomAccessToken,
  getProtectedSuccessRoomBundle,
  getPublicSuccessRoom,
  getSuccessRoomAccessToken,
  setSuccessRoomAccessToken,
  verifySuccessRoomPassword,
} from '$lib/server/successRoomConvex';
import { getSuccessRoomResource, isSuccessRoomRoutedResource } from '$lib/success-room/successRooms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const accessToken = getSuccessRoomAccessToken(cookies, params.roomSlug);

  if (accessToken) {
    try {
      const bundle = await getProtectedSuccessRoomBundle(params.roomSlug, accessToken);
      const resource = getSuccessRoomResource(bundle.room, params.resourceSlug);

      if (!resource || !isSuccessRoomRoutedResource(resource)) {
        error(404, 'Success room resource not found');
      }

      return {
        locked: false,
        room: bundle.room,
        state: bundle.state,
        resource,
      };
    } catch {
      clearSuccessRoomAccessToken(cookies, params.roomSlug);
    }
  }

  const room = await getPublicSuccessRoom(params.roomSlug);

  if (!room) {
    error(404, 'Success room not found');
  }

  return {
    locked: true,
    room: {
      slug: room.slug,
      prospectName: room.prospectName,
      description: room.description,
    },
  };
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) => {
    const formData = await request.formData();
    const password = formData.get('password');

    if (typeof password !== 'string' || password.trim() === '') {
      return fail(400, {
        message: 'Enter the room password.',
      });
    }

    const accessToken = await verifySuccessRoomPassword(params.roomSlug, password);

    if (!accessToken) {
      return fail(401, {
        message: 'That password is not correct.',
      });
    }

    setSuccessRoomAccessToken(cookies, params.roomSlug, accessToken);
    redirect(303, url.pathname);
  },
} satisfies Actions;
