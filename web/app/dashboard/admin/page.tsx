import { requireRole } from "@/lib/session";
import { cookies, headers } from "next/headers";
import ActionForm from "@/components/ActionForm";

async function PendingList() {
  const cookieHeader = (await cookies()).toString();
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/admin/pending`, { cache: "no-store", headers: { cookie: cookieHeader } });
  const items = res.ok ? await res.json() : [];
  return (
    <div>
      <div className="text-xl font-bold">Pending Articles</div>
      <ul className="mt-3 space-y-3">
        {items.map((a: { id: number; title: string }) => (
          <li key={a.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-xs text-neutral-600">ID {a.id}</div>
            </div>
            <ActionForm id={`approve-${a.id}`} action="/api/admin/pending" successMessage="Approved article">
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="approve" value="true" />
              <button className="rounded bg-blue-700 text-white px-3 py-1 text-sm">Approve</button>
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function UsersList() {
  const cookieHeader = (await cookies()).toString();
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/admin/users`, { cache: "no-store", headers: { cookie: cookieHeader } });
  const users = res.ok ? await res.json() : [];
  return (
    <div>
      <div className="text-xl font-bold">Users</div>
      <ul className="mt-3 space-y-3">
        {users.map((u: { id: number; name: string; email: string; role: "admin" | "journalist"; verified: boolean }) => (
          <li key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{u.name} <span className="text-xs text-neutral-600">({u.email})</span></div>
              <div className="text-xs text-neutral-600">Role: {u.role} • {u.verified ? "Approved" : "Pending"}</div>
            </div>
            <div className="flex gap-2">
              <ActionForm id={`role-${u.id}`} action="/api/admin/users" successMessage="Role updated">
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="role" value={u.role === 'admin' ? 'journalist' : 'admin'} />
                <button className="rounded border px-3 py-1 text-sm">Toggle Role</button>
              </ActionForm>
              {!u.verified && (
                <ActionForm id={`verify-${u.id}`} action="/api/admin/users" successMessage="User approved">
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="verified" value="true" />
                  <button className="rounded border px-3 py-1 text-sm bg-blue-700 text-white">Approve User</button>
                </ActionForm>
              )}
              <ActionForm id={`delete-${u.id}`} action="/api/admin/users" successMessage="User deleted">
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="delete" value="true" />
                <button className="rounded border px-3 py-1 text-sm text-red-600">Delete</button>
              </ActionForm>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function AdminPage() {
  await requireRole("admin");
  return (
    <main className="py-8 space-y-10">
      <h1 className="headline-serif text-3xl font-black">Admin</h1>
      <div className="section-rule"></div>
      {/* Server components fetching */}
      {await PendingList()}
      {await UsersList()}
    </main>
  );
}


