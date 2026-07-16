<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import IndustryScreenshotPager from './IndustryScreenshotPager.svelte';
  import type { IndustryPageContent } from './types';

  let { content }: { content: IndustryPageContent } = $props();

  let activeOpportunityGroupIndex = $state(0);

  const opportunityGroupCount = $derived(content.screenshots.opportunityGroups.length);
  const activeOpportunityGroup = $derived(
    content.screenshots.opportunityGroups[activeOpportunityGroupIndex],
  );
  const renderedSections = $derived([
    {
      ...content.sections.setup,
      screenshot: content.screenshots.setup,
      showPager: false,
    },
    {
      ...content.sections.emailFormat,
      screenshot: activeOpportunityGroup.emailFormat,
      showPager: opportunityGroupCount > 1,
    },
    {
      ...content.sections.opportunityEmail,
      screenshot: activeOpportunityGroup.opportunityEmail,
      showPager: false,
    },
  ]);

  const previousGroup = () => {
    activeOpportunityGroupIndex = Math.max(0, activeOpportunityGroupIndex - 1);
  };

  const nextGroup = () => {
    activeOpportunityGroupIndex = Math.min(
      opportunityGroupCount - 1,
      activeOpportunityGroupIndex + 1,
    );
  };
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <header>
      <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {content.heading}
      </h1>

      <div class="mt-[24px] flex flex-col gap-[22px]">
        {#each content.introParagraphs as paragraph}
          <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
            {paragraph}
          </p>
        {/each}
      </div>
    </header>

    <div class="mt-[88px] flex flex-col gap-[96px]">
      {#each renderedSections as section (section.id)}
        <section>
          <h2 class="font-heading text-[24px] font-book leading-[1.15] tracking-normal text-stone-900">
            {section.heading}
          </h2>

          <p class="mt-[10px] text-[16px] font-book leading-[1.6] tracking-normal text-stone-700 sm:text-[17px]">
            {section.body}
          </p>

          <div class="mt-[32px]">
            <div
              class="overflow-hidden rounded-[8px] bg-stone-50"
              style:aspect-ratio={`${section.screenshot.width} / ${section.screenshot.height}`}
            >
              <img
                src={section.screenshot.src}
                alt={section.screenshot.alt}
                width={section.screenshot.width}
                height={section.screenshot.height}
                loading="lazy"
                class="h-full w-full object-contain"
              />
            </div>

            {#if section.showPager}
              <IndustryScreenshotPager
                currentIndex={activeOpportunityGroupIndex}
                itemCount={opportunityGroupCount}
                onprevious={previousGroup}
                onnext={nextGroup}
              />
            {/if}
          </div>
        </section>
      {/each}
    </div>
  </ContentMeasure>
</PageFrame>
