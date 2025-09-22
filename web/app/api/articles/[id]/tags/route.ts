import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { articleTags } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const rows = await db.query.articleTags.findMany({ where: eq(articleTags.articleId, id) });
  return NextResponse.json(rows.map(r => r.tag));
}



