// app/apps/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listApps } from "@/lib/monitorClient";
import { apiPost } from "@/lib/api";

// ===== Grafana Integration (feature flag) =====
const USE_GRAFANA =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

const GRAFANA_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_BASE) || "/grafana";

const GRAFANA_DASH =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_DASH_UID) ||
  "app-observability";

const grafanaLink = (ns: string, app: string, from = "now-1h", to = "now") =>
  `${GRAFANA_BASE}/d/${GRAFANA_DASH}/app-monitor` +
  `?var-namespace=${encodeURIComponent(ns)}` +
  `&var-app=${encodeURIComponent(app)}` +
  `&from=${from}&to=${to}`;

// ===== Types =====
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

      // يضرب: /api/monitor/apps (backend: FastAPI /monitor/apps)
      const data = await listApps();

      // تطبيع البيانات إلى نموذج الجدول الحالي
      const mapped: StatusItem[] = (data as any[]).map((x) => ({
        namespace: x.namespace,
        name: x.app,
        image: x.image,
        desired: x.replicas_desired ?? 0,
        current: x.replicas_desired ?? 0,
        available: x.replicas_available ?? 0,
        updated: x.replicas_available ?? 0,
        conditions: {},
        svc_selector: null,
        preview_ready: null,
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
      // اختياري: لو عندك API للـscale فعلاً؛ خلاف ذلك عطّل الزر أو عدّل المسار لاحقًا
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
                const ns = it.namespace ?? "default";

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
                  <tr key={`${ns}/${it.name}`} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                    <td style={{ padding: 8 }}>{ns}</td>
                    <td style={{ padding: 8, fontWeight: 700 }}>{it.name}</td>
                    <td style={{ padding: 8, fontFamily: "monospace" }}>{it.image}</td>
                    <td style={{ padding: 8 }}>{it.desired}</td>
                    <td style={{ padding: 8 }}>{it.current}</td>
                    <td style={{ padding: 8 }}>{it.available}</td>
                    <td style={{ padding: 8 }}>{it.updated}</td>

                    <td style={{ padding: 8 }}>
                      {Object.entries(it.conditions || {}).map(([k, v]) => (
                        <span key={k} className="badge" style={{ marginRight: 6 }}>
                          {k}:{v}
                        </span>
                      ))}
                    </td>

                    <td style={{ padding: 8 }}>
                      <span className={`px-2 py-1 rounded text-xs ${cls}`} title="traffic status">
                        {label}
                      </span>
                    </td>

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

                    <td style={{ padding: 8 }}>
                      {USE_GRAFANA ? (
                        <a
                          className="px-2 py-1 text-sm rounded bg-blue-600"
                          href={grafanaLink(ns, it.name)}
                          target="_blank"
                          rel="noreferrer"
                          title="Open in Grafana"
                        >
                          Monitor
                        </a>
                      ) : (
                        <button
                          className="px-2 py-1 text-sm rounded bg-blue-600"
                          onClick={() => router.push(`/monitor/${ns}/${it.name}`)}
                          title="Monitor"
                        >
                          Monitor
                        </button>
                      )}
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
