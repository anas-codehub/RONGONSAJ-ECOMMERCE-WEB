import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const colors = await db.color.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(colors);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, hex } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existing = await db.color.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json({ error: "Color already exists" }, { status: 400 });
    }

    const color = await db.color.create({
      data: {
        name: name.trim(),
        hex: hex || "#000000",
      },
    });

    return NextResponse.json(color);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await db.color.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}