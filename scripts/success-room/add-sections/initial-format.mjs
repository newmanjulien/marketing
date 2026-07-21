// Run from the project root:
//   npm run add:success-room:initial-format -- <room-slug>
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).

import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";

// Enables the initial format section for an existing room.
// If this slug does not exist, Convex throws and nothing is created.
const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run add:success-room:initial-format -- <room-slug>");
  process.exit(1);
}

await enableSuccessRoomSection({
  slug,
  resourceSlug: "initial-format",
});
