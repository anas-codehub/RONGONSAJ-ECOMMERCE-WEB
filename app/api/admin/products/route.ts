import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, price, stock, categoryId, isFeatured, images, sizes, colors, coupon } = body;

    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

const product = await db.product.create({
  data: {
    name,
    slug,
    description,
    actualPrice: parseFloat(body.actualPrice || 0),
    price: parseFloat(price),
    discount: parseFloat(body.discount || 0),
    discountAmount: parseFloat(body.discountAmount || 0),
    stock: parseInt(stock),
    categoryId,
    isFeatured: isFeatured || false,
    images: images || [],
    sizes: sizes || [],
    colors: colors || [],
  },
});

 if (coupon?.code) {
      await db.coupon.create({
        data: {
          code: coupon.code.toUpperCase().trim(),
          discount: parseFloat(coupon.discount),
          isPercent: coupon.isPercent ?? true,
          isActive: true,
          usageLimit: parseInt(coupon.usageLimit || 100),
          usageCount: 0,
          expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : null,
          productId: product.id,
        },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}