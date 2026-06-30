<script lang="ts">
  const footerNavigationItems = [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' }
  ] as const;
</script>

<footer class="border-t border-stone-200/70 bg-white">
  <div class="w-full px-8 py-8">
    <div class="flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
      <div class="hidden text-sm font-normal text-stone-500/60 sm:block">
        Overbase, Inc. 600 California St, San Francisco
      </div>

      <nav class="flex items-center gap-6" aria-label="Footer">
        {#each footerNavigationItems as link}
          <a
            href={link.href}
            class="text-sm font-normal text-stone-400/60 transition-colors duration-200 hover:text-stone-500"
          >
            {link.label}
          </a>
        {/each}
      </nav>
    </div>
  </div>
</footer>
