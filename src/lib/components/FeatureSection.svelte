<script lang="ts">
  export let title: string;
  export let body: string;

  const headingClasses =
    'font-heading text-[24px] font-medium leading-[1.18] tracking-normal text-stone-800 md:text-[26px]';
  const bodyClasses =
    'mt-[18px] max-w-[700px] text-[15px] font-normal leading-[1.55] tracking-normal text-stone-500 md:mt-[18px] md:text-[16px] md:leading-[1.55]';
</script>

<section class="px-[18px] md:px-8">
  <div class="mx-auto w-full max-w-[740px]">
    <h2 class={headingClasses}>{title}</h2>

    <p class={bodyClasses}>{body}</p>

    <div class="mt-[42px]">
      <slot />
    </div>
  </div>
</section>
