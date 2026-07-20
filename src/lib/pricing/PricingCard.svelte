<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';

  type PricingPlan = {
    price: string;
    priceLabel: string;
    name: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    external?: boolean;
    benefits: readonly string[];
  };

  let { plan }: { plan: PricingPlan } = $props();
</script>

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
