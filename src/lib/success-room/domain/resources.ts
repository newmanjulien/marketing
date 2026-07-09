import type {
  SuccessRoom,
  SuccessRoomResource,
  SuccessRoomRoutedResource,
} from './types';
import { getSuccessRoomPath, getSuccessRoomResourcePath } from './urls';

export type SuccessRoomRoutedResourceLink = {
  href: string;
  isRouted: true;
};

export type SuccessRoomDirectResourceLink = {
  href: string;
  target: '_blank';
  rel: 'noopener noreferrer';
  isRouted: false;
};

export type SuccessRoomResourceLink =
  | SuccessRoomRoutedResourceLink
  | SuccessRoomDirectResourceLink;

export const getSuccessRoomHref = (room: Pick<SuccessRoom, 'slug'>) =>
  getSuccessRoomPath(room.slug);

export const getSuccessRoomResourceLink = (
  room: Pick<SuccessRoom, 'slug'>,
  resource: SuccessRoomResource,
): SuccessRoomResourceLink => {
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

export function getSuccessRoomResource(
  room: SuccessRoom,
  resourceSlug: string,
): SuccessRoomResource | undefined {
  return room.resources.find((item) => item.slug === resourceSlug);
}

export function isSuccessRoomRoutedResource(
  resource: SuccessRoomResource,
): resource is SuccessRoomRoutedResource {
  return resource.delivery.type === 'route';
}
