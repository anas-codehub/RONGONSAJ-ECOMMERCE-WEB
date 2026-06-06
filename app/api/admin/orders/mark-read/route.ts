import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, all } = await req.json();

    if (all) {
      await db.order.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ message: "All marked as read" });
    }

    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { isRead: true },
      });
      return NextResponse.json({ message: "Marked as read" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}