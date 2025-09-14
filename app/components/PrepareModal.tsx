// app/components/PrepareModal.tsx
"use client";
import React from "react";
import { apiPost } from "@/lib/api";

export type PrepareSpec = {
  name: string;
  namespace: string;
  image: string;
  tag: string;
  port: number;
  health_path: string;
  replicas: number;
};

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

  function set<K extends keyof PrepareSpec>(k: K, v: PrepareSpec[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    try {
      setSubmitting(true);
      const body = {
        name: (form.name || "").trim(),
        namespace: (form.namespace || "").trim(),
        image: (form.image || "").trim(),
        tag: (form.tag || "").trim(),
        port: Number(form.port) || 8080,
        health_path: (form.health_path || "/").trim() || "/",
        readiness_path: "/ready",
        metrics_path: "/metrics",
        replicas: Number(form.replicas) || 1,
        env: [],
      };
      await apiPost("/apps/bluegreen/prepare", body);
      afterSubmit?.();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert("Prepare failed: " + (e?.message ?? String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ui-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ui-modal">
        <div className="ui-modal-hd">
          <h3>Prepare Preview: {form.name}</h3>
        </div>

        <div className="ui-modal-bd grid grid-cols-2 gap-4">
          <label className="ui-label">
            <span>Namespace</span>
            <input className="ui-input"
              value={form.namespace}
              onChange={(e) => set("namespace", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Image</span>
            <input className="ui-input"
              placeholder="e.g. nginxinc/nginx-unprivileged"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Tag</span>
            <input className="ui-input"
              placeholder="e.g. 1.27"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Port</span>
            <input className="ui-input"
              type="number"
              min={1}
              max={65535}
              value={form.port}
              onChange={(e) => set("port", Number(e.target.value))}
            />
          </label>

          <label className="ui-label col-span-2">
            <span>Health path</span>
            <input className="ui-input"
              placeholder="/healthz"
              value={form.health_path}
              onChange={(e) => set("health_path", e.target.value)}
            />
          </label>

          <label className="ui-label">
            <span>Replicas</span>
            <input className="ui-input"
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
          <button className="btn" onClick={submit} disabled={submitting}>
            {submitting ? "Preparing…" : "Prepare"}
          </button>
        </div>
      </div>
    </div>
  );
}

