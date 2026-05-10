import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Recalculate trending scores every 15 minutes
crons.interval(
  "recalculate-trending",
  { minutes: 15 },
  internal.feed.recalculateTrending
);

// Snapshot daily stats at midnight UTC
crons.daily(
  "daily-stats-snapshot",
  { hourUTC: 0, minuteUTC: 5 },
  internal.analytics.snapshotDaily
);

export default crons;
