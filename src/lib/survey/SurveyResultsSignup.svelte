<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';

  export type SurveyResultsSignupForm =
    | {
        email?: string;
        message: string;
      }
    | {
        email: string;
        success: true;
        message: string;
      };

  let { form }: { form?: SurveyResultsSignupForm } = $props();
  // svelte-ignore state_referenced_locally
  let email = $state(form?.email ?? '');
  let isSubmitting = $state(false);

  const handleSurveySubmit: SubmitFunction = () => {
    isSubmitting = true;

    return async ({ result, update }) => {
      try {
        await update();
        if (result.type === 'success') {
          email = '';
        }
      } finally {
        isSubmitting = false;
      }
    };
  };
</script>

<form
  method="POST"
  action="?/surveyResults"
  use:enhance={handleSurveySubmit}
  class="mt-[33px] rounded-[8px] border border-stone-200 bg-stone-50 p-[18px] sm:p-[20px]"
>
  <div class="grid gap-[14px] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
    <div class="min-w-0 sm:col-span-2">
      <label
        for="survey-results-email"
        class="block text-[14px] font-medium leading-none tracking-normal text-stone-900"
      >
        Receive the survey results
      </label>
      <p class="mt-[8px] text-[14px] font-book leading-[1.45] tracking-normal text-stone-600">
        We'll send you the results when they're published in January
      </p>
    </div>
    <div class="min-w-0">
      <input
        id="survey-results-email"
        type="email"
        name="email"
        autocomplete="email"
        placeholder="you@company.com"
        bind:value={email}
        aria-describedby={form?.message ? 'survey-results-message' : undefined}
        aria-invalid={form?.message && !('success' in form) ? 'true' : undefined}
        class="h-[40px] w-full rounded-[7px] border border-stone-300 bg-white px-[14px] text-[13px] font-book tracking-normal text-stone-900 placeholder:text-stone-400 focus:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-200"
      />
      {#if form?.message}
        <p
          id="survey-results-message"
          class={`mt-[10px] text-[13px] font-book leading-[1.45] tracking-normal ${
            'success' in form ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {form.message}
        </p>
      {/if}
    </div>
    <button
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      class="inline-flex h-[40px] shrink-0 items-center justify-center gap-[8px] justify-self-start rounded-[7px] bg-stone-750 px-[18px] text-[13px] font-book leading-none tracking-normal text-white transition-colors hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:bg-stone-500"
    >
      {#if isSubmitting}
        <span
          class="h-[14px] w-[14px] animate-spin rounded-full border-2 border-white/35 border-t-white"
          aria-hidden="true"
        ></span>
      {/if}
      {isSubmitting ? 'Adding you...' : 'Send me the results'}
    </button>
  </div>
</form>
