import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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

    const product = await db.product.update({
  where: { id },
  data: {
    name: body.name,
    slug: body.slug,
    description: body.description,
    actualPrice: parseFloat(body.actualPrice || 0),
    price: parseFloat(body.price),
    discount: parseFloat(body.discount || 0),
    stock: parseInt(body.stock),
    categoryId: body.categoryId,
    isFeatured: body.isFeatured,
    images: body.images,
    sizes: body.sizes || [],
    colors: body.colors || [],
  },
});

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
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
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}