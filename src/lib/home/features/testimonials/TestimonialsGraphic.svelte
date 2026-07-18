<script lang="ts">
  const testimonials = [
    {
      quote: "Our team adopted Overbase immediately because it's just emails",
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

<div class="flex flex-col gap-[34px] sm:gap-[40px]">
  {#each testimonials as testimonial (testimonial.quote)}
    <figure class="border-l-[2px] border-stone-200/70 pl-[18px] sm:pl-[20px]">
      <blockquote
        class="font-heading text-[20px] font-book italic leading-[1.42] tracking-normal text-stone-700 sm:text-[22px]"
      >
        "{testimonial.quote}"
      </blockquote>

      <figcaption class="mt-[14px] text-[16px] font-book leading-none tracking-normal text-stone-400 sm:text-[17px]">
        {testimonial.name}, {testimonial.role}, <span class="font-book text-stone-500">{testimonial.company}</span>
      </figcaption>
    </figure>
  {/each}
</div>
