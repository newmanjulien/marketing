import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete expired Success Room sessions",
  { hours: 1 },
  internal.cleanup.deleteExpiredSessions,
  {},
);

crons.interval(
  "delete orphaned storage",
  { hours: 1 },
  internal.cleanup.deleteOrphanedStorage,
  {},
);

export default crons;
