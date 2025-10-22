"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { apiGet, apiPost } from "@/lib/api";
import { grafanaDashboardUrl } from "@/lib/grafana";
import { getToken } from "@/lib/auth";

type StatusItem = {
  namespace?: string;
  name: string;
  image: string;
  desired: number;
  current: number;
  available: number;
  updated: number;
  conditions: Record<string, string>;
  svc_selector?: Record<string, string> | null;
  preview_ready?: boolean | null;
};

export default function AppsPage() {
  const router = useRouter();
  const [items, setItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [scaling, setScaling] = useState<Record<string, number>>({});
  const [working, setWorking] = useState<string | null>(null);

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
      const t = getToken();
      if (!t) return;
      const parts = t.split(".");
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = JSON.parse(atob(b64));
      return json?.ns || json?.k8s_namespace;
    } catch {
      return;
    }
  }

  async function load() {
    try {
      setErr(null);
      setLoading(true);

      const token = getToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const ns = resolveNs();
      const url = ns
        ? `/apps/status?ns=${encodeURIComponent(ns)}`
        : `/apps/status`;

      const data = await apiGet(url);
      const raw =
        Array.isArray((data as any)?.items)
          ? (data as any).items
          : Array.isArray(data)
          ? data
          : [];

      const mapped: StatusItem[] = raw.map((x: any) => ({
        namespace: x.namespace ?? ns ?? "default",
        name: x.name,
        image: x.image ?? "",
        desired: Number(x.desired ?? 0),
        current: Number(x.current ?? 0),
        available: Number(x.available ?? 0),
        updated: Number(x.updated ?? 0),
        conditions: x.conditions ?? {},
        svc_selector: x.svc_selector ?? null,
        preview_ready: x.preview_ready ?? null,
      }));

      setItems(mapped);
    } catch (e: any) {
      const msg = (e?.message || "").toLowerCase();

      if (msg.includes("not authenticated") || msg.includes("401")) {
        router.push("/auth/login");
        return;
      }
      if (msg.includes("pending")) {
        router.push("/auth/pending");
        return;
      }

      setErr(e?.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  async function doScale(name: string, replicas: number) {
    try {
      setWorking(name);
      const ns = resolveNs();
      await apiPost("/apps/scale", { name, replicas, namespace: ns });
      await load();
    } catch (e: any) {
      alert(e?.message || "Scale failed");
    } finally {
      setWorking(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-cyan-300"
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

  return (
    <RequireAuth>
      <main className="relative min-h-screen bg-[#050b14] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)] blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]">
              Applications
            </h2>
            <button
              onClick={load}
              disabled={loading}
              className="px-5 py-2 rounded-xl border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,255,0.2)]"
            >
              {loading && <Spinner />}
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {err && (
            <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-3 mb-4 shadow-[0_0_12px_rgba(255,0,0,0.2)]">
              {err}
            </div>
          )}

          {loading && !err && (
            <p className="text-white/70 text-sm">Loading applications...</p>
          )}

          {!loading && !err && (
            <div className="overflow-x-auto rounded-2xl border border-cyan-400/10 bg-[rgba(10,20,30,0.5)] backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
              <table className="w-full text-sm text-white/90">
                <thead className="bg-cyan-500/10 text-cyan-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Namespace</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3">Desired</th>
                    <th className="px-4 py-3">Current</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const ns = it.namespace ?? "default";
                    const isBusy = working === it.name;
                    const grafanaUrl = grafanaDashboardUrl(ns, it.name);
                    const appUrl = `https://${it.name}.${ns}.apps.smartdevops.lat`;

                    return (
                      <tr
                        key={`${ns}/${it.name}`}
                        className="border-t border-white/10 hover:bg-white/5 transition-all"
                      >
                        <td className="px-4 py-3 text-white/70">{ns}</td>
                        <td className="px-4 py-3 font-semibold text-cyan-300">
                          {it.name}
                        </td>
                        <td
                          className="px-4 py-3 font-mono truncate max-w-[240px] text-white/80"
                          title={it.image}
                        >
                          {it.image}
                        </td>
                        <td className="px-4 py-3 text-center">{it.desired}</td>
                        <td className="px-4 py-3 text-center">{it.current}</td>
                        <td className="px-4 py-3 text-center">{it.available}</td>
                        <td className="px-4 py-3 text-center">{it.updated}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2 items-center justify-center">
                            <input
                              type="number"
                              min={0}
                              defaultValue={it.desired}
                              className="rounded-lg bg-black/30 border border-cyan-500/20 text-white/80 w-20 text-center focus:outline-none focus:border-cyan-400 transition-all"
                              onChange={(e) =>
                                setScaling((s) => ({
                                  ...s,
                                  [it.name]: Number(e.target.value),
                                }))
                              }
                              disabled={isBusy}
                            />

                            {/* 🔹 Scale */}
                            <button
                              onClick={() =>
                                doScale(it.name, scaling[it.name] ?? it.desired)
                              }
                              disabled={isBusy}
                              className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all ${
                                isBusy
                                  ? "bg-cyan-700/40 cursor-not-allowed text-white/70"
                                  : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] text-white"
                              }`}
                            >
                              {isBusy && <Spinner />}
                              {isBusy ? "Scaling…" : "Scale"}
                            </button>

                            {/* 🔹 Grafana */}
                            <button
                              onClick={() =>
                                window.open(grafanaUrl, "_blank")
                              }
                              className="px-4 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white transition-all shadow-[0_0_8px_rgba(0,255,255,0.1)]"
                            >
                              Grafana
                            </button>

                            {/* 🔹 Open App — نفس تصميم Grafana */}
                            <button
                              onClick={() => {
                                if (it.available > 0)
                                  window.open(appUrl, "_blank");
                              }}
                              disabled={it.available < 1}
                              className={`px-4 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white transition-all shadow-[0_0_8px_rgba(0,255,255,0.1)] ${
                                it.available < 1
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Open App
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-6 text-center text-white/60"
                      >
                        No applications found.{" "}
                        <a
                          href="/dashboard/apps/new"
                          className="text-cyan-400 hover:underline"
                        >
                          Deploy one here
                        </a>
                        .
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
