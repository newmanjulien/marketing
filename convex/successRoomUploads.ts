import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  maxSuccessRoomUploadByteSize,
  maxSuccessRoomUploadSizeLabel,
  successRoomUploadIntentHeader,
} from "../shared/successRoomUploads";

const corsHeaders = {
  "Access-Control-Allow-Headers": `authorization, content-type, ${successRoomUploadIntentHeader}`,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400",
} as const;

const response = (body: string | null, status: number) =>
  new Response(body, {
    status,
    headers: corsHeaders,
  });

const readCapability = (request: Request) => {
  const uploadIntentId = request.headers.get(successRoomUploadIntentHeader)?.trim();
  const authorization = request.headers.get("authorization")?.trim();
  const uploadToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!uploadIntentId || !uploadToken) {
    return null;
  }

  return {
    uploadIntentId: uploadIntentId as Id<"successRoomUploadIntents">,
    uploadToken,
  };
};

export const uploadSuccessRoomFile = httpAction(async (ctx, request) => {
  const capability = readCapability(request);

  if (!capability) {
    return response("Upload capability is required", 401);
  }

  try {
    await ctx.runQuery(internal.successRooms.authorizeUploadIntent, capability);
  } catch {
    return response("Upload capability is invalid or expired", 401);
  }

  const file = await request.blob();

  if (file.size === 0) {
    return response("A non-empty file is required", 400);
  }

  if (file.size > maxSuccessRoomUploadByteSize) {
    return response(`Files must be ${maxSuccessRoomUploadSizeLabel} or smaller`, 413);
  }

  let storageId: Id<"_storage"> | undefined;

  try {
    storageId = await ctx.storage.store(file);
    const result = await ctx.runMutation(internal.successRooms.completeUploadIntent, {
      ...capability,
      storageId,
    });

    return Response.json(result, {
      headers: corsHeaders,
    });
  } catch (uploadError) {
    if (storageId) {
      try {
        await ctx.storage.delete(storageId);
      } catch (deletionError) {
        console.error("Unable to immediately delete failed Success Room upload", deletionError);
      }
    }

    console.error("Unable to complete Success Room upload", uploadError);
    return response("Upload could not be completed", 500);
  }
});

export const successRoomUploadOptions = httpAction(async () => response(null, 204));
