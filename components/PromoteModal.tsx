"use client";
import * as React from "react";
import { bgPromote } from "@/apis/bluegreen"; // ثبّت المسار
const DNS1123 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

type Props = {
  initial?: { name?: string }; // لا نحتاج namespace مطلقًا
  onClose: () => void;
  afterSubmit?: () => void;
};

export default function PromoteModal({ initial, onClose, afterSubmit }: Props) {
  const [name, setName] = React.useState(initial?.name ?? "");
  
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const nameOk = DNS1123.test(name.trim());
  const canSubmit = nameOk && !submitting;

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  async function submit() {
    try {
      setSubmitting(true);
      setError(null);
      setNotice(null);

      await bgPromote({ name: name.trim() }); // ← الاسم فقط؛ الـns من JWT
      setNotice("Promote submitted ✅");
      afterSubmit?.();
      onClose();
    } catch (e: any) {
      setError("Promote failed: " + (e?.message || String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-zinc-900 text-zinc-100 rounded-2xl p-5 w-[420px] shadow-xl">
        <div className="text-lg font-semibold mb-3">Promote</div>

        {error && (
          <div className="text-rose-300 bg-rose-900/30 border border-rose-800 rounded-lg p-2 text-sm mb-3">
            {error}
          </div>
        )}
        {notice && (
          <div className="text-sky-300 bg-sky-900/30 border border-sky-800 rounded-lg p-2 text-sm mb-3">
            {notice}
          </div>
        )}

        <label className="text-sm">App name</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-800 px-3 py-2 outline-none"
          placeholder="my-app"
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase())}
        />
        {!nameOk && name.length > 0 && (
          <p className="text-xs text-white/60 mb-2">
            must match DNS-1123: lowercase, digits, dashes; can’t start/end with “-”.
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost border border-white/20 text-white/80 hover:text-white h-9 px-4" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            disabled={!canSubmit}


            onClick={submit}
            className="btn btn-primary h-9 px-4 flex items-center gap-2"
            title="Promote preview to production"
          >
            {submitting && <Spinner />}
            {submitting ? "Promoting…" : "Promote"}
          </button>
        </div>
      </div>
    </div>
  );
}
