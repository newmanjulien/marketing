<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import CtaSection from '$lib/marketing/cta/CtaSection.svelte';
  import ConnectDataGraphic from '$lib/marketing/connect-data/ConnectDataGraphic.svelte';
  import { dataSources } from '$lib/marketing/connect-data/dataSources';
  import NetworkResultsGraphic from '$lib/marketing/network-results/NetworkResultsGraphic.svelte';
  import TextMessageConversation from '$lib/marketing/text-message/TextMessageConversation.svelte';
  import TextMessageScenarioDropdown from '$lib/marketing/text-message/TextMessageScenarioDropdown.svelte';
  import type { Industry } from './industries';

  let { industry }: { industry: Industry } = $props();

  let dataSourceIndex = $state(0);
  const dataSource = $derived(dataSources[dataSourceIndex]);

  function showNextDataSource() {
    dataSourceIndex = (dataSourceIndex + 1) % dataSources.length;
  }

  const scenarios = $derived(industry.scenarios);
  let selectedScenarioId = $state<string | null>(null);
  const scenario = $derived(
    scenarios.find((item) => item.id === selectedScenarioId) ?? scenarios[0]
  );
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <header>
      <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {industry.heading}
      </h1>

      <div class="mt-[24px] flex flex-col gap-[22px]">
        <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
          {industry.intro}
        </p>
        <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
          These partnerships drive growth, but many opportunities never surface. Because everyone's
          data is trapped in separate systems
        </p>
      </div>
    </header>

    <div class="mt-[88px] flex flex-col gap-[128px]">
      <section>
        <h2 class="font-heading text-[24px] font-book leading-[1.15] tracking-normal text-stone-900">
          Connect sales data
        </h2>

        <p class="mt-[10px] text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
          Both you and your partners securely connect sales data from wherever it lives. You stay in
          full control of who accesses what data
        </p>

        <div class="mt-[32px]">
          <ConnectDataGraphic source={dataSource} onNext={showNextDataSource} />

          <p
            class="mt-[18px] px-[2px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500/70 sm:text-[17px]"
          >
            {dataSource.description}
          </p>
        </div>
      </section>

      <section>
        <h2 class="font-heading text-[24px] font-book leading-[1.15] tracking-normal text-stone-900">
          Receive opportunities by text message
        </h2>

        <p class="mt-[10px] text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
          Your team receives text messages with actionable revenue opportunities. No new dashboard
          or tools to learn
        </p>

        <div class="mt-[32px]">
          <div
            class="flex h-[360px] flex-col overflow-hidden rounded-[14px] border border-stone-200 bg-white"
          >
            <div class="flex items-center border-b border-stone-200 bg-stone-50/60 px-[12px] py-[10px]">
              <div class="w-[224px] sm:w-[270px]">
                <TextMessageScenarioDropdown
                  {scenarios}
                  selectedScenario={scenario}
                  onSelect={(id) => (selectedScenarioId = id)}
                  placement="down"
                />
              </div>
            </div>

            <TextMessageConversation message={scenario.message} />
          </div>

          <p
            class="mt-[18px] px-[2px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500/70 sm:text-[17px]"
          >
            {scenario.description}
          </p>
        </div>
      </section>

      <section>
        <h2 class="font-heading text-[24px] font-book leading-[1.15] tracking-normal text-stone-900">
          Grow your practice
        </h2>

        <div class="mt-[10px] flex flex-col gap-[22px]">
          {#each industry.revenueOutcomeParagraphs as paragraph}
            <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
              {paragraph}
            </p>
          {/each}
        </div>

        <div class="mt-[30px]">
          <NetworkResultsGraphic results={industry.networkResults} />
        </div>
      </section>
    </div>
  </ContentMeasure>
</PageFrame>

<CtaSection heading={industry.ctaHeading} workPhrase={industry.ctaWorkPhrase} />
