<script lang="ts">
  import { homeIndustries } from '$lib/marketing/home/homeIndustries';
  import type { IndustryId } from '$lib/marketing/industries/industryContent';
  import type { Snippet } from 'svelte';

  let {
    onIndustryHover
  }: {
    onIndustryHover: (id: IndustryId) => void;
  } = $props();

  const industryLabelById = Object.fromEntries(
    homeIndustries.map((industry) => [industry.id, industry.label])
  ) as Record<IndustryId, string>;

  type Logo = {
    mark: Snippet;
    name: string;
    industryId: IndustryId;
    brand: string;
  };

  // The marks (hk, gt, ...) are the snippets declared in the markup below.
  const logos: Logo[] = [
    { mark: hk, name: 'Holland & Knight', industryId: 'government-relations', brand: '#2c3c7c' },
    { mark: gt, name: 'Greenberg Traurig', industryId: 'law', brand: '#171717' },
    { mark: marsh, name: 'Marsh', industryId: 'insurance', brand: '#002c77' },
    { mark: bain, name: 'Bain & Company', industryId: 'consulting', brand: '#cc0000' },
    { mark: ey, name: 'Ernst & Young', industryId: 'accounting', brand: '#2e2e38' },
    { mark: lw, name: 'Latham & Watkins', industryId: 'law', brand: '#a6192e' }
  ];
</script>

{#snippet hk()}
  <svg viewBox="0 0 24 24" fill="currentColor">
    <text
      x="12"
      y="17.5"
      text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="16"
      letter-spacing="-3">HK</text
    >
  </svg>
{/snippet}

{#snippet gt()}
  <svg viewBox="0 0 24 24" fill="currentColor">
    <mask id="hero-logo-gt-mask">
      <rect width="24" height="24" fill="white" />
      <text
        x="12"
        y="17"
        text-anchor="middle"
        font-family="'Helvetica Neue', Arial, sans-serif"
        font-weight="300"
        font-size="13"
        fill="black">GT</text
      >
    </mask>
    <rect width="24" height="24" mask="url(#hero-logo-gt-mask)" />
  </svg>
{/snippet}

{#snippet marsh()}
  <svg viewBox="0 0 24 24" fill="currentColor">
    <mask id="hero-logo-marsh-mask">
      <rect width="24" height="24" fill="white" />
      <path d="M10.5 4L13.4 4L0.5 16.5L0.5 13.5Z" fill="black" />
      <path d="M13.5 20L10.6 20L23.5 7.5L23.5 10.5Z" fill="black" />
    </mask>
    <rect x="1" y="4.5" width="22" height="15" rx="5" mask="url(#hero-logo-marsh-mask)" />
  </svg>
{/snippet}

{#snippet bain()}
  <svg viewBox="0 0 24 24">
    <path
      d="M17.8 5.1A9 9 0 1 1 12.8 3.05"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
    />
    <path d="M15.3 5.2L7.4 13.2l7.8 1.4z" fill="currentColor" />
  </svg>
{/snippet}

{#snippet ey()}
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path class="ey-beam" d="M0 9L24 0v4.5z" />
    <text
      x="12"
      y="23.5"
      text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="bold"
      font-size="13"
      letter-spacing="-0.5">EY</text
    >
  </svg>
{/snippet}

{#snippet lw()}
  <svg viewBox="0 0 24 24" fill="currentColor">
    <mask id="hero-logo-lw-mask">
      <rect width="24" height="24" fill="white" />
      <text
        x="12.2"
        y="17"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="bold"
        font-size="12"
        letter-spacing="-0.5"
        fill="black">LW</text
      >
    </mask>
    <rect width="24" height="24" mask="url(#hero-logo-lw-mask)" />
  </svg>
{/snippet}

<div class="flex items-center justify-center gap-[40px] text-stone-400">
  {#each logos as logo, index (logo.name)}
    <!-- svelte-ignore a11y_no_static_element_interactions -- hover is a mouse-only flourish; the graphic's tabs remain the accessible control -->
    <div
      class="logo-item relative flex will-change-[transform,opacity]"
      style:--brand={logo.brand}
      style:--logo-index={index}
      onmouseenter={() => onIndustryHover(logo.industryId)}
    >
      <span class="logo flex h-[25px] w-[25px]" aria-hidden="true">{@render logo.mark()}</span>
      <span class="logo-label">{logo.name}<span class="logo-label-industry">{industryLabelById[logo.industryId]}</span></span>
    </div>
  {/each}
</div>

<style>
  /* Entrance: one by one, starting at --logos-enter-delay (set by the hero's
     page-load choreography; defaults to 0 so the logos never stay hidden). */
  .logo-item {
    opacity: 0;
    transform: translateY(4px);
    animation: logo-enter 320ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--logos-enter-delay, 0ms) + var(--logo-index) * 90ms) both;
  }

  @keyframes logo-enter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .logo {
    transition: color 180ms ease;
  }

  .logo svg {
    height: 100%;
    width: 100%;
  }

  .logo-item:hover .logo {
    color: var(--brand);
    animation: logo-bounce 900ms cubic-bezier(0.28, 0.84, 0.42, 1);
  }

  .logo-label {
    position: absolute;
    bottom: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%) translateY(3px);
    background: #383634;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    padding: 6px 9px;
    border-radius: 7px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .logo-label-industry {
    color: #a3a09d;
    font-weight: 400;
  }

  .logo-label-industry::before {
    content: '·';
    margin: 0 4px;
  }

  .logo-item:hover .logo-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @keyframes logo-bounce {
    0% {
      transform: translateY(0);
    }

    20% {
      transform: translateY(-7px);
    }

    40% {
      transform: translateY(0);
    }

    60% {
      transform: translateY(-4px);
    }

    80% {
      transform: translateY(0);
    }

    90% {
      transform: translateY(1px);
    }

    100% {
      transform: translateY(0);
    }
  }

  /* EY is two-tone: --brand covers the letters, the beam goes yellow on its own. */
  .ey-beam {
    transition: fill 180ms ease;
  }

  .logo-item:hover .ey-beam {
    fill: #ffe600;
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-item {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }

    .logo-item:hover .logo {
      animation: none;
    }
  }
</style>
