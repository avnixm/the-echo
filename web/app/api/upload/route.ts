import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";

// Simple local dev upload: stores in /public/uploads (ensure dir exists in dev)
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await requireUser();
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const blob = file as unknown as File;
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${blob.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFile(filepath, buffer);
  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}


