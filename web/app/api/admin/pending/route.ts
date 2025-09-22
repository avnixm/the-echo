import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { articles, users, articleTags } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export async function GET() {
  await requireRole("admin");
  const rows = await db.query.articles.findMany({ where: isNull(articles.publishedAt) });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await requireRole("admin");
  let id: number | undefined;
  let approve = true;
  let reason: string | undefined;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({} as any));
    id = typeof body.id === "number" ? body.id : Number(body.id);
    approve = body.approve !== false;
    reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : undefined;
  } else {
    const fd = await req.formData();
    id = Number(fd.get("id"));
    approve = String(fd.get("approve") ?? "true") !== "false";
    const r = fd.get("reason");
    reason = typeof r === "string" ? r.slice(0, 500) : undefined;
  }
  if (!id || Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await db
    .update(articles)
    .set({ publishedAt: approve ? new Date() : null })
    .where(eq(articles.id, id));

  // Manage rejection marker via tags so we avoid schema changes
  // Remove previous rejection tags
  await db.delete(articleTags).where(and(eq(articleTags.articleId, id), eq(articleTags.tag, "rejected")));
  await db.delete(articleTags).where(and(eq(articleTags.articleId, id), eq(articleTags.tag, "rejection:")));
  if (!approve) {
    await db.insert(articleTags).values({ articleId: id, tag: "rejected" });
    if (reason && reason.trim().length > 0) {
      await db.insert(articleTags).values({ articleId: id, tag: "rejection:" + reason.trim() });
    }
  }
  return NextResponse.json({ ok: true });
}


