// Run from the project root:
//   npm run create:success-room -- <room-slug> "<title>" <deck.pdf> <audio.mp3|.m4a>
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This creates the room with deck, audio, and benefits from create-benefits.csv.
// The room is seeded with the default host team member, whose last name unlocks
// it (see convex/auth.ts). It never adds extra sections; if the slug already
// exists, Convex throws and nothing is created. To add extra sections, run the
// matching script in scripts/success-room/add-sections/.
//
// File paths outside the project are allowed. Relative paths resolve from the
// project root.

import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { runConvex, uploadSeedFile } from "./helpers/convex.mjs";

const [roomSlug, title, deckPath, audioPath] = process.argv.slice(2);

const audioContentType = audioPath?.endsWith(".mp3")
  ? "audio/mpeg"
  : audioPath?.endsWith(".m4a")
    ? "audio/mp4"
    : null;

if (!roomSlug || !title || !deckPath?.endsWith(".pdf") || !audioContentType) {
  console.error(
    'Usage: npm run create:success-room -- <room-slug> "<title>" <deck.pdf> <audio.mp3|.m4a>',
  );
  process.exit(1);
}

const benefitCards = await readBenefitCards(import.meta.dirname);
const { slug } = await runConvex("admin:validateNewSuccessRoomSlug", {
  slug: roomSlug,
});
const deck = await uploadSeedFile({
  path: deckPath,
  contentType: "application/pdf",
});
const audio = await uploadSeedFile({
  path: audioPath,
  contentType: audioContentType,
});

await runConvex("admin:createSuccessRoom", {
  slug,
  prospectName: title,
  deck,
  audio,
  benefitCards,
});

console.log(`Created ${slug} success room with deck, audio, and benefits.`);
