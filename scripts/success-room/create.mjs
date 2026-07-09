// Run from the project root:
//   npm run create:success-room
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This creates the hard-coded room below, reads create-benefits.csv,
// and uploads its configured deck/audio files.

import { api } from "../../convex/_generated/api.js";
import {
  assertUniqueKey,
  parseSortOrder,
  readCsvRecords,
  requireValue,
} from "./helpers/csv.mjs";
import {
  createSeedClient,
  uploadSeedFile,
  validateNewSuccessRoomSlug,
} from "./helpers/seed-common.mjs";

const benefitsCsvFilename = "create-benefits.csv";
const benefitHeaders = ["key", "title", "description", "sortOrder"];

const readBenefitCards = async () => {
  const records = await readCsvRecords({
    baseDir: import.meta.dirname,
    filename: benefitsCsvFilename,
    expectedHeaders: benefitHeaders,
  });
  const benefitKeys = new Map();
  const benefitCards = records
    .map((record, index) => {
      const rowNumber = index + 2;
      const key = requireValue(record, "key", benefitsCsvFilename, rowNumber);

      assertUniqueKey(
        benefitKeys,
        key,
        benefitsCsvFilename,
        rowNumber,
        "benefit key",
      );

      return {
        key,
        title: requireValue(record, "title", benefitsCsvFilename, rowNumber),
        description: requireValue(
          record,
          "description",
          benefitsCsvFilename,
          rowNumber,
        ),
        sortOrder: parseSortOrder(
          record,
          "sortOrder",
          benefitsCsvFilename,
          rowNumber,
        ),
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (benefitCards.length === 0) {
    throw new Error(`${benefitsCsvFilename} must include at least one benefit.`);
  }

  return benefitCards;
};

// Add a new base room here. This script creates deck, audio, and benefits.
// It never adds extra sections and never overwrites an existing room.
// To add extra sections, run the matching script in scripts/success-room/add-sections/.
// If this slug already exists, Convex throws and no room rows are replaced.
const room = {
  slug: "overbase",
  title: "Overbase",
  password: "newman",

  // Absolute paths outside the project are allowed. Relative paths resolve from the project root.
  deckPath:
    "/Users/juliennewman/Documents/marketing/Overbase with Joseph's questions - deck.pdf",
  audioPath:
    "/Users/juliennewman/Documents/marketing/Navacord and Overbase.mp3",
};

const { client, seedSecret } = await createSeedClient();
const benefitCards = await readBenefitCards();
const slug = await validateNewSuccessRoomSlug({
  client,
  seedSecret,
  slug: room.slug,
});

const deck = await uploadSeedFile({
  client,
  seedSecret,
  slug,
  path: room.deckPath,
  contentType: "application/pdf",
});
const audio = await uploadSeedFile({
  client,
  seedSecret,
  slug,
  path: room.audioPath,
  contentType: "audio/mpeg",
});

await client.mutation(api.successRooms.createSuccessRoom, {
  seedSecret,
  slug,
  prospectName: room.title,
  password: room.password,
  deck,
  audio,
  benefitCards,
});

console.log(`Created ${slug} success room with deck, audio, and benefits.`);
