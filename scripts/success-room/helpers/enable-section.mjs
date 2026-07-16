// Enables a section on an existing success room.
// Used by the scripts in scripts/success-room/add-sections/.

import { api } from "../../../convex/_generated/api.js";

export const enableSuccessRoomSection = async ({
  client,
  seedSecret,
  slug,
  resourceKey,
  planAccordions = [],
}) => {
  const result = await client.mutation(
    api.successRooms.enableSuccessRoomSections,
    {
      seedSecret,
      slug,
      resourceKeys: [resourceKey],
      planAccordions,
    },
  );

  console.log(
    `Enabled ${resourceKey} for ${slug}: ${result.enabledResourceKeys.join(", ")}.`,
  );
};
