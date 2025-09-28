// app/apps/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

type StatusItem = {
  namespace: string;                 // مضاف
  name: string;
  image: string;
  desired: number;
  current: number;
  available: number;
  updated: number;
  conditions: Record<string, string>;
  svc_selector?: Record<string, string> | null; // { role: "active" | "preview" }
  preview_ready?: boolean | null;
};

type StatusResponse = { items: StatusItem[] };

export default function AppsStatusPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [scaling, setScaling] = useState<Record<string, number>>({});
  const router = useRouter();

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const data = await apiGet<StatusResponse>("/apps/status");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  async function doScale(name: string, replicas: number) {
    try {
      await apiPost("/apps/scale", { name, replicas });
      await load();
    } catch (e: any) {
      alert(e?.message || "Scale failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="glass" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="heading-gradient" style={{ fontSize: 28 }}>Apps Status</h2>
        <button className="btn btn-ghost" onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "#f99" }}>{err}</p>}

      {!loading && !err && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                <th style={{ padding: 8 }}>Namespace</th>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Image</th>
                <th style={{ padding: 8 }}>Desired</th>
                <th style={{ padding: 8 }}>Current</th>
                <th style={{ padding: 8 }}>Available</th>
                <th style={{ padding: 8 }}>Updated</th>
                <th style={{ padding: 8 }}>Conditions</th>
                <th style={{ padding: 8 }}>Traffic</th>
                <th style={{ padding: 8 }}>Scale</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => {
                // استنتاج دور الـDeployment من الاسم
                const depRole = (it.name.endsWith("-preview") ? "preview" : "active") as
                  | "preview"
                  | "active";
                const svcRole = (it.svc_selector?.role as "preview" | "active" | undefined) ?? undefined;
                const isTraffic = svcRole !== undefined && svcRole === depRole;

                const label =
                  svcRole === undefined
                    ? "unknown"
                    : isTraffic
                    ? "active"
                    : depRole === "preview"
                    ? "preview"
                    : "idle";

                const cls =
                  svcRole === undefined
                    ? "bg-zinc-600/30 text-zinc-300"
                    : isTraffic
                    ? "bg-emerald-600/30 text-emerald-300"
                    : depRole === "preview"
                    ? "bg-sky-600/30 text-sky-300"
                    : "bg-zinc-600/30 text-zinc-300";

                return (
                  <tr key={`${it.namespace}/${it.name}`} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                    <td style={{ padding: 8 }}>{it.namespace}</td>

                    {/* Name */}
                    <td style={{ padding: 8, fontWeight: 700 }}>{it.name}</td>

                    {/* Image */}
                    <td style={{ padding: 8, fontFamily: "monospace" }}>{it.image}</td>

                    {/* Numbers */}
                    <td style={{ padding: 8 }}>{it.desired}</td>
                    <td style={{ padding: 8 }}>{it.current}</td>
                    <td style={{ padding: 8 }}>{it.available}</td>
                    <td style={{ padding: 8 }}>{it.updated}</td>

                    {/* Conditions */}
                    <td style={{ padding: 8 }}>
                      {Object.entries(it.conditions || {}).map(([k, v]) => (
                        <span key={k} className="badge" style={{ marginRight: 6 }}>
                          {k}:{v}
                        </span>
                      ))}
                    </td>

                    {/* Traffic badge */}
                    <td style={{ padding: 8 }}>
                      <span className={`px-2 py-1 rounded text-xs ${cls}`} title="traffic status">
                        {label}
                      </span>
                    </td>

                    {/* Scale controls */}
                    <td style={{ padding: 8 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          defaultValue={it.desired}
                          onChange={(e) =>
                            setScaling((s) => ({ ...s, [it.name]: Number(e.target.value) }))
                          }
                          style={{ width: 100 }}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => doScale(it.name, scaling[it.name] ?? it.desired)}
                        >
                          Scale
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: 8 }}>
                      <button
                        className="px-2 py-1 text-sm rounded bg-blue-600"
                        onClick={() => router.push(`/monitor/${it.namespace}/${it.name}`)}
                        title="Monitor"
                      >
                        Monitor
                      </button>
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ padding: 12, color: "var(--muted)" }}>
                    No apps yet. Go to <a href="/apps/new">Deploy App</a>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
