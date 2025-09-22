import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SessionUser = {
  userId: number;
  role: "admin" | "journalist";
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    // Always load fresh user data from DB so role/name updates take effect immediately
    const user = await db.query.users.findFirst({ where: eq(users.id, payload.userId) });
    if (!user) return null;
    return {
      userId: user.id,
      role: (user.role as any) || "journalist",
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(required: "admin" | "journalist") {
  const user = await requireUser();
  if (required === "admin" && user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}


