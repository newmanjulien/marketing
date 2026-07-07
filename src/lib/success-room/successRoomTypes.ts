export type SuccessRoomAssetDelivery = {
  type: 'asset';
  href: string;
};

export type SuccessRoomRouteDelivery = {
  type: 'route';
};

export type SuccessRoomResourceBase<Kind extends string> = {
  kind: Kind;
  slug: string;
  title: string;
  previewImageHref: string;
};

export type SuccessRoomPdfResource = SuccessRoomResourceBase<'pdf'> & {
  description?: string;
  delivery: SuccessRoomAssetDelivery;
};

export type SuccessRoomAudioResource = SuccessRoomResourceBase<'audio'> & {
  description?: string;
  delivery: SuccessRoomAssetDelivery;
};

export type SuccessRoomMutualSuccessPlanResource =
  SuccessRoomResourceBase<'mutual-success-plan'> & {
    description: string;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomResource =
  | SuccessRoomPdfResource
  | SuccessRoomAudioResource
  | SuccessRoomMutualSuccessPlanResource;

export type SuccessRoomTeamMember = {
  id: string;
  name: string;
  role: string;
  imageHref: string;
};

export type SuccessRoom = {
  slug: string;
  prospectName: string;
  description: string;
  team: SuccessRoomTeamMember[];
  resources: SuccessRoomResource[];
};
