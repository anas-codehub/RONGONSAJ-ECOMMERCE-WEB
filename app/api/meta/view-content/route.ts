import { NextRequest, NextResponse } from "next/server";
import { sendCAPIEvent } from "@/lib/meta-capi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { productId, productName, price, url } = await req.json();

    await sendCAPIEvent({
      eventName: "ViewContent",
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: url,
      eventId: `view_${productId}_${Date.now()}`,
      userData: {},
      customData: {
        currency: "BDT",
        value: price,
        contentIds: [productId],
        contentType: "product",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}