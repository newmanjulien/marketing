import { error } from '@sveltejs/kit';
import { getSuccessRoom } from '$lib/success-room/successRooms';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const room = getSuccessRoom(params.roomSlug);

  if (!room) {
    error(404, 'Success room not found');
  }

  return {
    room
  };
};
