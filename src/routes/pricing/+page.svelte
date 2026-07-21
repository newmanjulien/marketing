<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte';
  import { page } from '$app/state';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import { createPortalAuthUrl } from '$lib/marketing/portalAuthLinks';
  import ButtonLink from '$lib/marketing/ui/ButtonLink.svelte';

  const pricingPlans = [
    {
      price: '$90',
      priceLabel: 'per month',
      name: 'Single user',
      description: 'Simple fee for professionals who want to quickly grow their practice',
      ctaLabel: 'Join now',
      ctaHref: createPortalAuthUrl('join', page.url.pathname),
      external: true,
      benefits: [
        'One user',
        'Use existing formats',
        'Your network joins for free',
        'Zero retention data processing'
      ]
    },
    {
      price: '5%',
      priceLabel: 'of revenue',
      name: 'Whole firm',
      description: 'Professional services firms only pay as a percentage of the revenue you get',
      ctaLabel: 'Schedule demo',
      ctaHref: 'https://cal.com/juliennewman',
      external: true,
      benefits: [
        'Unlimited users',
        'Use custom formats',
        'Your network joins for free',
        'Zero retention data processing'
      ]
    }
  ] as const;

  const faqItems = [
    {
      question: 'Can I join on my own?',
      answer:
        'Yes, easily. Quickly sign up for a simple $90 per month'
    },
    {
      question: 'Can my whole firm join?',
      answer:
        'Yes, and on favorable terms. If your whole firm joins, we use success based pricing where we charge 5% of the revenue we help you generate and we get paid after you get paid'
    },
    {
      question: "What's different about custom formats?",
      answer:
        'Overbase packages up the most popular formats so single users can easily access them. When we partner with a whole firm, we create custom formats together that perfectly match how that firm works'
    },
    {
      question: 'Does my network pay anything?',
      answer:
        'No. Your network can join Overbase and share data with you for free. They would only pay if they selected to receive opportunities'
    },
    {
      question: 'How does success-based pricing work?',
      answer:
        'Your firm pays 5% of the revenue we generate together, and you only pay after you get paid. Revenue is attributed by your team in a self-reported way'
    }
  ] as const;
</script>

<svelte:head>
  <title>Overbase › Pricing</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-900">
      Pricing
    </h1>

    <p class="mt-[24px] text-[17px] font-book leading-[1.55] tracking-normal text-stone-700">
      How much does Overbase cost? You can easily join on your own for a simple $90 per month. If your whole firm joins, we charge 5% of the revenue we help generate
    </p>

    <div class="mt-[43px] grid gap-[20px] sm:grid-cols-2">
      {#each pricingPlans as plan (plan.name)}
        <article class="rounded-[18px] border border-stone-200 bg-white px-[25px] py-[34px]">
          <div>
            <div class="font-heading text-[38px] font-medium leading-none tracking-normal text-stone-900">
              {plan.price}
            </div>
            <div class="mt-[6px] text-[14px] leading-none tracking-normal text-stone-500">
              {plan.priceLabel}
            </div>
          </div>

          <div class="mt-[28px] border-t border-stone-200 pt-[26px]">
            <h2 class="text-[14px] font-medium leading-none tracking-normal text-stone-900">
              {plan.name}
            </h2>
            <p class="mt-[12px] text-[14px] font-book leading-normal tracking-normal text-stone-500">
              {plan.description}
            </p>

            <div class="mt-[22px]">
              <ButtonLink
                href={plan.ctaHref}
                target={plan.external ? '_blank' : undefined}
                rel={plan.external ? 'noopener noreferrer' : undefined}
                variant="primary"
                size="medium"
                fullWidth
              >
                {plan.ctaLabel}
              </ButtonLink>
            </div>
          </div>

          <ul class="mt-[24px] space-y-[23px] border-t border-stone-200 pt-[27px]">
            {#each plan.benefits as benefit (benefit)}
              <li class="flex items-center gap-[13px] text-[14px] font-book leading-snug tracking-normal text-stone-700">
                <CheckIcon size={14} weight="regular" class="shrink-0 text-stone-700" />
                <span>{benefit}</span>
              </li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </ContentMeasure>

  <ContentMeasure as="section" width="narrow" class="mt-[128px]">
    <h2 class="font-heading text-[35px] font-book leading-[1.18] tracking-normal text-stone-750">
      Frequently Asked Questions
    </h2>

    <div class="mt-[38px] flex flex-col gap-[32px]">
      {#each faqItems as item (item.question)}
        <article>
          <h3 class="font-heading text-[17px] font-book leading-[1.25] tracking-normal text-stone-750 sm:text-[18px]">
            {item.question}
          </h3>
          <p class="mt-[12px] text-[14px] font-book leading-[1.55] tracking-normal text-stone-500 sm:text-[15px]">
            {item.answer}
          </p>
        </article>
      {/each}
    </div>
  </ContentMeasure>
</PageFrame>
