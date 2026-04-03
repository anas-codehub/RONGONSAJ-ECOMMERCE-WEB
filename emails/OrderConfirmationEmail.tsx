import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  address: {
    fullName: string;
    street: string;
    city: string;
    district: string;
    phone: string;
  };
}

export default function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
  address,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your order #{orderId} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>RÊVE</Heading>
            <Text style={headerSub}>Fashion · Dhaka, Bangladesh</Text>
          </Section>

          {/* Thank you */}
          <Section style={section}>
            <Heading style={h1}>Order confirmed! 🎉</Heading>
            <Text style={text}>
              Hi {customerName}, thank you for your order! We've received it and
              will start processing it shortly.
            </Text>
          </Section>

          {/* Order ID */}
          <Section style={orderIdSection}>
            <Text style={orderIdLabel}>Order ID</Text>
            <Text style={orderIdValue}>#{orderId}</Text>
          </Section>

          <Hr style={hr} />

          {/* Items */}
          <Section style={section}>
            <Heading style={h2}>Items ordered</Heading>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemName}>
                  {item.name} × {item.quantity}
                </Column>
                <Column style={itemPrice}>
                  ৳{(item.price * item.quantity).toLocaleString()}
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row style={itemRow}>
              <Column style={{ ...itemName, fontWeight: "600" }}>Total</Column>
              <Column
                style={{ ...itemPrice, color: "#D85A30", fontWeight: "600" }}
              >
                ৳{total.toLocaleString()}
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Delivery address */}
          <Section style={section}>
            <Heading style={h2}>Delivery address</Heading>
            <Text style={text}>
              {address.fullName}
              <br />
              {address.street}
              <br />
              {address.city}, {address.district}
              <br />
              Phone: {address.phone}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or contact us anytime.
            </Text>
            <Text style={footerText}>
              © 2026 RÊVE Fashion · Dhaka, Bangladesh
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#FFFBF5",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

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

const headerSub = {
  color: "#854F0B",
  fontSize: "13px",
  margin: "4px 0 0",
};

const section = {
  padding: "24px 40px",
  backgroundColor: "#ffffff",
};

const orderIdSection = {
  padding: "16px 40px",
  backgroundColor: "#FAEEDA",
  textAlign: "center" as const,
};

const orderIdLabel = {
  color: "#854F0B",
  fontSize: "12px",
  margin: "0",
};

const orderIdValue = {
  color: "#D85A30",
  fontSize: "20px",
  fontWeight: "700",
  margin: "4px 0 0",
  fontFamily: "monospace",
};

const h1 = {
  color: "#412402",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const h2 = {
  color: "#412402",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const text = {
  color: "#854F0B",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const itemRow = {
  marginBottom: "8px",
};

const itemName = {
  color: "#412402",
  fontSize: "14px",
};

const itemPrice = {
  color: "#412402",
  fontSize: "14px",
  textAlign: "right" as const,
};

const hr = {
  borderColor: "#FAC775",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
  backgroundColor: "#412402",
  borderRadius: "0 0 12px 12px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#FAC775",
  fontSize: "12px",
  margin: "4px 0",
};
