import { beforeNavigate } from '$app/navigation';
import { onDestroy, onMount } from 'svelte';

type SaveTask = () => Promise<void> | void;

type SaveQueueEntry = {
  task: SaveTask | null;
  timeout: ReturnType<typeof setTimeout> | null;
  // Not redundant with `promise !== null`: the drain loop runs synchronously
  // up to its first await, during which `promise` is still unassigned.
  running: boolean;
  promise: Promise<void> | null;
  // Whether the most recently run task persisted. A newer task under the same
  // key supersedes an older one, so once the queue drains this is the fate of
  // the newest state — the thing an awaiter of schedule() cares about.
  lastRunSucceeded: boolean;
};

export type SuccessRoomSaveQueue = ReturnType<typeof createSuccessRoomSaveQueue>;

// Serializes saves per key, debounced, and flushes them at the moments the
// document might stop existing. Must be created during component init.
export const createSuccessRoomSaveQueue = () => {
  const entries = new Map<string, SaveQueueEntry>();

  const getOrCreateEntry = (key: string): SaveQueueEntry => {
    let entry = entries.get(key);

    if (!entry) {
      entry = { task: null, timeout: null, running: false, promise: null, lastRunSucceeded: false };
      entries.set(key, entry);
    }

    return entry;
  };

  const clearEntryTimeout = (entry: SaveQueueEntry) => {
    if (entry.timeout) {
      clearTimeout(entry.timeout);
      entry.timeout = null;
    }
  };

  const runTask = async (key: string, task: SaveTask) => {
    try {
      await task();

      return true;
    } catch (error) {
      console.error(`Success room save failed for ${key}`, error);

      return false;
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
        // A task with an armed timeout is still inside its debounce window;
        // leave it for the timer, which re-invokes runEntry when it elapses.
        while (entry.task && !entry.timeout) {
          const task = entry.task;

          entry.task = null;
          entry.lastRunSucceeded = await runTask(key, task);
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

  // Resolves with whether the newest state for this key is known persisted.
  const schedule = (key: string, task: SaveTask, debounceMs = 0): Promise<boolean> => {
    const entry = getOrCreateEntry(key);

    entry.task = task;
    clearEntryTimeout(entry);

    if (debounceMs > 0) {
      entry.timeout = setTimeout(() => {
        void runEntry(key, entry);
      }, debounceMs);

      // A debounced task has no single completion to hand back: the timer, a
      // flush, or a newer task under the same key decides when (or whether)
      // it runs. Only immediate saves can report their fate.
      return Promise.resolve(false);
    }

    // Resolves once this key's queue is actually empty, so a caller can gate
    // navigation on persistence when the destination's server load reads the
    // new state. A single runEntry can return early while a task sits parked
    // behind an in-flight save (re-debounced mid-drain), so loop until
    // nothing is left; runEntry force-runs a parked task by clearing its
    // timer, which matches flush semantics.
    return (async () => {
      while (entry.task || entry.running) {
        await runEntry(key, entry);
      }

      return entry.lastRunSucceeded;
    })();
  };

  // Document stays alive: start an ordered drain of every entry. A task
  // queued behind an in-flight save waits for it, so the server always ends
  // on the newest state.
  const flush = () => {
    for (const [key, entry] of entries) {
      void runEntry(key, entry);
    }
  };

  // Document being torn down: promise continuations no longer run, so the
  // ordered drain could never reach a task queued behind an in-flight save.
  // Fire that task synchronously instead — the fetch it issues survives
  // teardown via `keepalive`, at the cost of racing the in-flight save it
  // overlaps; at teardown, losing that ordering beats losing the edit.
  // Everything else goes through runEntry as usual, which keeps the entry
  // marked running — so if the page returns from bfcache, later edits for
  // the same key still serialize behind it.
  const flushBeforeTeardown = () => {
    for (const [key, entry] of entries) {
      if (entry.running && entry.task) {
        clearEntryTimeout(entry);

        const task = entry.task;

        entry.task = null;
        void runTask(key, task);
      } else {
        void runEntry(key, entry);
      }
    }
  };

  beforeNavigate(flush);

  onMount(() => {
    // `pagehide` never fires when the OS discards a backgrounded mobile tab;
    // going hidden is the last reliable signal. The document is still alive
    // here, so the ordered flush is safe and sufficient.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };

    window.addEventListener('pagehide', flushBeforeTeardown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushBeforeTeardown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  onDestroy(flush);

  return { schedule };
};
