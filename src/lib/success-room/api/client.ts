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
) => {
  const payload = new Blob([JSON.stringify(body)], { type: 'application/json' });

  return fetch(getSuccessRoomApiPath(roomSlug, operation), {
    method: 'POST',
    body: payload,
    // Saves are flushed from `pagehide`, so requests must survive document
    // teardown — but keepalive bodies are capped at 64KB (shared across
    // in-flight requests), so oversized saves fall back to a regular request.
    keepalive: payload.size < 60_000
  }).then(relockOnExpiredSession);
};

export const deleteSuccessRoomApi = (roomSlug: string, operation: SuccessRoomDeleteApiOperation) =>
  fetch(getSuccessRoomApiPath(roomSlug, operation), { method: 'DELETE' }).then(
    relockOnExpiredSession
  );
