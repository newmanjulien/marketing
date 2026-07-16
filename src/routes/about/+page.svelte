<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
</script>

<PageFrame>
  <ContentMeasure as="article" width="copy">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-750">
      About Overbase
    </h1>

    <div class="mt-[32px] flex flex-col gap-[22px]">
      <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700">
        We're a team of machine learning engineers who have been working together for over a decade
      </p>

      <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700">
        We have a unique culture that's all about making you successful
      </p>

      <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700">
        We measure our success by yours. Our pricing is pegged to revenue you get from using our
        tech. And our entire team's compensation is also pegged to your success
      </p>

      <p class="text-[16px] font-book leading-[1.6] tracking-normal text-stone-700">
        Overbase is a forward deployed company. We're HQed in San Francisco but our team spends most
        of the year in the city where our users need us most
      </p>
    </div>

    <section
      class="mt-[72px] grid gap-[28px] border-t border-stone-200/80 pt-[40px] sm:grid-cols-[168px_1fr] sm:items-start"
    >
      <div class="w-[168px] max-w-full overflow-hidden rounded-[16px] bg-stone-100">
        <img
          src="/julien.png"
          alt="Julien Newman"
          class="aspect-square w-full object-cover"
          width="168"
          height="168"
        />
      </div>

      <div>
        <h2 class="font-heading text-[20px] font-medium leading-[1.1] tracking-normal text-stone-900">
          Our CEO
        </h2>

        <p class="mt-[16px] text-[16px] font-book leading-[1.6] tracking-normal text-stone-700">
          Julien Newman is a machine learning engineer who has built startups at the intersection of
          AI and sales for +10 years. Check out:
          <a
            href="https://juliennewman.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-500 underline decoration-current underline-offset-[3px] transition-colors hover:text-stone-750"
          >
            juliennewman.com
          </a>
        </p>
      </div>
    </section>
  </ContentMeasure>
</PageFrame>
