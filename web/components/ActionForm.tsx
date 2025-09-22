"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/Toaster";

type Props = {
  id: string;
  action: string;
  method?: "post" | "put" | "delete" | "patch";
  successMessage?: string;
  children: React.ReactNode;
  className?: string;
};

export default function ActionForm({ id, action, method = "post", successMessage, children, className }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    const res = await fetch(action, { method: method.toUpperCase(), body: fd as any });
    // Ignore JSON body; we only care about success
    if (res.ok) {
      if (successMessage) toast(successMessage);
      router.refresh();
    } else {
      try {
        const data = await res.json();
        toast(data?.error || "Request failed");
      } catch {
        toast("Request failed");
      }
    }
    setSubmitting(false);
  }

  return (
    <form id={id} action={action} method={method} onSubmit={onSubmit} className={className}>
      <div className="relative">
        {submitting && (
          <div className="absolute inset-0 grid place-items-center bg-white/60">
            <Loader2 className="animate-spin h-5 w-5 text-neutral-600" />
          </div>
        )}
        {children}
      </div>
    </form>
  );
}


