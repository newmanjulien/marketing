import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete expired survey signup rate limits",
  { hours: 1 },
  internal.surveyResultsSignups.deleteExpiredRateLimits,
  {},
);

crons.interval(
  "delete expired Success Room upload intents",
  { hours: 1 },
  internal.storageCleanup.deleteExpiredUploadIntents,
  {},
);

crons.interval(
  "delete orphaned storage",
  { hours: 1 },
  internal.storageCleanup.deleteOrphanedStorage,
  {},
);

export default crons;
