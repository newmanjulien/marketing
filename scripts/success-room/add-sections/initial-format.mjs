// Run from the project root:
//   npm run add:success-room:initial-format
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This enables the initial-format section for the hard-coded slug below.

import { enableSuccessRoomSection } from "../helpers/seed-common.mjs";

// Enables the initial format section for an existing room.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "overbase";

await enableSuccessRoomSection({
  slug,
  resourceKey: "initial-format",
});
