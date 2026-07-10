export const getSuccessRoomPath = (roomSlug: string) => `/${roomSlug}`;

export const getSuccessRoomResourcePath = (roomSlug: string, resourceSlug: string) =>
  `${getSuccessRoomPath(roomSlug)}/${resourceSlug}`;

export const getSuccessRoomApiPath = (roomSlug: string, endpoint: string) =>
  `${getSuccessRoomPath(roomSlug)}/api/${endpoint}`;
