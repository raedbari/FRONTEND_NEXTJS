"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import BlueGreenActions from "./components/BlueGreenActions";

// ===== Types coming from backend /apps/status =====
type StatusItem = {
  name: string;
  image: string;
  desired: number;
  current: number;
  available: number;
  updated: number;
  conditions: Record<string, string>;

  // ← جديدان (اختياريان) من الباكند
  svc_selector?: Record<string, string> | null;
  preview_ready?: boolean | null;
};
type StatusResponse = { items: StatusItem[] };

// namespace الافتراضي عند نداء promote/rollback من الجدول
const DEFAULT_NS =
  process.env.NEXT_PUBLIC_DEFAULT_NAMESPACE?.trim() || "project-env";

export default function AppsStatusPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [scaling, setScaling] = useState<Record<string, number>>({});
  const [promoting, setPromoting] = useState<string | null>(null);

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
      await apiPost(`/apps/scale`, { name, replicas });
      await load();
    } catch (e: any) {
      alert(e?.message || "Scale failed");
    }
  }

  async function doPromote(name: string) {
    try {
      setPromoting(name);
      await apiPost("/apps/bluegreen/promote", {
        name,
        namespace: DEFAULT_NS,
      });
      await load();
      alert("Promote done ✅");
    } catch (e: any) {
      alert(e?.message || "Promote failed");
    } finally {
      setPromoting(null);
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
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Image</th>
                <th style={{ padding: 8 }}>Desired</th>
                <th style={{ padding: 8 }}>Current</th>
                <th style={{ padding: 8 }}>Available</th>
                <th style={{ padding: 8 }}>Updated</th>
                <th style={{ padding: 8 }}>Conditions</th>
                <th style={{ padding: 8 }}>Traffic</th>   {/* badge */}
                <th style={{ padding: 8 }}>Scale</th>
                <th style={{ padding: 8 }}>Blue/Green</th> {/* actions */}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const role = it.svc_selector?.role ?? "unknown";
                const previewReady = Boolean(it.preview_ready);

                return (
                  <tr key={it.name} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                    <td style={{ padding: 8, fontWeight: 700 }}>{it.name}</td>
                    <td style={{ padding: 8, fontFamily: "monospace" }}>{it.image}</td>
                    <td style={{ padding: 8 }}>{it.desired}</td>
                    <td style={{ padding: 8 }}>{it.current}</td>
                    <td style={{ padding: 8 }}>{it.available}</td>
                    <td style={{ padding: 8 }}>{it.updated}</td>

                    <td style={{ padding: 8 }}>
                      {(Object.entries(it.conditions || {})).map(([k, v]) => (
                        <span key={k} className="badge" style={{ marginRight: 6 }}>{k}:{v}</span>
                      ))}
                    </td>

                    {/* badge: svc role */}
                   <td style={{ padding: 8 }}>
                     <BlueGreenActions
                      name={it.name}
                      namespace={DEFAULT_NS}
                      image={it.image}
                      onChanged={load} />
                    </td>


                    {/* Scale controls */}
                    <td style={{ padding: 8 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          className="input"
                          type="number"
                          min={1}
                          defaultValue={it.desired}
                          onChange={(e) =>
                            setScaling((s) => ({ ...s, [it.name]: Number(e.target.value) }))
                          }
                          style={{ width: 100 }}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => doScale(it.name, scaling[it.name] || it.desired)}
                        >
                          Scale
                        </button>
                      </div>
                    </td>

                    {/* Blue/Green actions (Promote only for الآن) */}
                    <td style={{ padding: 8 }}>
                      <button
                        className="btn btn-sm"
                        disabled={!previewReady || promoting === it.name}
                        onClick={() => doPromote(it.name)}
                        title={
                          previewReady
                            ? "Swap traffic to preview (zero-downtime)"
                            : "Preview not Ready yet"
                        }
                      >
                        {promoting === it.name ? "…" : "Promote"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: 12, color: "var(--muted)" }}>
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
