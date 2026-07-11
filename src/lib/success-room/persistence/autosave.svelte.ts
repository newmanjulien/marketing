import { untrack } from 'svelte';
import { postSuccessRoomApi } from '../api/client';
import type {
  SuccessRoomAutosaveApiOperation,
  SuccessRoomPostApiBody
} from '../domain/api';
import type { SuccessRoomSaveQueue } from './saveQueue';

export const createSyncedSnapshot = <Snapshot>({
  initial,
  getSnapshot,
  shouldReplace
}: {
  initial: Snapshot;
  getSnapshot: () => Snapshot;
  shouldReplace: (current: Snapshot, next: Snapshot) => boolean;
}) => {
  let current = $state<Snapshot>(initial);

  $effect(() => {
    const next = getSnapshot();
    const currentSnapshot = untrack(() => current);

    if (shouldReplace(currentSnapshot, next)) {
      current = next;
    }
  });

  return {
    get current() {
      return current;
    },
    replace(next: Snapshot) {
      current = next;
    }
  };
};

export const scheduleJsonSave = <Endpoint extends SuccessRoomAutosaveApiOperation>({
  saveQueue,
  key,
  roomSlug,
  endpoint,
  body,
  errorMessage,
  debounceMs = 0
}: {
  saveQueue: SuccessRoomSaveQueue;
  key: string;
  roomSlug: string;
  endpoint: Endpoint;
  body: SuccessRoomPostApiBody<Endpoint>;
  errorMessage: string;
  debounceMs?: number;
}) => {
  saveQueue.schedule(
    key,
    async () => {
      const response = await postSuccessRoomApi(roomSlug, endpoint, body);

      if (!response.ok) {
        throw new Error(errorMessage);
      }
    },
    debounceMs
  );
};
