import { requireRole } from "@/lib/session";
import ActionForm from "@/components/ActionForm";
import RejectWithReason from "@/components/RejectWithReason";
import { cookies, headers } from "next/headers";

export default async function AdminApprovalsPage() {
  await requireRole("admin");
  const cookieHeader = (await cookies()).toString();
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/admin/pending`, { cache: "no-store", headers: { cookie: cookieHeader } });
  const items = res.ok ? await res.json() : [];

  return (
    <main className="py-8">
      <h1 className="headline-serif text-3xl font-black">Approvals</h1>
      <div className="section-rule mt-3"></div>
      <ul className="mt-6 space-y-3">
        {items.map((a: any) => (
          <li key={a.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-neutral-600">Submitted on {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</div>
              </div>
              <div className="flex gap-2">
                <ActionForm id={`approve-${a.id}`} action="/api/admin/pending" successMessage="Approved article">
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="approve" value="true" />
                  <button className="rounded bg-blue-700 text-white px-3 py-1 text-sm">Approve</button>
                </ActionForm>
                <RejectWithReason articleId={a.id} />
              </div>
            </div>
            {a.body && <p className="deck mt-2 line-clamp-4">{a.body.slice(0, 300)}{a.body.length > 300 ? "…" : ""}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}



