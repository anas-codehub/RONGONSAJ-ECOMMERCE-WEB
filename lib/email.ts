import { Resend } from "resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL!;

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  total,
  address,
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: {
    fullName: string;
    street: string;
    city: string;
    district: string;
    phone: string;
  };
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Order confirmed! #${orderId} — RÊVE Fashion`,
      react: OrderConfirmationEmail({
        customerName,
        orderId,
        items,
        total,
        address,
      }),
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

export async function sendWelcomeEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Welcome to RÊVE Fashion! 🎉`,
      react: WelcomeEmail({ customerName }),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}