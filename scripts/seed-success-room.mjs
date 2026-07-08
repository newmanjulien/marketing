import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env.local");
const command = process.argv[2];

const navacordSeedManifest = {
  slug: "navacord",
  prospectName: "Navacord",
  description:
    "Review the shared materials for evaluating Overbase and aligning on a practical proof of concept.",
  optionalResources: [
    {
      kind: "mutual-success-plan",
      slug: "mutual-success-plan",
      title: "Mutual success plan",
      actionLabel: "Create the mutual success plan",
      description:
        "Align on success criteria, next steps, and owners for a practical proof of concept.",
      sortOrder: 10,
    },
    {
      kind: "editable-text",
      slug: "initial-format",
      title: "Initial email format",
      actionLabel: "Create the initial email format",
      description: "Edit a simple starting email format for the first Overbase follow-up.",
      sortOrder: 20,
      editorRows: 14,
      initialText: `Hi [Name],

Sharing an initial format for how Overbase could support [Company].

The goal would be to identify [opportunity type], route the right context to [team or person], and agree on a simple workflow for reviewing results.

Proposed next step:
[Next step]

Best,
[Sender]`,
    },
  ],
};

const usage = `Usage:
  npm run seed:success-room -- seed-global-assets [--photo static/julien.png]
  SUCCESS_ROOM_PASSWORD=... npm run seed:success-room -- seed-room --deck <path> --audio <path> [--slug navacord]

Required environment:
  PUBLIC_CONVEX_URL
  SUCCESS_ROOM_SEED_SECRET
  SUCCESS_ROOM_PASSWORD     required for seed-room`;

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

const getOption = (name) => {
  const index = process.argv.indexOf(name);

  return index === -1 ? null : process.argv[index + 1] ?? null;
};

const requireOption = (name) => {
  const value = getOption(name);

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing required option ${name}.\n\n${usage}`);
  }

  return value;
};

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

const client = new ConvexHttpClient(convexUrl);

const uploadFile = async ({ path, contentType, uploadUrl }) => {
  const absolutePath = resolve(root, path);

  if (!existsSync(absolutePath)) {
    throw new Error(`Seed asset does not exist: ${path}`);
  }

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
    filename: path.split("/").at(-1),
    contentType,
    byteSize: stats.size,
  };
};

const seedGlobalAssets = async () => {
  const photoPath = getOption("--photo") ?? "static/julien.png";
  const uploadUrl = await client.mutation(api.successRooms.generateGlobalSeedUploadUrl, {
    seedSecret,
  });
  const file = await uploadFile({
    path: photoPath,
    contentType: "image/png",
    uploadUrl,
  });

  await client.mutation(api.successRooms.seedGlobalFile, {
    seedSecret,
    key: "julien-newman-photo",
    file,
  });

  console.log("Seeded global success room assets.");
};

const seedRoom = async () => {
  const slug = getOption("--slug") ?? navacordSeedManifest.slug;
  const deckPath = requireOption("--deck");
  const audioPath = requireOption("--audio");
  const password = process.env.SUCCESS_ROOM_PASSWORD ?? env.SUCCESS_ROOM_PASSWORD;
  const isNavacord = slug === navacordSeedManifest.slug;
  const prospectName = getOption("--prospect-name") ?? (isNavacord ? navacordSeedManifest.prospectName : null);
  const description = getOption("--description") ?? (isNavacord ? navacordSeedManifest.description : null);

  if (!password) {
    throw new Error("SUCCESS_ROOM_PASSWORD is required when seeding a room.");
  }

  if (!prospectName || !description) {
    throw new Error(
      "Non-Navacord rooms require --prospect-name and --description.\n\n" + usage,
    );
  }

  const deckUploadUrl = await client.mutation(api.successRooms.generateSeedUploadUrl, {
    slug,
    seedSecret,
  });
  const deck = await uploadFile({
    path: deckPath,
    contentType: "application/pdf",
    uploadUrl: deckUploadUrl,
  });
  const audioUploadUrl = await client.mutation(api.successRooms.generateSeedUploadUrl, {
    slug,
    seedSecret,
  });
  const audio = await uploadFile({
    path: audioPath,
    contentType: "audio/mpeg",
    uploadUrl: audioUploadUrl,
  });

  await client.mutation(api.successRooms.seedSuccessRoom, {
    seedSecret,
    slug,
    prospectName,
    description,
    password,
    deck,
    audio,
    optionalResources: isNavacord ? navacordSeedManifest.optionalResources : [],
  });

  console.log(`Seeded ${slug} success room.`);
};

if (command === "seed-global-assets") {
  await seedGlobalAssets();
} else if (command === "seed-room") {
  await seedRoom();
} else {
  throw new Error(`Unknown seed command: ${command ?? "(missing)"}\n\n${usage}`);
}
