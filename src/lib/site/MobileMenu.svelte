<script lang="ts">
  import { page } from '$app/state';
  import { industryNavigationItems } from '$lib/industries/industryNavigation';
  import { createPortalAuthUrlForCurrentPage } from '$lib/portalAuthLinks';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import { authNavItems, mobilePrimaryNavItems } from './navigation';

  const navSections = [
    { id: 'mobile-industries-heading', label: 'Industries', links: industryNavigationItems },
    { id: 'mobile-site-heading', label: 'Overbase', links: mobilePrimaryNavItems }
  ] as const;

  const activePath = $derived(page.url.pathname);
</script>

<nav
  id="mobile-menu"
  class="z-layer-chrome-popover fixed bottom-0 left-0 right-0 top-[var(--site-mobile-header-height)] flex flex-col overflow-y-auto bg-white pb-[28px]"
  aria-label="Mobile primary"
  transition:slide={{ duration: 380, axis: 'y', easing: cubicOut }}
>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-col gap-[30px] px-[20px] pt-[26px]">
      {#each navSections as section (section.id)}
        <section aria-labelledby={section.id}>
          <h2
            id={section.id}
            class="mb-[14px] text-[12px] font-book uppercase leading-none tracking-[0.12em] text-stone-400"
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

    <div class="mt-[30px] flex flex-col gap-[12px] border-t border-stone-200/70 px-[20px] pt-[24px]">
      {#each authNavItems as link (link.authRoute)}
        {@const href = createPortalAuthUrlForCurrentPage(link.authRoute, page.url, page.url.hash)}
        <ButtonLink
          {href}
          target="_blank"
          rel="noopener noreferrer"
          variant={link.variant === 'primary' ? 'primary' : 'soft'}
          size="large"
          fullWidth
        >
          {link.label}
        </ButtonLink>
      {/each}
    </div>
  </div>
</nav>
