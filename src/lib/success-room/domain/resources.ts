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
) => ({
  href: getSuccessRoomResourcePath(room.slug, resource.slug),
  target: resource.delivery.type === 'asset' ? '_blank' : undefined,
  rel: resource.delivery.type === 'asset' ? 'noopener noreferrer' : undefined
});
