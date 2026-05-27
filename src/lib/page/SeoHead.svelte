<script lang="ts">
  import type { PageMeta } from './pageMeta';

  let { meta }: { meta: PageMeta } = $props();
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
</svelte:head>
