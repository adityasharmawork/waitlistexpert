import { Resend } from "resend";
import { render } from "react-email";
import { WelcomeEmail } from "@/emails/welcome";
import { MilestoneEmail } from "@/emails/milestone";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // Verify internal secret to prevent external calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, to, data } = body;

  try {
    let subject: string;
    let html: string;

    switch (type) {
      case "welcome": {
        subject = `You're #${data.position} on the waitlist for ${data.productName}`;
        html = await render(
          WelcomeEmail({
            productName: data.productName,
            position: data.position,
            referralLink: data.referralLink,
            waitlistUrl: data.waitlistUrl,
          })
        );
        break;
      }
      case "milestone": {
        subject = `${data.productName} just hit ${data.milestoneCount.toLocaleString()} signups!`;
        html = await render(
          MilestoneEmail({
            productName: data.productName,
            milestoneCount: data.milestoneCount,
            waitlistUrl: data.waitlistUrl,
            tweetText: data.tweetText,
          })
        );
        break;
      }
      default:
        return Response.json({ error: "unknown_type" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: "waitlist.expert <notifications@waitlist.expert>",
      to,
      subject,
      html,
    });

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json(
      { success: false, error: "send_failed" },
      { status: 500 }
    );
  }
}
