import type { kickoffScheduleColumns } from '../../../../shared/successRoomResources';
import type {
  SuccessRoomPlanAction as SharedSuccessRoomPlanAction,
  SuccessRoomPlanState as SharedSuccessRoomPlanState
} from '../../../../shared/successRoomPlan';
import type {
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomKickoffScheduleResourceSlug
} from './config';

export type SuccessRoomAssetDelivery = {
  type: 'asset';
};

export type SuccessRoomRouteDelivery = {
  type: 'route';
};

export type SuccessRoomResourceBase<Kind extends string, Slug extends string = string> = {
  kind: Kind;
  slug: Slug;
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

export type SuccessRoomMutualSuccessPlanResourceSummary =
  SuccessRoomResourceBase<'mutual-success-plan'> & {
    description: string;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomMutualSuccessPlanResource =
  SuccessRoomMutualSuccessPlanResourceSummary & {
    catalog: SuccessRoomMutualSuccessPlanCatalog;
  };

export type SuccessRoomEditableTextResource =
  SuccessRoomResourceBase<'editable-text', SuccessRoomEditableTextResourceSlug> & {
    delivery: SuccessRoomRouteDelivery;
    editorRows?: number;
  };

export type SuccessRoomKickoffScheduleResource =
  SuccessRoomResourceBase<'kickoff-schedule', SuccessRoomKickoffScheduleResourceSlug> & {
    description: string;
    delivery: SuccessRoomRouteDelivery;
  };

export type SuccessRoomRoutedResource =
  | SuccessRoomMutualSuccessPlanResource
  | SuccessRoomEditableTextResource
  | SuccessRoomKickoffScheduleResource;

export type SuccessRoomRoutedResourceSummary =
  | SuccessRoomMutualSuccessPlanResourceSummary
  | SuccessRoomEditableTextResource
  | SuccessRoomKickoffScheduleResource;

export type SuccessRoomResourceSummary =
  | SuccessRoomPdfResource
  | SuccessRoomAudioResource
  | SuccessRoomRoutedResourceSummary;

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
  key: string;
  name: string;
  role: string;
  imageHref: string;
  photo?: SuccessRoomLinkedTeamMemberPhotoMetadata;
};

export type SuccessRoomBenefitCard = {
  key: string;
  title: string;
  description: string;
};

export type SuccessRoomPlanTask = {
  key: string;
  title: string;
  date?: string;
};

export type SuccessRoomPlanAccordion = {
  key: string;
  title: string;
  description: string;
  variant: 'default' | 'muted' | 'highlighted';
  tasks: SuccessRoomPlanTask[];
};

export type SuccessRoomMutualSuccessPlanCatalog = {
  planAccordions: SuccessRoomPlanAccordion[];
  team: SuccessRoomTeamMember[];
};

export type SuccessRoomBenefitsState = {
  selectedCardKeys: string[];
  selectedCustomBenefit: string | null;
  painPointsByBenefitKey: Record<string, string>;
  goalsByBenefitKey?: Record<string, string>;
};

export type SuccessRoomBenefitsPatch = {
  selectedCardKeys?: string[];
  selectedCustomBenefit?: string | null;
  painPointsByBenefitKey?: Record<string, string>;
  goalsByBenefitKey?: Record<string, string>;
};

export type SuccessRoomPlanState = SharedSuccessRoomPlanState;

export type SuccessRoomPlanAction = SharedSuccessRoomPlanAction;

export type SuccessRoomEditableTextState = {
  content: string;
  dataSources: string[];
  attachment?: SuccessRoomLinkedFileMetadata;
};

export type SuccessRoomEditableTextAttachmentUpdate = {
  roomSlug: string;
  resourceSlug: SuccessRoomEditableTextResourceSlug;
  attachment?: SuccessRoomLinkedFileMetadata;
};

export type SuccessRoomKickoffScheduleColumn = (typeof kickoffScheduleColumns)[number];

export type SuccessRoomKickoffScheduleRow = {
  key: string;
  sortOrder: number;
  cells: Record<string, string>;
};

export type SuccessRoomKickoffScheduleState = {
  rows: SuccessRoomKickoffScheduleRow[];
};

export type SuccessRoomBaseRoom = {
  slug: string;
  prospectName: string;
  description: string;
};

export type SuccessRoomLandingRoom = SuccessRoomBaseRoom & {
  benefitCards: SuccessRoomBenefitCard[];
  team: SuccessRoomTeamMember[];
  resources: SuccessRoomResourceSummary[];
};

export type SuccessRoomLandingState = {
  benefits: SuccessRoomBenefitsState;
};

export type SuccessRoomResourceRoom = SuccessRoomBaseRoom;

export type SuccessRoomResourceState =
  | {
      kind: 'mutual-success-plan';
      plan: SuccessRoomPlanState;
    }
  | {
      kind: 'editable-text';
      editableText: SuccessRoomEditableTextState;
    }
  | {
      kind: 'kickoff-schedule';
      kickoffSchedule: SuccessRoomKickoffScheduleState;
    };
