import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	const token = req.cookies.get("session")?.value;
	const res = NextResponse.json({ ok: true });
	res.cookies.set("session", "", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/" });
	if (token) {
		await db.delete(sessions).where(eq(sessions.jti, token));
	}
	return res;
}


