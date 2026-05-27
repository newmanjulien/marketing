<script lang="ts">
  type Testimonial = {
    quote: string;
    name: string;
    role: string;
    company: string;
  };

  const testimonials: Testimonial[] = [
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
  ];
</script>

<section class="px-[18px] md:px-8">
  <div class="mx-auto w-full max-w-[740px]">
    <h2 class="font-heading text-[24px] font-medium leading-[1.18] tracking-normal text-stone-800 md:text-[26px]">
      See why teams stick with Overbase
    </h2>

    <p class="mt-[18px] max-w-[700px] text-[15px] font-normal leading-[1.55] tracking-normal text-stone-500 md:text-[16px] md:leading-[1.55]">
      We spend most of our time building things for the companies who already use Overbase and for their partners. Here are some nice things they've said
    </p>

    <div class="mt-[42px] flex flex-col gap-[34px] md:gap-[40px]">
      {#each testimonials as testimonial}
        <figure class="border-l-[2px] border-stone-200/70 pl-[18px] md:pl-[20px]">
          <blockquote
            class="font-heading text-[18px] font-normal italic leading-[1.42] tracking-normal text-stone-700 md:text-[20px]"
          >
            "{testimonial.quote}"
          </blockquote>

          <figcaption class="mt-[14px] text-[14px] font-normal leading-none tracking-normal text-stone-400 md:text-[15px]">
            {testimonial.name}, {testimonial.role}, <span class="font-normal text-stone-500">{testimonial.company}</span>
          </figcaption>
        </figure>
      {/each}
    </div>
  </div>
</section>
