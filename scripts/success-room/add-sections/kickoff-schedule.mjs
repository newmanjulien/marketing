// Run from the project root:
//   npm run add:success-room:kickoff-schedule
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This enables the kickoff-schedule section for the hard-coded slug below.

import { connectToTarget } from "../helpers/convex-client.mjs";
import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";

// Enables the kickoff schedule section for an existing room.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "overbase";

const { client, seedSecret } = await connectToTarget();

await enableSuccessRoomSection({
  client,
  seedSecret,
  slug,
  resourceKey: "kickoff-schedule",
});
