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

interface WelcomeEmailProps {
  productName: string;
  position: number;
  referralLink: string;
  waitlistUrl: string;
}

export function WelcomeEmail({
  productName = "Awesome Product",
  position = 42,
  referralLink = "https://waitlist.expert/w/example?ref=abc123",
  waitlistUrl = "https://waitlist.expert/w/example",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        You&apos;re #{position} on the waitlist for {productName}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>You&apos;re on the list!</Heading>

          <Text style={text}>
            You just joined the waitlist for <strong>{productName}</strong>.
            You&apos;re #{position} in line.
          </Text>

          <Section style={positionBox}>
            <Text style={positionLabel}>Your position</Text>
            <Text style={positionNumber}>#{position}</Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={subheading}>
            Want to move up?
          </Heading>

          <Text style={text}>
            Share your unique referral link. Every friend who joins through your
            link moves you closer to the front of the line.
          </Text>

          <Section style={linkBox}>
            <Link href={referralLink} style={linkText}>
              {referralLink}
            </Link>
          </Section>

          <Text style={textSmall}>
            Copy the link above and share it on Twitter, LinkedIn, or anywhere
            else. The more people who join through your link, the higher you
            move in the queue.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You received this email because you signed up for the{" "}
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
            Don&apos;t want these emails?{" "}
            <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={footerLink}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

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
  margin: "0 0 16px",
};

const subheading = {
  color: "#fafafa",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
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

const positionBox = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const positionLabel = {
  color: "#737373",
  fontSize: "13px",
  margin: "0 0 4px",
};

const positionNumber = {
  color: "#fafafa",
  fontSize: "48px",
  fontWeight: "700" as const,
  margin: "0",
  lineHeight: "1",
};

const linkBox = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "16px 0",
};

const linkText = {
  color: "#6366f1",
  fontSize: "14px",
  textDecoration: "none",
  wordBreak: "break-all" as const,
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
  lineHeight: "1.5",
  margin: "16px 0 0",
  textAlign: "center" as const,
};
