export const getSuccessRoomPath = (roomSlug: string, section?: string) => {
  const path = `/${roomSlug}`;

  return section ? `${path}?section=${encodeURIComponent(section)}` : path;
};

export const getSuccessRoomResourcePath = (roomSlug: string, resourceSlug: string) =>
  `/${roomSlug}/${resourceSlug}`;

export const getSuccessRoomDocumentRequestPath = (roomSlug: string) =>
  `/${roomSlug}/request-document`;

export const getSuccessRoomApiPath = (roomSlug: string, endpoint: string) =>
  `/${roomSlug}/api/${endpoint}`;
