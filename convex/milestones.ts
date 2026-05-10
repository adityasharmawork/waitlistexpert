import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const MILESTONES = [
  { count: 100, type: "signup_100" as const },
  { count: 250, type: "signup_250" as const },
  { count: 500, type: "signup_500" as const },
  { count: 1000, type: "signup_1000" as const },
  { count: 5000, type: "signup_5000" as const },
  { count: 10000, type: "signup_10000" as const },
];

// Called after each signup to check if a milestone was just crossed
export const checkMilestone = internalMutation({
  args: {
    waitlistId: v.id("waitlists"),
    currentCount: v.number(),
  },
  handler: async (ctx, { waitlistId, currentCount }) => {
    for (const milestone of MILESTONES) {
      // Only trigger if we just crossed this threshold (count equals milestone)
      if (currentCount !== milestone.count) continue;

      // Check if already recorded
      const existing = await ctx.db
        .query("milestones")
        .withIndex("by_waitlist_type", (q) =>
          q.eq("waitlistId", waitlistId).eq("type", milestone.type)
        )
        .first();

      if (existing) continue;

      // Record milestone
      await ctx.db.insert("milestones", {
        waitlistId,
        type: milestone.type,
        reachedAt: Date.now(),
        notified: true,
      });

      // Send milestone email to founder
      await ctx.scheduler.runAfter(
        0,
        internal.emails.sendMilestone,
        {
          waitlistId,
          milestoneCount: milestone.count,
        }
      );
    }
  },
});
