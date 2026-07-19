<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import PricingCard from '$lib/pricing/PricingCard.svelte';
  import PricingFaqSection from '$lib/pricing/PricingFaqSection.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/pricing');

  const pricingPlans = [
    {
      price: '$100',
      priceLabel: 'per month',
      name: 'Single user',
      description: 'Monthly fee to help you grow your practice with new clients and more business',
      ctaLabel: 'Join now',
      ctaHref: joinHref,
      external: true,
      benefits: [
        'One user',
        'Any data source',
        'Your network joins for free',
        'Self-serve'
      ]
    },
    {
      price: '5%',
      priceLabel: 'of revenue',
      name: 'Whole firm',
      description: 'Pay 5% of the revenue we help you generate and only pay after you get paid',
      ctaLabel: 'Schedule demo',
      ctaHref: 'https://cal.com/juliennewman',
      external: true,
      benefits: [
        'Unlimited users',
        'Any data source',
        'Your network joins for free',
        'White glove support'
      ]
    }
  ] as const;

  const faqItems = [
    {
      question: "Wait, what's your price again?",
      answer:
        "It's easy for you to join on your own and we charge a simple $100 per month. If your whole firm joins, we charge 5% of the revenue we help you generate and we get paid after you get paid"
    },
     {
      question: 'Can I join on my own?',
      answer:
        'Yes, easily. Quickly sign up for a simple $100 per month'
    },
      {
      question: 'Can my firm join?',
      answer:
        'Yes, and on favorable terms. If your whole firm joins, we use success based pricing where we charge 5% of the revenue we help you generate and we get paid after you get paid'
    },
    {
      question: 'Does my network pay anything?',
      answer:
        'Not necessarily. Your network can join Overbase and share data with you for free. They would only pay if they selected to receive opportunities'
    },
    {
      question: 'How does success-based pricing work?',
      answer:
        'Your firm pay 5% of the revenue we generate together, and you only pay after you get paid. Revenue is attributed by your team in a self-reported way'
    }
  ] as const;
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-900">
      Pricing
    </h1>

    <p class="mt-[24px] text-[17px] font-book leading-[1.55] tracking-normal text-stone-700">
      How much does Overbase cost? You can easily join on your own for a simple $100 per month. If your whole firm joins, we charge pay 5% of the revenue we help generate
    </p>

    <div class="mt-[43px] grid gap-[20px] sm:grid-cols-2">
      {#each pricingPlans as plan (plan.name)}
        <PricingCard {plan} />
      {/each}
    </div>
  </ContentMeasure>

  <PricingFaqSection heading="Frequently Asked Questions" items={faqItems} />
</PageFrame>
