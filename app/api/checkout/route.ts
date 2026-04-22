import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in to checkout" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();
    const { items, address, couponId, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address?.fullName || !address?.phone || !address?.street || !address?.city || !address?.district) {
      return NextResponse.json({ error: "Please fill in all address fields" }, { status: 400 });
    }

    // Verify stock
    for (const item of items) {
      const productId = item.id.split("-")[0];
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: `Product not found` }, { status: 400 });
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

    // Create address
    const savedAddress = await db.address.create({
      data: {
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
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

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}