import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

const ListSchema = z.object({
	limit: z.coerce.number().min(1).max(50).default(12),
	offset: z.coerce.number().min(0).default(0),
});

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const parsed = ListSchema.safeParse({
		limit: searchParams.get("limit") ?? undefined,
		offset: searchParams.get("offset") ?? undefined,
	});
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid params" }, { status: 400 });
	}
	const { limit, offset } = parsed.data;
	const rows = await db.query.articles.findMany({
		limit,
		offset,
		orderBy: [desc(articles.publishedAt), desc(articles.createdAt)],
	});
	return NextResponse.json(rows);
}


