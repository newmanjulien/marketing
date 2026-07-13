import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

const hourlyStorageCleanups = [
  {
    name: "delete expired Success Room upload intents",
    handler: internal.storageCleanup.deleteExpiredUploadIntents,
  },
  {
    name: "delete orphaned storage",
    handler: internal.storageCleanup.deleteOrphanedStorage,
  },
];

for (const { name, handler } of hourlyStorageCleanups) {
  crons.interval(name, { hours: 1 }, handler, {});
}

export default crons;
