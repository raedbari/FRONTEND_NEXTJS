// app/apps/page.tsx
"use client";

import RequireAuth from "@/components/RequireAuth";
import { useEffect, useState } from "react";
import { listApps } from "@/lib/monitorClient";
import { apiPost } from "@/lib/api";
import { grafanaDashboardUrl } from "@/lib/grafana";

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
  const [items, setItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [scaling, setScaling] = useState<Record<string, number>>({});
  const [working, setWorking] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      setLoading(true);

      const data = await listApps();
      const raw = Array.isArray(data) ? data : data?.items ?? [];

      const mapped: StatusItem[] = raw.map((x: any) => ({
        namespace: x.namespace ?? "default",
        name: x.name, // كان x.app
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
      setErr(e?.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  async function doScale(name: string, replicas: number) {
    try {
      setWorking(name);
      await apiPost("/apps/scale", { name, replicas });
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

  return (
    <RequireAuth>
      <section className="glass" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="heading-gradient" style={{ fontSize: 28 }}>Apps Status</h2>
          <button className="btn btn-ghost" onClick={load} disabled={loading}>
            {loading ? "…" : "Refresh"}
          </button>
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
                  <th style={{ padding: 8, minWidth: 360 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const ns = it.namespace ?? "default";
                  const rowKey = `${ns}/${it.name}`;
                  const isBusy = working === it.name;

                  return (
                    <tr key={rowKey} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                      <td style={{ padding: 8 }}>{ns}</td>
                      <td style={{ padding: 8, fontWeight: 700 }}>{it.name}</td>
                      <td
                        style={{
                          padding: 8,
                          fontFamily: "monospace",
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.image}
                      </td>
                      <td style={{ padding: 8 }}>{it.desired}</td>
                      <td style={{ padding: 8 }}>{it.current}</td>
                      <td style={{ padding: 8 }}>{it.available}</td>
                      <td style={{ padding: 8 }}>{it.updated}</td>
                      <td style={{ padding: 8 }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                              className="input"
                              type="number"
                              min={0}
                              defaultValue={it.desired}
                              onChange={(e) =>
                                setScaling((s) => ({ ...s, [it.name]: Number(e.target.value) }))
                              }
                              style={{ width: 100 }}
                              disabled={isBusy}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => doScale(it.name, scaling[it.name] ?? it.desired)}
                              disabled={isBusy}
                              title="Scale"
                            >
                              {isBusy ? "Working…" : "Scale"}
                            </button>
                          </div>

                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const url = grafanaDashboardUrl(ns, it.name);
                              window.open(url, "_blank", "noopener,noreferrer");
                            }}
                            title="Open in Grafana"
                          >
                            Open in Grafana
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 12, color: "var(--muted)" }}>
                      No apps yet. Go to <a href="/apps/new">Deploy App</a>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </RequireAuth>
  );
}
