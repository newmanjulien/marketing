// Run from the project root:
//   npm run add:success-room:mutual-success-plan
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This reads the sibling mutual-success-plan CSV and replaces the mutual
// success plan content for the hard-coded slug below.

import { enableSuccessRoomSection } from "../helpers/enable-section.mjs";
import { readPlanAccordions } from "../helpers/plan-accordions.mjs";

// Replaces the mutual success plan for an existing room with the CSV content.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "tabitha";

const planAccordions = await readPlanAccordions(import.meta.dirname);

await enableSuccessRoomSection({
  slug,
  resourceKey: "mutual-success-plan",
  planAccordions,
});
