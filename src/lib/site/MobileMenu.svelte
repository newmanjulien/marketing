<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { authNavItems, primaryNavItems } from './navigation';
  import { createPortalAuthUrlForCurrentPage } from '$lib/portalAuthLinks';

  let currentHash = $state('');
  const activePath = $derived(page.url.pathname);

  function syncHash() {
    if (browser) {
      currentHash = window.location.hash;
    }
  }

  afterNavigate(syncHash);
</script>

<svelte:window onhashchange={syncHash} />

<nav
  class="absolute left-0 top-full z-20 w-full border-t border-stone-200/70 bg-white px-[20px] py-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.07)]"
  aria-label="Mobile primary"
>
  <div class="flex flex-col">
    {#each primaryNavItems as link (link.href)}
      <a
        href={link.href}
        class={[
          'py-[11px] text-[16px] leading-none',
          activePath === link.href ? 'text-stone-900' : 'text-stone-600'
        ]}
        aria-current={activePath === link.href ? 'page' : undefined}
      >
        {link.label}
      </a>
    {/each}
    {#each authNavItems as link (link.authRoute)}
      <a
        href={createPortalAuthUrlForCurrentPage(link.authRoute, page.url, currentHash)}
        target="_blank"
        rel="noopener noreferrer"
        class="py-[11px] text-[16px] leading-none text-stone-500"
      >
        {link.label}
      </a>
    {/each}
  </div>
</nav>
