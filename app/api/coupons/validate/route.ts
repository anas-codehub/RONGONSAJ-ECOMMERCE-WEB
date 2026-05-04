import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const productId = searchParams.get("productId");

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    // Find coupon — case insensitive
    const coupon = await db.coupon.findFirst({
      where: {
        code: { equals: code.toUpperCase().trim(), mode: "insensitive" },
        isActive: true,
        ...(productId && { productId }),
      },
      include: { product: true },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { error: "This coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: `This coupon has reached its usage limit of ${coupon.usageLimit} users` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: coupon.id,
      code: coupon.code,
      discount: coupon.discount,
      isPercent: coupon.isPercent,
      usageLimit: coupon.usageLimit,
      usageCount: coupon.usageCount,
      remainingUses: coupon.usageLimit - coupon.usageCount,
      productId: coupon.productId,
      productName: coupon.product.name,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}