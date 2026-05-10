import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("waitlists")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("waitlists") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    return await ctx.db
      .query("waitlists")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const checkSlugAvailability = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const existing = await ctx.db
      .query("waitlists")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    return { available: !existing };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    tagline: v.string(),
    slug: v.string(),
    category: v.union(
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
    ),
    theme: v.union(
      v.literal("minimal-light"),
      v.literal("minimal-dark"),
      v.literal("premium-dark"),
      v.literal("stealth")
    ),
    description: v.optional(v.string()),
    launchDate: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    // Check slug uniqueness
    const existing = await ctx.db
      .query("waitlists")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Slug already taken");

    const now = Date.now();
    return await ctx.db.insert("waitlists", {
      ownerId: user._id,
      slug: args.slug,
      name: args.name,
      tagline: args.tagline,
      description: args.description,
      category: args.category,
      theme: args.theme,
      launchDate: args.launchDate,
      websiteUrl: args.websiteUrl,
      status: "active",
      isPublic: true,
      enableReferrals: true,
      signupCount: 0,
      watcherCount: 0,
      referralCount: 0,
      trendingScore: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("waitlists"),
    name: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
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
    theme: v.optional(
      v.union(
        v.literal("minimal-light"),
        v.literal("minimal-dark"),
        v.literal("premium-dark"),
        v.literal("stealth")
      )
    ),
    accentColor: v.optional(v.string()),
    launchDate: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("launched")
      )
    ),
    isPublic: v.optional(v.boolean()),
    enableReferrals: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const waitlist = await ctx.db.get(id);
    if (!waitlist) throw new Error("Waitlist not found");

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || waitlist.ownerId !== user._id) {
      throw new Error("Not authorized");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }

    if (updates.status === "launched" && !waitlist.launchedAt) {
      patch.launchedAt = Date.now();
    }

    await ctx.db.patch(id, patch);
  },
});
