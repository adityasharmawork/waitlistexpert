import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { nanoid } from "nanoid";
import { internal } from "./_generated/api";

export const getByWaitlist = query({
  args: {
    waitlistId: v.id("waitlists"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { waitlistId, limit }) => {
    // Auth check — only the waitlist owner can see signup emails
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    const waitlist = await ctx.db.get(waitlistId);
    if (!waitlist || waitlist.ownerId !== user._id) return [];

    const q = ctx.db
      .query("signups")
      .withIndex("by_waitlist_created", (q) => q.eq("waitlistId", waitlistId))
      .order("desc");

    if (limit) {
      return await q.take(limit);
    }
    return await q.collect();
  },
});

export const getPosition = query({
  args: {
    waitlistId: v.id("waitlists"),
    email: v.string(),
  },
  handler: async (ctx, { waitlistId, email }) => {
    const signup = await ctx.db
      .query("signups")
      .withIndex("by_waitlist_email", (q) =>
        q.eq("waitlistId", waitlistId).eq("email", email.toLowerCase())
      )
      .first();

    if (!signup) return null;

    return {
      position: signup.position,
      referralCode: signup.referralCode,
      referralCount: signup.referralCount,
      status: signup.status,
    };
  },
});

export const getByReferralCode = query({
  args: { referralCode: v.string() },
  handler: async (ctx, { referralCode }) => {
    return await ctx.db
      .query("signups")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", referralCode))
      .first();
  },
});

export const create = mutation({
  args: {
    waitlistId: v.id("waitlists"),
    email: v.string(),
    name: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    source: v.union(
      v.literal("page"),
      v.literal("widget"),
      v.literal("embed"),
      v.literal("api"),
      v.literal("referral")
    ),
    customFieldValues: v.optional(v.any()),
    ipHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return { success: false, error: "invalid_email" };
    }

    // Block common disposable email domains
    const domain = email.split("@")[1];
    const disposableDomains = [
      "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
      "temp-mail.org", "10minutemail.com", "trashmail.com", "yopmail.com",
      "dispostable.com", "maildrop.cc", "fakeinbox.com", "sharklasers.com",
      "spam4.me", "getairmail.com", "mailnesia.com", "tmpmail.net",
    ];
    if (disposableDomains.includes(domain)) {
      return { success: false, error: "disposable_email" };
    }

    // Check for duplicate
    const existing = await ctx.db
      .query("signups")
      .withIndex("by_waitlist_email", (q) =>
        q.eq("waitlistId", args.waitlistId).eq("email", email)
      )
      .first();
    if (existing) {
      return {
        success: false,
        error: "already_signed_up",
        position: existing.position,
        referralCode: existing.referralCode,
      };
    }

    // Get waitlist to check status
    const waitlist = await ctx.db.get(args.waitlistId);
    if (!waitlist || waitlist.status !== "active") {
      return { success: false, error: "waitlist_not_active" };
    }

    // Calculate position
    const position = waitlist.signupCount + 1;

    // Generate unique referral code
    const referralCode = nanoid(10);

    // Track referral source
    let referredBy: Id<"signups"> | undefined;
    let source = args.source;
    const incomingReferralCode = args.referralCode;
    if (incomingReferralCode) {
      const referrer = await ctx.db
        .query("signups")
        .withIndex("by_referral_code", (q) =>
          q.eq("referralCode", incomingReferralCode)
        )
        .first();
      if (referrer && referrer.waitlistId === args.waitlistId) {
        referredBy = referrer._id;
        source = "referral";

        // Increment referrer's count
        await ctx.db.patch(referrer._id, {
          referralCount: referrer.referralCount + 1,
        });

        // Update waitlist referral count
        await ctx.db.patch(args.waitlistId, {
          referralCount: waitlist.referralCount + 1,
        });

        // Queue-jump: schedule position recalculation for the referrer
        // The referrer moves up by 1 position for each referral
        await ctx.scheduler.runAfter(0, internal.signups.recalculatePosition, {
          waitlistId: args.waitlistId,
          signupId: referrer._id,
        });
      }
    }

    // Create signup
    const signupId = await ctx.db.insert("signups", {
      waitlistId: args.waitlistId,
      email,
      name: args.name,
      position,
      referralCode,
      referredBy,
      referralCount: 0,
      status: "waiting",
      source,
      customFieldValues: args.customFieldValues,
      verified: false,
      ipHash: args.ipHash,
      createdAt: Date.now(),
    });

    // Increment waitlist signup count
    const newCount = waitlist.signupCount + 1;
    await ctx.db.patch(args.waitlistId, {
      signupCount: newCount,
      updatedAt: Date.now(),
    });

    // Schedule welcome email (runs asynchronously)
    await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeAction, {
      signupId,
    });

    // Check for milestone
    await ctx.scheduler.runAfter(0, internal.milestones.checkMilestone, {
      waitlistId: args.waitlistId,
      currentCount: newCount,
    });

    return {
      success: true,
      signupId,
      position,
      referralCode,
      totalSignups: newCount,
    };
  },
});

