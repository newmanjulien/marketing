// Enables a section on an existing success room.
// Used by the scripts in scripts/success-room/add-sections/.

import { runConvex } from "./convex.mjs";

export const enableSuccessRoomSection = async ({ slug, resourceKey, planAccordions }) => {
  const result = await runConvex("admin:enableSuccessRoomSections", {
    slug,
    resourceKeys: [resourceKey],
    ...(planAccordions ? { planAccordions } : {}),
  });

  console.log(
    `Enabled ${resourceKey} for ${slug}: ${result.enabledResourceKeys.join(", ")}.`,
  );
};
