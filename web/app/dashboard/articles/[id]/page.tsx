"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/Toaster";

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/articles/${id}`);
      if (res.ok) {
        const a = await res.json();
        setTitle(a.title || "");
        setBody(a.body || "");
        setFeaturedImageUrl(a.featuredImageUrl || "");
      }
    })();
  }, [id]);

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setFeaturedImageUrl(data.url);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, featuredImageUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast("Article saved");
      window.location.href = "/dashboard/articles";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="py-8 max-w-2xl mx-auto">
      <h1 className="headline-serif text-3xl font-black">Edit Article</h1>
      <div className="section-rule mt-3"></div>
      <form onSubmit={save} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Featured Image</label>
          <div className="mt-1 flex items-center gap-3">
            <input className="flex-1 w-full rounded border border-neutral-300 px-3 py-2" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} placeholder="/uploads/... or https://..." />
            <input type="file" accept="image/*" onChange={uploadImage} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold">Body (Markdown)</label>
          <textarea className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 min-h-64" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={saving} className="rounded bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800 disabled:opacity-60">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}


