// Run from the project root:
//   node scripts/success-room/nuke.mjs
//
// Uses the Convex CLI's deploy credentials (SCRIPT_TARGET=prod for production).
// This deletes all success-room rows and all Convex file-storage objects.

import { runConvex } from "./helpers/convex.mjs";

const result = await runConvex("admin:nukeSuccessRoomData");

console.log(JSON.stringify(result, null, 2));
