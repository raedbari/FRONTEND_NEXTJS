// app/components/PrepareModal.tsx
"use client";
import React from "react";
import { apiPost } from "@/lib/api";

export type PrepareSpec = {
  name: string;        // deployment/service name (DNS-1123)
  namespace: string;   // DNS-1123
  image: string;       // e.g. nginxinc/nginx-unprivileged
  tag: string;         // e.g. 1.27-alpine
  port: number;        // 1..65535
  health_path: string; // e.g. "/"
  replicas: number;    // >=1
};

// نفس نمط Kubernetes DNS-1123
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

  function set<K extends keyof PrepareSpec>(k: K, v: PrepareSpec[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const nameTrim = (form.name || "").trim();
  const nsTrim   = (form.namespace || "").trim();
  const imgTrim  = (form.image || "").trim();
  const tagTrim  = (form.tag || "").trim();
  const portNum  = Number(form.port);

  const nameOk = DNS1123.test(nameTrim);
  const nsOk   = DNS1123.test(nsTrim);
  const imgOk  = imgTrim.length > 0;
  const portOk = portNum >= 1 && portNum <= 65535;
  const canSubmit = nameOk && nsOk && imgOk && portOk && !submitting;

  async function submit() {
    try {
      setSubmitting(true);
      const body = {
        name: nameTrim,
        namespace: nsTrim,
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
      alert("Prepare failed: " + (e?.message ?? String(e)));
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

          <label className="ui-label">
            <span>Namespace</span>
            <input
              className="ui-input"
              placeholder="e.g. project-env"
              value={form.namespace}
              onChange={(e) => set("namespace", e.target.value.toLowerCase())}
            />
            {!nsOk && (
              <small className="text-[12px] opacity-70">
                must match Kubernetes DNS-1123 (lowercase/digits/dashes).
              </small>
            )}
          </label>

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
          <button className="btn" onClick={submit} disabled={!canSubmit}>
            {submitting ? "Preparing…" : "Prepare"}
          </button>
        </div>
      </div>
    </div>
  );
};