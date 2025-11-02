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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      {/* ↓↓↓ نقلنا النافذة لتظهر أسفل الشاشة مع مسافة بسيطة للأعلى */}
      <div className="w-full max-w-2xl bg-[#0a1625] border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)] p-6 relative text-white backdrop-blur-md mb-10">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">
          Prepare Preview:{" "}
          <span className="text-white">
            {form.name || "(name pending)"}
          </span>
        </h3>

        {error && (
          <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-white/70">
              Name (k8s)
            </label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="e.g. nginx-test"
              value={form.name}
              onChange={(e) => set("name", e.target.value.toLowerCase())}
            />
            {!nameOk && (
              <small className="text-xs opacity-60">
                lowercase, digits, and dashes only; can’t start/end with “-”.
              </small>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium text-white/70">Image</label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="e.g. nginxinc/nginx-unprivileged"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
            />
            {!imgOk && (
              <small className="text-xs opacity-60">image is required</small>
            )}
          </div>

          {/* Tag */}
          <div>
            <label className="text-sm font-medium text-white/70">Tag</label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="e.g. 1.27-alpine"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </div>

          {/* Port */}
          <div>
            <label className="text-sm font-medium text-white/70">Port</label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              type="number"
              min={1}
              max={65535}
              value={form.port}
              onChange={(e) => set("port", Number(e.target.value))}
            />
            {!portOk && (
              <small className="text-xs opacity-60">port 1–65535</small>
            )}
          </div>

          {/* Health path */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-white/70">
              Health path
            </label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="/healthz"
              value={form.health_path}
              onChange={(e) => set("health_path", e.target.value)}
            />
          </div>

          {/* Replicas */}
          <div>
            <label className="text-sm font-medium text-white/70">
              Replicas
            </label>
            <input
              className="mt-1 w-full rounded-lg bg-[#0f1f33] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              type="number"
              min={1}
              max={50}
              value={form.replicas}
              onChange={(e) => set("replicas", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
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
            {submitting ? "Preparing…" : "Prepare"}
          </button>
        </div>
      </div>
    </div>
  );
}
