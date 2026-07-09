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
  benefitCards: [
    {
      key: "faster-onboarding",
      title: "Faster onboarding",
      description: "Dummy benefit copy that explains the expected business value in a short paragraph.",
      sortOrder: 0,
    },
    {
      key: "cleaner-handoffs",
      title: "Cleaner handoffs",
      description: "Dummy benefit copy that keeps the card balanced while matching the surrounding plan.",
      sortOrder: 1,
    },
    {
      key: "less-manual-work",
      title: "Less manual work",
      description: "Dummy benefit copy for a workflow improvement that will be replaced with real content.",
      sortOrder: 2,
    },
    {
      key: "earlier-risk-signals",
      title: "Earlier risk signals",
      description: "Dummy benefit copy describing a useful customer insight surfaced at the right moment.",
      sortOrder: 3,
    },
    {
      key: "better-follow-up",
      title: "Better follow-up",
      description: "Dummy benefit copy that describes a more consistent rhythm across the account team.",
      sortOrder: 4,
    },
    {
      key: "clearer-reporting",
      title: "Clearer reporting",
      description: "Dummy benefit copy for shared visibility into progress, next steps, and outcomes.",
      sortOrder: 5,
    },
  ],
  planAccordions: [
    {
      key: "setup-proof-of-concept",
      title: "Set up proof of concept",
      description: "Confirm goals, data access, stakeholders, and success criteria.",
      variant: "default",
      sortOrder: 0,
      tasks: [
        {
          key: "confirm-sponsor",
          title: "Confirm the proof of concept sponsor and day-to-day owner.",
          dateLabel: "Jul 12",
        },
        {
          key: "document-workflow",
          title: "Document the target workflow and sample output expectations.",
          dateLabel: "Jul 15",
        },
        {
          key: "share-access-requirements",
          title: "Share access requirements for source systems and stakeholder calendars.",
          dateLabel: "Jul 18",
        },
      ],
    },
    {
      key: "start-proof-of-concept",
      title: "Start 6-week proof of concept",
      description: "Launch the workflow, review early outputs, and tune the process.",
      variant: "default",
      sortOrder: 1,
      tasks: [
        {
          key: "kickoff-review",
          title: "Kick off the first workflow review with the core project team.",
          dateLabel: "Jul 22",
        },
        {
          key: "review-initial-records",
          title: "Review initial records for completeness, accuracy, and formatting.",
          dateLabel: "Jul 29",
        },
        {
          key: "agree-feedback-cadence",
          title: "Agree on the weekly feedback cadence and decision log.",
          dateLabel: "Aug 2",
        },
      ],
    },
    {
      key: "evaluate-proof-of-concept",
      title: "Proof of concept evaluation",
      description: "Assess results, document learnings, and decide whether to move forward.",
      variant: "muted",
      sortOrder: 2,
      tasks: [
        {
          key: "compare-outcomes",
          title: "Compare proof of concept outcomes against agreed success criteria.",
          dateLabel: "Aug 26",
        },
        {
          key: "summarize-learnings",
          title: "Summarize operational learnings, risks, and recommended next steps.",
          dateLabel: "Aug 29",
        },
        {
          key: "confirm-go-forward",
          title: "Confirm the go-forward decision and implementation owners.",
          dateLabel: "Sep 3",
        },
      ],
    },
  ],
};

const usage = `Usage:
  SUCCESS_ROOM_PASSWORD=... npm run seed:success-room -- seed-room --deck <path> --audio <path> [--slug navacord]
  npm run seed:success-room -- enable-sections [--slug navacord] [--mutual-success-plan] [--initial-format]

Behavior:
  seed-room replaces any existing success room with the same slug.
  enable-sections preserves the room and enables the requested optional sections.

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

const hasOption = (name) => process.argv.includes(name);

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

const getSeedManifest = (slug) => (slug === navacordSeedManifest.slug ? navacordSeedManifest : null);

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

const seedRoom = async () => {
  const slug = getOption("--slug") ?? navacordSeedManifest.slug;
  const deckPath = requireOption("--deck");
  const audioPath = requireOption("--audio");
  const password = process.env.SUCCESS_ROOM_PASSWORD ?? env.SUCCESS_ROOM_PASSWORD;
  const manifest = getSeedManifest(slug);
  const prospectName = getOption("--prospect-name") ?? manifest?.prospectName ?? null;

  if (!password) {
    throw new Error("SUCCESS_ROOM_PASSWORD is required when seeding a room.");
  }

  if (!prospectName) {
    throw new Error(
      "Non-Navacord rooms require --prospect-name.\n\n" + usage,
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
    password,
    deck,
    audio,
  });

  console.log(`Seeded ${slug} success room with deck/audio only, replacing any existing room with that slug.`);
};

const enableSections = async () => {
  const slug = getOption("--slug") ?? navacordSeedManifest.slug;
  const enableMutualSuccessPlan = hasOption("--mutual-success-plan");
  const enableInitialFormat = hasOption("--initial-format");

  if (!enableMutualSuccessPlan && !enableInitialFormat) {
    throw new Error("Choose at least one section: --mutual-success-plan or --initial-format.\n\n" + usage);
  }

  const manifest = getSeedManifest(slug);

  if (enableMutualSuccessPlan && !manifest) {
    throw new Error(
      `No mutual success plan seed manifest is available for "${slug}". Add one before enabling that section.`,
    );
  }

  const resourceKeys = [
    ...(enableMutualSuccessPlan ? ["mutual-success-plan"] : []),
    ...(enableInitialFormat ? ["initial-format"] : []),
  ];

  const result = await client.mutation(api.successRooms.enableSuccessRoomSections, {
    seedSecret,
    slug,
    resourceKeys,
    benefitCards: enableMutualSuccessPlan ? manifest.benefitCards : [],
    planAccordions: enableMutualSuccessPlan ? manifest.planAccordions : [],
  });

  console.log(`Enabled sections for ${slug}: ${result.enabledResourceKeys.join(", ")}.`);
};

if (command === "seed-room") {
  await seedRoom();
} else if (command === "enable-sections") {
  await enableSections();
} else {
  throw new Error(`Unknown seed command: ${command ?? "(missing)"}\n\n${usage}`);
}
