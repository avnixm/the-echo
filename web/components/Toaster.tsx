"use client";

import { useEffect, useState } from "react";

type ToastMsg = { id: number; message: string };

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const custom = e as CustomEvent<{ message: string }>;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: custom.detail.message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
    }
    window.addEventListener("toast", handler as EventListener);
    return () => window.removeEventListener("toast", handler as EventListener);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="rounded bg-blue-700 text-white px-3 py-2 shadow">
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function toast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toast", { detail: { message } }));
  }
}


