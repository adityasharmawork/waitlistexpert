import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const getTrending = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("ai"),
        v.literal("saas"),
        v.literal("devtools"),
        v.literal("fintech"),
        v.literal("mobile"),
        v.literal("consumer"),
        v.literal("creator"),
        v.literal("b2b"),
        v.literal("gaming"),
        v.literal("other")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit = 20 }) => {
    if (category) {
      return await ctx.db
        .query("waitlists")
        .withIndex("by_category_status", (q) =>
          q.eq("category", category).eq("status", "active")
        )
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("waitlists")
      .withIndex("by_status_trending", (q) => q.eq("status", "active"))
      .order("desc")
      .take(limit);
  },
});

export const getNewest = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 20 }) => {
    return await ctx.db
      .query("waitlists")
      .withIndex("by_status_created", (q) => q.eq("status", "active"))
      .order("desc")
      .take(limit);
  },
});

export const getMostAnticipated = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 20 }) => {
    return await ctx.db
      .query("waitlists")
      .withIndex("by_status_signups", (q) => q.eq("status", "active"))
      .order("desc")
      .take(limit);
  },
});

export const getLaunchingSoon = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 20 }) => {
    const now = Date.now();
    const twoWeeksFromNow = now + 14 * 24 * 60 * 60 * 1000;

    const waitlists = await ctx.db
      .query("waitlists")
      .withIndex("by_status_launch", (q) => q.eq("status", "active"))
      .collect();

    return waitlists
      .filter(
        (w) =>
          w.launchDate && w.launchDate > now && w.launchDate <= twoWeeksFromNow
      )
      .sort((a, b) => (a.launchDate ?? 0) - (b.launchDate ?? 0))
      .slice(0, limit);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query: searchQuery }) => {
    return await ctx.db
      .query("waitlists")
      .withSearchIndex("search_name", (q) =>
        q.search("name", searchQuery).eq("status", "active")
      )
      .take(20);
  },
});

// Internal mutation for recalculating trending scores (called by cron)
export const recalculateTrending = internalMutation({
  handler: async (ctx) => {
    const activeWaitlists = await ctx.db
      .query("waitlists")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    for (const waitlist of activeWaitlists) {
      // Count signups in last 24h
      const recentSignups = await ctx.db
        .query("signups")
        .withIndex("by_waitlist_created", (q) =>
          q
            .eq("waitlistId", waitlist._id)
            .gte("createdAt", oneDayAgo)
        )
        .collect();

      // Count signups in last week
      const weeklySignups = await ctx.db
        .query("signups")
        .withIndex("by_waitlist_created", (q) =>
          q
            .eq("waitlistId", waitlist._id)
            .gte("createdAt", oneWeekAgo)
        )
        .collect();

      // Velocity: recent signups relative to total
      const velocity =
        waitlist.signupCount > 0
          ? recentSignups.length / waitlist.signupCount
          : 0;

      // Growth rate
      const growthRate =
        waitlist.signupCount > weeklySignups.length
          ? weeklySignups.length /
            (waitlist.signupCount - weeklySignups.length)
          : weeklySignups.length > 0
            ? 1
            : 0;

      // Recency bonus (decays over 30 days)
      const daysSinceCreation =
        (now - waitlist.createdAt) / (1000 * 60 * 60 * 24);
      const recencyBonus = Math.max(0, 1 - daysSinceCreation / 30);

      // Launch proximity
      let launchProximity = 0;
      if (waitlist.launchDate) {
        const daysUntilLaunch =
          (waitlist.launchDate - now) / (1000 * 60 * 60 * 24);
        if (daysUntilLaunch > 0 && daysUntilLaunch <= 14) {
          launchProximity = 1 - daysUntilLaunch / 14;
        }
      }

      // Watcher ratio
      const watcherRatio =
        waitlist.signupCount > 0
          ? waitlist.watcherCount / waitlist.signupCount
          : 0;

      const trendingScore =
        velocity * 0.3 +
        growthRate * 0.25 +
        watcherRatio * 0.15 +
        recencyBonus * 0.15 +
        launchProximity * 0.15;

      await ctx.db.patch(waitlist._id, { trendingScore });
    }
  },
});
