<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { SuccessRoomTeamMember } from '../domain/types';

  let { team }: { team: readonly SuccessRoomTeamMember[] } = $props();

  const preloadedImages = new Map<string, HTMLImageElement>();
  const queuedImageHrefs = new Set<string>();
  let cancelPendingPreload: (() => void) | undefined;

  const teamImageHrefs = $derived.by(() => {
    const hrefs = new Set<string>();

    for (const member of team) {
      const href = member.imageHref.trim();

      if (href) {
        hrefs.add(href);
      }
    }

    return [...hrefs];
  });

  const cancelPendingSchedule = () => {
    cancelPendingPreload?.();
    cancelPendingPreload = undefined;
  };

  const preloadQueuedImages = () => {
    cancelPendingPreload = undefined;

    for (const href of queuedImageHrefs) {
      if (!preloadedImages.has(href)) {
        const image = new Image();

        image.decoding = 'async';
        image.src = href;
        preloadedImages.set(href, image);
      }

      queuedImageHrefs.delete(href);
    }
  };

  const schedulePreload = () => {
    if (cancelPendingPreload) {
      return;
    }

    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preloadQueuedImages);

      cancelPendingPreload = () => {
        window.cancelIdleCallback(handle);
      };
    } else {
      const handle = setTimeout(preloadQueuedImages, 0);

      cancelPendingPreload = () => {
        clearTimeout(handle);
      };
    }
  };

  $effect(() => {
    const currentImageHrefs = new Set(teamImageHrefs);

    for (const href of queuedImageHrefs) {
      if (!currentImageHrefs.has(href)) {
        queuedImageHrefs.delete(href);
      }
    }

    for (const href of teamImageHrefs) {
      if (!preloadedImages.has(href) && !queuedImageHrefs.has(href)) {
        queuedImageHrefs.add(href);
      }
    }

    if (queuedImageHrefs.size > 0) {
      schedulePreload();
    }
  });

  onDestroy(cancelPendingSchedule);
</script>
