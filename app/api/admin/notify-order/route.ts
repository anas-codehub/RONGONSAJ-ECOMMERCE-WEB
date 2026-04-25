import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { orderId, total, items } = await req.json();

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `🛍️ New order received! #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3D2B1F; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #F0EBE3; margin: 0; font-size: 24px;">New Order Received!</h1>
            <p style="color: #E07B54; margin: 8px 0 0; font-size: 16px;">RONGONSAAJ</p>
          </div>

          <div style="background: #F9F5F1; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
            <h2 style="color: #3D2B1F; margin: 0 0 12px; font-size: 18px;">Order Details</h2>
            <p style="margin: 4px 0; color: #7A5C4F;"><strong style="color: #3D2B1F;">Order ID:</strong> #${orderId}</p>
            <p style="margin: 4px 0; color: #7A5C4F;"><strong style="color: #3D2B1F;">Total:</strong> ৳${total.toLocaleString()}</p>
            <p style="margin: 4px 0; color: #7A5C4F;"><strong style="color: #3D2B1F;">Items:</strong> ${items.length} item(s)</p>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #E8DDD4; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
            <h3 style="color: #3D2B1F; margin: 0 0 12px; font-size: 16px;">Items Ordered</h3>
            ${items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F0EBE3;">
                <span style="color: #3D2B1F; font-weight: 600;">${item.name}</span>
                <span style="color: #E07B54; font-weight: 700;">৳${item.price.toLocaleString()} × ${item.quantity}</span>
              </div>
            `).join("")}
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/orders"
              style="background: #E07B54; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
              View Order in Admin Panel
            </a>
          </div>

          <p style="text-align: center; color: #7A5C4F; font-size: 12px; margin-top: 24px;">
            This is an automated notification from Rongonsaaj admin system.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin notification error:", error);
    return NextResponse.json({ ok: false });
  }
}