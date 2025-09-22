"use client";

import { useState } from "react";
import ActionForm from "@/components/ActionForm";

export default function RejectWithReason({ articleId }: { articleId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded border px-3 py-1 text-sm text-red-600">Reject</button>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden="true"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-4 border-b font-semibold">Reject Article</div>
            <ActionForm id={`reject-${articleId}`} action="/api/admin/pending" successMessage="Rejected article" className="p-4 space-y-3">
              <input type="hidden" name="id" value={articleId} />
              <input type="hidden" name="approve" value="false" />
              <label className="block text-sm font-medium">Reason (visible to journalist via admin):</label>
              <textarea name="reason" placeholder="Briefly explain why this article is rejected" className="w-full rounded border border-neutral-300 px-3 py-2 min-h-28" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded border px-3 py-1 text-sm">Cancel</button>
                <button className="rounded bg-red-600 text-white px-3 py-1 text-sm">Confirm Reject</button>
              </div>
            </ActionForm>
          </div>
        </div>
      )}
    </>
  );
}


