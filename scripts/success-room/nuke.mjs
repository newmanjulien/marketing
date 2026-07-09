// Run from the project root:
//   node scripts/success-room/nuke.mjs
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This deletes all success-room rows and all Convex file-storage objects.

import { api } from "../../convex/_generated/api.js";
import { createSeedClient } from "./helpers/seed-common.mjs";

const { client, seedSecret } = await createSeedClient();

const result = await client.mutation(api.successRooms.nukeSuccessRoomData, {
  seedSecret,
});

console.log(JSON.stringify(result, null, 2));
