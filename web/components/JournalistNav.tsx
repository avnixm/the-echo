"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const LogoutButton = dynamic(() => import("@/components/LogoutButton"), { ssr: false });

export default function JournalistNav() {
  const pathname = usePathname();
  const isAuth = pathname === "/journalist/login" || pathname === "/journalist/register";

  if (isAuth) return null;

  return (
    <nav className="mt-3 flex items-center gap-4 text-sm font-semibold">
      <a href="/journalist/dashboard" className="hover:underline">Dashboard</a>
      <a href="/journalist/articles" className="hover:underline">My Articles</a>
      <span className="ml-auto"></span>
      <LogoutButton redirectTo="/" />
    </nav>
  );
}



