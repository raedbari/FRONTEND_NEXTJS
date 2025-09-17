"use client";
import * as React from "react";
import { bgPromote } from "../apis/bluegreen";
const DNS1123 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

type Props = {
  initial?: { name?: string; namespace?: string };
  onClose: () => void;
  afterSubmit?: () => void;
};

export default function PromoteModal({ initial, onClose, afterSubmit }: Props) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [ns, setNs] = React.useState(initial?.namespace ?? "project-env");
  const [submitting, setSubmitting] = React.useState(false);

  const nameOk = DNS1123.test(name.trim());
  const nsOk   = DNS1123.test(ns.trim());
  const canSubmit = nameOk && nsOk && !submitting;

async function submit() {
  try {
    setSubmitting(true);
    await bgPromote(name.trim(), ns.trim());   // 👈 بدلاً من postJSON
    alert("Promote done ✅");
    afterSubmit?.();
    onClose();
  } catch (e: any) {
    alert(`Promote failed: ${e?.message || e}`);
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 text-zinc-100 rounded-2xl p-5 w-[420px] shadow-xl">
        <div className="text-lg font-semibold mb-3">Promote</div>

        <label className="text-sm">App name</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-800 px-3 py-2 outline-none"
          placeholder="google-test"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label className="text-sm">Namespace</label>
        <input
          className="w-full mt-1 mb-4 rounded-lg bg-zinc-800 px-3 py-2 outline-none"
          placeholder="project-env"
          value={ns}
          onChange={e => setNs(e.target.value)}
        />

        <div className="flex gap-2 justify-end">
          <button className="px-3 py-2 rounded-lg bg-zinc-700" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            className={`px-3 py-2 rounded-lg ${canSubmit ? "bg-blue-600" : "bg-zinc-700/60"}`}
            onClick={submit}
          >
            {submitting ? "Working..." : "Promote"}
          </button>
        </div>
      </div>
    </div>
  );
}
