export const getSuccessRoomPath = (roomSlug: string, section?: string) => {
  const path = `/${roomSlug}`;

  return section ? `${path}?section=${encodeURIComponent(section)}` : path;
};

export const getSuccessRoomResourcePath = (roomSlug: string, resourceSlug: string) =>
  `${getSuccessRoomPath(roomSlug)}/${resourceSlug}`;

export const getSuccessRoomApiPath = (roomSlug: string, endpoint: string) =>
  `${getSuccessRoomPath(roomSlug)}/api/${endpoint}`;
