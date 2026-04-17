import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Task 5: Require authentication to place an order
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to place an order" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    const { items, address, couponId, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Check stock availability for all items first
    // Task fix: use item.productId (not item.id which includes size/color suffix)
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Sorry! Only ${product.stock} units of "${product.name}" are available`,
          },
          { status: 400 }
        );
      }
    }

    // Generate professional order number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const orderCount = await db.order.count();
    const orderNumber = `ORD-${dateStr}-${String(orderCount + 1).padStart(3, "0")}`;

    // Create address in DB
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

    // Task 6: Cash on Delivery — create order directly, no payment gateway needed
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          id: orderNumber,
          total,
          userId,
          addressId: savedAddress.id,
          // Cash on Delivery — starts as PENDING (admin will update to PROCESSING → SHIPPED → DELIVERED)
          status: "PENDING",
          ...(couponId && { couponId }),
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // Decrease stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    // Task 6: Return orderId directly — no payment redirect needed
    return NextResponse.json({
      orderId: order.id,
      message: "Order placed successfully! You will pay on delivery.",
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}