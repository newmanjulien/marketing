<script lang="ts">
  import { testimonials } from './testimonialsContent';
</script>

<div class="flex flex-col gap-[34px] sm:gap-[40px]">
  {#each testimonials as testimonial (testimonial.quote)}
    <figure class="border-l-[2px] border-stone-200/70 pl-[18px] sm:pl-[20px]">
      <blockquote
        class="font-heading text-[19px] font-book italic leading-[1.42] tracking-normal text-stone-700 sm:text-[21px]"
      >
        "{testimonial.quote}"
      </blockquote>

      <figcaption class="mt-[14px] text-[15px] font-book leading-none tracking-normal text-stone-400 sm:text-[16px]">
        {testimonial.name}, {testimonial.role}, <span class="text-stone-500">{testimonial.company}</span>
      </figcaption>
    </figure>
  {/each}
</div>
