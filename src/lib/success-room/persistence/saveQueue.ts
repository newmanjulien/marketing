import { beforeNavigate } from '$app/navigation';
import { onDestroy, onMount } from 'svelte';

type SaveTask = () => Promise<void> | void;

type SaveQueueEntry = {
  task: SaveTask | null;
  timeout: ReturnType<typeof setTimeout> | null;
  running: boolean;
  promise: Promise<void> | null;
};

export type SuccessRoomSaveQueue = ReturnType<typeof createSuccessRoomSaveQueue>;

export const createSuccessRoomSaveQueue = () => {
  const entries = new Map<string, SaveQueueEntry>();

  const getEntry = (key: string) => {
    const existingEntry = entries.get(key);

    if (existingEntry) {
      return existingEntry;
    }

    const entry: SaveQueueEntry = {
      task: null,
      timeout: null,
      running: false,
      promise: null
    };

    entries.set(key, entry);

    return entry;
  };

  const clearEntryTimeout = (entry: SaveQueueEntry) => {
    if (entry.timeout) {
      clearTimeout(entry.timeout);
      entry.timeout = null;
    }
  };

  const runEntry = async (key: string, entry: SaveQueueEntry) => {
    clearEntryTimeout(entry);

    if (entry.running) {
      await entry.promise;
      return;
    }

    entry.running = true;
    entry.promise = (async () => {
      try {
        while (entry.task) {
          const task = entry.task;

          entry.task = null;

          try {
            await task();
          } catch (error) {
            console.error(`Success room save failed for ${key}`, error);
          }
        }
      } finally {
        entry.running = false;
        entry.promise = null;

        if (!entry.task && !entry.timeout) {
          entries.delete(key);
        }
      }
    })();

    await entry.promise;
  };

  const schedule = (key: string, task: SaveTask, debounceMs = 0) => {
    const entry = getEntry(key);

    entry.task = task;
    clearEntryTimeout(entry);

    if (debounceMs > 0) {
      entry.timeout = setTimeout(() => {
        void runEntry(key, entry);
      }, debounceMs);
      return;
    }

    void runEntry(key, entry);
  };

  const flush = async () => {
    await Promise.all(
      Array.from(entries.entries()).map(([key, entry]) => runEntry(key, entry))
    );
  };

  const flushAndDispose = () => {
    void flush().finally(() => {
      for (const entry of entries.values()) {
        clearEntryTimeout(entry);
      }

      entries.clear();
    });
  };

  return {
    schedule,
    flush,
    flushAndDispose
  };
};

export const attachSuccessRoomSaveQueueLifecycle = (saveQueue: SuccessRoomSaveQueue) => {
  beforeNavigate(() => {
    void saveQueue.flush();
  });

  onMount(() => {
    const handlePageHide = () => {
      void saveQueue.flush();
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  });

  onDestroy(() => {
    saveQueue.flushAndDispose();
  });
};
