export const getSuccessRoomPath = (roomSlug: string) => `/${roomSlug}`;

export const getSuccessRoomResourcePath = (roomSlug: string, resourceSlug: string) =>
  `${getSuccessRoomPath(roomSlug)}/${resourceSlug}`;

export const getSuccessRoomApiPath = (roomSlug: string, endpoint: string) =>
  `${getSuccessRoomPath(roomSlug)}/api/${endpoint}`;

export const getSuccessRoomResourceFilePath = (roomSlug: string, resourceSlug: string) =>
  `${getSuccessRoomPath(roomSlug)}/resource-file/${resourceSlug}`;

export const getSuccessRoomEditableAttachmentPath = (roomSlug: string, resourceSlug: string) =>
  `${getSuccessRoomPath(roomSlug)}/editable-attachment/${resourceSlug}`;

export const getSuccessRoomTeamMemberPhotoPath = (roomSlug: string, memberId: string) =>
  `${getSuccessRoomPath(roomSlug)}/team-member-photo/${memberId}`;
