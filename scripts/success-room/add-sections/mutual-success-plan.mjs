// Run from the project root:
//   npm run add:success-room:mutual-success-plan
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This reads the sibling mutual-success-plan CSV and replaces the mutual
// success plan content for the hard-coded slug below.

import { connectToTarget } from "../helpers/convex-client.mjs";
import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";
import { readPlanAccordions } from "../helpers/plan-accordions.mjs";

// Replaces the mutual success plan for an existing room with the CSV content.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "tabitha";

const { client, seedSecret } = await connectToTarget();
const planAccordions = await readPlanAccordions(import.meta.dirname);

await enableSuccessRoomSection({
  client,
  seedSecret,
  slug,
  resourceKey: "mutual-success-plan",
  planAccordions,
});
