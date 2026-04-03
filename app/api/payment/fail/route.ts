import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id) {
      await db.$transaction(async (tx) => {
        // Get order items
        const order = await tx.order.findUnique({
          where: { id: tran_id },
          include: { items: true },
        });

        if (order) {
          // Cancel the order
          await tx.order.update({
            where: { id: tran_id },
            data: { status: "CANCELLED" },
          });

          // Restock items
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      });
    }

    return NextResponse.redirect(
      new URL("/checkout?error=payment_failed", req.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/checkout", req.url));
  }
}