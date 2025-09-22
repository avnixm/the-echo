"use client";

import Link from "next/link";

export default function NavBar() {
  const showJournalist = true;

  return (
    <nav className="mt-3 flex items-center gap-6 text-sm font-semibold relative">
      <Link href="/announcement" className="hover:underline">Announcement</Link>

      <div className="group relative">
        <button className="hover:underline inline-flex items-center gap-1">News <span aria-hidden>▾</span></button>
        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute z-50 mt-2 w-56 rounded-md border border-neutral-200 bg-white shadow-lg p-2">
          <div className="grid grid-cols-1 gap-1">
            <Link href="/news/sports" className="px-3 py-2 rounded hover:bg-neutral-50">Sports</Link>
            <Link href="/news/science-health" className="px-3 py-2 rounded hover:bg-neutral-50">Science &amp; Health</Link>
            <Link href="/sections/culture" className="px-3 py-2 rounded hover:bg-neutral-50">Culture</Link>
            <Link href="/sections/opinion" className="px-3 py-2 rounded hover:bg-neutral-50">Opinion</Link>
          </div>
        </div>
      </div>

      <div className="ml-auto" />
      {showJournalist && (
        <>
          <Link href="/journalist/login" className="hover:underline">Journalist</Link>
          <Link href="/admin/login" className="hover:underline">Admin</Link>
        </>
      )}
    </nav>
  );
}


