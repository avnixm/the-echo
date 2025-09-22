import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verifyPassword, createSessionToken } from "@/lib/auth";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(100),
	remember: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
	try {
		const json: unknown = await req.json();
		const { email, password, remember } = LoginSchema.parse(json);

		const user = await db.query.users.findFirst({ where: eq(users.email, email) });
		if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

		if (!user.verified) {
			return NextResponse.json({ error: "Account pending admin approval" }, { status: 403 });
		}

		const valid = await verifyPassword(password, user.passwordHash);
		if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

		const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30d or 1d
		const token = await createSessionToken({
			userId: user.id,
			role: (user.role as "admin" | "journalist") ?? "journalist",
			name: user.name,
			email: user.email,
		}, maxAge);

		await db.insert(sessions).values({ userId: user.id, jti: token, expiresAt: new Date(Date.now() + maxAge * 1000) });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      maxAge,
      path: "/",
    });
		return res;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Invalid request";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}


