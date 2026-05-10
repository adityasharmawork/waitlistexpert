import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Founders — synced from Clerk via webhook
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // Waitlists
  waitlists: defineTable({
    ownerId: v.id("users"),
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    websiteUrl: v.optional(v.string()),
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
    accentColor: v.optional(v.string()),
    launchDate: v.optional(v.number()),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("launched")
    ),
    isPublic: v.boolean(),

    // Referral configuration
    enableReferrals: v.boolean(),
    referralTiers: v.optional(
      v.array(
        v.object({
          name: v.string(),
          referralsRequired: v.number(),
          reward: v.string(),
        })
      )
    ),

    // Custom fields for signup form
    customFields: v.optional(
      v.array(
        v.object({
          id: v.string(),
          label: v.string(),
          type: v.union(
            v.literal("text"),
            v.literal("select"),
            v.literal("checkbox")
          ),
          required: v.boolean(),
          options: v.optional(v.array(v.string())),
        })
      )
    ),

    // Denormalized counters — updated atomically on signup/watch
    signupCount: v.number(),
    watcherCount: v.number(),
    referralCount: v.number(),

    // Feed ranking signals — recalculated by cron
    trendingScore: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
    launchedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_status_trending", ["status", "trendingScore"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_status_signups", ["status", "signupCount"])
    .index("by_status_launch", ["status", "launchDate"])
    .index("by_category_status", ["category", "status"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["status", "category"],
    }),

  // Waitlist signups
  signups: defineTable({
    waitlistId: v.id("waitlists"),
    email: v.string(),
    name: v.optional(v.string()),
    position: v.number(),
    referralCode: v.string(),
    referredBy: v.optional(v.id("signups")),
    referralCount: v.number(),
    status: v.union(
      v.literal("waiting"),
      v.literal("priority"),
      v.literal("invited"),
      v.literal("converted")
    ),
    customFieldValues: v.optional(v.any()),
    source: v.union(
      v.literal("page"),
      v.literal("widget"),
      v.literal("embed"),
      v.literal("api"),
      v.literal("referral")
    ),
    verified: v.boolean(),
    ipHash: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_waitlist", ["waitlistId"])
    .index("by_waitlist_email", ["waitlistId", "email"])
    .index("by_waitlist_position", ["waitlistId", "position"])
    .index("by_referral_code", ["referralCode"])
    .index("by_referrer", ["referredBy"])
    .index("by_waitlist_created", ["waitlistId", "createdAt"]),

  // Watchers — users watching from the discovery feed
  watchers: defineTable({
    waitlistId: v.id("waitlists"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_waitlist", ["waitlistId"])
    .index("by_user", ["userId"])
    .index("by_waitlist_user", ["waitlistId", "userId"]),

  // Milestones achieved
  milestones: defineTable({
    waitlistId: v.id("waitlists"),
    type: v.union(
      v.literal("signup_100"),
      v.literal("signup_250"),
      v.literal("signup_500"),
      v.literal("signup_1000"),
      v.literal("signup_5000"),
      v.literal("signup_10000"),
      v.literal("launched")
    ),
    reachedAt: v.number(),
    notified: v.boolean(),
  })
    .index("by_waitlist", ["waitlistId"])
    .index("by_waitlist_type", ["waitlistId", "type"]),

  // Email events for tracking delivery
  emailEvents: defineTable({
    waitlistId: v.id("waitlists"),
    signupId: v.optional(v.id("signups")),
    type: v.union(
      v.literal("welcome"),
      v.literal("position_update"),
      v.literal("milestone"),
      v.literal("launch_notification"),
      v.literal("referral_reward")
    ),
    resendId: v.optional(v.string()),
    status: v.union(
      v.literal("queued"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("bounced"),
      v.literal("failed")
    ),
    sentAt: v.number(),
  })
    .index("by_waitlist", ["waitlistId"])
    .index("by_signup", ["signupId"]),

  // Daily stats snapshots for analytics charts
  dailyStats: defineTable({
    waitlistId: v.id("waitlists"),
    date: v.string(), // "2026-05-08"
    signups: v.number(),
    referrals: v.number(),
    pageViews: v.number(),
  }).index("by_waitlist_date", ["waitlistId", "date"]),
});
