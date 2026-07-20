<script lang="ts">
  import {
    homeIndustries,
    type HomeIndustryId
  } from '$lib/home/industryContent';
  import { textMessageContentByIndustryId } from './textMessageContent';
  import { ArrowUpIcon } from 'phosphor-svelte';
  import TextMessageIndustryTabs from './TextMessageIndustryTabs.svelte';
  import TextMessageScenarioDropdown from './TextMessageScenarioDropdown.svelte';

  // How long each industry stays on screen while auto-cycling.
  const CYCLE_INTERVAL_MS = 7000;
  // How much of the graphic must be visible before the cycle starts.
  const CYCLE_START_VISIBILITY = 0.4;

  const initialIndustryId: HomeIndustryId = homeIndustries[0].id;
  let selectedIndustryId = $state<HomeIndustryId>(initialIndustryId);
  let selectedScenarioId = $state<string>(
    textMessageContentByIndustryId[initialIndustryId].scenarios[0].id
  );

  // Set the industry and reset the scenario to that industry's first option, so
  // selectedScenarioId always belongs to the current industry — no invalid state exists.
  function showIndustry(id: HomeIndustryId) {
    selectedIndustryId = id;
    selectedScenarioId = textMessageContentByIndustryId[id].scenarios[0].id;
  }

  // Auto-cycle: once the graphic scrolls into view, step through the industries
  // in order and stop for good on the last one. Any interaction also stops it.
  let root = $state<HTMLElement | null>(null);
  let inView = $state(false);
  let stopped = $state(false);

  function advanceIndustry() {
    const index = homeIndustries.findIndex((industry) => industry.id === selectedIndustryId);
    const next = homeIndustries[index + 1];
    if (!next) {
      stopped = true;
      return;
    }
    showIndustry(next.id);
  }

  // Watch for the graphic scrolling into view (until it does, or the user takes over).
  $effect(() => {
    if (!root || inView || stopped) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) inView = true;
      },
      { threshold: CYCLE_START_VISIBILITY }
    );
    observer.observe(root);
    return () => observer.disconnect();
  });

  // While in view and not stopped, advance to the next industry every interval.
  $effect(() => {
    if (!inView || stopped) return;

    const timer = setInterval(advanceIndustry, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  });

  function selectIndustry(id: HomeIndustryId) {
    stopped = true;
    showIndustry(id);
  }

  function selectScenario(id: string) {
    stopped = true;
    selectedScenarioId = id;
  }

  const content = $derived(textMessageContentByIndustryId[selectedIndustryId]);
  const scenario = $derived(content.scenarios.find((item) => item.id === selectedScenarioId)!);

  // Each blank-line-separated paragraph becomes its own chat bubble.
  const messages = $derived(
    scenario.message
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -- mouse-only convenience; the cycle also stops on any click -->
<div
  bind:this={root}
  onmouseenter={() => (stopped = true)}
  class="flex h-[510px] overflow-hidden rounded-[14px] border border-stone-200/70 bg-white shadow-[0_8px_28px_-12px_rgba(48,47,45,0.12)]"
>
  <div
    class="flex w-[244px] shrink-0 flex-col border-r border-stone-200/70 bg-stone-50 px-[10px] py-[12px] sm:px-[12px] sm:w-[294px]"
  >
    <TextMessageIndustryTabs
      industries={homeIndustries}
      {selectedIndustryId}
      onSelect={selectIndustry}
    />

    <div class="mt-auto pt-[14px]">
      <TextMessageScenarioDropdown
        scenarios={content.scenarios}
        {selectedScenarioId}
        onSelect={selectScenario}
      />
    </div>
  </div>

  <div class="flex min-h-0 flex-1 flex-col bg-white">
    <div class="min-h-0 flex-1 overflow-auto px-[18px] py-[16px] sm:px-[22px]">
      <div class="flex flex-col items-start gap-[3px]">
        {#each messages as message, index}
          <div
            class="bubble {index === messages.length - 1 ? 'bubble-tail' : ''} max-w-[82%] whitespace-pre-wrap break-words px-[14px] py-[8px] text-left font-body text-[14.5px] font-book leading-[1.35] tracking-normal text-white sm:text-[15.5px]"
          >{message}</div>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-[8px] border-t border-stone-200/70 px-[14px] py-[11px]">
      <div
        class="flex h-[38px] flex-1 items-center rounded-full border border-stone-200/60 px-[16px] text-[14.5px] font-book leading-none tracking-normal text-stone-300 sm:text-[15.5px]"
      >
        Text message
      </div>
      <div
        class="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-stone-100"
        aria-hidden="true"
      >
        <ArrowUpIcon size={17} weight="bold" class="text-stone-300" />
      </div>
    </div>
  </div>
</div>

<p
  class="mt-[18px] max-w-[720px] px-[2px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500/70 sm:mt-[20px] sm:text-[17px]"
>
  {scenario.description}
</p>

<style>
  .bubble {
    position: relative;
    background: #0b84fe;
    border-radius: 18px;
  }

  /* iMessage tail: a blue curve hugging the bubble's bottom-left corner,
     carved into a tail shape by a white curve just outside it. */
  .bubble-tail::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -7px;
    width: 20px;
    height: 20px;
    background: #0b84fe;
    border-bottom-right-radius: 15px;
  }

  .bubble-tail::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 10px;
    height: 20px;
    background: white;
    border-bottom-right-radius: 10px;
  }
</style>
