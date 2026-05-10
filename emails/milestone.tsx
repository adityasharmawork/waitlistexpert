import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

interface MilestoneEmailProps {
  productName: string;
  milestoneCount: number;
  waitlistUrl: string;
  tweetText: string;
}

export function MilestoneEmail({
  productName = "Awesome Product",
  milestoneCount = 1000,
  waitlistUrl = "https://waitlist.expert/w/example",
  tweetText = "",
}: MilestoneEmailProps) {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <Html>
      <Head />
      <Preview>
        {productName} just hit {milestoneCount.toLocaleString()} signups!
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Milestone reached!</Heading>

          <Section style={milestoneBox}>
            <Text style={milestoneEmoji}>&#127881;</Text>
            <Text style={milestoneNumber}>
              {milestoneCount.toLocaleString()}
            </Text>
            <Text style={milestoneLabel}>people on the waitlist</Text>
          </Section>

          <Text style={text}>
            Congratulations! <strong>{productName}</strong> just crossed{" "}
            {milestoneCount.toLocaleString()} signups on its waitlist. Your
            pre-launch audience is growing.
          </Text>

          <Section style={buttonContainer}>
            <Link href={tweetUrl} style={button}>
              Share this milestone on X →
            </Link>
          </Section>

          <Text style={textSmall}>
            People love seeing momentum. Sharing milestones brings more
            signups — founders who tweeted their milestones saw 15-30% signup
            spikes in the following 48 hours.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            This notification was sent because you own the{" "}
            <Link href={waitlistUrl} style={footerLink}>
              {productName}
            </Link>{" "}
            waitlist on{" "}
            <Link href="https://waitlist.expert" style={footerLink}>
              waitlist.expert
            </Link>
            .
          </Text>

          <Text style={unsubscribeText}>
            <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={footerLink}>
              Unsubscribe from milestone notifications
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MilestoneEmail;

// --- Styles ---
const body = {
  backgroundColor: "#09090b",
  fontFamily: "system-ui, -apple-system, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "40px 24px",
};

const heading = {
  color: "#fafafa",
  fontSize: "24px",
  fontWeight: "700" as const,
  margin: "0 0 24px",
};

const text = {
  color: "#a3a3a3",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const textSmall = {
  color: "#737373",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const milestoneBox = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "16px",
  padding: "32px",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const milestoneEmoji = {
  fontSize: "40px",
  margin: "0 0 8px",
  lineHeight: "1",
};

const milestoneNumber = {
  color: "#fafafa",
  fontSize: "56px",
  fontWeight: "700" as const,
  margin: "0",
  lineHeight: "1",
};

const milestoneLabel = {
  color: "#737373",
  fontSize: "14px",
  margin: "8px 0 0",
};

const buttonContainer = {
  margin: "24px 0",
};

const button = {
  backgroundColor: "#6366f1",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  display: "inline-block" as const,
};

const hr = {
  borderColor: "#262626",
  margin: "24px 0",
};

const footer = {
  color: "#525252",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};

const footerLink = {
  color: "#6366f1",
  textDecoration: "none",
};

const unsubscribeText = {
  color: "#404040",
  fontSize: "11px",
  margin: "16px 0 0",
  textAlign: "center" as const,
};
