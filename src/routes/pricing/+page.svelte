<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import PricingCard from '$lib/pricing/PricingCard.svelte';
  import PricingFaqSection from '$lib/pricing/PricingFaqSection.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/pricing');

  const pricingPlan = {
    price: '5%',
    priceLabel: 'of revenue',
    name: 'Success based',
    description: 'Pay 5% of the revenue we help you generate and only pay after you get paid',
    ctaLabel: 'Join now',
    benefits: [
      'Unlimited users and unlimited use',
      'Add any and all data sources',
      'Invite as many partners as you want'
    ]
  } as const;

  const faqItems = [
    {
      question: "Wait, what's your price again?",
      answer:
        'We charge 5% of the net new revenue we help you generate. You only pay after you get paid'
    },
    {
      question: 'Do my ecosystem partners pay anything?',
      answer:
        'No. Your ecosystem partners can share any data with you for free through Overbase. They would only pay if they selected to receive revenue opportunities'
    },
    {
      question: 'How does success-based pricing work?',
      answer:
        'You pay 5% of the net new revenue we generate together, and you only pay after you get paid. Revenue is attributed by your team in a self-reported way'
    },
    {
      question: 'Are there any upfront costs at all?',
      answer:
        "Not necessarily. But most companies pay $15,000 for a proof of concept before signing an annual contract. And in the first year, some companies purchase a one-week onsite deployment kickoff for $10,000, which includes an Overbase engineer on-site, travel expenses, deployment assistance, knowledge transfer, and hands-on training"
    }
  ] as const;
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
      Pricing
    </h1>

    <p class="mt-[24px] max-w-[620px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700">
      Our pricing is success based. Pay 5% of the net new revenue we help you generate. And only
      pay after you get paid
    </p>

    <PricingCard {joinHref} plan={pricingPlan} />
  </ContentMeasure>

  <PricingFaqSection heading="Frequently Asked Questions" items={faqItems} />
</PageFrame>
