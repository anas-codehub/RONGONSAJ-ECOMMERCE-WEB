import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const reviews = await db.review.findMany({
      where: {
        productId,
        approved: true, // Only show approved reviews
      },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment, images } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating required" },
        { status: 400 }
      );
    }

    // Check if user has ordered this product
    const order = await db.order.findFirst({
      where: {
        userId: session.user.id as string,
        status: { not: "CANCELLED" },
        items: { some: { productId } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "You can only review products you have purchased" },
        { status: 403 }
      );
    }

    // Check if already reviewed
    const existing = await db.review.findFirst({
      where: {
        productId,
        userId: session.user.id as string,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        productId,
        userId: session.user.id as string,
        rating: parseInt(rating),
        comment: comment || null,
        images: images || [],
        approved: false, // Needs admin approval
      },
    });

    return NextResponse.json({
      ...review,
      message: "Review submitted! It will appear after admin approval.",
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}