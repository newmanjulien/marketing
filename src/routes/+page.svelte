<script lang="ts">
  import CalendarConnectGraphic from '$lib/marketing/home/features/CalendarConnectGraphic.svelte';
  import NetworkResultsGraphic from '$lib/marketing/home/features/NetworkResultsGraphic.svelte';
  import TestimonialsGraphic from '$lib/marketing/home/features/TestimonialsGraphic.svelte';
  import HomeCtaSection from '$lib/marketing/home/cta/HomeCtaSection.svelte';
  import Hero from '$lib/marketing/home/hero/Hero.svelte';
  import FeatureSection from '$lib/marketing/home/shared/FeatureSection.svelte';

  function scrollToTextMessage(event: MouseEvent) {
    const target = document.getElementById('text-message');
    if (!target) return;
    event.preventDefault();

    // Native smooth scroll honours the target's scroll-mt offset and the user's
    // reduced-motion preference; behavior:'auto' falls back to an instant jump.
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: motionOk ? 'smooth' : 'auto', block: 'start' });
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
    <FeatureSection title="You connect your data">
      {#snippet body()}
        Easily, quickly and safely connect any data source. Overbase can analyze any structured and unstructured data
      {/snippet}
      <CalendarConnectGraphic />
    </FeatureSection>

    <FeatureSection title="Your network connects their data">
      {#snippet body()}
        Your network easily, quickly and safely connects their data for free then we find opportunities for both of you
      {/snippet}
      <NetworkResultsGraphic />
    </FeatureSection>

    <FeatureSection title="Get opportunities by text message">
      {#snippet body()}
        Overbase happens by text message. No dashboard. No need to change how you work. Just
        <a
          href="#text-message"
          onclick={scrollToTextMessage}
          class="text-stone-500/80 underline decoration-current underline-offset-[3px] transition-colors hover:text-stone-500"
          >get text messages</a
        > and answer
      {/snippet}
      <TestimonialsGraphic />
    </FeatureSection>

    <HomeCtaSection />
  </div>
</main>
