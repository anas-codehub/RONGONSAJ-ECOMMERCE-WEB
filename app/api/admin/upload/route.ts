import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "product";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 20MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Transformation based on type
    const transformation =
      type === "slide"
        ? {
            // Slides: always exactly 1920x600, cropped and centered
            width: 1920,
            height: 600,
            crop: "fill" as const,
            gravity: "center" as const,
            quality: 95,
            fetch_format: "auto" as const,
          }
        : type === "profile"
        ? {
            // Profile pictures: always exactly 200x200
            width: 200,
            height: 200,
            crop: "fill" as const,
            gravity: "face" as const,
            quality: 90,
            fetch_format: "auto" as const,
          }
        : {
            // Products: always exactly 800x800, cropped and centered
            width: 800,
            height: 800,
            crop: "fill" as const,
            gravity: "center" as const,
            quality: 90,
            fetch_format: "auto" as const,
          };

    const folder =
      type === "slide"
        ? "rongonsaaj/slides"
        : type === "profile"
        ? "rongonsaaj/profiles"
        : "rongonsaaj/products";

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            transformation: [transformation],
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}