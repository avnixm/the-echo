import { requireRole } from "@/lib/session";
import { db } from "@/db/client";
import { users, articles } from "@/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const [journalistsCount, pendingCount, approvedCount] = await Promise.all([
    db.$count(users, eq(users.role, "journalist" as any)).catch(async () => (await db.query.users.findMany({ where: eq(users.role, "journalist") })).length),
    db.$count(articles, isNull(articles.publishedAt)).catch(async () => (await db.query.articles.findMany({ where: isNull(articles.publishedAt) })).length),
    db.$count(articles, isNotNull(articles.publishedAt)).catch(async () => (await db.query.articles.findMany({ where: isNotNull(articles.publishedAt) })).length),
  ]);

  return (
    <main className="py-8">
      <h1 className="headline-serif text-3xl font-black">Admin Dashboard</h1>
      <div className="section-rule mt-3"></div>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="border rounded p-4"><div className="text-sm text-neutral-600">Journalists</div><div className="text-2xl font-bold">{journalistsCount}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-neutral-600">Pending Articles</div><div className="text-2xl font-bold">{pendingCount}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-neutral-600">Approved Articles</div><div className="text-2xl font-bold">{approvedCount}</div></div>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        <Link href="/admin/users" className="border rounded p-5 hover:bg-neutral-50">
          <div className="text-xl font-bold">Users</div>
          <div className="text-sm text-neutral-600">Manage journalist accounts.</div>
        </Link>
        <Link href="/admin/approvals" className="border rounded p-5 hover:bg-neutral-50">
          <div className="text-xl font-bold">Approvals</div>
          <div className="text-sm text-neutral-600">Review and approve pending articles.</div>
        </Link>
      </div>
    </main>
  );
}



