<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { getNamedFormAction } from '$lib/forms/formActionUrls';
  import type { SubmitFunction } from '@sveltejs/kit';
  import {
    maxSuccessRoomDocumentRequestDescriptionLength,
    type DocumentRequestFormFailure
  } from '../domain/documentRequests';

  let { form }: { form?: DocumentRequestFormFailure } = $props();
  let isSubmitting = $state(false);
  const requestDocumentAction = $derived(
    getNamedFormAction(page.url, 'requestDocument', { 'document-request': null })
  );

  const handleSubmit: SubmitFunction = () => {
    isSubmitting = true;

    return async ({ update }) => {
      try {
        await update({ invalidateAll: false });
      } finally {
        isSubmitting = false;
      }
    };
  };
</script>

<section
  class="mt-[34px] rounded-[16px] border border-stone-200/70 bg-white px-[18px] py-[18px] shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-stone-300 focus-within:border-stone-300 focus-within:shadow-[0_6px_14px_rgba(28,25,23,0.06)] sm:px-[20px] sm:py-[20px]"
  aria-label="Request an additional document"
>
  <form
    method="POST"
    action={requestDocumentAction}
    use:enhance={handleSubmit}
    class="grid gap-[16px]"
  >
    <label
      for="success-room-document-request"
      class="text-[15px] font-normal leading-[1.2] tracking-normal text-stone-750 sm:text-[16px]"
    >
      Describe the document you need
    </label>
    <textarea
      id="success-room-document-request"
      name="description"
      value={form?.description ?? ''}
      maxlength={maxSuccessRoomDocumentRequestDescriptionLength}
      required
      rows="5"
      spellcheck="true"
      aria-describedby={form?.message ? 'success-room-document-request-feedback' : undefined}
      aria-invalid={form?.status === 'validation-error' ? 'true' : undefined}
      class="min-h-[132px] w-full resize-none rounded-[12px] border border-stone-200 bg-stone-50/70 px-[14px] py-[12px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-stone-900/10 sm:px-[16px] sm:py-[14px] sm:text-[15px]"
      placeholder="Ideally, explain what pushback you'd like to preempt so we can prepare the right doc"
    ></textarea>

    {#if form?.message}
      <p
        id="success-room-document-request-feedback"
        class="m-0 text-[13px] font-book leading-[1.45] tracking-normal text-red-700"
        aria-live="polite"
      >
        {form.message}
      </p>
    {/if}

    <button
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      class="inline-flex h-[42px] w-fit items-center justify-center gap-[8px] rounded-[7px] bg-stone-750 px-[18px] text-[13px] font-book leading-none tracking-normal text-white shadow-[0_1px_2px_rgba(28,25,23,0.12)] transition-[background-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:bg-stone-700 hover:shadow-[0_4px_10px_rgba(28,25,23,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:bg-stone-500 disabled:shadow-none disabled:hover:translate-y-0"
    >
      {#if isSubmitting}
        <span
          class="h-[14px] w-[14px] animate-spin rounded-full border-2 border-white/35 border-t-white"
          aria-hidden="true"
        ></span>
      {/if}
      {isSubmitting ? 'Sending request…' : 'Request document'}
    </button>
  </form>
</section>
