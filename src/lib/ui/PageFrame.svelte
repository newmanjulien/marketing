<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<main class="px-[22px] pb-[120px] pt-[var(--page-frame-top-space)] sm:px-0">
  {@render children()}
</main>
