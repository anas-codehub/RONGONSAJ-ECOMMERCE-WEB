import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/ratelimits";


export async function POST(req: NextRequest) {

  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
const { success, minutesLeft } = checkRateLimit(ip);

if (!success) {
  return NextResponse.json(
    { error: `Too many attempts. Please try again in ${minutesLeft} minutes.` },
    { status: 429 }
  );
}
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Send welcome email
    await sendWelcomeEmail({ to: email, customerName: name });
    // Send welcome email
try {
  await sendWelcomeEmail({ to: email, customerName: name });
  console.log("Welcome email sent to:", email);
} catch (emailError) {
  console.error("Email error:", emailError);
}

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}