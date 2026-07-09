import { error, json } from '@sveltejs/kit';
import { api } from '../../../../../../convex/_generated/api';
import { kickoffScheduleResourceKey } from '../../../../../../shared/successRoomResources';
import { convex } from '$lib/success-room/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type { RequestHandler } from './$types';

const invalidSchedule = (): never => error(400, 'Kickoff schedule payload is invalid');

const parseRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    invalidSchedule();
  }

  return value as Record<string, unknown>;
};

const parseString = (value: unknown): string => {
  if (typeof value !== 'string') {
    invalidSchedule();
  }

  return value as string;
};

const parseCells = (value: unknown): Record<string, string> => {
  if (value === undefined) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(parseRecord(value)).map(([key, cellValue]) => [key, parseString(cellValue)])
  );
};

const parseSchedule = (value: unknown) => {
  const schedule = parseRecord(value);

  if (!Array.isArray(schedule.rows)) {
    invalidSchedule();
  }

  const rows = schedule.rows as unknown[];

  return {
    rows: rows.map((row, index) => {
      const rowRecord = parseRecord(row);
      return {
        key: parseString(rowRecord.key),
        sortOrder: index,
        cells: parseCells(rowRecord.cells)
      };
    })
  };
};

export const POST: RequestHandler = async ({ cookies, params, request }) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = parseRecord(await request.json());

  if (body.resourceSlug !== kickoffScheduleResourceKey) {
    invalidSchedule();
  }

  await convex.mutation(api.successRooms.replaceKickoffSchedule, {
    slug: params.roomSlug,
    accessToken,
    resourceSlug: kickoffScheduleResourceKey,
    schedule: parseSchedule(body.schedule)
  });

  return json({ ok: true });
};
