import type { Metadata } from "next";
import "../globals.css";
import JournalistNav from "@/components/JournalistNav";

export const metadata: Metadata = {
  title: "The Echo • Journalist",
};

export default function JournalistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black tracking-wide">The Echo</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Journalist</span>
          </div>
          <a href="/" className="text-sm hover:underline">Back to site</a>
        </div>
        <div className="section-rule mt-3"></div>
        <JournalistNav />
      </header>
      {children}
      <footer className="py-8 mt-12 section-rule text-xs text-neutral-600">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} The Echo</span>
          <span className="">Journalist workspace</span>
        </div>
      </footer>
    </div>
  );
}



