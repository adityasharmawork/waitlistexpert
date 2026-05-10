import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// CORS preflight
http.route({
  path: "/api/signup",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// Widget signup endpoint
http.route({
  path: "/api/signup",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { waitlistId, email, name, referralCode, source } = body;

      if (!waitlistId || !email) {
        return jsonResponse({ success: false, error: "missing_fields" }, 400);
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email) || email.length > 254) {
        return jsonResponse({ success: false, error: "invalid_email" }, 400);
      }

      // Hash IP for anti-gaming (get from request headers)
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
      let ipHash: string | undefined;
      if (ip !== "unknown") {
        let hash = 0;
        for (let i = 0; i < ip.length; i++) {
          hash = (hash << 5) - hash + ip.charCodeAt(i);
          hash |= 0;
        }
        ipHash = Math.abs(hash).toString(36);
      }

      const result = await ctx.runMutation(api.signups.create, {
        waitlistId,
        email,
        name,
        referralCode,
        source: source || "widget",
        ipHash,
      });

      return jsonResponse(result);
    } catch {
      return jsonResponse({ success: false, error: "server_error" }, 500);
    }
  }),
});

// CORS preflight for count
http.route({
  path: "/api/count",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// Widget count endpoint
http.route({
  path: "/api/count",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return jsonResponse({ error: "missing_slug" }, 400);
    }

    const waitlist = await ctx.runQuery(api.waitlists.getBySlug, { slug });

    if (!waitlist) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    return new Response(
      JSON.stringify({
        slug: waitlist.slug,
        name: waitlist.name,
        signupCount: waitlist.signupCount,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=10",
        },
      }
    );
  }),
});

export default http;
