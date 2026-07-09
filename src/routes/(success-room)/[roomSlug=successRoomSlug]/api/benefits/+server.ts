import { error, json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

const invalidBenefits = () => error(400, 'Benefits update is required');

const parseStringArray = (value: unknown) => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    invalidBenefits();
  }

  return value as string[];
};

const parseBenefitsBody = (body: unknown) => {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    invalidBenefits();
  }

  return body as Record<string, unknown>;
};

const parseBenefitsUpdate = (value: unknown) => {
  const benefits = parseBenefitsBody(value);
  const update: {
    selectedCardIds?: string[];
    painPoints?: string[];
  } = {};

  if ('selectedCardIds' in benefits) {
    update.selectedCardIds = parseStringArray(benefits.selectedCardIds);
  }

  if ('painPoints' in benefits) {
    update.painPoints = parseStringArray(benefits.painPoints);
  }

  if (!('selectedCardIds' in update) && !('painPoints' in update)) {
    invalidBenefits();
  }

  return update;
};

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = parseBenefitsBody(await request.json());

  await convex.mutation(api.successRooms.patchBenefits, {
    slug: params.roomSlug,
    accessToken,
    benefits: parseBenefitsUpdate(body.benefits),
  });

  return json({ ok: true });
};
