import type {
  SuccessRoomDeleteApiBody,
  SuccessRoomDeleteApiOperation,
  SuccessRoomPostApiBody,
  SuccessRoomPostApiOperation
} from '../domain/api';
import { getSuccessRoomApiPath } from '../domain/urls';

const requestSuccessRoomApi = (
  method: 'POST' | 'DELETE',
  roomSlug: string,
  operation: SuccessRoomPostApiOperation | SuccessRoomDeleteApiOperation,
  body?: unknown
) =>
  fetch(getSuccessRoomApiPath(roomSlug, operation), {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
        })
  });

export const postSuccessRoomApi = <Operation extends SuccessRoomPostApiOperation>(
  roomSlug: string,
  operation: Operation,
  body: SuccessRoomPostApiBody<Operation>
) => requestSuccessRoomApi('POST', roomSlug, operation, body);

export const deleteSuccessRoomApi = <Operation extends SuccessRoomDeleteApiOperation>(
  roomSlug: string,
  operation: Operation,
  body: SuccessRoomDeleteApiBody<Operation>
) => requestSuccessRoomApi('DELETE', roomSlug, operation, body);
