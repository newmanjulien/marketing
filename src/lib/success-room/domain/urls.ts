export const getSuccessRoomPath = (roomSlug: string, section?: string) => {
  const path = `/${roomSlug}`;

  return section ? `${path}?section=${encodeURIComponent(section)}` : path;
};

const getSuccessRoomChildPath = (roomSlug: string, childPath: string) =>
  `${getSuccessRoomPath(roomSlug)}/${childPath}`;

export const getSuccessRoomResourcePath = (roomSlug: string, resourceSlug: string) =>
  getSuccessRoomChildPath(roomSlug, resourceSlug);

export const getSuccessRoomDocumentRequestPath = (roomSlug: string) =>
  getSuccessRoomChildPath(roomSlug, 'request-document');

export const getSuccessRoomApiPath = (roomSlug: string, endpoint: string) =>
  getSuccessRoomChildPath(roomSlug, `api/${endpoint}`);
