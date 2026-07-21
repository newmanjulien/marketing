// Run from the project root:
//   npm run add:success-room -- <room-slug> <section>
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// Enables the section for an existing room; if the slug does not exist, Convex
// throws and nothing is created. The mutual success plan section is seeded from
// the sibling CSV, replacing any existing plan content.

import { runConvex } from "../helpers/convex.mjs";
import { readPlanAccordions } from "../helpers/plan-accordions.mjs";

// Must mirror the routed resource slugs in shared/successRoomResources.ts
// (this script can't import the TS module).
const sections = ["initial-format", "kickoff-schedule", "mutual-success-plan"];
const [slug, section] = process.argv.slice(2);

if (!slug || !sections.includes(section)) {
  console.error(`Usage: npm run add:success-room -- <room-slug> <${sections.join("|")}>`);
  process.exit(1);
}

const planAccordions =
  section === "mutual-success-plan" ? await readPlanAccordions(import.meta.dirname) : null;

const result = await runConvex("admin:enableSuccessRoomSection", {
  slug,
  resourceSlug: section,
  ...(planAccordions ? { planAccordions } : {}),
});

console.log(
  `Enabled ${section} for ${slug}. Sections now enabled: ${result.enabledResourceSlugs.join(", ")}.`,
);
