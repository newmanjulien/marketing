<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import type { ActionData } from './$types';
  import SurveyResultsSignup from './SurveyResultsSignup.svelte';

  let { form }: { form?: ActionData } = $props();

  const surveyLandingMetaDescription =
    'Overbase survey of the most innovative CMOs in professional services firms for 2026.';

  const surveyLandingHero = {
    eyebrow: 'Survey',
    title: 'Survey has started for the most innovative CMOs of 2026',
    description:
      'Every summer, we survey the leadership of the best professional services firms to find out who are the most innovative CMOs in each industry according to their peers',
    image: {
      src: '/684997b8f748d8c055f3798d.avif',
      alt: 'Innovative CMO survey'
    }
  };

</script>

<svelte:head>
  <meta name="description" content={surveyLandingMetaDescription} />
</svelte:head>

<PageFrame topPadding="standard">
  <ContentMeasure as="section" width="copy">
    <header>
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">
        {surveyLandingHero.eyebrow}
      </p>
      <h1
        class="mt-[14px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        {surveyLandingHero.title}
      </h1>

      <p class="mt-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
        {surveyLandingHero.description}
      </p>

      <img
        src={surveyLandingHero.image.src}
        alt={surveyLandingHero.image.alt}
        class="mt-[34px] block w-full rounded-[8px] object-cover"
        loading="eager"
        decoding="async"
      />
    </header>

    <SurveyResultsSignup {form} />

    <p class="mt-[44px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
      Every summer, Overbase surveys the leadership of the best professional services
      firms to find the most innovative CMOs in each industry.
    </p>

    <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
      Most innovative CMOs in each industry
    </h2>
    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700"
    >
      <p>
        Overbase surveys firm leaders from the best law firms, insurance brokerages, consulting firms, accounting firms and government relations firms.
      </p>
      <p>
        Then we publish a list of the most innovative CMOs in each industry.
      </p>
    </div>

    <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
      Criteria and methodology
    </h2>
    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700"
    >
      <p>
        We survey AmLaw 100 law firms, Business Insurance Top 100 insurance brokerages, Tier 1 and Tier 2 strategy consulting firms, Accounting Today Top 100
        accounting firms and the the top 50 government relations firms by lobbying revenue.
      </p>
       <p>
        We send our survey to each firm's CMO and to each firm's leadership. Our results are entirely based on the responses to this survey.
      </p>
      <p>
        There's no way to request a survey, ask for a firm to be included or nominate a candidate.
      </p>
      <p>
        Nothing but survey results from peers is taken into account.
      </p>
    </div>

     <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
     Last year's lists
    </h2>
    <p class="mt-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700"
    >
        Thousands of leaders from the best professional services firms answer our survey every year. Check out last year's lists from each industry we survey.
      </p>
    <div
      class="mt-[20px] flex flex-col gap-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700 [&_a]:underline [&_a]:decoration-stone-400 [&_a]:underline-offset-[4px] [&_a:hover]:text-stone-950"
    >
      <p>
        <a href="#">Last year's law firm CMOs -></a>
      </p>
       <p>
        <a href="#">Last year's insurance brokerage CMOs -></a>
      </p>
      <p>
        <a href="#">Last year's consulting firm CMOs -></a>
      </p>
      <p>
        <a href="#">Last year's accounting firm CMOs -></a>
      </p>
      <p>
        <a href="#">Last year's government relations firm CMOs -></a>
      </p>
    </div>
  </ContentMeasure>
</PageFrame>
