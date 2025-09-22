"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isScoped = pathname?.startsWith("/journalist") || pathname?.startsWith("/admin");

  if (isScoped) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="py-8">
        <div className="flex items-center justify-between">
          <h1 className="masthead-title text-4xl sm:text-5xl font-black tracking-wide">The Echo</h1>
          <div className="text-xs uppercase tracking-widest text-neutral-500">Established 2025</div>
        </div>
        <div className="mt-4 section-rule"></div>
        <NavBar />
      </header>
      {children}
      <footer className="py-10 mt-16 section-rule text-sm text-neutral-600">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} The Echo</span>
          <span className="">Published weekly by the student press</span>
        </div>
      </footer>
    </div>
  );
}



