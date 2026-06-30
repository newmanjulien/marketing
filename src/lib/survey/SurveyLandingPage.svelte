<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import SurveyResultsSignup from '$lib/survey/SurveyResultsSignup.svelte';
  import type { SurveyResultsSignupForm } from './SurveyResultsSignup.svelte';

  let { form }: { form?: SurveyResultsSignupForm | null } = $props();

  const firmCriteria = [
    'Business Insurance Top 100 insurance brokerages',
    'AmLaw 100 law firms',
    'Top 50 government relations firms by lobbying revenue',
    'Tier 1 and Tier 2 strategy consulting firms',
    'Accounting Today Top 100 accounting firms'
  ] as const;

  const previousListLinks = [
    {
      label: "Last year's insurance brokerage CMOs ->",
      href: '/annual-survey/2026-insurance-cmos'
    },
    {
      label: "Last year's law firm CMOs ->",
      href: '/annual-survey/2026-law-firm-cmos'
    },
    {
      label: "Last year's government relations firm CMOs ->",
      href: '/annual-survey/2026-gov-cmos'
    },
    {
      label: "Last year's consulting firm CMOs ->",
      href: '/annual-survey/2026-consulting-cmos'
    },
    {
      label: "Last year's accounting firm CMOs ->",
      href: '/annual-survey/2026-accounting-cmos'
    }
  ] as const;

  const researchTeamProfiles = [
    {
      name: 'Julien Newman',
      title: 'CEO at Overbase',
      imageSrc: '/julien.png',
      imageAlt: 'Julien Newman'
    },
    {
      name: 'Caden Pun',
      title: 'Research Analyst',
      imageSrc: '/caden.png',
      imageAlt: 'Caden Pun'
    }
  ] as const;
</script>

<svelte:head>
  <meta
    name="description"
    content="Overbase survey of the most innovative CMOs in professional services firms for 2027."
  />
</svelte:head>

<PageFrame topPadding="standard">
  <ContentMeasure as="section" width="copy">
    <header>
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">
        Survey
      </p>
      <h1
        class="mt-[14px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        Survey has started for the most innovative CMOs of 2027
      </h1>

      <p class="mt-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
        Every year, Overbase surveys the marketing teams in the best professional services firms to
        find out who are the most innovative CMOs in each industry according to their peers.
      </p>

      <img
        src="/cmos/group.avif"
        alt="Innovative CMO survey"
        class="mt-[34px] block w-full rounded-[8px] object-cover"
        loading="eager"
        decoding="async"
      />
    </header>

    <SurveyResultsSignup form={form ?? undefined} />

    <p class="mt-[44px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
      Every year, Overbase surveys the marketing teams of the best professional services firms to
      find the most innovative CMOs in each industry.
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
        Overbase surveys marketing teams from the best insurance brokerages, law firms, government
        relations firms, consulting firms and accounting firms.
      </p>

      <p>Then we publish a list of the most innovative CMOs in each industry.</p>
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
        We send our survey to each firm's marketing team. Our list is entirely based on the
        responses to this survey.
      </p>

      <p>We only survey marketing teams from the best firms in each industry:</p>

      <ul class="list-disc pl-[32px]">
        {#each firmCriteria as criterion}
          <li>{criterion}</li>
        {/each}
      </ul>

      <p>
        Nothing but survey results from peers is taken into account. And there's no way to request
        a survey, ask for a firm to be included or nominate a CMO.
      </p>
    </div>

    <h2
      class="mt-[50px] font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
    >
      Last year's lists
    </h2>
    <p class="mt-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
      +900 marketers from the best professional services firms answered our survey last year.
      Check out last year's lists for each industry.
    </p>
    <div
      class="survey-previous-links mt-[20px] flex flex-col gap-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700 [&_a]:underline [&_a]:underline-offset-[4px] [&_a]:transition-colors [&_a:hover]:text-stone-500"
    >
      {#each previousListLinks as link}
        <p>
          <a href={link.href}>{link.label}</a>
        </p>
      {/each}
    </div>

    <section
      class="mt-[58px] border-t border-stone-200 pt-[34px]"
      aria-labelledby="research-team-heading"
    >
      <h2
        id="research-team-heading"
        class="font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        Meet the research team
      </h2>

      <div class="mt-[22px] grid grid-cols-1 gap-[12px] sm:grid-cols-2">
        {#each researchTeamProfiles as profile}
          <article
            class="flex min-h-[132px] items-center gap-[16px] rounded-[8px] border border-stone-200 bg-stone-50/70 p-[16px]"
          >
            <img
              src={profile.imageSrc}
              alt={profile.imageAlt}
              class="h-[82px] w-[82px] shrink-0 rounded-full border border-stone-200 bg-white object-cover object-center shadow-sm"
              loading="lazy"
              decoding="async"
            />
            <div class="min-w-0">
              <h3
                class="font-heading text-[18px] font-medium leading-[1.15] tracking-normal text-stone-900"
              >
                {profile.name}
              </h3>
              <p
                class="mt-[6px] text-[14px] font-normal leading-[1.35] tracking-normal text-stone-600"
              >
                {profile.title}
              </p>
            </div>
          </article>
        {/each}
      </div>
    </section>
  </ContentMeasure>
</PageFrame>

<style>
  .survey-previous-links :global(a) {
    text-decoration-color: currentColor;
  }
</style>
