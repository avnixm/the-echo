import { db } from "@/db/client";
import { articles, articleTags, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

interface Props { params: Promise<{ category: string }>; }

export default async function NewsCategoryPage({ params }: Props) {
  const { category } = await params;
  const rows = await db
    .select({ id: articles.id, slug: articles.slug, title: articles.title, body: articles.body, featured: articles.featuredImageUrl, publishedAt: articles.publishedAt, authorId: articles.authorId })
    .from(articles)
    .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
    .where(eq(articles.status, "approved"))
    .where(eq(articleTags.tag, category))
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
    .limit(60);

  const authorsMap = new Map<number, { name: string }>();
  for (const a of rows) {
    if (!authorsMap.has(a.authorId)) {
      const u = await db.query.users.findFirst({ where: eq(users.id, a.authorId) });
      if (u) authorsMap.set(a.authorId, { name: u.name });
    }
  }

  const title = category.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());

  return (
    <main className="py-8">
      <h1 className="headline-serif text-4xl font-black">{title}</h1>
      <div className="section-rule mt-3"></div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => (
          <article key={a.id} className="border rounded overflow-hidden">
            <div className="aspect-video bg-neutral-100" style={{ backgroundImage: a.featured ? `url(${a.featured})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="p-4">
              <Link href={`/articles/${a.slug}`} className="headline-serif text-xl font-bold hover:underline block">{a.title}</Link>
              <div className="text-xs text-neutral-600 mt-1">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""} • {authorsMap.get(a.authorId)?.name || ""}</div>
              <p className="deck mt-2 line-clamp-3">{a.body.slice(0, 160)}{a.body.length > 160 ? "…" : ""}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}


