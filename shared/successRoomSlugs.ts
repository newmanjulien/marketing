import { reservedSuccessRoomSlugs } from './generated/reservedSuccessRoomSlugs';

const reservedSuccessRoomSlugSet = new Set<string>(reservedSuccessRoomSlugs);
const successRoomSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const normalizeSuccessRoomSlug = (slug: string) => slug.trim().toLowerCase();

export const isNormalizedSuccessRoomSlug = (slug: string) =>
  successRoomSlugPattern.test(slug) && !reservedSuccessRoomSlugSet.has(slug);

export const parseSuccessRoomSlug = (slug: string) => {
  const normalizedSlug = normalizeSuccessRoomSlug(slug);

  return isNormalizedSuccessRoomSlug(normalizedSlug) ? normalizedSlug : null;
};
