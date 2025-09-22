import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, otpCodes, sessions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { verifyOtp } from "@/lib/otp";
import { createSessionToken } from "@/lib/auth";

const Schema = z.object({ otpToken: z.string().min(10), code: z.string().min(4).max(10) });

export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const { otpToken, code } = Schema.parse(json);
    const row = await db.query.otpCodes.findFirst({ where: eq(otpCodes.otpToken, otpToken) });
    if (!row || row.consumed || row.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }
    const ok = await verifyOtp(code, row.codeHash);
    if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const user = await db.query.users.findFirst({ where: eq(users.id, row.userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Mark verified on register flow
    if (row.purpose === "register" && !user.verified) {
      await db.update(users).set({ verified: true }).where(eq(users.id, user.id));
    }

    const maxAge = 60 * 60 * 24 * 30;
    const token = await createSessionToken({ userId: user.id, role: (user.role as any) || "journalist", name: user.name, email: user.email }, maxAge);
    await db.insert(sessions).values({ userId: user.id, jti: token, expiresAt: new Date(Date.now() + maxAge * 1000) });
    await db.update(otpCodes).set({ consumed: true }).where(eq(otpCodes.id, row.id));

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge, path: "/" });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

