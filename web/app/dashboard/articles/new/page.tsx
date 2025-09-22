"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/articles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, body, featuredImageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      toast("Article created");
      window.location.href = "/dashboard/articles";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="py-8 max-w-2xl mx-auto">
      <h1 className="headline-serif text-3xl font-black">New Article</h1>
      <div className="section-rule mt-3"></div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Slug</label>
          <input className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Featured Image URL</label>
          <input className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Body (Markdown)</label>
          <textarea className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 min-h-64" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={saving} className="rounded bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800 disabled:opacity-60">
          {saving ? "Saving..." : "Create"}
        </button>
      </form>
    </main>
  );
}