export const getStats = query({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    const waitlist = await ctx.db.get(waitlistId);
    if (!waitlist) return null;

    // Get today's signups
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todaySignups = await ctx.db
      .query("signups")
      .withIndex("by_waitlist_created", (q) =>
        q
          .eq("waitlistId", waitlistId)
          .gte("createdAt", todayStart.getTime())
      )
      .collect();

    // Get top referrers
    const allSignups = await ctx.db
      .query("signups")
      .withIndex("by_waitlist", (q) => q.eq("waitlistId", waitlistId))
      .collect();

    const topReferrers = allSignups
      .filter((s) => s.referralCount > 0)
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 10);

    return {
      totalSignups: waitlist.signupCount,
      todaySignups: todaySignups.length,
      totalReferrals: waitlist.referralCount,
      topReferrers,
    };
  },
});

// Queue-jump position recalculation.
// When a referral comes in, the referrer jumps ahead of non-referring signups
// who are currently ahead of them. Each referral = jump 1 spot.
export const recalculatePosition = internalMutation({
  args: {
    waitlistId: v.id("waitlists"),
    signupId: v.id("signups"),
  },
  handler: async (ctx, { waitlistId, signupId }) => {
    const signup = await ctx.db.get(signupId);
    if (!signup || signup.waitlistId !== waitlistId) return;

    // Can't move higher than position 1
    if (signup.position <= 1) return;

    // Find the person directly ahead of the referrer
    const personAhead = await ctx.db
      .query("signups")
      .withIndex("by_waitlist_position", (q) =>
        q.eq("waitlistId", waitlistId).eq("position", signup.position - 1)
      )
      .first();

    if (!personAhead) return;

    // Only jump ahead of someone who has fewer referrals
    if (personAhead.referralCount >= signup.referralCount) return;

    // Swap positions
    await ctx.db.patch(signup._id, { position: personAhead.position });
    await ctx.db.patch(personAhead._id, { position: signup.position });
  },
});

// Referral leaderboard for a waitlist
export const getReferralLeaderboard = query({
  args: { waitlistId: v.id("waitlists"), limit: v.optional(v.number()) },
  handler: async (ctx, { waitlistId, limit = 10 }) => {
    const signups = await ctx.db
      .query("signups")
      .withIndex("by_waitlist", (q) => q.eq("waitlistId", waitlistId))
      .collect();

    return signups
      .filter((s) => s.referralCount > 0)
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, limit)
      .map((s, i) => ({
        rank: i + 1,
        name: s.name || `User #${s.position}`,
        referralCount: s.referralCount,
        position: s.position,
      }));
  },
});

// Get signup by referral code with waitlist info (for share pages)
export const getSignupWithWaitlist = query({
  args: { referralCode: v.string() },
  handler: async (ctx, { referralCode }) => {
    const signup = await ctx.db
      .query("signups")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", referralCode))
      .first();

    if (!signup) return null;

    const waitlist = await ctx.db.get(signup.waitlistId);
    if (!waitlist) return null;

    return {
      signup: {
        position: signup.position,
        referralCode: signup.referralCode,
        referralCount: signup.referralCount,
      },
      waitlist: {
        name: waitlist.name,
        slug: waitlist.slug,
        signupCount: waitlist.signupCount,
      },
    };
  },
});
