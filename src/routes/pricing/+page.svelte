<script lang="ts">
  import { page } from '$app/state';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/marketing/portalAuthLinks';
  import PricingCard from '$lib/marketing/pricing/PricingCard.svelte';
  import PricingFaqSection from '$lib/marketing/pricing/PricingFaqSection.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', page.url.pathname);

  const pricingPlans = [
    {
      price: '$90',
      priceLabel: 'per month',
      name: 'Single user',
      description: 'Simple fee for professionals who want to quickly grow their practice',
      ctaLabel: 'Join now',
      ctaHref: joinHref,
      external: true,
      benefits: [
        'One user',
        'Use pre-existing formats',
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
        <PricingCard {plan} />
      {/each}
    </div>
  </ContentMeasure>

  <PricingFaqSection heading="Frequently Asked Questions" items={faqItems} />
</PageFrame>
