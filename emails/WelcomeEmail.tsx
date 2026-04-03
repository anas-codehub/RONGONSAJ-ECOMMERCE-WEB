import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface Props {
  customerName: string;
}

export default function WelcomeEmail({ customerName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to RÊVE Fashion! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>RÊVE</Heading>
            <Text style={headerSub}>Fashion · Dhaka, Bangladesh</Text>
          </Section>

          {/* Content */}
          <Section style={section}>
            <Heading style={h1}>Welcome, {customerName}! 👋</Heading>
            <Text style={text}>
              We're so excited to have you join RÊVE Fashion. Discover our
              handpicked collection of beautiful fashion pieces made just for
              you.
            </Text>
            <Text style={text}>
              As a welcome gift, use code{" "}
              <strong style={{ color: "#D85A30" }}>WELCOME20</strong> for 20%
              off your first order!
            </Text>
          </Section>

          <Hr style={hr} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={process.env.NEXTAUTH_URL} style={button}>
              Start shopping →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 RÊVE Fashion · Dhaka, Bangladesh
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#FFFBF5", fontFamily: "Arial, sans-serif" };
const container = { margin: "0 auto", padding: "20px 0", maxWidth: "600px" };
const header = {
  backgroundColor: "#FAEEDA",
  padding: "32px 40px",
  textAlign: "center" as const,
  borderRadius: "12px 12px 0 0",
};
const logo = {
  color: "#412402",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "4px",
  margin: "0",
};
const headerSub = { color: "#854F0B", fontSize: "13px", margin: "4px 0 0" };
const section = { padding: "32px 40px", backgroundColor: "#ffffff" };
const ctaSection = {
  padding: "24px 40px",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};
const h1 = {
  color: "#412402",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px",
};
const text = {
  color: "#854F0B",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px",
};
const button = {
  backgroundColor: "#D85A30",
  color: "#FAEEDA",
  padding: "14px 32px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#FAC775", margin: "0" };
const footer = {
  padding: "24px 40px",
  backgroundColor: "#412402",
  borderRadius: "0 0 12px 12px",
  textAlign: "center" as const,
};
const footerText = { color: "#FAC775", fontSize: "12px", margin: "4px 0" };
