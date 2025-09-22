import { db } from "@/db/client";
import { articles, articleTags } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function AnnouncementPage() {
  const rows = await db
    .select({ id: articles.id, title: articles.title, slug: articles.slug, body: articles.body, publishedAt: articles.publishedAt })
    .from(articles)
    .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
    .where(eq(articles.status, "approved"))
    .where(eq(articleTags.tag, "announcement"))
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
    .limit(50);

  return (
    <main className="py-8">
      <h1 className="headline-serif text-4xl font-black">Announcements</h1>
      <div className="section-rule mt-3"></div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => (
          <article key={a.id} className="border rounded p-4">
            <Link href={`/articles/${a.slug}`} className="headline-serif text-xl font-bold hover:underline block">{a.title}</Link>
            <div className="text-xs text-neutral-600 mt-1">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""}</div>
            <p className="deck mt-2 line-clamp-3">{a.body.slice(0, 180)}{a.body.length > 180 ? "…" : ""}</p>
          </article>
        ))}
      </div>
    </main>
  );
}


