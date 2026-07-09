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
    catalog: SuccessRoomMutualSuccessPlanCatalog;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomEditableTextResource =
  SuccessRoomResourceBase<'editable-text'> & {
    delivery: SuccessRoomRouteDelivery;
    editorRows?: number;
  };

export type SuccessRoomKickoffScheduleResource =
  SuccessRoomResourceBase<'kickoff-schedule'> & {
    description: string;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomRoutedResource =
  | SuccessRoomMutualSuccessPlanResource
  | SuccessRoomEditableTextResource
  | SuccessRoomKickoffScheduleResource;

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

export type SuccessRoomLinkedFileMetadata = SuccessRoomFileMetadata & {
  href: string;
};

export type SuccessRoomTeamMemberPhotoMetadata = {
  photoId: string;
  filename: string;
  contentType: string;
  byteSize: number;
};

export type SuccessRoomLinkedTeamMemberPhotoMetadata = SuccessRoomTeamMemberPhotoMetadata & {
  href: string;
};

export type SuccessRoomTeamMember = {
  id: string;
  name: string;
  role: string;
  imageHref: string;
  photo?: SuccessRoomLinkedTeamMemberPhotoMetadata;
};

export type SuccessRoomBenefitCard = {
  id: string;
  title: string;
  description: string;
};

export type SuccessRoomPlanTask = {
  id: string;
  title: string;
  date: string;
};

export type SuccessRoomPlanAccordion = {
  id: string;
  title: string;
  description: string;
  variant: 'default' | 'muted';
  tasks: SuccessRoomPlanTask[];
};

export type SuccessRoomQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type SuccessRoomMutualSuccessPlanCatalog = {
  benefitCards: SuccessRoomBenefitCard[];
  planAccordions: SuccessRoomPlanAccordion[];
};

export type SuccessRoomPlanState = {
  selectedBenefitIds: string[];
  checkedTaskIds: string[];
  dateOverrides: Record<string, string>;
  taskAssigneeMemberIds: Record<string, string>;
};

export type SuccessRoomPlanUpdate = Partial<SuccessRoomPlanState>;

export type SuccessRoomMutualSuccessPlanState = {
  plan: SuccessRoomPlanState;
};

export type SuccessRoomEditableTextState = {
  content: string;
  dataSources: string[];
  attachment?: SuccessRoomLinkedFileMetadata;
};

export type SuccessRoomKickoffScheduleColumn = {
  key: string;
  label: string;
};

export type SuccessRoomKickoffScheduleRow = {
  key: string;
  sortOrder: number;
  cells: Record<string, string>;
};

export type SuccessRoomKickoffScheduleState = {
  rows: SuccessRoomKickoffScheduleRow[];
};

export type SuccessRoomState = {
  mutualSuccessPlan?: SuccessRoomMutualSuccessPlanState;
  editableTexts: Record<string, SuccessRoomEditableTextState>;
  kickoffSchedules: Record<string, SuccessRoomKickoffScheduleState>;
};

export type SuccessRoom = {
  slug: string;
  prospectName: string;
  description: string;
  team: SuccessRoomTeamMember[];
  questions: SuccessRoomQuestion[];
  resources: SuccessRoomResource[];
};
