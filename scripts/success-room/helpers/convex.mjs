// Runs internal Convex functions through `npx convex run`, so the scripts
// authenticate with the Convex CLI's deploy credentials instead of a shared
// secret. Do not run this file directly; run one of the scripts in
// scripts/success-room/.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { basename, isAbsolute, resolve } from "node:path";

const exec = promisify(execFile);

export const projectRoot = resolve(import.meta.dirname, "../../..");

// Selects which Convex deployment ALL success-room scripts hit — including the
// destructive nuke. The default is the dev deployment from the project's
// Convex config; run with `SCRIPT_TARGET=prod npm run ...` to hit production.
// WARNING: SCRIPT_TARGET=prod makes `node scripts/success-room/nuke.mjs` wipe production.
const targetFlags = process.env.SCRIPT_TARGET === "prod" ? ["--prod"] : [];

export const runConvex = async (functionName, args = {}) => {
  const { stdout } = await exec(
    "npx",
    ["convex", "run", functionName, JSON.stringify(args), ...targetFlags],
    { cwd: projectRoot, maxBuffer: 16 * 1024 * 1024 },
  );
  const output = stdout.trim();

  if (!output) {
    return null;
  }

  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`convex run ${functionName} returned unexpected output:\n${output}`);
  }
};

export const uploadSeedFile = async ({ path, contentType }) => {
  const absolutePath = isAbsolute(path) ? path : resolve(projectRoot, path);
  const uploadUrl = await runConvex("admin:generateUploadUrl");
  const bytes = await readFile(absolutePath);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "content-type": contentType },
    body: bytes,
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
