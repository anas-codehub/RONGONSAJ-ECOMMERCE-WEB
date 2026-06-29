import { NextResponse } from "next/server";
import { sendCAPIEvent } from "@/lib/meta-capi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await sendCAPIEvent({
      eventName: "Purchase",
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: "http://localhost:3000/order-success",
      eventId: `test_purchase_${Date.now()}`,
      userData: {
        phone: "01711234567",
        firstName: "Test",
      },
      customData: {
        currency: "BDT",
        value: 1500,
        orderId: "TEST-ORDER-001",
        numItems: 2,
        contentIds: ["test-product-1"],
        contentType: "product",
      },
    });

    return NextResponse.json({
      success: true,
      message: "CAPI event sent! Check Events Manager → Test Events",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}