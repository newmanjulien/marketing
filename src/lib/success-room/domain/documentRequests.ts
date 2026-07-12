export { maxSuccessRoomDocumentRequestDescriptionLength } from '../../../../shared/successRoomDocumentRequests';

export const successRoomDocumentRequestTitle = 'Do you need something else?';
export const successRoomDocumentRequestDescription =
  'Describe any additional document that would help you socialize this opportunity within your firm';

type DocumentRequestFailureStatus = 'validation-error' | 'submission-error';

export type DocumentRequestFormFailure = {
  description: string;
  message: string;
  status: DocumentRequestFailureStatus;
};
