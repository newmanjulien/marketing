import { error, json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { RequestHandler } from './$types';

const invalidPlan = () => error(400, 'A complete success room plan is required');

const parseStringArray = (value: unknown) => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    invalidPlan();
  }

  return value as string[];
};

const parseStringRecord = (value: unknown) => {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    Object.entries(value).some(([key, recordValue]) => typeof key !== 'string' || typeof recordValue !== 'string')
  ) {
    invalidPlan();
  }

  return value as Record<string, string>;
};

const parseTeamMemberIdRecord = (value: unknown) =>
  parseStringRecord(value) as Record<string, Id<'successRoomTeamMembers'>>;

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();
  const plan =
    typeof body.plan === 'object' && body.plan !== null && !Array.isArray(body.plan)
      ? (body.plan as Record<string, unknown>)
      : invalidPlan();

  if (
    !('selectedBenefitIds' in plan) ||
    !('checkedTaskIds' in plan) ||
    !('dateOverrides' in plan) ||
    !('taskAssigneeMemberIds' in plan)
  ) {
    invalidPlan();
  }

  await convex.mutation(api.successRooms.replacePlan, {
    slug: params.roomSlug,
    accessToken,
    plan: {
      selectedBenefitIds: parseStringArray(plan.selectedBenefitIds),
      checkedTaskIds: parseStringArray(plan.checkedTaskIds),
      dateOverrides: parseStringRecord(plan.dateOverrides),
      taskAssigneeMemberIds: parseTeamMemberIdRecord(plan.taskAssigneeMemberIds),
    },
  });

  return json({ ok: true });
};
