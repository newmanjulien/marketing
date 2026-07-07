import { error } from '@sveltejs/kit';
import {
  getSuccessRoomResource,
  isSuccessRoomRoutedResource
} from '$lib/success-room/successRooms';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  const match = getSuccessRoomResource(params.roomSlug, params.resourceSlug);

  if (!match) {
    error(404, 'Success room resource not found');
  }

  if (!isSuccessRoomRoutedResource(match.resource)) {
    error(404, 'Success room resource not found');
  }

  return {
    room: match.room,
    resource: match.resource
  };
}) satisfies PageLoad;
