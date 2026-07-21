<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import ConnectDataGraphic from '$lib/marketing/connect-data/ConnectDataGraphic.svelte';
  import { outlook } from '$lib/marketing/connect-data/dataSources';
  import NetworkFunnelGraphic from '$lib/marketing/home/NetworkFunnelGraphic.svelte';
  import NetworkResultsGraphic from '$lib/marketing/network-results/NetworkResultsGraphic.svelte';
  import TestimonialsGraphic from '$lib/marketing/home/TestimonialsGraphic.svelte';
  import CtaSection from '$lib/marketing/cta/CtaSection.svelte';
  import Hero from '$lib/marketing/home/Hero.svelte';
  import FeatureSection from '$lib/marketing/home/FeatureSection.svelte';

  function scrollToTextMessage(event: MouseEvent) {
    const target = document.getElementById('text-message');
    if (!target) return;
    event.preventDefault();

    // Native smooth scroll honours the target's scroll-mt offset;
    // behavior:'auto' falls back to an instant jump for reduced motion.
    target.scrollIntoView({
      behavior: prefersReducedMotion.current ? 'auto' : 'smooth',
      block: 'start'
    });
  }
</script>

<svelte:head>
  <title>Overbase › Grow your practice</title>
  <meta
    name="description"
    content="Overbase helps professional services firms share sales data with your ecosystem partners"
  />
</svelte:head>

<main>
  <Hero />

  <div class="flex flex-col gap-[150px] pt-[150px] sm:gap-[190px] sm:pt-[190px]">
    <FeatureSection title="You connect your sales data">
      {#snippet body()}
        Easily, quickly and safely connect any data source. Overbase can analyze any structured and unstructured data
      {/snippet}
      <ConnectDataGraphic source={outlook} />
    </FeatureSection>

    <FeatureSection title="Your network connects their data">
      {#snippet body()}
        Your network easily, quickly and safely connects their data for free then we find opportunities for both of you
      {/snippet}
      <NetworkFunnelGraphic />
    </FeatureSection>

    <FeatureSection title="Receive opportunities by text message">
      {#snippet body()}
        Overbase happens by text message. No dashboard. No need to change how you work. Just
        <a
          href="#text-message"
          onclick={scrollToTextMessage}
          class="text-blue-500/80 underline decoration-current underline-offset-[3px] transition-colors hover:text-blue-500"
          >receive text messages</a
        > and answer
      {/snippet}
      <TestimonialsGraphic />
    </FeatureSection>

    <FeatureSection title="Grow your practice">
      {#snippet body()}
        Sharing data with your network helps you get new clients that you wouldn't have. And it helps you find opportunities to get more business from your current clients
      {/snippet}
      <NetworkResultsGraphic
        results={{
          opportunities: { count: '37', rate: '74%' },
          newClients: { count: '11', rate: '42%' },
          moreBusiness: { count: '8', rate: '61%' }
        }}
      />
    </FeatureSection>

    <CtaSection heading="Built for professional services" />
  </div>
</main>
