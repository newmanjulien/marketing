import type {
  SuccessRoomDeleteApiOperation,
  SuccessRoomPostApiBody,
  SuccessRoomPostApiOperation
} from '../domain/api';
import { getSuccessRoomApiPath } from '../domain/urls';

const relockOnExpiredSession = (response: Response) => {
  if (response.status === 401) {
    // The server cleared the stale session cookie; reloading re-runs the page
    // load, which renders the password gate.
    location.reload();
  }

  return response;
};

export const postSuccessRoomApi = <Operation extends SuccessRoomPostApiOperation>(
  roomSlug: string,
  operation: Operation,
  body: SuccessRoomPostApiBody<Operation>
) =>
  fetch(getSuccessRoomApiPath(roomSlug, operation), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }).then(relockOnExpiredSession);

export const deleteSuccessRoomApi = (roomSlug: string, operation: SuccessRoomDeleteApiOperation) =>
  fetch(getSuccessRoomApiPath(roomSlug, operation), { method: 'DELETE' }).then(
    relockOnExpiredSession
  );
