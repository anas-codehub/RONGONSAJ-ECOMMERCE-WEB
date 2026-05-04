import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sizes = await db.size.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(sizes);
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

    const { label, type } = await req.json();

    if (!label?.trim()) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const existing = await db.size.findFirst({
      where: { label: { equals: label.trim(), mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json({ error: "Size already exists" }, { status: 400 });
    }

    const size = await db.size.create({
      data: {
        label: label.trim().toUpperCase(),
        type: type || "letter",
      },
    });

    return NextResponse.json(size);
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
    await db.size.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}