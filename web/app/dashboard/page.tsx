import { requireUser } from "@/lib/session";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";

  return (
    <main className="py-8">
      <h1 className="headline-serif text-3xl font-black">Dashboard</h1>
      <div className="section-rule mt-3"></div>
      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <Link href="/dashboard/articles" className="border rounded p-5 hover:bg-neutral-50">
          <div className="text-xl font-bold">My Articles</div>
          <div className="text-sm text-neutral-600">Create and edit your stories.</div>
        </Link>
        {isAdmin && (
          <Link href="/dashboard/admin" className="border rounded p-5 hover:bg-neutral-50">
            <div className="text-xl font-bold">Admin</div>
            <div className="text-sm text-neutral-600">Approve articles and manage users.</div>
          </Link>
        )}
      </div>
    </main>
  );
}


