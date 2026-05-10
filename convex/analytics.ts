import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

// Get daily stats for chart (last N days)
export const getDailyStats = query({
  args: {
    waitlistId: v.id("waitlists"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, { waitlistId, days = 30 }) => {
    const stats = await ctx.db
      .query("dailyStats")
      .withIndex("by_waitlist_date", (q) => q.eq("waitlistId", waitlistId))
      .order("desc")
      .take(days);

    return stats.reverse();
  },
});

// Get source breakdown for a waitlist
export const getSourceBreakdown = query({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    const signups = await ctx.db
      .query("signups")
      .withIndex("by_waitlist", (q) => q.eq("waitlistId", waitlistId))
      .collect();

    const counts: Record<string, number> = {};
    for (const signup of signups) {
      counts[signup.source] = (counts[signup.source] || 0) + 1;
    }

    const total = signups.length;
    return Object.entries(counts)
      .map(([source, count]) => ({
        source,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  },
});

// Get growth metrics
export const getGrowthMetrics = query({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    const allSignups = await ctx.db
      .query("signups")
      .withIndex("by_waitlist_created", (q) => q.eq("waitlistId", waitlistId))
      .collect();

    const todayCount = allSignups.filter((s) => s.createdAt >= oneDayAgo).length;
    const thisWeekCount = allSignups.filter(
      (s) => s.createdAt >= oneWeekAgo
    ).length;
    const lastWeekCount = allSignups.filter(
      (s) => s.createdAt >= twoWeeksAgo && s.createdAt < oneWeekAgo
    ).length;

    const weekOverWeekGrowth =
      lastWeekCount > 0
        ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
        : thisWeekCount > 0
          ? 100
          : 0;

    return {
      today: todayCount,
      thisWeek: thisWeekCount,
      lastWeek: lastWeekCount,
      weekOverWeekGrowth,
      total: allSignups.length,
    };
  },
});

// Internal: snapshot daily stats for all active waitlists (called by cron at midnight UTC)
export const snapshotDaily = internalMutation({
  handler: async (ctx) => {
    const today = new Date();
    // Snapshot for yesterday
    today.setDate(today.getDate() - 1);
    const dateStr = today.toISOString().split("T")[0];

    const activeWaitlists = await ctx.db
      .query("waitlists")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const dayStart = new Date(dateStr + "T00:00:00Z").getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    for (const waitlist of activeWaitlists) {
      // Check if snapshot already exists
      const existing = await ctx.db
        .query("dailyStats")
        .withIndex("by_waitlist_date", (q) =>
          q.eq("waitlistId", waitlist._id).eq("date", dateStr)
        )
        .first();
      if (existing) continue;

      // Count signups for that day
      const daySignups = await ctx.db
        .query("signups")
        .withIndex("by_waitlist_created", (q) =>
          q
            .eq("waitlistId", waitlist._id)
            .gte("createdAt", dayStart)
        )
        .collect();

      const signupsInDay = daySignups.filter(
        (s) => s.createdAt < dayEnd
      ).length;
      const referralsInDay = daySignups.filter(
        (s) => s.createdAt < dayEnd && s.source === "referral"
      ).length;

      await ctx.db.insert("dailyStats", {
        waitlistId: waitlist._id,
        date: dateStr,
        signups: signupsInDay,
        referrals: referralsInDay,
        pageViews: 0, // TODO: track page views
      });
    }
  },
});
