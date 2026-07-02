<script lang="ts">
  import { onMount } from 'svelte';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { homeIndustries } from '../industryContent';
  import {
    getHeroIndustryAutoAdvanceStartDelayMs,
    getHeroIndustryDetailEnterAtMs,
    getHeroIndustryLabelEnterAtMs,
    industryProofTimeline,
    ms
  } from './industryProofTimeline';

  const detailEnterAtMs = getHeroIndustryDetailEnterAtMs(homeIndustries.length);
  const autoAdvanceStartDelayMs = getHeroIndustryAutoAdvanceStartDelayMs(homeIndustries.length);
  const industryProofTimelineStyle = [
    `--industry-enter-duration: ${ms(industryProofTimeline.labelEnterDurationMs)}`,
    `--industry-detail-enter-duration: ${ms(industryProofTimeline.detailEnterDurationMs)}`,
    `--industry-enter-ease: ${industryProofTimeline.enterEase}`
  ].join('; ');

  let selectedIndex = $state(0);
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
  let autoAdvanceStopped = false;

  const selectedIndustry = $derived(homeIndustries[selectedIndex]);

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
    }, industryProofTimeline.autoAdvanceIntervalMs);
  };

  const selectIndustryManually = (index: number) => {
    autoAdvanceStopped = true;
    clearAutoAdvanceTimer();
    selectedIndex = index;
  };

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    autoAdvanceTimer = setTimeout(
      () => {
        scheduleNextIndustry(0);
      },
      prefersReducedMotion ? 0 : autoAdvanceStartDelayMs
    );

    return clearAutoAdvanceTimer;
  });
</script>

<ContentMeasure class="!max-w-[660px] sm:text-center">
  <div style={industryProofTimelineStyle}>
    <div
      class="flex flex-wrap justify-center gap-x-[22px] gap-y-[14px] px-[10px] pb-[4px] sm:gap-x-[26px] sm:gap-y-[10px] sm:px-0"
      aria-label="Industries"
      role="group"
    >
      {#each homeIndustries as industry, index (industry.id)}
        <a
          href={industry.href}
          style={`--industry-enter-delay: ${ms(getHeroIndustryLabelEnterAtMs(index))}`}
          class={[
            'hero-industry-option shrink-0 translate-y-[5px] text-[15px] font-normal leading-none tracking-normal opacity-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950',
            selectedIndex === index ? 'text-stone-750' : 'text-stone-300 hover:text-stone-500'
          ]}
          aria-describedby={selectedIndex === index ? 'hero-industry-proof-detail' : undefined}
          onfocus={() => {
            selectIndustryManually(index);
          }}
          onclick={(event) => {
            event.preventDefault();
            selectIndustryManually(index);
          }}
          onmouseenter={() => {
            selectIndustryManually(index);
          }}
        >
          {industry.label}
        </a>
      {/each}
    </div>

    <div class="mt-[28px] min-h-[33px]">
      {#if selectedIndustry}
        {@const IndustryIcon = selectedIndustry.icon}
        <div
          id="hero-industry-proof-detail"
          class="hero-industry-detail flex translate-y-[4px] items-center justify-center gap-[10px] opacity-0 will-change-[transform,opacity]"
          style={`--industry-detail-enter-delay: ${ms(detailEnterAtMs)}`}
        >
          <a
            href={selectedIndustry.href}
            class="inline-flex h-[33px] shrink-0 items-center gap-[7px] rounded-[7px] border border-stone-200/70 bg-white px-[10px] text-[13px] font-book leading-none tracking-normal text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 sm:text-[14px]"
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
  </div>
</ContentMeasure>

<style>
  .hero-industry-option {
    animation: hero-industry-option-enter var(--industry-enter-duration)
      var(--industry-enter-ease) var(--industry-enter-delay) both;
  }

  .hero-industry-detail {
    animation: hero-industry-detail-enter var(--industry-detail-enter-duration)
      var(--industry-enter-ease) var(--industry-detail-enter-delay) both;
  }

  @keyframes hero-industry-option-enter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes hero-industry-detail-enter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-industry-option,
    .hero-industry-detail {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }
  }
</style>
