<script lang="ts">
  import { page } from '$app/state';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { authNavItems } from './navigation';
  import { createPortalAuthUrlForCurrentPage } from '$lib/portalAuthLinks';
</script>

<div class="z-layer-chrome fixed right-[42px] top-[31px] hidden items-center gap-[10px] lg:flex">
  {#each authNavItems as item (item.authRoute)}
    <ButtonLink
      href={createPortalAuthUrlForCurrentPage(item.authRoute, page.url)}
      target="_blank"
      rel="noopener noreferrer"
      variant={item.variant}
      size="small"
      textSize="compact"
    >
      {item.label}
    </ButtonLink>
  {/each}
</div>
