import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
// @ts-ignore
import SSLCommerz from "sslcommerz-lts";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
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
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
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

    // Create order + decrease stock in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          id: orderNumber,
          total,
          userId,
          addressId: savedAddress.id,
          ...(couponId && { couponId }),
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // Decrease stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    // SSLCommerz payment init
    const store_id = process.env.SSLCOMMERZ_STORE_ID!;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

    const sslcz = new SSLCommerz(store_id, store_passwd, is_live);

    const paymentData = {
      total_amount: total,
      currency: "BDT",
      tran_id: order.id,
      success_url: `${process.env.NEXTAUTH_URL}/api/payment/success`,
      fail_url: `${process.env.NEXTAUTH_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXTAUTH_URL}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: items.map((i: any) => i.name).join(", "),
      product_category: "Fashion",
      product_profile: "general",
      cus_name: address.fullName,
      cus_email: session.user.email ?? "",
      cus_add1: address.street,
      cus_city: address.city,
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: address.phone,
      ship_name: address.fullName,
      ship_add1: address.street,
      ship_city: address.city,
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    const apiResponse = await sslcz.init(paymentData);

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({
        paymentUrl: apiResponse.GatewayPageURL,
        orderId: order.id,
      });
    }

    return NextResponse.json(
      { error: "Payment gateway error" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}