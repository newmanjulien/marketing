<script lang="ts">
  import { CheckIcon } from 'phosphor-svelte';
</script>

<section
  class="mt-[34px] rounded-[16px] border border-stone-200/70 bg-white px-[22px] py-[36px] text-center shadow-[0_1px_4px_rgba(28,25,23,0.06)] sm:px-[40px] sm:py-[44px]"
  role="status"
  aria-labelledby="document-request-confirmation-title"
>
  <span
    class="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700"
    aria-hidden="true"
  >
    <CheckIcon size={21} weight="bold" />
  </span>

  <h2
    id="document-request-confirmation-title"
    class="mt-[20px] text-[18px] font-normal leading-[1.2] tracking-normal text-stone-750 sm:text-[20px]"
  >
    Your request is with us
  </h2>

  <p
    class="mx-auto mt-[12px] max-w-[30rem] text-[14px] font-book leading-[1.55] tracking-normal text-stone-600 sm:text-[15px]"
  >
    We’ll review the details and reach out if anything needs clarification. Once the document is
    ready, we’ll add it to this success room.
  </p>
</section>
