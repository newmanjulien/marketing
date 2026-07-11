import { env } from '$env/dynamic/private';
import { createPrivateEmailSender } from '$lib/email/server/privateEmail.server';
import { fail } from '@sveltejs/kit';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SurveyResultsFailure = {
  email?: string;
  message: string;
};

const getEmail = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

export const submitSurveyResultsSignup = async (formData: FormData) => {
  const email = getEmail(formData.get('email'));

  if (!emailPattern.test(email)) {
    return fail(400, {
      email,
      message: 'Enter a valid email address.'
    } satisfies SurveyResultsFailure);
  }

  const emailSender = createPrivateEmailSender();
  const bcc = env.SURVEY_CONFIRMATION_BCC?.trim();

  if (!emailSender || !bcc) {
    return fail(500, {
      email,
      message: 'Email confirmation is not configured yet.'
    } satisfies SurveyResultsFailure);
  }

  try {
    await emailSender.send({
      to: email,
      bcc,
      subject: 'Survey results confirmation',
      text: [
        'Thank you for your interest in our CMO survey.',
        '',
        "I'll send you the results when they're published in January.",
        '',
        'julien'
      ].join('\n'),
      html: [
        '<p>Thanks for your interest in the Overbase survey.</p>',
        "<p>I'll send you the results when they're published in January.</p>",
        '<p>julien</p>'
      ].join('')
    });
  } catch {
    return fail(502, {
      email,
      message: 'Email confirmation could not be sent. Try again in a few minutes'
    } satisfies SurveyResultsFailure);
  }

  return {
    email,
    success: true,
    message: "You're on the list. We'll send the results when they're published"
  };
};
