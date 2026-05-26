<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';
  import { headerActionItems } from '$lib/data/siteNav';
  import { createCurrentPortalAuthHref } from '$lib/portalAuthLinks';

  export let currentUrl: URL;
  export let currentHash = '';
</script>

<div class="fixed right-[42px] top-[31px] hidden items-center gap-[10px] md:flex">
  {#each headerActionItems as item}
    <ButtonLink
      href={createCurrentPortalAuthHref(item.authRoute, currentUrl, currentHash)}
      target="_blank"
      rel="noopener noreferrer"
      variant={item.variant}
      size="small"
    >
      {item.label}
    </ButtonLink>
  {/each}
</div>
