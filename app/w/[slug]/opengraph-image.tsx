import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Waitlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // Fetch waitlist data from Convex HTTP endpoint
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  let name = slug;
  let tagline = "Join the waitlist";
  let signupCount = 0;

  if (convexUrl) {
    try {
      const siteUrl = convexUrl.replace(".convex.cloud", ".convex.site");
      const res = await fetch(`${siteUrl}/api/count?slug=${slug}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        name = data.name || slug;
        signupCount = data.signupCount || 0;
      }
    } catch {
      // Fallback to slug-based display
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#09090b",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(to right, #6366f1, #a855f7)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#fafafa",
              textAlign: "center",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {name}
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
              textAlign: "center",
              margin: "16px 0 0 0",
              maxWidth: "600px",
            }}
          >
            {tagline}
          </p>

          {signupCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "40px",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1px solid #262626",
                backgroundColor: "#171717",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#fafafa",
                }}
              >
                {signupCount.toLocaleString()}
              </span>
              <span style={{ fontSize: "18px", color: "#737373" }}>
                people waiting
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ color: "white", fontWeight: 700, fontSize: "12px" }}
            >
              W
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#525252" }}>
            waitlist.expert
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
