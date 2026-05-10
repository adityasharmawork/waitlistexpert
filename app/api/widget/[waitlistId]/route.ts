import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Read the widget template at startup
let widgetTemplate = "";
const widgetPath = join(process.cwd(), "widget/dist/widget.js");
if (existsSync(widgetPath)) {
  widgetTemplate = readFileSync(widgetPath, "utf-8");
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ waitlistId: string }> }
) {
  const { waitlistId } = await props.params;

  const convexSiteUrl = (process.env.NEXT_PUBLIC_CONVEX_URL ?? "")
    .replace(".convex.cloud", ".convex.site");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://waitlist.expert";

  // Inject config into the widget script
  const script = widgetTemplate
    .replace(/__CONVEX_SITE_URL__/g, convexSiteUrl)
    .replace(/__SITE_URL__/g, siteUrl)
    .replace(/__WAITLIST_ID__/g, waitlistId);

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
