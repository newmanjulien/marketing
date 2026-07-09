import { reservedSuccessRoomSlugs } from './generated/reservedSuccessRoomSlugs';

const reservedSuccessRoomSlugSet = new Set<string>(reservedSuccessRoomSlugs);
const successRoomSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const normalizeSuccessRoomSlug = (slug: string) => slug.trim().toLowerCase();

const isAllowedSuccessRoomSlug = (slug: string) =>
  successRoomSlugPattern.test(slug) && !reservedSuccessRoomSlugSet.has(slug);

export const parseSuccessRoomSlug = (slug: string) => {
  const normalizedSlug = normalizeSuccessRoomSlug(slug);

  return isAllowedSuccessRoomSlug(normalizedSlug) ? normalizedSlug : null;
};

export const isNormalizedSuccessRoomSlug = (slug: string) => parseSuccessRoomSlug(slug) === slug;
