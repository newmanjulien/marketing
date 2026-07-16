// Convex connection and file-upload helpers for the success-room scripts.
// Do not run this file directly; run one of the scripts in scripts/success-room/.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, isAbsolute, resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api.js";

export const projectRoot = resolve(import.meta.dirname, "../../..");

const envPath = resolve(projectRoot, ".env.local");

// Selects which Convex deployment ALL success-room scripts hit — including the
// destructive nuke. Flip this to "prod" to point the scripts at production, or
// override per-run with `SCRIPT_TARGET=prod npm run ...` without editing this file.
// "dev" uses whatever PUBLIC_CONVEX_URL is in .env.local / the shell.
// WARNING: SCRIPT_TARGET=prod makes `node scripts/success-room/nuke.mjs` wipe production.
const SCRIPT_TARGET = process.env.SCRIPT_TARGET ?? "dev";

const TARGET_URLS = {
  prod: "https://fearless-lemur-211.convex.cloud",
};

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

export const connectToTarget = async () => {
  const env = await parseEnvFile(envPath);
  const convexUrl =
    TARGET_URLS[SCRIPT_TARGET] ??
    process.env.PUBLIC_CONVEX_URL ??
    env.PUBLIC_CONVEX_URL;
  const seedSecret =
    process.env.SUCCESS_ROOM_SEED_SECRET ?? env.SUCCESS_ROOM_SEED_SECRET;

  console.log(
    `Target deployment: ${SCRIPT_TARGET.toUpperCase()} (${convexUrl ?? "no URL"})`,
  );

  if (!convexUrl) {
    throw new Error(
      "PUBLIC_CONVEX_URL is not configured. Run `npx convex dev --once` first.",
    );
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

export const uploadSeedFile = async ({
  client,
  seedSecret,
  slug,
  path,
  contentType,
}) => {
  const absolutePath = isAbsolute(path) ? path : resolve(projectRoot, path);

  if (!existsSync(absolutePath)) {
    throw new Error(
      `Seed asset does not exist: ${path}\nResolved path: ${absolutePath}`,
    );
  }

  const uploadUrl = await client.mutation(
    api.successRooms.generateSeedUploadUrl,
    {
      slug,
      seedSecret,
    },
  );
  const bytes = await readFile(absolutePath);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "content-type": contentType,
    },
    body: new Blob([bytes], { type: contentType }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload ${path}: ${response.status} ${response.statusText}`,
    );
  }

  const { storageId } = await response.json();
  return {
    storageId,
    filename: basename(absolutePath),
    contentType,
    byteSize: bytes.byteLength,
  };
};
