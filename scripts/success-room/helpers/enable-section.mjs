// Enables a section on an existing success room.
// Used by the scripts in scripts/success-room/add-sections/.

import { runConvex } from "./convex.mjs";

export const enableSuccessRoomSection = async ({ slug, resourceSlug, planAccordions }) => {
  const result = await runConvex("admin:enableSuccessRoomSections", {
    slug,
    resourceSlugs: [resourceSlug],
    ...(planAccordions ? { planAccordions } : {}),
  });

  console.log(
    `Enabled ${resourceSlug} for ${slug}: ${result.enabledResourceSlugs.join(", ")}.`,
  );
};
