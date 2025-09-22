"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const LogoutButton = dynamic(() => import("@/components/LogoutButton"), { ssr: false });

export default function AdminNav() {
  const pathname = usePathname();
  const isAuth = pathname === "/admin/login";

  if (isAuth) return null;

  return (
    <nav className="mt-3 flex items-center gap-4 text-sm font-semibold">
      <a href="/admin/dashboard" className="hover:underline">Dashboard</a>
      <a href="/admin/users" className="hover:underline">Users</a>
      <a href="/admin/approvals" className="hover:underline">Approvals</a>
      <span className="ml-auto"></span>
      <LogoutButton redirectTo="/" />
    </nav>
  );
}



