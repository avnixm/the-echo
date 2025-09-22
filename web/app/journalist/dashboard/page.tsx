import { requireUser } from "@/lib/session";
import Link from "next/link";

export default async function JournalistDashboardPage() {
  const user = await requireUser();

  return (
    <main className="py-8">
      <h1 className="headline-serif text-3xl font-black">Journalist Dashboard</h1>
      <div className="section-rule mt-3"></div>
      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <Link href="/journalist/articles" className="border rounded p-5 hover:bg-neutral-50">
          <div className="text-xl font-bold">My Articles</div>
          <div className="text-sm text-neutral-600">Create and edit your stories.</div>
        </Link>
        <div className="border rounded p-5">
          <div className="text-xl font-bold">Account</div>
          <div className="text-sm text-neutral-600 mt-1">Signed in as {user.name} ({user.email})</div>
        </div>
      </div>
    </main>
  );
}



