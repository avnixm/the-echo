import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, otpCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateOtpCode, generateOtpToken, hashOtp } from "@/lib/otp";

const Schema = z.object({ email: z.string().email(), purpose: z.enum(["login", "register"]) });

export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const { email, purpose } = Schema.parse(json);
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user && purpose === "login") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // For register, create a placeholder user if not exists
    const ensuredUser = user ?? (await db.insert(users).values({ name: email.split("@")[0], email, passwordHash: "otp-only", role: "journalist" }).returning())[0];
    const code = generateOtpCode();
    const token = generateOtpToken();
    const codeHash = await hashOtp(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.insert(otpCodes).values({ userId: ensuredUser.id, otpToken: token, codeHash, purpose, expiresAt });
    // In production, send via email/SMS. For dev, return the code.
    return NextResponse.json({ otpToken: token, devCode: code });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

