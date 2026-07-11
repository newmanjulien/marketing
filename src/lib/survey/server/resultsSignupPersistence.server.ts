import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { api } from '../../../../convex/_generated/api';
import { createConvexClient } from '$lib/server/convexClient.server';

const getSignupSecret = () => {
  const signupSecret = env.SURVEY_SIGNUP_SECRET;

  if (!signupSecret) {
    throw new Error('SURVEY_SIGNUP_SECRET is not configured');
  }

  return signupSecret;
};

const createClientKey = (clientAddress: string, signupSecret: string) =>
  createHmac('sha256', signupSecret).update(clientAddress).digest('hex');

export const registerSurveyResultsSignup = async (email: string, clientAddress: string) => {
  const signupSecret = getSignupSecret();

  return await createConvexClient().mutation(api.surveyResultsSignups.register, {
    email,
    clientKey: createClientKey(clientAddress, signupSecret),
    signupSecret
  });
};
