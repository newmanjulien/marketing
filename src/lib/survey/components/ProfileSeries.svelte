<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col gap-[56px] sm:gap-[74px]">
  {@render children()}
</div>
