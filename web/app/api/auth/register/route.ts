import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";

const RegisterSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email(),
	password: z.string().min(8).max(100),
});

export async function GET() {
    return new NextResponse("Method Not Allowed", {
        status: 405,
        headers: { Allow: "POST, OPTIONS" },
    });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: { Allow: "POST, OPTIONS" },
    });
}

export async function POST(req: NextRequest) {
	try {
		const json: unknown = await req.json();
		const { name, email, password } = RegisterSchema.parse(json);

		const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
		if (existing) {
			return NextResponse.json({ error: "Email already in use" }, { status: 400 });
		}

		const passwordHash = await hashPassword(password);
		const [inserted] = await db.insert(users).values({ name, email, passwordHash, verified: false }).returning();
		return NextResponse.json({ id: inserted.id, name: inserted.name, email: inserted.email, pending: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Invalid request";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}


