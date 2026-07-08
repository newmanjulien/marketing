import { json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { convex } from '$lib/server/successRoomConvex';
import { requireSuccessRoomAccessToken } from '$lib/server/successRoomAccess';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await request.json();
  const plan: Record<string, unknown> =
    typeof body.plan === 'object' && body.plan !== null ? body.plan : {};
  const checkedTaskIds = Array.isArray(plan.checkedTaskIds)
    ? plan.checkedTaskIds.filter((taskId): taskId is string => typeof taskId === 'string')
    : undefined;
  const dateOverrides =
    typeof plan.dateOverrides === 'object' && plan.dateOverrides !== null
      ? Object.fromEntries(
          Object.entries(plan.dateOverrides).filter(
            (entry): entry is [string, string] => typeof entry[1] === 'string',
          ),
        )
      : undefined;

  await convex.mutation(api.successRooms.patchPlan, {
    slug: params.roomSlug,
    accessToken,
    plan: {
      ...(checkedTaskIds ? { checkedTaskIds } : {}),
      ...(dateOverrides ? { dateOverrides } : {}),
    },
  });

  return json({ ok: true });
};
