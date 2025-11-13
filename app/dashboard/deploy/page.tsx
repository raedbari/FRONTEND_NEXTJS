"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

type EnvVar = { name: string; value: string };

export default function DeployPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const [port, setPort] = useState<number>(3000);
  const [replicas, setReplicas] = useState<number>(1);
  const [healthPath, setHealthPath] = useState("/");
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
  function resolveNs(): string | undefined {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      return (
        u?.tenant?.k8s_namespace ||
        u?.tenant?.ns ||
        u?.k8s_namespace ||
        u?.ns
      );
    }
    const t = localStorage.getItem("token");
    if (!t) return;
    const parts = t.split(".");
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(b64));
    return json?.ns || json?.k8s_namespace;
  } catch {
    return;
  }
}

 async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setResult(null);

  if (!nameOk) return setError("Invalid name: must be lowercase, digits, hyphen (k8s-compliant).");
  if (!image || !tag) return setError("Image and tag are required.");

  const ns = resolveNs();

  const payload = {
    name: name.trim(),
    image: image.trim(),
    tag: tag.trim(),
    port: Number(port),
    replicas: Number(replicas),
    health_path: (healthPath || "/").trim(),
    env: env.filter((e) => e.name && e.value),
    namespace: ns, // 🧠 هذا هو المفتاح!
  };

  try {
    setSubmitting(true);
    await apiPost("/apps/deploy", payload);
    setResult("✅ Deployed successfully!");
  } catch (err: any) {
    setError(err?.message || "Deploy failed");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <section
      className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] border border-cyan-500/20 max-w-3xl mx-auto my-10 backdrop-blur-md bg-[rgba(10,20,30,0.7)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(0,255,255,0.1), transparent 70%)",
      }}
    >
      {/* تدرج مضيء خلف العنوان */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl"></div>

      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
        ⚔️ Deploy a New App
      </h2>
      <p className="text-white/70 mb-6">
        Provide image, tag, port, and a valid Kubernetes name.
      </p>

      <form onSubmit={onSubmit} className="grid gap-5">
        {/* Name */}
        <div>
          <label className="text-cyan-300 text-sm">Name (k8s)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder="example-app"
            className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            required
          />
          {!nameOk && name.length > 0 && (
            <small className="text-red-400">
              must match: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$
            </small>
          )}
        </div>

        {/* Image + tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-cyan-300 text-sm">Image</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="raedbari/node.js"
              className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="text-cyan-300 text-sm">Tag</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="latest"
              className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
        </div>

        {/* Port + replicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-cyan-300 text-sm">Port</label>
            <input
              type="number"
              min={1}
              max={65535}
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="text-cyan-300 text-sm">Replicas</label>
            <input
              type="number"
              min={1}
              max={50}
              value={replicas}
              onChange={(e) => setReplicas(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
        </div>

        {/* Health check */}
        <div>
          <label className="text-cyan-300 text-sm">Health check path</label>
          <input
            value={healthPath}
            onChange={(e) => setHealthPath(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Env vars */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-cyan-300 text-sm">Environment variables</label>
            <button
              type="button"
              onClick={addEnv}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              + Add
            </button>
          </div>

          {env.length === 0 && <small className="text-white/40">No env vars yet.</small>}

          <div className="grid gap-2 mt-2">
            {env.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  placeholder="NAME"
                  className="px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
                  value={row.name}
                  onChange={(e) => updateEnv(i, "name", e.target.value)}
                />
                <input
                  placeholder="value"
                  className="px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400"
                  value={row.value}
                  onChange={(e) => updateEnv(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 transition"
                  onClick={() => removeEnv(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 mt-6">
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
            disabled={submitting || !nameOk}
          >
            {submitting ? "Deploying…" : "Deploy"}
          </button>

          {result && <span className="text-green-400">{result}</span>}
          {error && <span className="text-red-400">{error}</span>}
        </div>
      </form>
    </section>
  );
}
