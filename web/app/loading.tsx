"use client";

import { Loader } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center min-h-[70vh]" aria-label="Loading">
      <Loader className="h-6 w-6 text-neutral-500 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}


