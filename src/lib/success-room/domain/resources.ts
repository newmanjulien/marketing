import type {
  SuccessRoomBaseRoom,
  SuccessRoomResourceSummary,
} from './types';
import { getSuccessRoomPath, getSuccessRoomResourcePath } from './urls';

export const getSuccessRoomHref = (
  room: Pick<SuccessRoomBaseRoom, 'slug'>,
  section?: string,
) => getSuccessRoomPath(room.slug, section);

export const getSuccessRoomResourceLink = (
  room: Pick<SuccessRoomBaseRoom, 'slug'>,
  resource: SuccessRoomResourceSummary,
) => {
  if (resource.delivery.type === 'asset') {
    return {
      href: resource.delivery.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      isRouted: false,
    };
  }

  return {
    href: getSuccessRoomResourcePath(room.slug, resource.slug),
    isRouted: true,
  };
};
