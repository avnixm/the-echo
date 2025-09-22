import { db } from "@/db/client";
import { articles, users, articleTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;
    const article = await db.query.articles.findFirst({ where: eq(articles.slug, slug) });

	if (!article) {
		return (
			<main className="py-10">
				<p>Article not found.</p>
			</main>
		);
	}

    const author = await db.query.users.findFirst({ where: eq(users.id, article.authorId) });
    const tags = await db
        .select({ tag: articleTags.tag })
        .from(articleTags)
        .where(eq(articleTags.articleId, article.id));

    const words = article.body.trim().split(/\s+/).length;
    const readingMins = Math.max(1, Math.round(words / 200));

	return (
		<main className="py-10 max-w-3xl mx-auto">
			<div className="text-xs uppercase tracking-widest text-neutral-500">The Echo</div>
			<h1 className="mt-2 headline-serif text-5xl font-black leading-tight">{article.title}</h1>
            <div className="mt-3 byline text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>By {author?.name ?? "Staff"}</span>
                <span>• {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Draft"}</span>
                <span>• {readingMins} min read</span>
            </div>
			<div className="section-rule mt-4"></div>
            {article.featuredImageUrl && (
                <div className="mt-6">
                    <Image
                        src={article.featuredImageUrl}
                        alt={article.title}
                        width={1200}
                        height={630}
                        className="w-full h-auto rounded"
                        priority
                    />
                </div>
            )}
			<div className="prose-article mt-6 drop-cap">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
			</div>
            {tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                    {tags.map((t) => (
                        <a key={t.tag} href={`/sections/${t.tag}`} className="text-xs uppercase tracking-wider px-2 py-1 border rounded hover:bg-neutral-50">
                            {t.tag}
                        </a>
                    ))}
                </div>
            )}
		</main>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await db.query.articles.findFirst({ where: eq(articles.slug, slug) });
    if (!article) return { title: "Article not found" };
    const description = article.body.replace(/\s+/g, " ").slice(0, 160);
    return {
        title: `${article.title} • The Echo`,
        description,
        openGraph: {
            title: article.title,
            description,
            type: "article",
            images: article.featuredImageUrl ? [{ url: article.featuredImageUrl } as any] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description,
            images: article.featuredImageUrl ? [article.featuredImageUrl] : undefined,
        },
    };
}


