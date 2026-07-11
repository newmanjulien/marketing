import { submitSurveyResultsSignup } from '$lib/survey/server/resultsSignup.server';
import type { Actions } from './$types';

export const actions = {
  surveyResults: async ({ request, getClientAddress }) =>
    await submitSurveyResultsSignup(await request.formData(), getClientAddress())
} satisfies Actions;
