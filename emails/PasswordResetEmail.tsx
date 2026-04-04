import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface Props {
  resetUrl: string;
  customerName: string;
}

export default function PasswordResetEmail({ resetUrl, customerName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your RÊVE Fashion password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>RÊVE</Heading>
            <Text style={headerSub}>Fashion · Dhaka, Bangladesh</Text>
          </Section>

          <Section style={section}>
            <Heading style={h1}>Reset your password</Heading>
            <Text style={text}>
              Hi {customerName}, we received a request to reset your password.
              Click the button below to create a new password.
            </Text>
            <Text style={text}>
              This link will expire in <strong>1 hour</strong>.
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button href={resetUrl} style={button}>
              Reset password →
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={smallText}>
              If you didn't request a password reset, you can safely ignore this
              email. Your password will not be changed.
            </Text>
          </Section>

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
const section = { padding: "24px 40px", backgroundColor: "#ffffff" };
const ctaSection = {
  padding: "8px 40px 24px",
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
const smallText = {
  color: "#854F0B",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0",
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
