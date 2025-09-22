"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";

export default function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to logout");
      toast("Signed out");
      window.location.href = redirectTo;
    } catch (err) {
      toast("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} className="text-sm hover:underline" disabled={loading}>
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}



