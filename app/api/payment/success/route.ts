import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    if (status === "VALID" && tran_id) {
      const order = await db.order.update({
        where: { id: tran_id },
        data: { status: "PROCESSING" },
        include: {
          user: true,
          address: true,
          items: {
            include: { product: true },
          },
        },
      });

      // Send confirmation email
      if (order.user.email) {
        await sendOrderConfirmationEmail({
          to: order.user.email,
          customerName: order.user.name || "Customer",
          orderId: order.id,
          items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          address: {
            fullName: order.address.fullName,
            street: order.address.street,
            city: order.address.city,
            district: order.address.district,
            phone: order.address.phone,
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL(`/order-success?orderId=${tran_id}`, req.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/checkout", req.url));
  }
}