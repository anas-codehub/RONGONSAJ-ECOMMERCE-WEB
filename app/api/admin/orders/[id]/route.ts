import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, address } = body;

    if (status) {
      await db.order.update({
        where: { id },
        data: { status },
      });
    }

    if (address) {
      const order = await db.order.findUnique({
        where: { id },
        select: { addressId: true },
      });

      if (order?.addressId) {
        await db.address.update({
          where: { id: order.addressId },
          data: {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            district: address.district,
          },
        });
      }
    }

    return NextResponse.json({ message: "Order updated!" });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}