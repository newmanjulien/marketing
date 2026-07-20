// Run from the project root:
//   npm run create:success-room
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This creates the hard-coded room below, reads create-benefits.csv,
// and uploads its configured deck/audio files.

import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { runConvex, uploadSeedFile } from "./helpers/convex.mjs";

// Add a new base room here. This script creates deck, audio, and benefits.
// It never adds extra sections and never overwrites an existing room.
// To add extra sections, run the matching script in scripts/success-room/add-sections/.
// If this slug already exists, Convex throws and no room rows are replaced.
const room = {
  slug: "navacord",
  title: "Navacord success room",
  password: "newman",

  // Absolute paths outside the project are allowed. Relative paths resolve from the project root.
  deckPath: "/Users/juliennewman/Downloads/Navacord and Overbase - deck.pdf",
  audioPath: "/Users/juliennewman/Downloads/Navacord and Overbase - audio.mp3",
};

const benefitCards = await readBenefitCards(import.meta.dirname);
const { slug } = await runConvex("admin:validateNewSuccessRoomSlug", {
  slug: room.slug,
});
const passwordHash = await runConvex("auth:hashRoomPassword", {
  password: room.password,
});
const deck = await uploadSeedFile({
  path: room.deckPath,
  contentType: "application/pdf",
});
const audio = await uploadSeedFile({
  path: room.audioPath,
  contentType: "audio/mpeg",
});

await runConvex("admin:createSuccessRoom", {
  slug,
  prospectName: room.title,
  passwordHash,
  deck,
  audio,
  benefitCards,
});

console.log(`Created ${slug} success room with deck, audio, and benefits.`);
