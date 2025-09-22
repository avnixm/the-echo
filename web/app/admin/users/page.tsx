import { requireRole } from "@/lib/session";
import ActionForm from "@/components/ActionForm";
import { cookies, headers } from "next/headers";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const cookieHeader = (await cookies()).toString();
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/admin/users`, { cache: "no-store", headers: { cookie: cookieHeader } });
  const users = res.ok ? await res.json() : [];

  return (
    <main className="py-8">
      <h1 className="headline-serif text-3xl font-black">Users</h1>
      <div className="section-rule mt-3"></div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-600">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Approved</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.role}</td>
                <td className="py-2 pr-4">{u.verified ? "Yes" : "No"}</td>
                <td className="py-2 pr-4">
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
                        <button className="rounded border px-3 py-1 text-sm bg-blue-700 text-white">Approve</button>
                      </ActionForm>
                    )}
                    <ActionForm id={`delete-${u.id}`} action="/api/admin/users" successMessage="User deleted">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="delete" value="true" />
                      <button className="rounded border px-3 py-1 text-sm text-red-600">Delete</button>
                    </ActionForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}



