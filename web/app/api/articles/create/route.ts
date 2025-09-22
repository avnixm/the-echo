import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { articles, articleTags } from "@/db/schema";
import { z } from "zod";
import { requireRole } from "@/lib/session";

const Schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  body: z.string().min(10),
  featuredImageUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole("journalist");
    const json: unknown = await req.json();
    const input = Schema.parse(json);

    // Generate slug if not provided
    let slug = input.slug?.trim();
    if (!slug || slug.length === 0) {
      const base = input.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80);
      let candidate = base || "article";
      let i = 0;
      // ensure uniqueness
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const exists = await db.query.articles.findFirst({ where: (articles, { eq }) => eq(articles.slug, candidate) });
        if (!exists) break;
        i += 1;
        candidate = `${base}-${i}`;
      }
      slug = candidate;
    }

    const [row] = await db.insert(articles).values({
      title: input.title,
      slug,
      body: input.body,
      featuredImageUrl: input.featuredImageUrl,
      isFeatured: input.isFeatured ?? false,
      authorId: user.userId,
    }).returning();
    if (input.tags && input.tags.length > 0) {
      await db.insert(articleTags).values(input.tags.map(tag => ({ articleId: row.id, tag })));
    }
    return NextResponse.json(row);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad request";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}


