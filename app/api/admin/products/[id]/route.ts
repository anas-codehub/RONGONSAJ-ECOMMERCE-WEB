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
    const { coupon, ...productData } = body;

    const product = await db.product.update({
      where: { id },
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        actualPrice: parseFloat(productData.actualPrice || 0),
        price: parseFloat(productData.price),
        discount: parseFloat(productData.discount || 0),
        discountAmount: parseFloat(productData.discountAmount || 0),
        stock: parseInt(productData.stock),
        categoryId: productData.categoryId,
        isFeatured: productData.isFeatured,
        images: productData.images,
        sizes: productData.sizes || [],
        colors: productData.colors || [],
      },
    });

    // Handle coupon update
    if (coupon?.code) {
      // Delete existing coupon for this product
      await db.coupon.deleteMany({ where: { productId: id } });

      // Create new coupon
      await db.coupon.create({
        data: {
          code: coupon.code.toUpperCase().trim(),
          discount: parseFloat(coupon.discount),
          isPercent: coupon.isPercent ?? true,
          isActive: true,
          usageLimit: parseInt(coupon.usageLimit || 100),
          usageCount: 0,
          expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : null,
          productId: id,
        },
      });
    } else if (coupon?.remove) {
      // Remove coupon if admin cleared it
      await db.coupon.deleteMany({ where: { productId: id } });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}