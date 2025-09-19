// app/apps/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

// ===== أنواع البيانات القادمة من /apps/status =====
type StatusItem = {
  name: string;
  image: string;
  desired: number;
  current: number;
  available: number;
  updated: number;
  conditions: Record<string, string>;
  // حقول اختيارية نرسلها من الباكند (إن وُجدت)
  svc_selector?: Record<string, string> | null;
  preview_ready?: boolean | null;
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
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Image</th>
                <th style={{ padding: 8 }}>Desired</th>
                <th style={{ padding: 8 }}>Current</th>
                <th style={{ padding: 8 }}>Available</th>
                <th style={{ padding: 8 }}>Updated</th>
                <th style={{ padding: 8 }}>Conditions</th>
                <th style={{ padding: 8 }}>Traffic</th>
                <th style={{ padding: 8 }}>Scale</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => {
                // الدور الحقيقي القادم من الـService selector
                const rawRole = it.svc_selector?.role ?? "unknown";
                // الدور المعروض: لو الصف نفسه لاسم ينتهي بـ -preview والخدمة على preview نعرضه Active
                const displayRole =
                  it.name.endsWith("-preview") && rawRole === "preview"
                    ? "active"
                    : rawRole;

                return (
                  <tr key={it.name} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
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
                      {(Object.entries(it.conditions || {})).map(([k, v]) => (
                        <span key={k} className="badge" style={{ marginRight: 6 }}>
                          {k}:{v}
                        </span>
                      ))}
                    </td>

                  // Traffic badge
<td style={{ padding: 8 }}>
  {(() => {
    // 1) دور الديبلويمنت حسب الاسم (بدون تعديل الباكند)
    const depRole = it.name.endsWith("-preview") ? "preview" : "active" as
      | "preview"
      | "active";

    // 2) هل هذا الصف هو الذي عليه الترافيك فعلاً؟
    const isTraffic = it.svc_selector?.role === depRole;

    // 3) النص واللون حسب الحالة
    const label = isTraffic ? "active" : depRole === "preview" ? "preview" : "idle";
    const cls =
      isTraffic
        ? "bg-emerald-600/30 text-emerald-300" // يستقبل الترافيك
        : depRole === "preview"
        ? "bg-sky-600/30 text-sky-300"         // نسخة المعاينة
        : "bg-zinc-600/30 text-zinc-300";      // الأساسية لكن ليست على الترافيك

    return (
      <span className={`px-2 py-1 rounded text-xs ${cls}`} title="traffic status">
        {label}
      </span>
    );
  })()}
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
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 12, color: "var(--muted)" }}>
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
