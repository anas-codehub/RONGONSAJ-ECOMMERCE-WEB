import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentOrders, pendingCount] = await Promise.all([
      db.order.findMany({
        where: { createdAt: { gte: since } },
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.order.count({
        where: { status: "PENDING" },
      }),
    ]);

    return NextResponse.json({ recentOrders, pendingCount });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}