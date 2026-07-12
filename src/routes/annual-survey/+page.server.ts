import { submitSurveyResultsSignup } from '$lib/survey/server/resultsSignup.server';
import { getFormActionRedirectPath } from '$lib/forms/formActionUrls';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => ({
  resultsSignupSubmitted: url.searchParams.get('results-signup') === 'submitted'
});

export const actions = {
  surveyResults: async ({ request, getClientAddress, url }) => {
    const result = await submitSurveyResultsSignup(
      await request.formData(),
      getClientAddress()
    );

    if (result) {
      return result;
    }

    redirect(303, getFormActionRedirectPath(url, { 'results-signup': 'submitted' }));
  }
} satisfies Actions;
