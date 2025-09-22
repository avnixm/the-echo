"use client";

import { use, useEffect, useState } from "react";
import { toast } from "@/components/Toaster";
import { Loader2 } from "lucide-react";

export default function JournalistEditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [status, setStatus] = useState<string>("pending");
  const [tags, setTags] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readOnly = status !== "pending";

  useEffect(() => {
    (async () => {
      const [aRes, tRes] = await Promise.all([
        fetch(`/api/articles/${id}`),
        fetch(`/api/articles/${id}/tags`),
      ]);
      if (aRes.ok) {
        const a = await aRes.json();
        setTitle(a.title || "");
        setBody(a.body || "");
        setFeaturedImageUrl(a.featuredImageUrl || "");
        setStatus(a.status || "pending");
      }
      if (tRes.ok) {
        const ts = await tRes.json();
        setTags((ts as string[]).join(", "));
      }
    })();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    setError(null);
    try {
      const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, featuredImageUrl, tags: tagList }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast("Article saved");
      window.location.href = "/journalist/articles";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="py-8 max-w-2xl mx-auto">
      <h1 className="headline-serif text-3xl font-black">{readOnly ? "View Article" : "Edit Article"}</h1>
      <div className="section-rule mt-3"></div>
      <form onSubmit={save} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input disabled={readOnly} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Featured Image</label>
          <input disabled={readOnly} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} placeholder="/uploads/... or https://..." />
        </div>
        <div>
          <label className="block text-sm font-semibold">Tags/Categories (comma-separated)</label>
          <input disabled={readOnly} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Body (Markdown)</label>
          <textarea disabled={readOnly} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 min-h-64" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!readOnly && (
        <button disabled={saving} className="rounded bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save"}
        </button>
        )}
      </form>
    </main>
  );
}



