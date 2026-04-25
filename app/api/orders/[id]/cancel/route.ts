import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        {
          error: `Order cannot be cancelled. Status is ${order.status}. Only PENDING orders can be cancelled.`,
        },
        { status: 400 }
      );
    }

    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const oneHour = 60 * 60 * 1000;
    if (orderAge > oneHour) {
      return NextResponse.json(
        {
          error: "Cancellation window has expired. Orders can only be cancelled within 1 hour.",
        },
        { status: 400 }
      );
    }

    // Cancel and restock
    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });

    // Notify admin about cancellation
    if (process.env.ADMIN_EMAIL && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: process.env.ADMIN_EMAIL!,
          subject: `❌ Order cancelled #${order.id}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:#DC2626;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">❌ Order Cancelled</h1>
                <p style="color:#FCA5A5;margin:8px 0 0;">RONGONSAAJ</p>
              </div>
              <div style="background:#FEF2F2;border:1px solid #FECACA;padding:20px;border-radius:12px;margin-bottom:16px;">
                <p style="margin:4px 0;color:#991B1B;"><strong>Order ID:</strong> #${order.id}</p>
                <p style="margin:4px 0;color:#991B1B;"><strong>Customer:</strong> ${order.user.name || order.user.email}</p>
                <p style="margin:4px 0;color:#991B1B;"><strong>Total:</strong> ৳${order.total.toLocaleString()}</p>
                <p style="margin:4px 0;color:#991B1B;"><strong>Cancelled at:</strong> ${new Date().toLocaleString("en-BD")}</p>
              </div>
              <div style="background:#fff;border:1px solid #E8DDD4;padding:20px;border-radius:12px;margin-bottom:16px;">
                <h3 style="color:#3D2B1F;margin:0 0 12px;">Cancelled Items (Stock Restored)</h3>
                ${order.items.map((item: any) => `
                  <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F0EBE3;">
                    <span style="color:#3D2B1F;font-weight:600;">${item.product.name}</span>
                    <span style="color:#DC2626;font-weight:700;">×${item.quantity} restored</span>
                  </div>
                `).join("")}
              </div>
              <div style="text-align:center;">
                <a href="${process.env.NEXTAUTH_URL}/admin/orders"
                  style="background:#3D2B1F;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
                  View in Admin Panel →
                </a>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Cancel notification error:", emailError);
      }
    }

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}