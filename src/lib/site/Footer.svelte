<script lang="ts">
  import { footerNavItems } from './navigation';
</script>

<footer class="border-t border-stone-200/70 bg-stone-50/80">
  <div class="flex w-full items-start justify-between px-8 py-8 lg:items-center">
    <div class="text-sm font-book text-stone-500/60">
      Overbase, Inc. 600 California St, San Francisco
    </div>

    <nav class="hidden items-center gap-6 lg:flex" aria-label="Footer">
      {#each footerNavItems as link}
        <a
          href={link.href}
          class="text-sm font-book text-stone-400/60 transition-colors duration-200 hover:text-stone-500"
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
</footer>
