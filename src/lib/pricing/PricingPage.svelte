<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { createPortalAuthHrefForPath } from '$lib/portalAuthLinks';
  import { pricingBenefits, pricingFaqItems } from './pricingContent';

  const joinHref = createPortalAuthHrefForPath('join', '/pricing');
</script>

<svelte:head>
  <title>Pricing</title>
  <meta
    name="description"
    content="Our pricing is entirely success based"
  />
</svelte:head>

<main class="px-[22px] pb-[120px] pt-[43px] md:px-0">
  <section class="mx-auto w-full max-w-[680px]">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
      Pricing
    </h1>

    <p class="mt-[24px] max-w-[620px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
      Our pricing is success based. You pay a percentage of the net new revenue we help you generate
    </p>

    <article class="mt-[43px] rounded-[15px] border border-stone-200/70 bg-white px-[25px] py-[34px] md:px-[25px] md:py-[34px]">
      <div>
        <div class="font-heading text-[38px] font-normal leading-none tracking-normal text-stone-900">
          5%
        </div>
        <div class="mt-[6px] text-[14px] leading-none tracking-normal text-stone-500">
          of revenue
        </div>
      </div>

      <div class="mt-[28px] border-t border-stone-200/70 pt-[26px]">
        <h2 class="text-[14px] font-normal leading-none tracking-normal text-stone-900">
          Success based
        </h2>
        <p class="mt-[12px] text-[14px] font-normal leading-normal tracking-normal text-stone-500">
          Pay 5% of the revenue we help you generate and only pay after you get paid
        </p>

        <div class="mt-[22px]">
          <ButtonLink href={joinHref} target="_blank" rel="noopener noreferrer" variant="primary" size="large" fullWidth>Join now</ButtonLink>
        </div>
      </div>

      <ul class="mt-[24px] space-y-[23px] border-t border-stone-200/70 pt-[27px]">
        {#each pricingBenefits as benefit}
          <li class="flex items-center gap-[13px] text-[14px] font-normal leading-snug tracking-normal text-stone-700">
            <CheckIcon size={14} weight="regular" class="shrink-0 text-stone-700" />
            <span>{benefit}</span>
          </li>
        {/each}
      </ul>
    </article>
  </section>

  <section class="mx-auto mt-[128px] w-full max-w-[680px]">
    <h2 class="font-heading text-[22px] font-medium leading-[1.18] tracking-normal text-stone-800 md:text-[24px]">
      Frequently Asked Questions
    </h2>

    <div class="mt-[38px] flex flex-col gap-[32px]">
      {#each pricingFaqItems as item}
        <article>
          <h3 class="font-heading text-[17px] font-normal leading-[1.25] tracking-normal text-stone-800 md:text-[18px]">
            {item.question}
          </h3>
          <p class="mt-[12px] max-w-[620px] text-[14px] font-normal leading-[1.55] tracking-normal text-stone-500 md:text-[15px]">
            {item.answer}
          </p>
        </article>
      {/each}
    </div>
  </section>
</main>
