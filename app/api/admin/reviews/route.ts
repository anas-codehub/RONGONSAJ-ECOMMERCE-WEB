import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pending, approved] = await Promise.all([
      db.review.findMany({
        where: { approved: false },
        include: {
          user: { select: { name: true, email: true, image: true } },
          product: { select: { name: true, slug: true, images: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.review.findMany({
        where: { approved: true },
        include: {
          user: { select: { name: true, email: true, image: true } },
          product: { select: { name: true, slug: true, images: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({ pending, approved });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}