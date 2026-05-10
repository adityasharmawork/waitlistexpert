import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const isWatching = query({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return false;

    const watcher = await ctx.db
      .query("watchers")
      .withIndex("by_waitlist_user", (q) =>
        q.eq("waitlistId", waitlistId).eq("userId", user._id)
      )
      .first();

    return !!watcher;
  },
});

export const getWatchedByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    const watches = await ctx.db
      .query("watchers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return watches.map((w) => w.waitlistId);
  },
});

export const toggle = mutation({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("watchers")
      .withIndex("by_waitlist_user", (q) =>
        q.eq("waitlistId", waitlistId).eq("userId", user._id)
      )
      .first();

    const waitlist = await ctx.db.get(waitlistId);
    if (!waitlist) throw new Error("Waitlist not found");

    if (existing) {
      // Remove watcher
      await ctx.db.delete(existing._id);
      await ctx.db.patch(waitlistId, {
        watcherCount: Math.max(0, waitlist.watcherCount - 1),
      });
      return { watching: false };
    } else {
      // Add watcher
      await ctx.db.insert("watchers", {
        waitlistId,
        userId: user._id,
        createdAt: Date.now(),
      });
      await ctx.db.patch(waitlistId, {
        watcherCount: waitlist.watcherCount + 1,
      });
      return { watching: true };
    }
  },
});
