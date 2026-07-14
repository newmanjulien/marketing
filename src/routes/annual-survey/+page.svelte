<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import ResearchTeam from '$lib/survey/components/ResearchTeam.svelte';
  import { firmCriteria, previousListLinks } from '$lib/survey/domain/landingContent';
</script>

<svelte:head>
  <meta
    name="description"
    content="Overbase survey of the most innovative CMOs in professional services firms for 2027."
  />
</svelte:head>

<PageFrame>
  <ContentMeasure as="section" width="copy">
    <header>
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">
        Survey
      </p>
      <h1
        class="mt-[28px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        Survey has started for the most innovative CMOs of 2027
      </h1>

      <p class="mt-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700">
        Every year, Overbase surveys the marketing teams in the best professional services firms to
        find out who you believe are the most innovative CMOs in your industry
      </p>

      <img
        src="/cmos/group.avif"
        alt="Innovative CMO survey"
        class="mt-[34px] block w-full rounded-[11px] object-cover"
        loading="eager"
        decoding="async"
      />
    </header>

    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700"
    >
      <p>
        Overbase surveys marketing teams from the best insurance brokerages, law firms, government
        relations firms, consulting firms and accounting firms
      </p>

      <p>Then we publish a list of who you think are the most innovative CMOs in your industry</p>
    </div>

    <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
      Criteria and methodology
    </h2>
    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700"
    >
      <p>
        We send our survey to each firm's marketing team. Our results are entirely based on your
        responses to this survey
      </p>

      <p>We only survey marketing teams from:</p>

      <ul class="list-disc pl-[32px]">
        {#each firmCriteria as criterion}
          <li>{criterion}</li>
        {/each}
      </ul>
    </div>

    <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
      Last year's lists
    </h2>
    <p class="mt-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700">
      +900 marketers from the best professional services firms answered our survey last year. Check
      out last year's lists for each industry
    </p>
    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700 [&_a]:text-stone-500 [&_a]:underline [&_a]:decoration-current [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a:hover]:text-stone-750"
    >
      {#each previousListLinks as link}
        <p>
          <a href={link.href}>{link.label}</a>
        </p>
      {/each}
    </div>

    <ResearchTeam />
  </ContentMeasure>
</PageFrame>
