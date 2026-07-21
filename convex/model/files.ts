import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { maxSuccessRoomUploadByteSize, maxSuccessRoomUploadSizeLabel } from "../../shared/successRoomUploads";
import type { SuccessRoom, TeamMember } from "./rooms";
import { createKey } from "./rooms";

export type SuccessRoomFile = Doc<"successRoomFiles">;
export type FileKind = SuccessRoomFile["kind"];

export const fileByRoomKind = (
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"successRooms">,
  kind: FileKind,
) =>
  ctx.db
    .query("successRoomFiles")
    .withIndex("by_room_kind", (q) => q.eq("roomId", roomId).eq("kind", kind))
    .first();

export const deleteFile = async (ctx: MutationCtx, fileId: Id<"successRoomFiles">) => {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return;
  }

  await ctx.storage.delete(file.storageId);
  await ctx.db.delete(file._id);
};

export const linkedFileSummary = async (ctx: QueryCtx | MutationCtx, file: SuccessRoomFile) => {
  const url = await ctx.storage.getUrl(file.storageId);

  if (!url) {
    throw new ConvexError("Success room file is unavailable");
  }

  return {
    filename: file.filename,
    contentType: file.contentType,
    byteSize: file.byteSize,
    href: url,
  };
};

export const teamMemberSummary = async (
  ctx: QueryCtx | MutationCtx,
  member: TeamMember,
) => {
  const photo = member.photoFileId ? await ctx.db.get(member.photoFileId) : null;

  return {
    key: member.key,
    name: member.name,
    role: member.role,
    imageHref: photo ? await ctx.storage.getUrl(photo.storageId) : null,
  };
};

export const teamSummaries = (ctx: QueryCtx | MutationCtx, room: SuccessRoom) =>
  Promise.all(room.teamMembers.map((member) => teamMemberSummary(ctx, member)));

// Accepts a freshly uploaded blob into the room, or throws when it fails
// validation. Uploads are claimed exactly once. Rejected blobs stay in storage
// for the orphaned-storage cron: mutations are atomic, so deleting here before
// throwing would just be rolled back.
export const acceptUploadedBlob = async (
  ctx: MutationCtx,
  roomId: Id<"successRooms">,
  {
    storageId,
    filename,
    kind,
    requiredContentTypePrefix,
  }: {
    storageId: Id<"_storage">;
    filename: string;
    kind: FileKind;
    requiredContentTypePrefix?: string;
  },
) => {
  const storedBlob = await ctx.db.system.get("_storage", storageId);

  if (!storedBlob) {
    throw new ConvexError("Uploaded file is unavailable");
  }

  const alreadyClaimed = await ctx.db
    .query("successRoomFiles")
    .withIndex("by_storage_id", (q) => q.eq("storageId", storageId))
    .first();

  if (alreadyClaimed) {
    throw new ConvexError("Uploaded file was already claimed");
  }

  const trimmedFilename = filename.trim();

  if (!trimmedFilename) {
    throw new ConvexError("Uploaded filename is required");
  }

  if (storedBlob.size === 0) {
    throw new ConvexError("A non-empty file is required");
  }

  if (storedBlob.size > maxSuccessRoomUploadByteSize) {
    throw new ConvexError(`Files must be ${maxSuccessRoomUploadSizeLabel} or smaller`);
  }

  const contentType = storedBlob.contentType ?? "application/octet-stream";

  if (requiredContentTypePrefix && !contentType.startsWith(requiredContentTypePrefix)) {
    throw new ConvexError("Uploaded file has an unsupported type");
  }

  const fileId = await ctx.db.insert("successRoomFiles", {
    roomId,
    kind,
    storageId,
    filename: trimmedFilename,
    contentType,
    byteSize: storedBlob.size,
  });

  // Reading back a row inserted in the same transaction cannot miss.
  return (await ctx.db.get(fileId))!;
};

export const addTeamMember = async (
  ctx: MutationCtx,
  room: SuccessRoom,
  { name, role, photoFileId }: { name: string; role: string; photoFileId: Id<"successRoomFiles"> },
) => {
  const member: TeamMember = {
    key: createKey("team-member"),
    name,
    role,
    photoFileId,
  };

  await ctx.db.patch(room._id, {
    teamMembers: [...room.teamMembers, member],
  });

  return member;
};
