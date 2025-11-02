"use client";
import * as React from "react";
import { bgRollback } from "@/apis/bluegreen";

const DNS1123 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

type Props = {
  initial?: { name?: string };
  onClose: () => void;
  afterSubmit?: () => void;
};

export default function RollbackModal({ initial, onClose, afterSubmit }: Props) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const nameOk = DNS1123.test(name.trim());
  const canSubmit = nameOk && !submitting;

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  async function submit() {
    try {
      setSubmitting(true);
      setError(null);
      setNotice(null);

      await bgRollback({ name: name.trim() });
      setNotice("✅ Rollback submitted successfully");
      afterSubmit?.();
      onClose();
    } catch (e: any) {
      setError("❌ Rollback failed: " + (e?.message || String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 mx-auto w-full max-w-md">
      <div className="w-full max-w-md bg-[#0a1625] border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)] p-6 text-white relative">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">Rollback</h3>

        {error && (
          <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}
        {notice && (
          <div className="border border-cyan-600/40 bg-cyan-900/20 text-cyan-300 text-sm rounded-lg px-4 py-2 mb-4">
            {notice}
          </div>
        )}

        <label className="text-sm font-medium text-white/70">App name</label>
        <input
          className="mt-1 mb-2 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
          placeholder="my-app"
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase())}
        />
        {!nameOk && name.length > 0 && (
          <p className="text-xs text-white/60 mb-2">
            must match DNS-1123: lowercase, digits, dashes; can’t start/end with “-”.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={`px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              canSubmit
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                : "bg-cyan-900/40 text-white/40 cursor-not-allowed"
            }`}
          >
            {submitting && <Spinner />}
            {submitting ? "Rolling back…" : "Rollback"}
          </button>
        </div>
      </div>
    </div>
  );
}
