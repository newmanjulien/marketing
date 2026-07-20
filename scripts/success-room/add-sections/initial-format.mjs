// Run from the project root:
//   npm run add:success-room:initial-format
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This enables the initial-format section for the hard-coded slug below.

import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";

// Enables the initial format section for an existing room.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "navacord";

await enableSuccessRoomSection({
  slug,
  resourceKey: "initial-format",
});
