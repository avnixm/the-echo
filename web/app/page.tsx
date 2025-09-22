import Link from "next/link";
import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { desc, isNotNull } from "drizzle-orm";

export default async function Home() {
  const rows = await db.query.articles.findMany({
    where: isNotNull(articles.publishedAt),
    orderBy: [desc(articles.publishedAt), desc(articles.createdAt)],
    limit: 13,
  });
  const [hero, ...rest] = rows;
  return (
    <main className="py-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {hero ? (
            <article>
              <Link href={`/articles/${hero.slug}`} className="block group">
                <div className="relative rounded-lg overflow-hidden">
                  <div
                    className="aspect-[16/9] bg-neutral-200"
                    style={{
                      backgroundImage: hero.featuredImageUrl ? `url(${hero.featuredImageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="headline-serif text-3xl sm:text-5xl font-black leading-tight text-white group-hover:underline">
                      {hero.title}
                    </h2>
                    <p className="deck mt-2 max-w-2xl line-clamp-3 text-neutral-100">
                      {hero.body.slice(0, 200)}{hero.body.length > 200 ? "…" : ""}
                    </p>
                    <div className="byline mt-2 text-xs text-neutral-200">
                      {hero.publishedAt ? new Date(hero.publishedAt).toLocaleDateString() : "Draft"}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="section-rule mt-4"></div>
            </article>
          ) : (
            <article>
              <h2 className="headline-serif text-4xl sm:text-5xl font-black leading-tight">No stories yet</h2>
              <div className="section-rule mt-4"></div>
            </article>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((a) => (
              <article key={a.id} className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                <div className="aspect-video bg-neutral-100" />
                <div className="p-4">
                  <Link href={`/articles/${a.slug}`} className="block">
                    <h3 className="text-xl font-extrabold tracking-tight headline-serif">{a.title}</h3>
                  </Link>
                  <p className="mt-2 text-sm text-neutral-700 line-clamp-3">{a.body.slice(0, 160)}{a.body.length > 160 ? "…" : ""}</p>
                  <div className="mt-3 text-xs text-neutral-500">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "Draft"}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/sections/news" className="px-4 py-2 rounded border border-neutral-300 text-sm font-semibold hover:bg-neutral-50">More news</Link>
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <h5 className="text-xs font-black uppercase tracking-widest">Trending</h5>
            <div className="section-rule mt-2"></div>
            <ul className="mt-3 space-y-3">
              {rows.slice(0, 8).map((a, i) => (
                <li key={a.id} className="flex gap-2">
                  <span className="text-neutral-400 w-6 text-right">{i + 1}.</span>
                  <Link href={`/articles/${a.slug}`} className="hover:underline headline-serif">{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black uppercase tracking-widest">Editor’s Picks</h5>
            <div className="section-rule mt-2"></div>
            <ul className="mt-3 space-y-3">
              {rows.slice(8, 13).map((a) => (
                <li key={a.id}>
                  <Link href={`/articles/${a.slug}`} className="hover:underline headline-serif">{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
