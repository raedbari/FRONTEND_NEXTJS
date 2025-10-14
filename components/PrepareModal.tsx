// app/components/PrepareModal.tsx
"use client";
import React from "react";
import { apiPost } from "@/lib/api";

export type PrepareSpec = {
  name: string;        // deployment/service name (DNS-1123)
  image: string;       // e.g. nginxinc/nginx-unprivileged
  tag: string;         // e.g. 1.27-alpine
  port: number;        // 1..65535
  health_path: string; // e.g. "/"
  replicas: number;    // >=1
};

// نفس نمط Kubernetes DNS-1123 لاسم الـDeployment/Service
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
  const imgTrim  = (form.image || "").trim();
  const tagTrim  = (form.tag || "").trim();
  const portNum  = Number(form.port);

  const nameOk = DNS1123.test(nameTrim);
  const imgOk  = imgTrim.length > 0;
  const portOk = portNum >= 1 && portNum <= 65535;
  const canSubmit = nameOk && imgOk && portOk && !submitting;

  // Spinner موحّد
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

      const body = {
        // لا نرسل namespace مطلقًا — الباكند يأخذه من JWT
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
    <div className="ui-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ui-modal">
        <div className="ui-modal-hd">
          <h3>Prepare Preview: {form.name || "(name pending)"}</h3>
        </div>

        {error && (
          <div className="text-rose-300 bg-rose-900/30 border border-rose-800 rounded-lg p-2 text-sm mb-3">
            {error}
          </div>
        )}

        <div className="ui-modal-bd grid grid-cols-2 gap-4">
          <label className="ui-label">
            <span>Name (k8s)</span>
            <input
              className="ui-input"
              placeholder="e.g. nginx-test"
              value={form.name}
              onChange={(e) => set("name", e.target.value.toLowerCase())}
            />
            {!nameOk && (
              <small className="text-[12px] opacity-70">
                lowercase, digits, and dashes only; can’t start/end with “-”.
              </small>
            )}
          </label>

          {/* Namespace حُذف — يُستمد من JWT في الباكند */}

          <label className="ui-label">
            <span>Image</span>
            <input
              className="ui-input"
              placeholder="e.g. nginxinc/nginx-unprivileged"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
            />
            {!imgOk && (
              <small className="text-[12px] opacity-70">image is required</small>
            )}
          </label>

          <label className="ui-label">
            <span>Tag</span>
            <input
              className="ui-input"
              placeholder="e.g. 1.27-alpine"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Port</span>
            <input
              className="ui-input"
              type="number"
              min={1}
              max={65535}
              value={form.port}
              onChange={(e) => set("port", Number(e.target.value))}
            />
            {!portOk && (
              <small className="text-[12px] opacity-70">port 1–65535</small>
            )}
          </label>

          <label className="ui-label col-span-2">
            <span>Health path</span>
            <input
              className="ui-input"
              placeholder="/healthz"
              value={form.health_path}
              onChange={(e) => set("health_path", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Replicas</span>
            <input
              className="ui-input"
              type="number"
              min={1}
              max={50}
              value={form.replicas}
              onChange={(e) => set("replicas", Number(e.target.value))}
            />
          </label>
        </div>

        <div className="ui-modal-ft flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={submit}
            disabled={!canSubmit}
          >
            {submitting && <Spinner />}
            {submitting ? "Preparing…" : "Prepare"}
          </button>
        </div>
      </div>
    </div>
  );
}
