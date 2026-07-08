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
  actionLabel: string;
  description?: string;
};

export type SuccessRoomPdfResource = SuccessRoomResourceBase<'pdf'> & {
  delivery: SuccessRoomAssetDelivery;
};

export type SuccessRoomAudioResource = SuccessRoomResourceBase<'audio'> & {
  delivery: SuccessRoomAssetDelivery;
};

export type SuccessRoomDownloadableFileResource =
  SuccessRoomResourceBase<'downloadable-file'> & {
  delivery: SuccessRoomAssetDelivery;
};

export type SuccessRoomMutualSuccessPlanResource =
  SuccessRoomResourceBase<'mutual-success-plan'> & {
    description: string;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomEditableTextResource =
  SuccessRoomResourceBase<'editable-text'> & {
    delivery: SuccessRoomRouteDelivery;
    initialText: string;
    editorRows?: number;
  };

export type SuccessRoomRoutedResource =
  | SuccessRoomMutualSuccessPlanResource
  | SuccessRoomEditableTextResource;

export type SuccessRoomResource =
  | SuccessRoomPdfResource
  | SuccessRoomAudioResource
  | SuccessRoomDownloadableFileResource
  | SuccessRoomRoutedResource;

export type SuccessRoomFileMetadata = {
  fileId: string;
  filename: string;
  contentType: string;
  byteSize: number;
};

export type SuccessRoomGlobalFileMetadata = {
  globalFileId: string;
  filename: string;
  contentType: string;
  byteSize: number;
};

export type SuccessRoomTeamMember = {
  id: string;
  name: string;
  role: string;
  email?: string;
  imageHref: string;
  photo?: SuccessRoomGlobalFileMetadata;
};

export type SuccessRoomPlanState = {
  checkedTaskIds: string[];
  dateOverrides: Record<string, string>;
};

export type SuccessRoomPlanPatch = Partial<SuccessRoomPlanState>;

export type SuccessRoomEditableTextState = {
  content: string;
  dataSources: string[];
  attachment?: SuccessRoomFileMetadata;
};

export type SuccessRoomState = {
  questions: Record<string, string>;
  plan?: SuccessRoomPlanState;
  editableTexts: Record<string, SuccessRoomEditableTextState>;
};

export type SuccessRoom = {
  slug: string;
  prospectName: string;
  description: string;
  team: SuccessRoomTeamMember[];
  resources: SuccessRoomResource[];
};
