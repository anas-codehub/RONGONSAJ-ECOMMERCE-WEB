import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    // Always return success even if user not found
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Delete any existing tokens for this email
    await db.passwordResetToken.deleteMany({ where: { email } });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to DB
    await db.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail({
      to: email,
      customerName: user.name || "there",
      resetUrl,
    });

    return NextResponse.json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}