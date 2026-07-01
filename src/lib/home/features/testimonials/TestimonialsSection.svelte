<script lang="ts">
  import HomeSection from '../../shared/HomeSection.svelte';

  const testimonials = [
    {
      quote: 'Overbase increased our revenue from partnerships by 20%',
      name: "Alex L'Heureux",
      role: 'CEO',
      company: 'WSP'
    },
    {
      quote: 'Overbase is simple to learn, our team just receives emails',
      name: 'Karthik Rao',
      role: 'CEO',
      company: 'Nielsen'
    }
  ] as const;
</script>

<HomeSection>
    <h2 class="font-heading text-[28px] font-medium leading-[1.14] tracking-normal text-stone-750 sm:text-[26px] sm:leading-[1.18]">
      See why teams stick with Overbase
    </h2>

    <p class="mt-[18px] max-w-[700px] text-[15px] font-book leading-[1.55] tracking-normal text-stone-500 sm:text-[16px]">
      We spend most of our time building things for the companies who already use Overbase and for their partners. Here are some nice things they've said
    </p>

    <div class="mt-[42px] flex flex-col gap-[34px] sm:gap-[40px]">
      {#each testimonials as testimonial (testimonial.quote)}
        <figure class="border-l-[2px] border-stone-200/70 pl-[18px] sm:pl-[20px]">
          <blockquote
            class="font-heading text-[18px] font-book italic leading-[1.42] tracking-normal text-stone-700 sm:text-[20px]"
          >
            "{testimonial.quote}"
          </blockquote>

          <figcaption class="mt-[14px] text-[14px] font-book leading-none tracking-normal text-stone-400 sm:text-[15px]">
            {testimonial.name}, {testimonial.role}, <span class="font-book text-stone-500">{testimonial.company}</span>
          </figcaption>
        </figure>
      {/each}
    </div>
</HomeSection>
