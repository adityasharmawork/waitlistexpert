import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const SITE_URL = process.env.SITE_URL ?? "https://waitlist.expert";
const EMAIL_API_URL = `${SITE_URL}/api/email`;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET ?? "";

async function sendEmail(
  type: string,
  to: string,
  data: Record<string, unknown>
) {
  const res = await fetch(EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${INTERNAL_API_SECRET}`,
    },
    body: JSON.stringify({ type, to, data }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Email API error: ${error}`);
  }

  return await res.json();
}

// Send welcome email after signup — called by scheduler from signup mutation
export const sendWelcomeAction = internalAction({
  args: {
    signupId: v.id("signups"),
  },
  handler: async (ctx, { signupId }) => {
    const signup = await ctx.runQuery(internal.emails.getSignupForEmail, {
      signupId,
    });
    if (!signup) return;

    const waitlist = await ctx.runQuery(internal.emails.getWaitlistForEmail, {
      waitlistId: signup.waitlistId,
    });
    if (!waitlist) return;

    const referralLink = `${SITE_URL}/w/${waitlist.slug}?ref=${signup.referralCode}`;
    const waitlistUrl = `${SITE_URL}/w/${waitlist.slug}`;

    try {
      const result = await sendEmail("welcome", signup.email, {
        productName: waitlist.name,
        position: signup.position,
        referralLink,
        waitlistUrl,
      });

      // Track email event
      await ctx.runMutation(internal.emails.trackEmailEvent, {
        waitlistId: signup.waitlistId,
        signupId,
        type: "welcome",
        resendId: result.id,
        status: "sent",
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      await ctx.runMutation(internal.emails.trackEmailEvent, {
        waitlistId: signup.waitlistId,
        signupId,
        type: "welcome",
        status: "failed",
      });
    }
  },
});

// Send milestone email to founder
export const sendMilestone = internalAction({
  args: {
    waitlistId: v.id("waitlists"),
    milestoneCount: v.number(),
  },
  handler: async (ctx, { waitlistId, milestoneCount }) => {
    const waitlist = await ctx.runQuery(internal.emails.getWaitlistForEmail, {
      waitlistId,
    });
    if (!waitlist) return;

    const owner = await ctx.runQuery(internal.emails.getUserForEmail, {
      userId: waitlist.ownerId,
    });
    if (!owner) return;

    const waitlistUrl = `${SITE_URL}/w/${waitlist.slug}`;
    const tweetText = `${waitlist.name} just crossed ${milestoneCount.toLocaleString()} waitlist signups! Building something big. Join us: ${waitlistUrl} via @waitlistexpert`;

    try {
      const result = await sendEmail("milestone", owner.email, {
        productName: waitlist.name,
        milestoneCount,
        waitlistUrl,
        tweetText,
      });

      await ctx.runMutation(internal.emails.trackEmailEvent, {
        waitlistId,
        type: "milestone",
        resendId: result.id,
        status: "sent",
      });
    } catch (error) {
      console.error("Failed to send milestone email:", error);
    }
  },
});

// Internal queries used by actions above
export const getSignupForEmail = internalQuery({
  args: { signupId: v.id("signups") },
  handler: async (ctx, { signupId }) => {
    return await ctx.db.get(signupId);
  },
});

export const getWaitlistForEmail = internalQuery({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, { waitlistId }) => {
    return await ctx.db.get(waitlistId);
  },
});

export const getUserForEmail = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const trackEmailEvent = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailEvents", {
      waitlistId: args.waitlistId,
      signupId: args.signupId,
      type: args.type,
      resendId: args.resendId,
      status: args.status,
      sentAt: Date.now(),
    });
  },
});
