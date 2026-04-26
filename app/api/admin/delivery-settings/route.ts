import { NextRequest, NextResponse } from "next/server";
import {auth} from "@/lib/auth"
import {db} from "@/lib/db"


export const dynamic = "force-dynamic";

export async function GET() {
    try {
        let settings = await db.deliverySettings.findFirst();

        if (!settings) {
            settings = await db.deliverySettings.create({
                data: {
                    insideDhaka: 80,
                    outsideDhaka: 150,
                    freeDeliveryMin: 2000,
                },
            });
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("Delivery settings error:", error);
        return NextResponse.json(
            {error: "Failed to fetch settings"},
            {status: 500}
        );
    }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { insideDhaka, outsideDhaka, freeDeliveryMin } = body;

    let settings = await db.deliverySettings.findFirst();

    if (!settings) {
      settings = await db.deliverySettings.create({
        data: {
          insideDhaka: parseFloat(insideDhaka),
          outsideDhaka: parseFloat(outsideDhaka),
          freeDeliveryMin: parseFloat(freeDeliveryMin),
        },
      });
    } else {
      settings = await db.deliverySettings.update({
        where: { id: settings.id },
        data: {
          insideDhaka: parseFloat(insideDhaka),
          outsideDhaka: parseFloat(outsideDhaka),
          freeDeliveryMin: parseFloat(freeDeliveryMin),
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update delivery settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
