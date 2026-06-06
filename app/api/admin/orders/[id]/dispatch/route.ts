import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSteadfastOrder } from "@/lib/steadfast";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        address: true,
        user: true,
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.trackingCode) {
      return NextResponse.json(
        { error: "Order already dispatched to Steadfast" },
        { status: 400 }
      );
    }

    // Create order on Steadfast
    const result = await createSteadfastOrder({
      invoice: order.id,
      recipient_name: order.address.fullName,
      recipient_phone: order.address.phone,
      recipient_address: `${order.address.street},  ${order.address.district}`,
      cod_amount: order.total,
      note: `Order from Rongonsaaj — ${order.items.map((i) => i.product.name).join(", ")}`,
    });

    if (result.status !== 200 || !result.consignment) {
      return NextResponse.json(
        { error: result.message || "Steadfast dispatch failed" },
        { status: 400 }
      );
    }

    // Save tracking code to order
    await db.order.update({
      where: { id },
      data: {
        trackingCode: result.consignment.tracking_code,
        steadfastId: result.consignment.consignment_id,
        steadfastStatus: result.consignment.status,
        status: "SHIPPED",
      },
    });

    return NextResponse.json({
      trackingCode: result.consignment.tracking_code,
      consignmentId: result.consignment.consignment_id,
      message: "Order dispatched to Steadfast successfully!",
    });
  } catch (error) {
    console.error("Steadfast dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch order" },
      { status: 500 }
    );
  }
}