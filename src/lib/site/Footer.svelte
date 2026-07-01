<script lang="ts">
  import { companyNavItems } from './navigation';
</script>

<footer class="border-t border-stone-200/70 bg-white">
  <div class="w-full px-8 py-8">
    <div class="flex items-start justify-between lg:items-center">
      <div class="text-sm font-normal text-stone-500/60">
        Overbase, Inc. 600 California St, San Francisco
      </div>

      <nav class="hidden items-center gap-6 lg:flex" aria-label="Footer">
        {#each companyNavItems as link}
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
