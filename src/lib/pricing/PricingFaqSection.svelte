<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';

  type PricingFaqItem = {
    question: string;
    answer: string;
  };

  let {
    heading,
    items
  }: {
    heading: string;
    items: readonly PricingFaqItem[];
  } = $props();
</script>

<ContentMeasure as="section" width="narrow" class="mt-[128px]">
  <h2 class="font-heading text-[35px] font-book leading-[1.18] tracking-normal text-stone-750">
    {heading}
  </h2>

  <div class="mt-[38px] flex flex-col gap-[32px]">
    {#each items as item (item.question)}
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
