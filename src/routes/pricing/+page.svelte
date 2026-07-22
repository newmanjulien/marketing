<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import ButtonLink from '$lib/marketing/ui/ButtonLink.svelte';

  const plan = {
    ctaLabel: 'Schedule demo',
    ctaHref: 'https://cal.com/juliennewman',
    benefits: [
      'Unlimited users',
      'Create advanced formats tailored to your firm',
      'Your network joins for free',
      'Zero retention data processing'
    ]
  } as const;

  const REVENUE_PER_MEMBER = 30_000;
  const FEE_RATE = 0.05;
  const memberSteps = [50, 75, 100, 150, 200, 300, 500, 750, 1000] as const;

  let stepIndex = $state(2);

  const members = $derived(memberSteps[stepIndex]);
  const membersLabel = $derived(
    members.toLocaleString('en-US') + (stepIndex === memberSteps.length - 1 ? '+' : '')
  );
  const dollars = (amount: number) => `$${amount.toLocaleString('en-US')}`;
  const revenue = $derived(members * REVENUE_PER_MEMBER);
  const fee = $derived(revenue * FEE_RATE);

  const quote = {
    quote: 'Sharing sales data with our network increased revenue by 10% for us and for the companies in our network',
    name: "Karthik Rao",
    role: 'CEO',
    company: 'Nielsen'
  };

  const faqItems = [
    {
      question: "What's your pricing again?",
      answer:
        "Join for free if you're invited by someone in your network. Or pay 5% of the revenue we help you generate if you want a tailored experience and maximum growth. You self-report your own revenue and you only pay us after you get paid"
    },
    {
      question: 'Can I join if one of my friends invited me?',
      answer:
        "Yes, for free. You can easily join Overbase as an individual professional or as a whole firm if someone invited you. You will get instant access to the data your friend's firm has connected to Overbase"
    },
    {
      question: 'How does success-based pricing work?',
      answer:
        'For a tailored experience and maximum growth, you pay 5% of the revenue we generate together.  You only pay after you get paid. Revenue is attributed by your team in a self-reported way'
    }
  ] as const;
</script>

<svelte:head>
  <title>Overbase › Pricing</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] text-stone-900">
      Pricing
    </h1>

    <p class="mt-[24px] text-[17px] font-book leading-[1.55] text-stone-700">
      Join for free when someone in your network invites you. For a tailored experience and maximum growth, we charge 5% of the revenue we generate together
    </p>

    <div class="mt-[55px]">
      <h2 id="firm-size-label" class="text-[17px] font-medium leading-none text-stone-900">
        How many professionals in your firm?
      </h2>

      <input
        type="range"
        min="0"
        max={memberSteps.length - 1}
        step="1"
        bind:value={stepIndex}
        aria-labelledby="firm-size-label"
        style="--fill: {(stepIndex / (memberSteps.length - 1)) * 100}%"
        class="member-slider mt-[24px] w-full"
      />
      <div class="mt-[12px] flex justify-between text-[13px] font-book leading-none text-stone-400">
        <span>{memberSteps[0]}</span>
        <span>{memberSteps[memberSteps.length - 1].toLocaleString('en-US')}+</span>
      </div>

      <article
        class="mt-[30px] rounded-[18px] border border-stone-200 bg-white px-[26px] py-[28px] shadow-[0_1px_0_rgba(48,47,45,0.03)]"
      >
        <div class="flex items-start justify-between gap-[24px]">
          <div>
            <p class="font-heading text-[46px] font-medium leading-none tabular-nums text-stone-900">
              {dollars(revenue)}
            </p>
            <p class="mt-[9px] text-[15px] font-normal leading-none text-stone-500">
              New revenue you generate
            </p>
          </div>
          <div class="text-right">
            <p class="font-heading text-[46px] font-medium leading-none tabular-nums text-stone-900">
              5%
            </p>
            <p class="mt-[9px] text-[15px] font-normal leading-none text-stone-500">Our fee</p>
          </div>
        </div>

        <p class="mt-[30px] border-t border-stone-200/70 pt-[30px] text-[16px] font-book leading-[1.55] text-stone-500">
          Most teams of <span class="tabular-nums text-stone-500">{membersLabel}</span> professionals
          generate <span class="tabular-nums text-stone-500">{dollars(revenue)}</span> of new revenue every year and
          pay <span class="tabular-nums text-stone-500">{dollars(fee)}</span> which is a 5% success fee
        </p>

        <div class="mt-[30px]">
          <ButtonLink
            href={plan.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="medium"
            fullWidth
          >
            {plan.ctaLabel}
          </ButtonLink>
        </div>

        <ul class="mt-[28px] space-y-[23px] border-t border-stone-200/70 pt-[28px]">
          {#each plan.benefits as benefit (benefit)}
            <li class="flex items-center gap-[13px] text-[15px] font-book leading-snug text-stone-700">
              <CheckIcon size={14} weight="regular" class="shrink-0 text-stone-700" />
              <span>{benefit}</span>
            </li>
          {/each}
        </ul>
      </article>
    </div>
  </ContentMeasure>

  <ContentMeasure as="section" width="narrow" class="mt-[128px]">
    <figure class="text-center">
      <blockquote
        class="mx-auto max-w-[540px] font-heading text-[30px] font-book leading-[1.35] text-stone-800 sm:text-[32px]"
      >
        "{quote.quote}"
      </blockquote>
      <figcaption class="mt-[20px] text-[14px] font-book leading-none text-stone-400 sm:text-[15px]">
        {quote.name}, {quote.role}, <span class="text-stone-500">{quote.company}</span>
      </figcaption>
    </figure>
  </ContentMeasure>

  <ContentMeasure as="section" width="narrow" class="mt-[131px]">
    <h2 class="font-heading text-[40px] font-book leading-[1.18] text-stone-750">
      Frequently Asked Questions
    </h2>

    <div class="mt-[38px] flex flex-col gap-[32px]">
      {#each faqItems as item (item.question)}
        <article>
          <h3 class="font-heading text-[17px] font-book leading-[1.25] text-stone-750 sm:text-[18px]">
            {item.question}
          </h3>
          <p class="mt-[12px] text-[14px] font-book leading-[1.55] text-stone-500 sm:text-[15px]">
            {item.answer}
          </p>
        </article>
      {/each}
    </div>
  </ContentMeasure>
</PageFrame>

<style>
  .member-slider {
    appearance: none;
    height: 8px;
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      #c4c0bb 0%,
      #c4c0bb var(--fill),
      #eeedeb var(--fill),
      #eeedeb 100%
    );
    outline: none;
  }

  .member-slider::-webkit-slider-thumb {
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 9999px;
    background: white;
    box-shadow:
      0 0 0 1px rgb(48 47 45 / 0.08),
      0 2px 6px rgb(48 47 45 / 0.2);
    cursor: grab;
  }

  .member-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 9999px;
    background: white;
    box-shadow:
      0 0 0 1px rgb(48 47 45 / 0.08),
      0 2px 6px rgb(48 47 45 / 0.2);
    cursor: grab;
  }

  .member-slider:active::-webkit-slider-thumb {
    cursor: grabbing;
  }
</style>
