<script lang="ts">
  import type { SuccessRoomTeamMember } from '../domain/types';

  let { team }: { team: readonly SuccessRoomTeamMember[] } = $props();

  const preloadedImages = new Map<string, HTMLImageElement>();

  $effect(() => {
    const hrefs = new Set(team.map(({ imageHref }) => imageHref.trim()).filter(Boolean));
    const preload = () => {
      for (const href of hrefs) {
        if (preloadedImages.has(href)) {
          continue;
        }

        const image = new Image();
        image.decoding = 'async';
        image.src = href;
        preloadedImages.set(href, image);
      }
    };

    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(handle);
    }

    const handle = setTimeout(preload, 0);
    return () => clearTimeout(handle);
  });
</script>
