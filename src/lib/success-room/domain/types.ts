import type { SuccessRoomBenefitsState } from '$shared/successRoomBenefits';
import type { SuccessRoomEditableTextContent } from '$shared/successRoomEditableText';
import type { SuccessRoomKickoffScheduleState } from '$shared/successRoomKickoffSchedule';
import type { SuccessRoomPlanState } from '$shared/successRoomPlan';
import type {
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomKickoffScheduleResourceSlug
} from '$shared/successRoomResources';

export type SuccessRoomResourceBase<Kind extends string, Slug extends string = string> = {
  kind: Kind;
  slug: Slug;
  title: string;
  actionLabel: string;
  description?: string;
};

export type SuccessRoomPdfResource = SuccessRoomResourceBase<'pdf'>;

export type SuccessRoomAudioResource = SuccessRoomResourceBase<'audio'>;

export type SuccessRoomMutualSuccessPlanResourceSummary =
  SuccessRoomResourceBase<'mutual-success-plan'> & {
    description: string;
  };

export type SuccessRoomMutualSuccessPlanResource =
  SuccessRoomMutualSuccessPlanResourceSummary & {
    catalog: SuccessRoomMutualSuccessPlanCatalog;
  };

export type SuccessRoomEditableTextResource =
  SuccessRoomResourceBase<'editable-text', SuccessRoomEditableTextResourceSlug> & {
    description: string;
    editorRows: number;
    editorPlaceholder: string;
  };

export type SuccessRoomKickoffScheduleResource =
  SuccessRoomResourceBase<'kickoff-schedule', SuccessRoomKickoffScheduleResourceSlug> & {
    description: string;
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

export type SuccessRoomLinkedFileMetadata = {
  filename: string;
  contentType: string;
  byteSize: number;
  href: string;
};

export type SuccessRoomTeamMember = {
  key: string;
  name: string;
  role: string;
  imageHref: string | null;
};

export type SuccessRoomBenefitCard = {
  key: string;
  title: string;
  description: string;
};

export type SuccessRoomPlanTask = {
  key: string;
  title: string;
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

export type SuccessRoomBenefitsPatch = Partial<SuccessRoomBenefitsState>;

export type SuccessRoomEditableTextState = SuccessRoomEditableTextContent & {
  attachment: SuccessRoomLinkedFileMetadata | null;
};

export type SuccessRoomEditableTextAttachmentUpdate = {
  roomSlug: string;
  resourceSlug: SuccessRoomEditableTextResourceSlug;
  attachment: SuccessRoomLinkedFileMetadata | null;
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

type DocumentRequestFailureStatus = 'validation-error' | 'submission-error';

export type DocumentRequestFormFailure = {
  description: string;
  message: string;
  status: DocumentRequestFailureStatus;
};
