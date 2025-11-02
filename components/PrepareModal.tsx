"use client";
import React from "react";
import { apiPost } from "@/lib/api";

export type PrepareSpec = {
  name: string;
  image: string;
  tag: string;
  port: number;
  health_path: string;
  replicas: number;
};

const DNS1123 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

export default function PrepareModal({
  initial,
  onClose,
  afterSubmit,
}: {
  initial: PrepareSpec;
  onClose: () => void;
  afterSubmit?: () => void;
}) {
  const [form, setForm] = React.useState<PrepareSpec>(initial);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof PrepareSpec>(k: K, v: PrepareSpec[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const nameTrim = (form.name || "").trim();
  const imgTrim = (form.image || "").trim();
  const tagTrim = (form.tag || "").trim();
  const portNum = Number(form.port);

  const nameOk = DNS1123.test(nameTrim);
  const imgOk = imgTrim.length > 0;
  const portOk = portNum >= 1 && portNum <= 65535;
  const canSubmit = nameOk && imgOk && portOk && !submitting;

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  async function submit() {
    try {
      setSubmitting(true);
      setError(null);

      const body = {
        name: nameTrim,
        image: imgTrim,
        tag: tagTrim,
        port: portOk ? portNum : 8080,
        health_path: (form.health_path || "/").trim() || "/",
        readiness_path: "/ready",
        metrics_path: "/metrics",
        replicas: Math.max(1, Number(form.replicas) || 1),
        env: [],
      };

      await apiPost("/apps/bluegreen/prepare", body);
      afterSubmit?.();
      onClose();
    } catch (e: any) {
      console.error(e);
      setError("Prepare failed: " + (e?.message ?? String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none"
      role="dialog"
      aria-modal="true"
    >
      {/* النافذة فقط بدون خلفية سوداء */}
      <div className="pointer-events-auto mt-20 bg-[#0a1625] border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)] p-6 text-white backdrop-blur-md w-[420px]">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">
          Prepare Preview
        </h3>

        {error && (
          <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            placeholder="Name (k8s)"
            value={form.name}
            onChange={(e) => set("name", e.target.value.toLowerCase())}
          />
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            placeholder="Image"
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
          />
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            placeholder="Tag"
            value={form.tag}
            onChange={(e) => set("tag", e.target.value)}
          />
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            type="number"
            placeholder="Port"
            value={form.port}
            onChange={(e) => set("port", Number(e.target.value))}
          />
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            placeholder="Health path"
            value={form.health_path}
            onChange={(e) => set("health_path", e.target.value)}
          />
          <input
            className="w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            type="number"
            placeholder="Replicas"
            value={form.replicas}
            onChange={(e) => set("replicas", Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
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
            {submitting ? "Preparing…" : "Prepare"}
          </button>
        </div>
      </div>
    </div>
  );
}
