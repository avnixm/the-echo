import { db } from "@/db/client";
import { articles, articleTags } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

interface Props {
	params: Promise<{ section: string }>;
}

export default async function SectionPage({ params }: Props) {
	const { section } = await params;
	const title = section.charAt(0).toUpperCase() + section.slice(1);
    const rows = await db
        .select({
            id: articles.id,
            title: articles.title,
            body: articles.body,
            slug: articles.slug,
            featuredImageUrl: articles.featuredImageUrl,
        })
        .from(articles)
        .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
        .where(eq(articleTags.tag, section))
        .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
        .limit(20);

	return (
		<main className="py-8">
			<h1 className="headline-serif text-4xl font-black">{title}</h1>
			<div className="section-rule mt-3"></div>
			<div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{rows.map((a) => (
					<article key={a.id}>
						<h2 className="headline-serif text-2xl font-bold">{a.title}</h2>
						<p className="deck mt-1 line-clamp-3">{a.body.slice(0, 180)}...</p>
					</article>
				))}
			</div>
		</main>
	);
}


