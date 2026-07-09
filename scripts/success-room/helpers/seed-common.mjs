// Shared seed helpers for the success-room scripts.
// Do not run this file directly; run one of the scripts in scripts/success-room/.

import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { basename, isAbsolute, resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api.js";

export const projectRoot = resolve(import.meta.dirname, "../../..");

const envPath = resolve(projectRoot, ".env.local");

const parseEnvFile = async (path) => {
  if (!existsSync(path)) {
    return {};
  }

  const env = {};
  const text = await readFile(path, "utf8");

  for (const line of text.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").split(" #")[0]?.trim();

    env[key] = value;
  }

  return env;
};

export const createSeedClient = async () => {
  const env = await parseEnvFile(envPath);
  const convexUrl = process.env.PUBLIC_CONVEX_URL ?? env.PUBLIC_CONVEX_URL;
  const seedSecret = process.env.SUCCESS_ROOM_SEED_SECRET ?? env.SUCCESS_ROOM_SEED_SECRET;

  if (!convexUrl) {
    throw new Error("PUBLIC_CONVEX_URL is not configured. Run `npx convex dev --once` first.");
  }

  if (!seedSecret) {
    throw new Error(
      "SUCCESS_ROOM_SEED_SECRET is not configured. Set it locally and in Convex env before seeding.",
    );
  }

  return {
    client: new ConvexHttpClient(convexUrl),
    seedSecret,
  };
};

export const uploadSeedFile = async ({ client, seedSecret, slug, path, contentType }) => {
  const absolutePath = isAbsolute(path) ? path : resolve(projectRoot, path);

  if (!existsSync(absolutePath)) {
    throw new Error(`Seed asset does not exist: ${path}\nResolved path: ${absolutePath}`);
  }

  const uploadUrl = await client.mutation(api.successRooms.generateSeedUploadUrl, {
    slug,
    seedSecret,
  });
  const bytes = await readFile(absolutePath);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "content-type": contentType,
    },
    body: new Blob([bytes], { type: contentType }),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload ${path}: ${response.status} ${response.statusText}`);
  }

  const { storageId } = await response.json();
  const stats = statSync(absolutePath);

  return {
    storageId,
    filename: basename(absolutePath),
    contentType,
    byteSize: stats.size,
  };
};

export const validateNewSuccessRoomSlug = async ({ client, seedSecret, slug }) => {
  const result = await client.query(api.successRooms.validateNewSuccessRoomSlug, {
    seedSecret,
    slug,
  });

  return result.slug;
};

export const enableSuccessRoomSection = async ({
  slug,
  resourceKey,
  benefitCards = [],
  planAccordions = [],
}) => {
  const { client, seedSecret } = await createSeedClient();

  const result = await client.mutation(api.successRooms.enableSuccessRoomSections, {
    seedSecret,
    slug,
    resourceKeys: [resourceKey],
    benefitCards,
    planAccordions,
  });

  console.log(`Enabled ${resourceKey} for ${slug}: ${result.enabledResourceKeys.join(", ")}.`);
};
