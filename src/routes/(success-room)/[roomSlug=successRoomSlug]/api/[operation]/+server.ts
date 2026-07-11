import { error, json } from '@sveltejs/kit';
import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { api } from '../../../../../../convex/_generated/api';
import { createConvexClient, convexSiteUrl } from '$lib/server/convexClient.server';
import { requireSuccessRoomAccessToken } from '$lib/success-room/server/access.server';
import type {
  SuccessRoomDeleteApiBodyByOperation,
  SuccessRoomPostApiBodyByOperation
} from '$lib/success-room/domain/api';
import type { RequestHandler } from './$types';

type RequestBody = Record<string, unknown>;
type Method = 'POST' | 'DELETE';
type SuccessRoomMutation = FunctionReference<'mutation', 'public', Record<string, unknown>, unknown>;
type RuntimeOperationContext = {
  slug: string;
  accessToken: string;
  body: RequestBody;
};
type OperationBodyByMethod = {
  POST: SuccessRoomPostApiBodyByOperation;
  DELETE: SuccessRoomDeleteApiBodyByOperation;
};
type OperationName<OperationMethod extends Method> = keyof OperationBodyByMethod[OperationMethod] &
  string;

type Operation = {
  mutation: SuccessRoomMutation;
  args: (context: RuntimeOperationContext) => Record<string, unknown>;
  response?: (output: unknown) => unknown;
};

// Convex remains the runtime validator; this only keeps bridge envelopes aligned with generated args.
const bridgeOperation = <
  OperationMethod extends Method,
  Name extends OperationName<OperationMethod>,
  Mutation extends FunctionReference<'mutation', 'public'>
>(
  _method: OperationMethod,
  _name: Name,
  config: {
    mutation: Mutation;
    args: (context: {
      slug: string;
      accessToken: string;
      body: OperationBodyByMethod[OperationMethod][Name];
    }) => FunctionArgs<Mutation>;
    response?: (output: Awaited<FunctionReturnType<Mutation>>) => unknown;
  }
): Operation => ({
  mutation: config.mutation,
  args: ({ slug, accessToken, body }) =>
    config.args({
      slug,
      accessToken,
      body: body as OperationBodyByMethod[OperationMethod][Name]
    }),
  response: config.response
    ? (output) => config.response?.(output as Awaited<FunctionReturnType<Mutation>>)
    : undefined
});

const operations: Record<string, Partial<Record<Method, Operation>>> = {
  benefits: {
    POST: bridgeOperation('POST', 'benefits', {
      mutation: api.successRooms.patchBenefits,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body })
    })
  },
  plan: {
    POST: bridgeOperation('POST', 'plan', {
      mutation: api.successRooms.applyPlanAction,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body })
    })
  },
  'editable-text': {
    POST: bridgeOperation('POST', 'editable-text', {
      mutation: api.successRooms.patchEditableText,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body })
    })
  },
  'editable-attachment': {
    DELETE: bridgeOperation('DELETE', 'editable-attachment', {
      mutation: api.successRooms.removeEditableAttachment,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body })
    })
  },
  'kickoff-schedule': {
    POST: bridgeOperation('POST', 'kickoff-schedule', {
      mutation: api.successRooms.replaceKickoffSchedule,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body })
    })
  },
  'upload-intent': {
    POST: bridgeOperation('POST', 'upload-intent', {
      mutation: api.successRooms.createUploadIntent,
      args: ({ slug, accessToken, body }) => ({ slug, accessToken, ...body }),
      response: (uploadIntent) => ({
        ...uploadIntent,
        uploadUrl: new URL('/success-room/upload', convexSiteUrl).toString()
      })
    })
  }
};

const isRequestBody = (value: unknown): value is RequestBody =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readRequestBody = async (request: Request) => {
  const body = await request.json();

  if (!isRequestBody(body)) {
    error(400, 'Request body must be a JSON object');
  }

  return body;
};

const handleOperation = async (
  method: Method,
  { cookies, params, request }: Parameters<RequestHandler>[0]
) => {
  const operation = operations[params.operation]?.[method];

  if (!operation) {
    error(404, 'Success room API operation not found');
  }

  const accessToken = requireSuccessRoomAccessToken(cookies, params.roomSlug);
  const body = await readRequestBody(request);
  const output = await createConvexClient().mutation(
    operation.mutation,
    operation.args({
      slug: params.roomSlug,
      accessToken,
      body
    })
  );

  return json(operation.response ? operation.response(output) : { ok: true });
};

export const POST: RequestHandler = (event) => handleOperation('POST', event);
export const DELETE: RequestHandler = (event) => handleOperation('DELETE', event);
