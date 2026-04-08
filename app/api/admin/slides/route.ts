import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const slides = await db.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(slides);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image, title, subtitle, buttonText, buttonLink, order } = body;

    if (!image || !title) {
      return NextResponse.json(
        { error: "Image and title are required" },
        { status: 400 }
      );
    }

    const slide = await db.heroSlide.create({
      data: {
        image,
        title,
        subtitle: subtitle || "",
        buttonText: buttonText || "",
        buttonLink: buttonLink || "",
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}