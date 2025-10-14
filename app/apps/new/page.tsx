"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

// Minimal shape matching your FastAPI AppSpec
type EnvVar = { name: string; value: string };

export default function DeployPage() {
  // Default values that match your backend defaults
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const [port, setPort] = useState<number>(3000);
  const [replicas, setReplicas] = useState<number>(1);
  const [healthPath, setHealthPath] = useState("/healthz");
  const [readyPath, setReadyPath] = useState("/ready");
  const [metricsPath, setMetricsPath] = useState("/metrics");
  const [env, setEnv] = useState<EnvVar[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nameOk = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(name || "");

  function updateEnv(i: number, key: keyof EnvVar, value: string) {
    setEnv((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)));
  }
  function addEnv() {
    setEnv((prev) => [...prev, { name: "", value: "" }]);
  }
  function removeEnv(i: number) {
    setEnv((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!nameOk) {
      setError("Invalid name: must be lowercase, digits, hyphen (k8s-compliant).");
      return;
    }
    if (!image || !tag) {
      setError("Image and tag are required.");
      return;
    }

    const payload = {
      name,
      image,
      tag,
      port: Number(port),
      replicas: Number(replicas),
      health_path: healthPath,
      readiness_path: readyPath,
      metrics_path: metricsPath,
      env: env.filter((e) => e.name && e.value),
      // app_label, service_name, resources -> omitted to use backend defaults
    };

    try {
      setSubmitting(true);
      const resp = await apiPost("/apps/deploy", payload);
      setResult("Deployed successfully.");
      console.log("Deploy response:", resp);
    } catch (err: any) {
      setError(err?.message || "Deploy failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass" style={{ padding: 20, maxWidth: 920, margin: "0 auto" }}>
      <h2 className="heading-gradient" style={{ fontSize: 28, marginBottom: 8 }}>
        Deploy a new app
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>
        Fill the minimal information: image, tag, port and a k8s-compliant name.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        {/* Name */}
        <div>
          <label>Name (k8s)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder="example-app"
            className="input"
            required
          />
          {!nameOk && name.length > 0 && (
            <small style={{ color: "#f99" }}>
              must match: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$
            </small>
          )}
        </div>

        {/* Image + tag */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label>Image</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="raedbari/node.js"
              className="input"
              required
            />
          </div>
          <div>
            <label>Tag</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="a902d22f..."
              className="input"
              required
            />
          </div>
        </div>

        {/* Port + replicas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label>Port</label>
            <input
              type="number"
              min={1}
              max={65535}
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="input"
              required
            />
          </div>
          <div>
            <label>Replicas</label>
            <input
              type="number"
              min={1}
              max={50}
              value={replicas}
              onChange={(e) => setReplicas(Number(e.target.value))}
              className="input"
              required
            />
          </div>
        </div>

        {/* Probes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <label>Health path</label>
            <input value={healthPath} onChange={(e) => setHealthPath(e.target.value)} className="input" />
          </div>
          <div>
            <label>Readiness path</label>
            <input value={readyPath} onChange={(e) => setReadyPath(e.target.value)} className="input" />
          </div>
          <div>
            <label>Metrics path</label>
            <input value={metricsPath} onChange={(e) => setMetricsPath(e.target.value)} className="input" />
          </div>
        </div>

        {/* Env vars */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Environment variables</label>
            <button type="button" className="btn btn-ghost" onClick={addEnv}>+ Add</button>
          </div>
          {env.length === 0 && <small style={{ color: "var(--muted)" }}>No env vars yet.</small>}
          <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
            {env.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
                <input
                  placeholder="NAME"
                  className="input"
                  value={row.name}
                  onChange={(e) => updateEnv(i, "name", e.target.value)}
                />
                <input
                  placeholder="value"
                  className="input"
                  value={row.value}
                  onChange={(e) => updateEnv(i, "value", e.target.value)}
                />
                <button type="button" className="btn btn-ghost" onClick={() => removeEnv(i)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" disabled={submitting || !nameOk}>Deploy</button>
          {submitting && <span>Deploying…</span>}
        </div>

        {result && <div className="badge">{result}</div>}
        {error && <div className="badge" style={{ borderColor: "#f66", color: "#ffd9d9" }}>{error}</div>}
      </form>
    </section>
  );
}
