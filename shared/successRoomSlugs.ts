import { reservedSuccessRoomSlugs } from './generated/reservedSuccessRoomSlugs';

const reservedSuccessRoomSlugSet = new Set<string>(reservedSuccessRoomSlugs);
const successRoomSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isNormalizedSuccessRoomSlug = (slug: string) =>
  successRoomSlugPattern.test(slug) && !reservedSuccessRoomSlugSet.has(slug);

export const parseSuccessRoomSlug = (slug: string) => {
  const normalizedSlug = slug.trim().toLowerCase();

  return isNormalizedSuccessRoomSlug(normalizedSlug) ? normalizedSlug : null;
};
