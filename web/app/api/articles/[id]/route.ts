import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { articles, articleTags } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUser, requireRole } from "@/lib/session";
import { z } from "zod";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idParam } = await params;
    const id = Number(idParam);
	if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const row = await db.query.articles.findFirst({ where: eq(articles.id, id) });
	if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(row);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    const user = await requireUser();
    const json: unknown = await req.json();
    const UpdateSchema = z.object({
      title: z.string().min(1).optional(),
      body: z.string().min(1).optional(),
      featuredImageUrl: z.string().url().optional(),
      isFeatured: z.boolean().optional(),
      tags: z.array(z.string().min(1)).optional(),
    });
    const parsed = UpdateSchema.parse(json);
    const updates: Partial<typeof articles.$inferInsert> = {
      title: parsed.title,
      body: parsed.body,
      featuredImageUrl: parsed.featuredImageUrl,
      isFeatured: parsed.isFeatured,
    };
    // Only allow journalists to edit if article is still pending
    const current = await db.query.articles.findFirst({ where: eq(articles.id, id) });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role !== "admin" && current.status !== "pending") {
      return NextResponse.json({ error: "Cannot edit approved/rejected articles" }, { status: 403 });
    }
    if (user.role === "admin") {
      await db.update(articles).set(updates).where(eq(articles.id, id));
    } else {
      await db.update(articles).set(updates).where(and(eq(articles.id, id), eq(articles.authorId, user.userId)));
    }
    if (parsed.tags) {
      // Reset tags for this article
      await db.delete(articleTags).where(eq(articleTags.articleId, id));
      if (parsed.tags.length > 0) {
        await db.insert(articleTags).values(parsed.tags.map(tag => ({ articleId: id, tag })));
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad request";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    await requireRole("admin");
    await db.delete(articles).where(eq(articles.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad request";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}


