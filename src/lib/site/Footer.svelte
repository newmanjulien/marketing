<script lang="ts">
  import { legalNavigationItems } from '$lib/legal/legalPages';
</script>

<footer class="border-t border-stone-200/70 bg-white">
  <div class="w-full px-6 py-8 md:px-12 lg:px-24">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
      <div class="hidden text-sm font-normal text-stone-500/60 md:block">
        Overbase, Inc. 600 California St, San Francisco
      </div>

      <nav class="flex items-center gap-6" aria-label="Legal">
        {#each legalNavigationItems as link}
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
