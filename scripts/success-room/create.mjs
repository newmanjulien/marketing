// Run from the project root:
//   npm run create:success-room
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This creates the hard-coded room below and uploads its configured deck/audio files.

import { api } from "../../convex/_generated/api.js";
import {
  createSeedClient,
  uploadSeedFile,
  validateNewSuccessRoomSlug,
} from "./helpers/seed-common.mjs";

// Add a new base room here. This script only creates deck, audio, and questions.
// It never adds extra sections and never overwrites an existing room.
// To add extra sections, run the matching script in scripts/success-room/add-sections/.
// If this slug already exists, Convex throws and no room rows are replaced.
const room = {
  slug: "Overbase",
  title: "Overbase",
  password: "newman",

  // Absolute paths outside the project are allowed. Relative paths resolve from the project root.
  deckPath: "/Users/juliennewman/Documents/marketing/Navacord and Overbase.mp3",
  audioPath:
    "/Users/juliennewman/Documents/marketing/Overbase with Joseph's questions - deck.pdf",

  questions: [
    {
      key: "colleagues-to-involve",
      question: "Which of your colleagues should we involve?",
      sortOrder: 0,
    },
  ],
};

const { client, seedSecret } = await createSeedClient();
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
  questions: room.questions,
});

console.log(`Created ${slug} success room with deck, audio, and questions.`);
