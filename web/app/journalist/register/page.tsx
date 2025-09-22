"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function JournalistRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      alert("Registration submitted. An admin must approve your account before you can sign in.");
      window.location.href = "/journalist/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-10 max-w-md mx-auto">
      <h1 className="headline-serif text-3xl font-black">Journalist Register</h1>
      <div className="section-rule mt-3"></div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input type="email" className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold">Password</label>
          <input type="password" className="mt-1 w-full rounded border border-neutral-300 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-700 text-white py-2 font-semibold hover:bg-blue-800 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </main>
  );
}


