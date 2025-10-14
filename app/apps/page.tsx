"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type StatusItem = {
  name: string;
  image: string;
  desired: number;
  current: number;
  available: number;
  updated: number;
  conditions: Record<string, string>;
};
type StatusResponse = { items: StatusItem[] };

export default function AppsStatusPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [scaling, setScaling] = useState<Record<string, number>>({});

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

  useEffect(() => { load(); }, []);

  return (
    <section className="glass" style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
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
                <th style={{ padding: 8 }}>Scale</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.name} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <td style={{ padding: 8, fontWeight: 700 }}>{it.name}</td>
                  <td style={{ padding: 8, fontFamily: "monospace" }}>{it.image}</td>
                  <td style={{ padding: 8 }}>{it.desired}</td>
                  <td style={{ padding: 8 }}>{it.current}</td>
                  <td style={{ padding: 8 }}>{it.available}</td>
                  <td style={{ padding: 8 }}>{it.updated}</td>
                  <td style={{ padding: 8 }}>
                    {Object.entries(it.conditions || {}).map(([k, v]) => (
                      <span key={k} className="badge" style={{ marginRight: 6 }}>{k}:{v}</span>
                    ))}
                  </td>
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
                </tr>
              ))}
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
  );
}
