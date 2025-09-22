"use client";

import { useEffect } from "react";
import { toast } from "@/components/Toaster";

export default function ToastOnSubmit({ formId, message }: { formId: string; message: string }) {
  useEffect(() => {
    const el = document.getElementById(formId) as HTMLFormElement | null;
    if (!el) return;
    const handler = () => toast(message);
    el.addEventListener("submit", handler);
    return () => el.removeEventListener("submit", handler);
  }, [formId, message]);
  return null;
}


