import { requireUser } from "@/lib/session";
import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function MyArticlesPage() {
  const user = await requireUser();
  const rows = await db.query.articles.findMany({
    where: eq(articles.authorId, user.userId),
    orderBy: [desc(articles.createdAt)],
  });

  return (
    <main className="py-8">
      <div className="flex items-center justify-between">
        <h1 className="headline-serif text-3xl font-black">My Articles</h1>
        <Link href="/dashboard/articles/new" className="rounded bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800">New Article</Link>
      </div>
      <div className="section-rule mt-3"></div>
      <ul className="mt-6 space-y-4">
        {rows.map((a) => (
          <li key={a.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-bold">{a.title}</div>
              <div className="text-xs text-neutral-600">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "Draft"}</div>
            </div>
            <div className="flex gap-3">
              <Link href={`/dashboard/articles/${a.id}`} className="text-blue-700 hover:underline">Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


