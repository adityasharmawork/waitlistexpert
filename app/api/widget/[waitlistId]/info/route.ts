import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  _request: Request,
  props: { params: Promise<{ waitlistId: string }> }
) {
  const { waitlistId } = await props.params;

  try {
    const waitlist = await convex.query(api.waitlists.getById, {
      id: waitlistId as Id<"waitlists">,
    });

    if (!waitlist) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    return Response.json(
      {
        name: waitlist.name,
        slug: waitlist.slug,
        signupCount: waitlist.signupCount,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=30",
        },
      }
    );
  } catch {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
