import { submitSurveyResultsSignup } from '$lib/survey/server/resultsSignup.server';
import type { Actions } from './$types';

export const actions = {
  surveyResults: async ({ request }) =>
    await submitSurveyResultsSignup(await request.formData())
} satisfies Actions;
