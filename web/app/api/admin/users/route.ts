import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, articles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export async function GET() {
  await requireRole("admin");
  const rows = await db.query.users.findMany();
  return NextResponse.json(rows.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, verified: u.verified })));
}

export async function PUT(req: NextRequest) {
  await requireRole("admin");
  const body = await req.json();
  const id = typeof body.id === 'number' ? body.id : Number(body.id);
  const role = body.role as string | undefined;
  const verified = typeof body.verified === 'boolean' ? body.verified : undefined;
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const updates: Partial<typeof users.$inferInsert> = {};
  if (role && ["admin", "journalist"].includes(role)) updates.role = role;
  if (typeof verified === 'boolean') updates.verified = verified;
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  await db.update(users).set(updates).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  await requireRole("admin");
  const { id } = await req.json();
  if (typeof id !== "number") return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  // Remove authored content first to avoid NOT NULL author_id constraint
  await db.delete(articles).where(eq(articles.authorId, id));
  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}

// Handle HTML form submissions from the admin page
export async function POST(req: NextRequest) {
  await requireRole("admin");
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    // Fallback to PUT/DELETE semantics for JSON
    const body = await req.json();
    const id = typeof body.id === 'number' ? body.id : Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    if (body.delete === true) {
      await db.delete(users).where(eq(users.id, id));
      return NextResponse.json({ ok: true });
    }
    const updates: Partial<typeof users.$inferInsert> = {};
    if (typeof body.role === 'string' && ["admin", "journalist"].includes(body.role)) updates.role = body.role;
    if (typeof body.verified === 'boolean') updates.verified = body.verified;
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    await db.update(users).set(updates).where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  }
  // FormData branch
  const fd = await req.formData();
  const id = Number(fd.get("id"));
  if (!id || Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const doDelete = String(fd.get("delete") || "").toLowerCase() === "true";
  if (doDelete) {
    await db.delete(articles).where(eq(articles.authorId, id));
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  }
  const role = fd.get("role");
  const verified = fd.get("verified");
  const updates: Partial<typeof users.$inferInsert> = {};
  if (typeof role === 'string' && ["admin", "journalist"].includes(role)) updates.role = role;
  if (typeof verified === 'string') updates.verified = verified === 'true';
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  await db.update(users).set(updates).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}


