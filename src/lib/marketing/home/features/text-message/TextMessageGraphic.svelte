<script lang="ts">
  import { homeIndustries } from '$lib/marketing/home/homeIndustries';
  import type { IndustryId } from '$lib/marketing/industries/industryContent';
  import { textMessageScenariosByIndustryId } from './textMessageContent';
  import { ArrowUpIcon, ArrowsClockwiseIcon } from 'phosphor-svelte';
  import TextMessageScenarioDropdown from './TextMessageScenarioDropdown.svelte';
  import { tabIndicator } from '$lib/ui/tabIndicator';
  import { prefersReducedMotion } from 'svelte/motion';

  let {
    industryId,
    onIndustrySelect
  }: {
    industryId: IndustryId;
    onIndustrySelect: (id: IndustryId) => void;
  } = $props();

  // The highlight pill rests under the selected industry, but slides to whichever
  // one the pointer is hovering — so the tab feels like it follows your cursor.
  // Text and icon emphasis follow the same target, not the raw selection.
  let hoveredIndustryId = $state<IndustryId | null>(null);
  const indicatorKey = $derived(hoveredIndustryId ?? industryId);

  const scenarios = $derived(textMessageScenariosByIndustryId[industryId]);

  // The scenario choice is remembered together with the industry it was made for,
  // so switching industries always falls back to that industry's first scenario —
  // no invalid state exists.
  let scenarioChoice = $state<{ industryId: IndustryId; scenarioId: string } | null>(null);
  const scenario = $derived(
    (scenarioChoice?.industryId === industryId
      ? scenarios.find((item) => item.id === scenarioChoice?.scenarioId)
      : undefined) ?? scenarios[0]
  );

  function selectScenario(id: string) {
    scenarioChoice = { industryId, scenarioId: id };
  }

  function selectNextScenario() {
    const index = scenarios.indexOf(scenario);
    selectScenario(scenarios[(index + 1) % scenarios.length].id);
  }

  // Each blank-line-separated paragraph becomes its own chat bubble.
  const messages = $derived(
    scenario.message
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );
</script>

<div
  class="flex h-[480px] overflow-hidden rounded-[14px] border border-stone-200 bg-white shadow-[0_8px_28px_-12px_rgba(48,47,45,0.12)]"
>
  <div
    class="flex w-[244px] shrink-0 flex-col border-r border-stone-200 bg-stone-50/90 px-[10px] py-[12px] sm:px-[12px] sm:w-[294px]"
  >
    <div
      class="relative flex flex-col items-stretch gap-[6px]"
      role="group"
      aria-label="Industry"
      use:tabIndicator={indicatorKey}
      onmouseleave={() => (hoveredIndustryId = null)}
    >
      <span
        aria-hidden="true"
        class={[
          'tab-indicator pointer-events-none absolute left-0 top-0 rounded-[8px] border border-stone-200 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)] will-change-transform',
          !prefersReducedMotion.current &&
            'transition-[transform,width,height,opacity] duration-[250ms] ease-out'
        ]}
      ></span>

      {#each homeIndustries as industry (industry.id)}
        {@const isEmphasized = indicatorKey === industry.id}
        <button
          type="button"
          data-indicator-key={industry.id}
          class={[
            'relative flex items-center gap-[14px] rounded-[8px] border border-transparent px-[10px] py-[9px] text-[17px] leading-none tracking-normal transition-colors',
            isEmphasized ? 'font-medium text-stone-750' : 'font-book text-stone-500'
          ]}
          aria-pressed={industryId === industry.id}
          onclick={() => onIndustrySelect(industry.id)}
          onmouseenter={() => (hoveredIndustryId = industry.id)}
          onfocus={() => (hoveredIndustryId = industry.id)}
        >
          <industry.icon size={18} weight={isEmphasized ? 'bold' : 'regular'} />
          <span>{industry.label}</span>
        </button>
      {/each}
    </div>

    <div class="mt-auto pt-[14px]">
      <TextMessageScenarioDropdown
        {scenarios}
        selectedScenario={scenario}
        onSelect={selectScenario}
      />
    </div>
  </div>

  <!-- min-w-0 lets the pane shrink below its content's intrinsic width, so an
       unbreakable word (like a long URL) wraps instead of widening the pane
       past the card edge. -->
  <div class="relative flex min-h-0 min-w-0 flex-1 flex-col bg-white">
    <button
      type="button"
      class="absolute right-[12px] top-[12px] z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600"
      aria-label="Show next example"
      title="Show next example"
      onclick={selectNextScenario}
    >
      <ArrowsClockwiseIcon size={15} weight="bold" />
    </button>

    <div class="min-h-0 flex-1 overflow-auto px-[18px] py-[16px] sm:px-[22px]">
      <div class="flex flex-col items-start gap-[3px]">
        {#each messages as message, index}
          <div
            class="bubble max-w-[82%] whitespace-pre-wrap break-words px-[14px] py-[8px] text-left font-body text-[14.5px] font-book leading-[1.35] tracking-normal text-white sm:text-[15.5px]"
            class:bubble-tail={index === messages.length - 1}
          >{message}</div>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-[8px] border-t border-stone-200 px-[14px] py-[11px]">
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
  .tab-indicator {
    transform: translate3d(var(--indicator-x, 0), var(--indicator-y, 0), 0);
    width: var(--indicator-width, 0);
    height: var(--indicator-height, 0);
    opacity: var(--indicator-opacity, 0);
  }

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
