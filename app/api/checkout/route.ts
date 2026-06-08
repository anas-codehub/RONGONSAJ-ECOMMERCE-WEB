import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, address, couponId, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address?.fullName || !address?.phone || !address?.street ||  !address?.district) {
      return NextResponse.json({ error: "Please fill in all address fields" }, { status: 400 });
    }

    // Verify stock
    for (const item of items) {
      const productId = item.id.split("-")[0];
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({
          error: `Only ${product.stock} units of "${product.name}" available`,
        }, { status: 400 });
      }
    }

    // Generate order ID
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const orderCount = await db.order.count();
    const orderNumber = `ORD-${dateStr}-${String(orderCount + 1).padStart(3, "0")}`;

    // Handle guest vs logged in user
    let userId = session?.user?.id as string | undefined;

    if (!userId) {
      // Create a guest user or find existing by phone
      let guestUser = await db.user.findFirst({
        where: { email: `guest_${address.phone}@rongonsaaj.com` },
      });

      if (!guestUser) {
        guestUser = await db.user.create({
          data: {
            name: address.fullName,
            email: `guest_${address.phone}@rongonsaaj.com`,
            role: "USER",
          },
        });
      }
      userId = guestUser.id;
    }

    // Create address
    const savedAddress = await db.address.create({
      data: {
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
     
        district: address.district,
        userId,
      },
    });

    // Create order in transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          id: orderNumber,
          total,
          status: "PENDING",
          userId,
          addressId: savedAddress.id,
          ...(couponId && { couponId }),
          items: {
            create: items.map((item: any) => ({
              productId: item.id.split("-")[0],
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id.split("-")[0] },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });
    

    if (couponId) {

  const coupon = await db.coupon.findUnique({ where: { id: couponId } });
  if (coupon && coupon.usageCount < coupon.usageLimit) {
    await db.coupon.update({
      where: { id: couponId },
      data: { usageCount: { increment: 1 } },
    });
  }
}

    // Send admin notification
    if (process.env.ADMIN_EMAIL && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: process.env.ADMIN_EMAIL!,
          subject: `🛍️ New order! #${order.id} — ৳${total.toLocaleString()}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:#3D2B1F;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px;">
                <h1 style="color:#F0EBE3;margin:0;font-size:22px;">🛍️ New Order!</h1>
                <p style="color:#E07B54;margin:8px 0 0;">RONGONSAAJ</p>
              </div>
              <div style="background:#F9F5F1;padding:20px;border-radius:12px;margin-bottom:16px;">
                <p style="margin:4px 0;color:#3D2B1F;"><strong>Order ID:</strong> #${order.id}</p>
                <p style="margin:4px 0;color:#3D2B1F;"><strong>Customer:</strong> ${address.fullName}</p>
                <p style="margin:4px 0;color:#3D2B1F;"><strong>Phone:</strong> ${address.phone}</p>
              <p style="margin:4px 0;color:#3D2B1F;">
  <strong>Address:</strong>
  ${address.street}, ${address.district}
</p>
                <p style="margin:4px 0;color:#3D2B1F;"><strong>Total:</strong> ৳${total.toLocaleString()}</p>
                <p style="margin:4px 0;color:#3D2B1F;"><strong>Type:</strong> ${session ? "Registered customer" : "Guest order"}</p>
              </div>
              <div style="text-align:center;">
                <a href="${process.env.NEXTAUTH_URL}/admin/orders"
                  style="background:#E07B54;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
                  View in Admin Panel →
                </a>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}