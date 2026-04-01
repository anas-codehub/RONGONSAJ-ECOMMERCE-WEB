import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    if (status === "VALID" && tran_id) {
      await db.order.update({
        where: { id: tran_id },
        data: { status: "PROCESSING" },
      });
    }

    return NextResponse.redirect(
      new URL(`/order-success?orderId=${tran_id}`, req.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/checkout", req.url));
  }
}