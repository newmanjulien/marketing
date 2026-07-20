// Run from the project root:
//   npm run add:success-room:kickoff-schedule
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This enables the kickoff-schedule section for the hard-coded slug below.

import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";

// Enables the kickoff schedule section for an existing room.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "overbase";

await enableSuccessRoomSection({
  slug,
  resourceKey: "kickoff-schedule",
});
