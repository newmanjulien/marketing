import { env } from '$env/dynamic/private';
import { createPrivateEmailSender } from '$lib/email/server/privateEmail.server';
import { fail } from '@sveltejs/kit';
import { registerSurveyResultsSignup } from './resultsSignupPersistence.server';

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

export const submitSurveyResultsSignup = async (formData: FormData, clientAddress: string) => {
  const email = getEmail(formData.get('email'));

  if (!emailPattern.test(email)) {
    return fail(400, {
      email,
      message: 'Enter a valid email address.'
    } satisfies SurveyResultsFailure);
  }

  let signup: Awaited<ReturnType<typeof registerSurveyResultsSignup>>;

  try {
    signup = await registerSurveyResultsSignup(email, clientAddress);
  } catch (persistenceError) {
    console.error('Unable to persist survey results signup', persistenceError);

    return fail(503, {
      email,
      message: 'Your signup could not be saved. Try again in a few minutes.'
    } satisfies SurveyResultsFailure);
  }

  if (signup.status === 'rate-limited') {
    return fail(429, {
      email,
      message: 'Too many signup attempts. Try again later.'
    } satisfies SurveyResultsFailure);
  }

  if (signup.created) {
    try {
      const emailSender = createPrivateEmailSender();

      if (!emailSender) {
        throw new Error('Survey confirmation email is not configured');
      }

      const bcc = env.SURVEY_CONFIRMATION_BCC?.trim();
      const delivery = await emailSender.send({
        to: email,
        ...(bcc ? { bcc } : {}),
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

      if (delivery.rejected.length > 0) {
        throw new Error(`SMTP rejected ${delivery.rejected.length} intended recipient(s)`);
      }
    } catch (confirmationError) {
      console.error('Unable to send survey results confirmation', confirmationError);
    }
  }

  return {
    success: true,
    message: "You're on the list. We'll send the results when they're published"
  };
};
