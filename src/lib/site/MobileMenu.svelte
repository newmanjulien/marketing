<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { createPortalAuthUrlForCurrentPage } from '$lib/portalAuthLinks';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import { authNavItems, industryNavItems, mobilePrimaryNavItems } from './navigation';

  const navSections = [
    { id: 'mobile-industries-heading', label: 'Industries', links: industryNavItems },
    { id: 'mobile-site-heading', label: 'Overbase', links: mobilePrimaryNavItems }
  ] as const;

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
  id="mobile-menu"
  class="fixed bottom-0 left-0 right-0 top-[50px] z-20 flex flex-col overflow-y-auto bg-white pb-[28px]"
  aria-label="Mobile primary"
  transition:slide={{ duration: 380, axis: 'y', easing: cubicOut }}
>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-col gap-[30px] px-[20px] pt-[26px]">
      {#each navSections as section (section.id)}
        <section aria-labelledby={section.id}>
          <h2
            id={section.id}
            class="mb-[14px] text-[12px] font-normal uppercase leading-none tracking-[0.12em] text-stone-400"
          >
            {section.label}
          </h2>

          <div class="flex flex-col">
            {#each section.links as link (link.href)}
              <a
                href={link.href}
                class={[
                  'py-[10px] text-[20px] leading-none',
                  activePath === link.href ? 'text-stone-900' : 'text-stone-600'
                ]}
                aria-current={activePath === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            {/each}
          </div>
        </section>
      {/each}
    </div>

    <div class="mt-[30px] flex flex-col border-t border-stone-200/70">
      <div class="flex flex-col gap-[12px] px-[20px] pt-[24px]">
        {#each authNavItems as link (link.authRoute)}
          {@const href = createPortalAuthUrlForCurrentPage(link.authRoute, page.url, currentHash)}
          {#if link.variant === 'primary'}
            <ButtonLink
              {href}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="large"
              fullWidth
            >
              {link.label}
            </ButtonLink>
          {:else}
            <a
              {href}
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-[50px] items-center justify-center rounded-[7px] bg-stone-100 text-[17px] leading-none text-stone-700"
            >
              {link.label}
            </a>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</nav>
