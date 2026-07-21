<script lang="ts">
  const testimonials = [
    {
      quote: "We adopted Overbase immediately because it's just text messages",
      name: "Alex L'Heureux",
      role: 'CEO',
      company: 'WSP'
    },
    {
      quote: 'Overbase is simple, we just receive text messages',
      name: 'Karthik Rao',
      role: 'CEO',
      company: 'Nielsen'
    }
  ];
</script>

<div class="flex flex-col gap-[34px] sm:gap-[40px]">
  {#each testimonials as testimonial (testimonial.quote)}
    <figure class="border-l-[2px] border-stone-200 pl-[18px] sm:pl-[20px]">
      <blockquote
        class="font-heading text-[18px] font-book leading-[1.42] tracking-normal text-stone-700 sm:text-[20px]"
      >
        "{testimonial.quote}"
      </blockquote>

      <figcaption class="mt-[12px] text-[14px] font-book leading-none tracking-normal text-stone-400 sm:text-[15px]">
        {testimonial.name}, {testimonial.role}, <span class="text-stone-500">{testimonial.company}</span>
      </figcaption>
    </figure>
  {/each}
</div>
