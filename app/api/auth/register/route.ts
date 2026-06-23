import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json();

if (!name || !phone || !password) {
  return NextResponse.json(
    { error: "All fields are required" },
    { status: 400 }
  );
}


    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    

    // Check existing phone
    if (phone) {
      const existingPhone = await db.user.findFirst({ where: { phone } });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        
        phone,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json({
      message: "Account created successfully!",
      userId: user.id,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}