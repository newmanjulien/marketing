<script lang="ts">
  import { onMount } from 'svelte';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { homeIndustries } from '../industryContent';

  const INDUSTRY_ENTER_START_MS = 1800;
  const INDUSTRY_ENTER_STAGGER_MS = 95;
  const INDUSTRY_ENTER_DURATION_MS = 360;
  const FIRST_INDUSTRY_OPEN_PAUSE_MS = 400;
  const INDUSTRY_ADVANCE_DELAY_MS = 4_000;
  const firstIndustryOpenDelay =
    INDUSTRY_ENTER_START_MS +
    (homeIndustries.length - 1) * INDUSTRY_ENTER_STAGGER_MS +
    INDUSTRY_ENTER_DURATION_MS +
    FIRST_INDUSTRY_OPEN_PAUSE_MS;

  let selectedIndex = $state<number | null>(null);
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
  let autoAdvanceStopped = false;

  const selectedIndustry = $derived(
    selectedIndex === null ? null : (homeIndustries[selectedIndex] ?? null)
  );

  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimer === null) {
      return;
    }

    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  };

  const scheduleNextIndustry = (currentIndex: number) => {
    clearAutoAdvanceTimer();

    if (autoAdvanceStopped || currentIndex >= homeIndustries.length - 1) {
      return;
    }

    autoAdvanceTimer = setTimeout(() => {
      if (autoAdvanceStopped) {
        return;
      }

      const nextIndex = currentIndex + 1;
      selectedIndex = nextIndex;
      scheduleNextIndustry(nextIndex);
    }, INDUSTRY_ADVANCE_DELAY_MS);
  };

  const openFirstIndustry = () => {
    if (autoAdvanceStopped) {
      return;
    }

    selectedIndex = 0;
    scheduleNextIndustry(0);
  };

  const selectIndustryManually = (index: number) => {
    autoAdvanceStopped = true;
    clearAutoAdvanceTimer();
    selectedIndex = index;
  };

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    autoAdvanceTimer = setTimeout(openFirstIndustry, prefersReducedMotion ? 0 : firstIndustryOpenDelay);

    return clearAutoAdvanceTimer;
  });
</script>

<ContentMeasure class="!max-w-[660px] sm:text-center">
  <div
    class="flex flex-wrap justify-center gap-x-[22px] gap-y-[14px] px-[10px] pb-[4px] sm:gap-x-[26px] sm:gap-y-[10px] sm:px-0"
    aria-label="Industries"
    role="group"
  >
    {#each homeIndustries as industry, index (industry.id)}
      <button
        type="button"
        style={`--industry-enter-delay: ${1800 + index * 95}ms`}
        class={[
          'hero-industry-option shrink-0 translate-y-[5px] text-[15px] font-medium leading-none tracking-normal opacity-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950',
          selectedIndex === index ? 'text-stone-750' : 'text-stone-300 hover:text-stone-500'
        ]}
        aria-describedby={selectedIndex === index ? 'hero-industry-proof-detail' : undefined}
        onfocus={() => {
          selectIndustryManually(index);
        }}
        onclick={() => {
          selectIndustryManually(index);
        }}
        onmouseenter={() => {
          selectIndustryManually(index);
        }}
      >
        {industry.label}
      </button>
    {/each}
  </div>

  <div class="mt-[28px] min-h-[33px]">
    {#if selectedIndustry}
      {@const IndustryIcon = selectedIndustry.icon}
      <div id="hero-industry-proof-detail" class="flex items-center justify-center gap-[10px]">
        <a
          href={selectedIndustry.href}
          class="inline-flex h-[33px] shrink-0 items-center gap-[7px] rounded-[7px] border border-stone-300 bg-white px-[10px] text-[13px] font-book leading-none tracking-normal text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 sm:text-[14px]"
        >
          <IndustryIcon size={15} weight="bold" aria-hidden="true" />
          <span>{selectedIndustry.label}</span>
        </a>

        <div class="flex min-w-0 flex-wrap items-center gap-x-[10px] gap-y-[6px] text-[14px] leading-none tracking-normal">
          <span class="leading-[1.35] text-stone-400">{selectedIndustry.heroProofLabel}</span>
        </div>
      </div>
    {/if}
  </div>
</ContentMeasure>

<style>
  .hero-industry-option {
    animation: hero-industry-option-enter 360ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--industry-enter-delay) both;
  }

  @keyframes hero-industry-option-enter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-industry-option {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
